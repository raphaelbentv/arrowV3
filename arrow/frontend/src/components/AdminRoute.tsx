import React from 'react';

interface AdminRouteProps {
  children: React.ReactNode;
}

// Composant temporairement modifié pour désactiver l'authentification
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  // Pour le développement, on retourne directement les enfants sans vérification
  return <>{children}</>;
};

export default AdminRoute;
