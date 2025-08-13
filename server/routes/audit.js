const express = require('express');
const router = express.Router();
const { runAudit, findBrokenLinks, getPagespeedInsights } = require('../services/auditService');

router.post('/', async (req, res) => {
  const { url, type } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    let results;
    if (type === 'broken_links') {
      results = await findBrokenLinks(url);
    } else {
      results = await runAudit(url);
    }
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to run audit' });
  }
});

router.post('/pagespeed', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const insights = await getPagespeedInsights(url);
    res.json(insights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
