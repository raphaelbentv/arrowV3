import React from 'react';
import { useLocation } from 'react-router-dom';
import SidebarNew from '../components/SidebarNew';
import { Navbar } from '../components/ui/Navbar';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const location = useLocation();

  // Déterminer le rôle basé sur le chemin
  const getRole = (): 'admin' | 'intervenant' | 'student' => {
    if (location.pathname.startsWith('/admin')) return 'admin';
    if (location.pathname.startsWith('/intervenant')) return 'intervenant';
    if (location.pathname.startsWith('/student')) return 'student';
    return 'admin'; // Par défaut
  };

  const role = getRole();
  // Désactiver la recherche dans la Navbar pour toutes les pages admin
  const showSearch = role !== 'admin';

  const handleSearch = (query: string) => {
    // Ici vous pouvez implémenter la logique de recherche globale
    console.log('Recherche globale:', query);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navbar sans barre de recherche pour les admins */}
      <Navbar 
        role={role}
        logoHref={`/${role}/dashboard`}
        activeLink={location.pathname}
        showSearch={showSearch}
        searchPlaceholder="Rechercher..."
        onSearch={handleSearch}
      />

      <div className="flex min-h-screen">
        {/* Sidebar masquée sur mobile */}
        <div className="hidden sm:block">
          <SidebarNew />
        </div>
        {/* Contenu: marge adaptée selon breakpoint */}
        <main className="flex-1 ml-0 sm:ml-[280px] transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;