import React from 'react';
import { useLocation } from 'react-router-dom';
import SidebarNew from '../components/SidebarNew';
import { Navbar } from '../components/ui/Navbar';
import AdminNav from '../components/AdminNav';
import CollapsibleBreadcrumb from '@/components/ui/CollapsibleBreadcrumb';

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

  // Vérifier si c'est la page Planning (exceptionnelle : pas de marges)
  const isPlanningPage = location.pathname === '/admin/planning';

  // Si admin, utiliser le composant fusionné AdminNav (contient navbar + sidebar)
  if (role === 'admin') {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        {/* AdminNav : Navbar + Sidebar fusionnés pour les admins */}
        <AdminNav 
          showSearch={showSearch}
          searchPlaceholder="Rechercher..."
          onSearch={handleSearch}
        />

        {/* Breadcrumb rétractable */}
        <CollapsibleBreadcrumb />

        {/* Contenu: marge adaptée selon breakpoint, pas de marges ni padding pour Planning */}
        <main 
          className={`flex-1 transition-all duration-300 ${isPlanningPage ? 'ml-0 planning-page-main' : 'ml-0 sm:ml-[280px]'}`}
          style={isPlanningPage ? { 
            margin: 0, 
            padding: 0, 
            maxWidth: '100%', 
            width: '100%',
            boxSizing: 'border-box'
          } : {}}
        >
          {children}
        </main>
      </div>
    );
  }

  // Pour les autres rôles, utiliser l'ancienne structure
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

      {/* Breadcrumb rétractable */}
      <CollapsibleBreadcrumb />

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