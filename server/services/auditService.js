const puppeteer = require('puppeteer');
const axios = require('axios');
const { URL } = require('url');

async function runAudit(url) {
  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const auditData = await page.evaluate(() => {
      const title = document.querySelector('title') ? document.querySelector('title').innerText : '';
      const metaDescription = document.querySelector('meta[name="description"]') ? document.querySelector('meta[name="description"]').content : '';

      const headers = {};
      for (let i = 1; i <= 6; i++) {
        const hTags = Array.from(document.querySelectorAll(`h${i}`)).map(h => h.innerText);
        if (hTags.length > 0) {
          headers[`H${i}`] = hTags;
        }
      }

      const wordCount = document.body.innerText.split(/\s+/).length;

      return {
        title,
        metaDescription,
        headers,
        wordCount,
      };
    });

    return auditData;
  } catch (error) {
    console.error(`Error during audit for ${url}:`, error);
    throw new Error('Failed to audit the URL.');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function findBrokenLinks(startUrl) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const queue = [startUrl];
  const visited = new Set();
  const brokenLinks = [];
  const domain = new URL(startUrl).hostname;

  const checkLinkStatus = async (url, sourcePage) => {
    try {
      // We use a HEAD request for efficiency as we only need the status code.
      await axios.head(url, { timeout: 5000 });
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        brokenLinks.push({
          url,
          status: error.response.status,
          source: sourcePage,
        });
      }
    }
  };

  while (queue.length > 0) {
    const currentUrl = queue.shift();
    if (visited.has(currentUrl)) {
      continue;
    }
    visited.add(currentUrl);
    console.log(`Crawling: ${currentUrl}`);

    try {
      await page.goto(currentUrl, { waitUntil: 'networkidle2' });
      const links = await page.$$eval('a', as => as.map(a => a.href));

      for (const link of links) {
        if (!link || link.startsWith('mailto:') || link.startsWith('tel:')) {
          continue;
        }

        const absoluteUrl = new URL(link, currentUrl).href;

        // Check link status
        await checkLinkStatus(absoluteUrl, currentUrl);

        // If it's an internal link and not visited, add to queue
        if (new URL(absoluteUrl).hostname === domain && !visited.has(absoluteUrl)) {
          queue.push(absoluteUrl);
        }
      }
    } catch (error) {
      console.error(`Failed to crawl ${currentUrl}:`, error.message);
    }
  }

  await browser.close();
  return brokenLinks;
}

const getPagespeedInsights = async (urlToTest) => {
  const apiKey = process.env.PAGESPEED_INSIGHTS_API_KEY;
  const apiEndpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(urlToTest)}&key=${apiKey}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO`;

  try {
    const response = await axios.get(apiEndpoint);
    const { lighthouseResult } = response.data;
    const { categories, audits } = lighthouseResult;

    const getScore = (id) => categories[id] ? Math.round(categories[id].score * 100) : null;

    return {
      scores: {
        performance: getScore('performance'),
        accessibility: getScore('accessibility'),
        bestPractices: getScore('best-practices'),
        seo: getScore('seo'),
      },
      metrics: {
        firstContentfulPaint: audits['first-contentful-paint'].displayValue,
        largestContentfulPaint: audits['largest-contentful-paint'].displayValue,
        speedIndex: audits['speed-index'].displayValue,
      }
    };
  } catch (error) {
    console.error('Error fetching data from PageSpeed Insights API:', error.response ? error.response.data : error.message);
    throw new Error('Failed to get PageSpeed Insights data.');
  }
};

module.exports = { runAudit, findBrokenLinks, getPagespeedInsights };
