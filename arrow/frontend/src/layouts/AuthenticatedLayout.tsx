import React from 'react';
import SidebarNew from '../components/SidebarNew';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Sidebar masquée sur mobile */}
      <div className="hidden sm:block">
        <SidebarNew />
      </div>
      {/* Contenu: marge adaptée selon breakpoint */}
      <main className="flex-1 ml-0 sm:ml-[280px] transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default AuthenticatedLayout;