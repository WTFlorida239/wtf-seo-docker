const express = require('express');
const router = express.Router();
const { runAudit } = require('../services/auditService');

router.post('/', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const auditData = await runAudit(url);
    res.json(auditData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to run audit' });
  }
});

module.exports = router;
