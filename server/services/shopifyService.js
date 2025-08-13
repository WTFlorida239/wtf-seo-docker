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

const analyzeAllProducts = async () => {
  try {
    const client = new shopify.clients.Graphql({
      session: {
        shop: process.env.SHOPIFY_STORE_URL,
        accessToken: process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN,
      },
    });

    // We'll need to handle pagination in a real scenario, but for now, we fetch the first 25.
    const query = `
      query {
        products(first: 25) {
          edges {
            node {
              id
              title
              handle
              bodyHtml
              onlineStoreUrl
              metafields(first: 2, namespace: "seo") {
                edges {
                  node {
                    key
                    value
                  }
                }
              }
              images(first: 5) {
                edges {
                  node {
                    id
                    altText
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await client.query({
      data: { query },
    });

    const products = response.body.data.products.edges.map(edge => edge.node);

    // Now, perform the analysis
    const analysisResults = products.map(product => {
      const seoMetafield = product.metafields.edges.reduce((acc, edge) => {
        acc[edge.node.key] = edge.node.value;
        return acc;
      }, {});

      const titleTag = seoMetafield.title_tag || '';
      const descriptionTag = seoMetafield.description_tag || '';
      const wordCount = product.bodyHtml ? product.bodyHtml.replace(/<[^>]*>?/gm, '').split(/\s+/).length : 0;
      const imagesWithoutAltText = product.images.edges.filter(edge => !edge.node.altText).length;

      return {
        id: product.id,
        title: product.title,
        url: product.onlineStoreUrl,
        analysis: {
          titleTag,
          titleTagLength: titleTag.length,
          descriptionTag,
          descriptionTagLength: descriptionTag.length,
          wordCount,
          imageCount: product.images.edges.length,
          imagesWithoutAltText,
        }
      };
    });

    return analysisResults;

  } catch (error) {
    console.error('Error fetching and analyzing products from Shopify:', error);
    if (error.response) {
      console.error('Shopify API Response:', JSON.stringify(error.response.body, null, 2));
    }
    throw new Error('Failed to fetch and analyze products from Shopify.');
  }
};


const updateImageAltText = async (imageId, altText) => {
  try {
    const client = new shopify.clients.Graphql({
      session: {
        shop: process.env.SHOPIFY_STORE_URL,
        accessToken: process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN,
      },
    });

    const mutation = `
      mutation imageUpdate($input: ImageInput!) {
        imageUpdate(input: $input) {
          image {
            id
            altText
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        id: imageId,
        altText: altText,
      },
    };

    const response = await client.query({
      data: {
        query: mutation,
        variables,
      },
    });

    const userErrors = response.body.data.imageUpdate.userErrors;
    if (userErrors && userErrors.length > 0) {
      throw new Error(userErrors.map(e => e.message).join(', '));
    }

    return response.body.data.imageUpdate.image;

  } catch (error) {
    console.error(`Error updating alt text for image ${imageId}:`, error);
    throw new Error('Failed to update image alt text in Shopify.');
  }
};

const updateProductMetafields = async (productId, metafields) => {
  try {
    const client = new shopify.clients.Graphql({
      session: {
        shop: process.env.SHOPIFY_STORE_URL,
        accessToken: process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN,
      },
    });

    const mutation = `
      mutation productUpdate($input: ProductInput!) {
        productUpdate(input: $input) {
          product {
            id
            metafields(first: 2, namespace: "seo") {
              edges {
                node {
                  key
                  value
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        id: productId,
        metafields: metafields.map(mf => ({
          namespace: "seo",
          key: mf.key,
          value: mf.value,
        })),
      },
    };

    const response = await client.query({
      data: {
        query: mutation,
        variables,
      },
    });

    const userErrors = response.body.data.productUpdate.userErrors;
    if (userErrors && userErrors.length > 0) {
      throw new Error(userErrors.map(e => e.message).join(', '));
    }

    return response.body.data.productUpdate.product;

  } catch (error) {
    console.error(`Error updating metafields for product ${productId}:`, error);
    throw new Error('Failed to update product metafields in Shopify.');
  }
};

module.exports = { getShopInfo, analyzeAllProducts, updateImageAltText, updateProductMetafields };
