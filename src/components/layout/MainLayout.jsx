import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Content from './Content';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="layout-wrapper">
      <Header />
      <Content>
        {children}
      </Content>
      <Footer />
    </div>
  );
};

export default MainLayout;
