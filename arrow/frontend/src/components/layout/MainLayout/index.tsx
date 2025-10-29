import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black/95">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;

