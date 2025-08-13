import React, { useState, useEffect } from 'react';
import { generateAltText, generateSeoTitle, generateSeoDescription } from '../services/aiAPI';
import { updateImageAltText, updateProductMetafields } from '../services/shopifyAPI';

// A sub-component to handle the suggestion and application logic for a single issue
const FixableIssue = ({ issueText, onGenerate, onApply }) => {
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await onGenerate();
      setSuggestion(result.suggestion);
    } catch (error) {
      alert(`Error generating suggestion: ${error.message}`);
    }
    setIsLoading(false);
  };

  const handleApply = () => {
    onApply(suggestion);
  };

  return (
    <div>
      <span>{issueText}</span>
      <button onClick={handleGenerate} disabled={isLoading} style={{ marginLeft: '10px' }}>
        {isLoading ? 'Generating...' : 'Generate Fix'}
      </button>
      {suggestion && (
        <div style={{ marginTop: '5px' }}>
          <input
            type="text"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            style={{ width: '80%' }}
          />
          <button onClick={handleApply} style={{ marginLeft: '5px' }}>Apply</button>
        </div>
      )}
    </div>
  );
};


const ShopifyProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  useEffect(() => {
    fetchProductAnalysis();
  }, []);

  const handleApplyMetafield = async (productId, key, value) => {
    try {
      await updateProductMetafields(productId, [{ key, value }]);
      alert('Successfully updated!');
      fetchProductAnalysis(); // Re-fetch to show updated data
    } catch (error) {
      alert(`Error applying fix: ${error.message}`);
    }
  };

  // This is a simplified handler. A real app would need to associate this with a specific image.
  const handleApplyAltText = async (productId, suggestion) => {
    // In a real app, we'd need imageId. For this demo, we'll just show an alert.
    alert(`Applying alt text "${suggestion}" to first missing image of product ${productId}`);
    // const imageIdToUpdate = ... find first image without alt text ...
    // await updateImageAltText(imageIdToUpdate, suggestion);
    // fetchProductAnalysis();
  };

  if (isLoading) return <div>Loading product analysis...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h1>Shopify Product SEO Dashboard</h1>
      <p>Analyze, generate AI suggestions, and apply fixes for your product SEO.</p>
      {products.map(product => (
        <div key={product.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '5px' }}>
          <h3><a href={product.url} target="_blank" rel="noopener noreferrer">{product.title}</a></h3>
          <ul>
            <li>
              <strong>Meta Title (Length: {product.analysis.titleTagLength}):</strong>
              {product.analysis.titleTagLength > 10 && product.analysis.titleTagLength <= 60 ? (
                <span style={{ color: 'green' }}> Good</span>
              ) : (
                <FixableIssue
                  issueText={product.analysis.titleTag || '(Missing)'}
                  onGenerate={() => generateSeoTitle(product.title, product.analysis.descriptionTag)}
                  onApply={(suggestion) => handleApplyMetafield(product.id, 'title_tag', suggestion)}
                />
              )}
            </li>
            <li>
              <strong>Meta Description (Length: {product.analysis.descriptionTagLength}):</strong>
               {product.analysis.descriptionTagLength > 50 && product.analysis.descriptionTagLength <= 160 ? (
                <span style={{ color: 'green' }}> Good</span>
              ) : (
                <FixableIssue
                  issueText={product.analysis.descriptionTag || '(Missing)'}
                  onGenerate={() => generateSeoDescription(product.title, product.analysis.descriptionTag)}
                  onApply={(suggestion) => handleApplyMetafield(product.id, 'description_tag', suggestion)}
                />
              )}
            </li>
            <li>
              <strong>Images missing alt text: {product.analysis.imagesWithoutAltText} / {product.analysis.imageCount}</strong>
              {product.analysis.imagesWithoutAltText > 0 && (
                 <FixableIssue
                  issueText=""
                  onGenerate={() => generateAltText(product.title)}
                  onApply={(suggestion) => handleApplyAltText(product.id, suggestion)}
                />
              )}
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ShopifyProductsPage;
