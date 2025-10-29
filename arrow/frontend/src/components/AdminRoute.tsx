import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  // Vérifier si l'utilisateur est authentifié et est un admin
  if (!authService.isAuthenticated() || !authService.isAdmin()) {
    console.log('Accès refusé - redirection vers login');
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;