import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user }) => {
  const renderContent = () => {
    switch (user) {
      case null:
        return; // Still fetching
      case false:
        return (
          <li>
            <a href="/auth/google">Login with Google</a>
          </li>
        );
      default:
        return (
          <>
            <li style={{ marginRight: '10px' }}>Welcome, {user.name}</li>
            <li>
              <a href="/api/logout">Logout</a>
            </li>
          </>
        );
    }
  };

  return (
    <nav>
      <div className="nav-wrapper" style={{ padding: '0 20px' }}>
        <Link to={user ? '/dashboard' : '/'} className="brand-logo">
          SEO Tool
        </Link>
        <ul className="right">{renderContent()}</ul>
      </div>
    </nav>
  );
};

export default Header;
