import React, { useState } from 'react';
import { runAudit, findBrokenLinks, getPagespeedInsights } from '../services/auditAPI';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AuditPage = () => {
  const [url, setUrl] = useState('');
  const [auditResult, setAuditResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [brokenLinks, setBrokenLinks] = useState([]);
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlError, setCrawlError] = useState('');

  const [pagespeedResult, setPagespeedResult] = useState(null);
  const [isScanningSpeed, setIsScanningSpeed] = useState(false);
  const [speedError, setSpeedError] = useState('');

  const handleRunAudit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a URL.');
      return;
    }
    setError('');
    setIsLoading(true);
    setAuditResult(null);

    try {
      const data = await runAudit(url);
      setAuditResult(data);
    } catch (err) {
      setError('Failed to run audit. Please check the URL or log in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrokenLinkScan = async () => {
    if (!url.trim()) {
      setCrawlError('Please enter a URL first.');
      return;
    }
    setIsCrawling(true);
    setCrawlError('');
    setBrokenLinks([]);
    try {
      const data = await findBrokenLinks(url);
      setBrokenLinks(data);
    } catch (err) {
      setCrawlError(err.message);
    } finally {
      setIsCrawling(false);
    }
  };

  const handlePageSpeedScan = async () => {
    if (!url.trim()) {
      setSpeedError('Please enter a URL first.');
      return;
    }
    setIsScanningSpeed(true);
    setSpeedError('');
    setPagespeedResult(null);
    try {
      const data = await getPagespeedInsights(url);
      setPagespeedResult(data);
    } catch (err) {
      setSpeedError(err.message);
    } finally {
      setIsScanningSpeed(false);
    }
  };

  return (
    <div>
      <h1>Site Audit</h1>
      <form onSubmit={handleRunAudit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to audit"
          style={{ width: '300px', marginRight: '10px' }}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Auditing...' : 'Run Audit'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {auditResult && (
        <div>
          <h2>Audit Results for {url}</h2>
          <p>
            <strong>Title:</strong> {auditResult.title}
          </p>
          <p>
            <strong>Meta Description:</strong> {auditResult.metaDescription}
          </p>
          <p>
            <strong>Word Count:</strong> {auditResult.wordCount}
          </p>
          <h3>Headers:</h3>
          <ul>
            {Object.entries(auditResult.headers).map(([h, tags]) => (
              <li key={h}>
                <strong>{h}:</strong>
                <ul>
                  {tags.map((tag, index) => (
                    <li key={index}>{tag}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      <hr style={{ margin: '40px 0' }} />

      <div>
        <h2>Broken Link Checker</h2>
        <p>Crawl your entire site to find broken links (404s, etc.). This may take several minutes for large sites.</p>
        <button onClick={handleBrokenLinkScan} disabled={isCrawling || !url}>
          {isCrawling ? 'Crawling...' : 'Start Broken Link Scan'}
        </button>

        {crawlError && <p style={{ color: 'red', marginTop: '20px' }}>{crawlError}</p>}

        {brokenLinks.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3>Found {brokenLinks.length} Broken Links</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid black' }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Broken URL</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Source Page</th>
                </tr>
              </thead>
              <tbody>
                {brokenLinks.map((link, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #ccc' }}>
                    <td style={{ padding: '8px', wordBreak: 'break-all' }}>{link.url}</td>
                    <td style={{ padding: '8px' }}>{link.status}</td>
                    <td style={{ padding: '8px', wordBreak: 'break-all' }}>{link.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <hr style={{ margin: '40px 0' }} />

      <div>
        <h2>Google PageSpeed Insights</h2>
        <p>Analyze your page's performance, accessibility, and SEO scores.</p>
        <button onClick={handlePageSpeedScan} disabled={isScanningSpeed || !url}>
          {isScanningSpeed ? 'Scanning...' : 'Run PageSpeed Scan'}
        </button>

        {speedError && <p style={{ color: 'red', marginTop: '20px' }}>{speedError}</p>}

        {pagespeedResult && (
          <div style={{ marginTop: '20px' }}>
            <h3>PageSpeed Scores</h3>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
              {Object.entries(pagespeedResult.scores).map(([key, value]) => (
                <div key={key} style={{ width: '150px', textAlign: 'center' }}>
                  <h4>{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                  <Doughnut data={{
                    labels: ['Score', ''],
                    datasets: [{
                      data: [value, 100 - value],
                      backgroundColor: [`hsl(${value}, 100%, 40%)`, '#e0e0e0'],
                      borderColor: [`hsl(${value}, 100%, 40%)`, '#e0e0e0'],
                      borderWidth: 1,
                    }]
                  }} />
                  <p style={{ fontSize: '24px', marginTop: '-70px' }}>{value}</p>
                </div>
              ))}
            </div>
            <h3 style={{marginTop: '40px'}}>Core Web Vitals</h3>
            <ul>
              <li>First Contentful Paint: {pagespeedResult.metrics.firstContentfulPaint}</li>
              <li>Largest Contentful Paint: {pagespeedResult.metrics.largestContentfulPaint}</li>
              <li>Speed Index: {pagespeedResult.metrics.speedIndex}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditPage;
