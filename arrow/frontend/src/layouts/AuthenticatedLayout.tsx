import React from 'react';
import SidebarNew from '../components/SidebarNew';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-vaporwave-darker">
      <SidebarNew />
      <main className="flex-1 p-8 ml-[280px] transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default AuthenticatedLayout;