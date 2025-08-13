export const runAudit = async (url) => {
  const response = await fetch('/api/audit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, type: 'standard' }),
  });
  if (!response.ok) {
    throw new Error('Failed to run audit');
  }
  return response.json();
};

export const getPagespeedInsights = async (url) => {
  const response = await fetch('/api/audit/pagespeed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });
  if (!response.ok) {
    throw new Error('Failed to run PageSpeed Insights scan');
  }
  return response.json();
};

export const findBrokenLinks = async (url) => {
  const response = await fetch('/api/audit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, type: 'broken_links' }),
  });
  if (!response.ok) {
    throw new Error('Failed to run broken link scan');
  }
  return response.json();
};
