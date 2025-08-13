const express = require('express');
const router = express.Router();
const {
  generateAltText,
  generateSeoTitle,
  generateSeoDescription,
} = require('../services/aiService');

// All routes in this file are protected by the requireLogin middleware in server/index.js

router.post('/generate-alt-text', async (req, res) => {
  try {
    const { productTitle } = req.body;
    if (!productTitle) {
      return res.status(400).json({ error: 'productTitle is required' });
    }
    const altText = await generateAltText(productTitle);
    res.json({ suggestion: altText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/generate-seo-title', async (req, res) => {
  try {
    const { productTitle, productDescription } = req.body;
    if (!productTitle || !productDescription) {
      return res.status(400).json({ error: 'productTitle and productDescription are required' });
    }
    const title = await generateSeoTitle(productTitle, productDescription);
    res.json({ suggestion: title });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/generate-seo-description', async (req, res) => {
  try {
    const { productTitle, productDescription } = req.body;
    if (!productTitle || !productDescription) {
      return res.status(400).json({ error: 'productTitle and productDescription are required' });
    }
    const description = await generateSeoDescription(productTitle, productDescription);
    res.json({ suggestion: description });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
