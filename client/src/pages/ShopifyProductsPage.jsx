import React, { useState, useEffect } from 'react';

const ShopifyProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductAnalysis = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('/api/shopify/products/analyze');
        if (!response.ok) {
          throw new Error('Failed to fetch product analysis.');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductAnalysis();
  }, []);

  const renderAnalysisCell = (value, goodCondition, warnCondition) => {
    let style = {};
    if (goodCondition) {
      style.color = 'green';
    } else if (warnCondition) {
      style.color = 'orange';
    }
    return <td style={style}>{value}</td>;
  };

  if (isLoading) {
    return <div>Loading product analysis...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Shopify Product SEO Analysis</h1>
      <p>An overview of the SEO health of your Shopify products.</p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid black' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Product</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Title Tag Length</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Description Length</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Word Count</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Images Missing Alt Text</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '8px' }}>
                <a href={product.url} target="_blank" rel="noopener noreferrer">{product.title}</a>
              </td>
              {renderAnalysisCell(
                product.analysis.titleTagLength,
                product.analysis.titleTagLength > 10 && product.analysis.titleTagLength <= 60,
                product.analysis.titleTagLength === 0 || product.analysis.titleTagLength > 60
              )}
              {renderAnalysisCell(
                product.analysis.descriptionTagLength,
                product.analysis.descriptionTagLength > 50 && product.analysis.descriptionTagLength <= 160,
                product.analysis.descriptionTagLength === 0 || product.analysis.descriptionTagLength > 160
              )}
              {renderAnalysisCell(
                product.analysis.wordCount,
                product.analysis.wordCount > 300,
                product.analysis.wordCount < 50
              )}
              {renderAnalysisCell(
                `${product.analysis.imagesWithoutAltText} / ${product.analysis.imageCount}`,
                product.analysis.imagesWithoutAltText === 0,
                product.analysis.imagesWithoutAltText > 0
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShopifyProductsPage;
