const express = require('express');
const router = express.Router();
const { generateReviewResponse } = require('../services/aiService');
const { postGbpReviewReply } = require('../services/gbpService');
const requirePermission = require('../middleware/requirePermission');

// All routes in this file will be protected by the requireLogin middleware

// Endpoint to generate an AI-powered reply suggestion
router.post('/reviews/:reviewId/generate-response', requirePermission('edit_social'), async (req, res) => {
  try {
    const { reviewText, customerName, businessName, sentiment } = req.body;
    if (!reviewText || !customerName || !businessName || !sentiment) {
      return res.status(400).json({ error: 'reviewText, customerName, businessName, and sentiment are required.' });
    }
    const suggestion = await generateReviewResponse({ reviewText, customerName, businessName, sentiment });
    res.json({ suggestion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to post the final reply to GBP
router.post('/reviews/:reviewId/post-reply', requirePermission('edit_social'), async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { replyText } = req.body;
    if (!replyText) {
      return res.status(400).json({ error: 'replyText is required.' });
    }
    const result = await postGbpReviewReply(reviewId, replyText);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
