import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

interface IntervenantRouteProps {
  children: React.ReactNode;
}

const IntervenantRoute: React.FC<IntervenantRouteProps> = ({ children }) => {
  const [isIntervenant, setIsIntervenant] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkIntervenant = () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setIsIntervenant(false);
        return;
      }
      
      try {
        const user = JSON.parse(storedUser);
        setIsIntervenant(user.role === 'intervenant');
      } catch (err) {
        console.error('Erreur lors du parsing des données utilisateur:', err);
        setIsIntervenant(false);
      }
    };
    
    checkIntervenant();
  }, []);
  
  if (isIntervenant === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return isIntervenant ? <>{children}</> : <Navigate to="/login" />;
};

export default IntervenantRoute; 