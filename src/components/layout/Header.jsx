import React from 'react';
import Nav from './Nav';
import './Header.css';

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo-section">
          <div className="logo-icon">
            {/* Mock logo with shapes */}
            <div className="shape shape-blue"></div>
            <div className="shape shape-orange"></div>
            <div className="shape shape-green"></div>
          </div>
          <h1 className="logo-text">Sách Điện Tử</h1>
        </div>
        <Nav />
      </div>
    </header>
  );
};

export default Header;
