import React, { useState, useEffect } from 'react';
import { generateAltText, generateSeoTitle, generateSeoDescription } from '../services/aiAPI';
import { updateImageAltText, updateProductMetafields, bulkUpdateProductMetafields } from '../services/shopifyAPI';
import Modal from '../components/Modal';
import { useUser } from '../context/UserContext';

// A sub-component to handle the suggestion and application logic for a single issue
const FixableIssue = ({ issueText, onGenerate, onApply }) => {
  const { hasPermission } = useUser();
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
      {hasPermission('edit_seo') && (
        <>
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
        </>
      )}
    </div>
  );
};


const ShopifyProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulkUpdateStatus, setBulkUpdateStatus] = useState('');

  const handleBulkUpdate = async () => {
    setBulkUpdateStatus('Initiating bulk update...');
    try {
      const productUpdates = Array.from(selectedProducts).map(productId => {
        // This is a simplified example. A real UI would have more options.
        // We'll generate a new title tag for all selected products.
        const product = products.find(p => p.id === productId);
        return {
          id: product.id,
          metafields: [{
            key: 'title_tag',
            value: `${product.title} - Now with improved SEO!`
          }]
        };
      });

      const result = await bulkUpdateProductMetafields(productUpdates);
      setBulkUpdateStatus(result.message);
      setIsModalOpen(false);
      setSelectedProducts(new Set()); // Clear selection
    } catch (error) {
      setBulkUpdateStatus(`Error: ${error.message}`);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(productId)) {
        newSelected.delete(productId);
      } else {
        newSelected.add(productId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allProductIds = products.map(p => p.id);
      setSelectedProducts(new Set(allProductIds));
    } else {
      setSelectedProducts(new Set());
    }
  };

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

      {selectedProducts.size > 0 && (
        <div style={{ padding: '10px', background: '#eef', border: '1px solid #ccd', marginBottom: '15px' }}>
          <strong>{selectedProducts.size} products selected.</strong>
          <button onClick={() => setIsModalOpen(true)} style={{ marginLeft: '20px' }}>
            Bulk Actions...
          </button>
        </div>
      )}

      {bulkUpdateStatus && <p><strong>Bulk Update Status:</strong> {bulkUpdateStatus}</p>}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Bulk Edit {selectedProducts.size} Products</h2>
        <p>This is a simplified demo. In a real app, you would have more options here.</p>
        <p>This action will append "- Now with improved SEO!" to the meta title of all selected products.</p>
        <button onClick={handleBulkUpdate}>Confirm Bulk Update</button>
      </Modal>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid black' }}>
            <th style={{ padding: '8px', width: '20px' }}>
              <input type="checkbox" onChange={handleSelectAll} />
            </th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Product</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Meta Title</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Meta Description</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Images Missing Alt Text</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '8px' }}>
                <input
                  type="checkbox"
                  checked={selectedProducts.has(product.id)}
                  onChange={() => handleSelectProduct(product.id)}
                />
              </td>
              <td style={{ padding: '8px' }}>
                <a href={product.url} target="_blank" rel="noopener noreferrer">{product.title}</a>
              </td>
              <td style={{ padding: '8px' }}>
                {product.analysis.titleTagLength > 10 && product.analysis.titleTagLength <= 60 ? (
                  <span style={{ color: 'green' }}>Good ({product.analysis.titleTagLength})</span>
                ) : (
                  <FixableIssue
                    issueText={`${product.analysis.titleTag || '(Missing)'} (${product.analysis.titleTagLength})`}
                    onGenerate={() => generateSeoTitle(product.title, product.analysis.descriptionTag)}
                    onApply={(suggestion) => handleApplyMetafield(product.id, 'title_tag', suggestion)}
                  />
                )}
              </td>
              <td style={{ padding: '8px' }}>
                {product.analysis.descriptionTagLength > 50 && product.analysis.descriptionTagLength <= 160 ? (
                  <span style={{ color: 'green' }}>Good ({product.analysis.descriptionTagLength})</span>
                ) : (
                  <FixableIssue
                    issueText={`${product.analysis.descriptionTag || '(Missing)'} (${product.analysis.descriptionTagLength})`}
                    onGenerate={() => generateSeoDescription(product.title, product.analysis.descriptionTag)}
                    onApply={(suggestion) => handleApplyMetafield(product.id, 'description_tag', suggestion)}
                  />
                )}
              </td>
              <td style={{ padding: '8px' }}>
                {product.analysis.imagesWithoutAltText > 0 ? (
                  <FixableIssue
                    issueText={`${product.analysis.imagesWithoutAltText} / ${product.analysis.imageCount} missing`}
                    onGenerate={() => generateAltText(product.title)}
                    onApply={(suggestion) => handleApplyAltText(product.id, suggestion)}
                  />
                ) : (
                  <span style={{ color: 'green' }}>{product.analysis.imagesWithoutAltText} / {product.analysis.imageCount}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShopifyProductsPage;
