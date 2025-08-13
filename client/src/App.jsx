import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AuditPage from './pages/AuditPage';
import KeywordsPage from './pages/KeywordsPage';
import ShopifyPage from './pages/ShopifyPage';
import ShopifyProductsPage from './pages/ShopifyProductsPage';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/current_user');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div>
      <Header user={user} />
      <div style={{ display: 'flex' }}>
        {user && <Sidebar />}
        <div className="container" style={{ flexGrow: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/keywords" element={<KeywordsPage />} />
          <Route path="/shopify" element={<ShopifyPage />} />
          <Route path="/shopify/products" element={<ShopifyProductsPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
