import React, { useState } from 'react';

const ShopifyPage = () => {
  const [shopInfo, setShopInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchShopInfo = async () => {
    setIsLoading(true);
    setError('');
    setShopInfo(null);
    try {
      const response = await fetch('/api/shopify/store/info');
      if (!response.ok) {
        throw new Error('Failed to fetch store info. Check server logs and .env configuration.');
      }
      const data = await response.json();
      setShopInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Shopify Integration</h1>
      <p>Verify your connection to the Shopify Admin API.</p>
      <button onClick={fetchShopInfo} disabled={isLoading}>
        {isLoading ? 'Fetching...' : 'Fetch Store Info'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}

      {shopInfo && (
        <div style={{ marginTop: '20px', background: '#f5f5f5', padding: '20px', borderRadius: '5px' }}>
          <h3>Store Information</h3>
          <pre>{JSON.stringify(shopInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ShopifyPage;
