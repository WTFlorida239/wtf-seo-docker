const express = require('express');
const router = express.Router();
const db = require('../database');
const shopify = require('../config/shopify');

// This route does not need login, as it's called by Shopify servers.
// It is protected by HMAC signature verification instead.
router.post('/orders/create', async (req, res) => {
  try {
    const hmac = req.get('X-Shopify-Hmac-Sha256');
    // The shopify-api library expects the raw body to be a string.
    const bodyString = req.rawBody.toString();

    const isValid = await shopify.utils.validateHmac({
      rawBody: bodyString,
      rawQuery: `hmac=${hmac}`, // A bit of a workaround to fit the library's expected format
    });

    if (!isValid) {
      console.log('Webhook HMAC validation failed.');
      return res.status(401).send('Could not verify webhook.');
    }

    const topic = req.get('X-Shopify-Topic');
    const payload = req.body;

    // Log the webhook payload to the database
    const stmt = db.prepare('INSERT INTO webhooks (topic, payload) VALUES (?, ?)');
    stmt.run(topic, JSON.stringify(payload));

    console.log(`Webhook received and stored for topic: ${topic}`);

    // Respond to Shopify to acknowledge receipt
    res.status(200).send('Webhook received.');

  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Error processing webhook.');
  }
});

module.exports = router;
