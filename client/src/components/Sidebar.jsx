import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{ width: '200px', float: 'left', borderRight: '1px solid #ccc', height: '100vh', padding: '20px' }}>
      <h3>Menu</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/keywords">Keywords</Link>
        </li>
        <li>
          <Link to="/audit">Audit</Link>
        </li>
        <li>
          <Link to="/shopify">Shopify</Link>
          <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
            <li>
              <Link to="/shopify/products">Product SEO</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/social">Social Media</Link>
        </li>
        <li>
          <Link to="/gbp">Google Business</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
