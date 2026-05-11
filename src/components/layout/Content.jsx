import React from 'react';
import './Content.css';

const Content = ({ children }) => {
  return (
    <main className="main-content">
      <div className="content-wrapper">
        {children}
      </div>
    </main>
  );
};

export default Content;
