const postRequest = async (url, body) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get AI suggestion');
  }
  return response.json();
};

export const generateAltText = async (productTitle) => {
  return postRequest('/api/ai/generate-alt-text', { productTitle });
};

export const generateSeoTitle = async (productTitle, productDescription) => {
  return postRequest('/api/ai/generate-seo-title', { productTitle, productDescription });
};

export const generateSeoDescription = async (productTitle, productDescription) => {
  return postRequest('/api/ai/generate-seo-description', { productTitle, productDescription });
};
