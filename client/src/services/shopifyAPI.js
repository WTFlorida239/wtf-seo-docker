export const updateImageAltText = async (imageId, altText) => {
  const response = await fetch(`/api/shopify/images/${imageId}/update-alt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ altText }),
  });
  if (!response.ok) {
    throw new Error('Failed to update alt text');
  }
  return response.json();
};

export const bulkUpdateProductMetafields = async (productUpdates) => {
  const response = await fetch('/api/shopify/products/bulk-update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productUpdates }),
  });
  if (!response.ok) {
    throw new Error('Failed to start bulk update job');
  }
  return response.json();
};

export const updateProductMetafields = async (productId, metafields) => {
  const response = await fetch(`/api/shopify/products/${productId}/update-metafields`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ metafields }),
  });
  if (!response.ok) {
    throw new Error('Failed to update metafields');
  }
  return response.json();
};
