import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useUser } from './context/UserContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AuditPage from './pages/AuditPage';
import KeywordsPage from './pages/KeywordsPage';
import ShopifyPage from './pages/ShopifyPage';
import ShopifyProductsPage from './pages/ShopifyProductsPage';
import SocialMediaPage from './pages/SocialMediaPage';
import GbpPage from './pages/GbpPage';

const App = () => {
  const { user } = useUser();

  return (
    <div>
      <Header />
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
          <Route path="/social" element={<SocialMediaPage />} />
          <Route path="/gbp" element={<GbpPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
