const express = require('express');
const router = express.Router();
const {
  getShopInfo,
  analyzeAllProducts,
  updateImageAltText,
  updateProductMetafields
} = require('../services/shopifyService');

// This route is protected by the requireLogin middleware in server/index.js
router.get('/store/info', async (req, res) => {
  try {
    const shopInfo = await getShopInfo();
    res.json(shopInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/products/analyze', async (req, res) => {
  try {
    const analysis = await analyzeAllProducts();
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/images/:imageId/update-alt', async (req, res) => {
  try {
    const { imageId } = req.params;
    const { altText } = req.body;
    const updatedImage = await updateImageAltText(imageId, altText);
    res.json(updatedImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/products/:productId/update-metafields', async (req, res) => {
  try {
    const { productId } = req.params;
    const { metafields } = req.body;
    const updatedProduct = await updateProductMetafields(productId, metafields);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
