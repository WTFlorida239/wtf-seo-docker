const express = require('express');
const router = express.Router();
const { getShopInfo } = require('../services/shopifyService');

// This route is protected by the requireLogin middleware in server/index.js
router.get('/store/info', async (req, res) => {
  try {
    const shopInfo = await getShopInfo();
    res.json(shopInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
