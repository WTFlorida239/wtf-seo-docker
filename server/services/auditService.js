const puppeteer = require('puppeteer');

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

module.exports = { runAudit };
