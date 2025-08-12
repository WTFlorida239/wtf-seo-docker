import React, { useState } from 'react';
import { runAudit } from '../services/auditAPI';

const AuditPage = () => {
  const [url, setUrl] = useState('');
  const [auditResult, setAuditResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
    </div>
  );
};

export default AuditPage;
