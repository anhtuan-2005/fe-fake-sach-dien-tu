import React from 'react';
import './Content.css';

interface ContentProps {
  children: React.ReactNode;
}

const Content: React.FC<ContentProps> = ({ children }) => {
  return (
    <main className="main-content">
      <div className="content-wrapper">
        {children}
      </div>
    </main>
  );
};

export default Content;
