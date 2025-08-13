const shopify = require('../config/shopify');

const getShopInfo = async () => {
  try {
    const client = new shopify.clients.Rest({
      session: {
        shop: process.env.SHOPIFY_STORE_URL,
        accessToken: process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN,
      },
    });

    const response = await client.get({
      path: 'shop',
    });

    return response.body.shop;
  } catch (error) {
    console.error('Error fetching shop info from Shopify:', error);
    if (error.response) {
      console.error('Shopify API Response:', error.response.body);
    }
    throw new Error('Failed to fetch shop info from Shopify.');
  }
};

module.exports = { getShopInfo };
