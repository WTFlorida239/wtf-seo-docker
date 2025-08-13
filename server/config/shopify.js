require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { shopifyApi, LATEST_API_VERSION } = require('@shopify/shopify-api');

const shopify = shopifyApi({
  apiKey: 'placeholder-api-key', // This is not the same as the access token. It's needed for the library, but not for private apps. We can use a placeholder.
  apiSecretKey: 'placeholder-api-secret', // Also not needed for private admin token auth, but required by the library.
  scopes: ['read_products', 'read_orders'], // Scopes are not used for admin token auth but good to have for context.
  hostName: process.env.SHOPIFY_STORE_URL.replace(/^https|:\/\//, ''),
  apiVersion: process.env.SHOPIFY_API_VERSION || LATEST_API_VERSION,
  isEmbeddedApp: false,
  // This is for private apps. The library is mainly for public apps, but can be used this way.
  adminApiAccessToken: process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN,
});

module.exports = shopify;
