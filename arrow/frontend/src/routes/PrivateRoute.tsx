import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (loading) {
    return <div>Chargement...</div>;
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Vérifier les rôles si spécifiés
  if (requiredRoles && requiredRoles.length > 0 && user) {
    if (user.role && !requiredRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" />;
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;