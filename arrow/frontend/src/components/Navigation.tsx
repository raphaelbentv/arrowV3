import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Arrow
        </Typography>
        
        {/* Navigation basée sur le rôle */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {user?.role === 'admin' && (
            <>
              <Button color="inherit" onClick={() => navigate('/admin')}>
                Dashboard Admin
              </Button>
              <Button color="inherit" onClick={() => navigate('/admin/users')}>
                Gestion Utilisateurs
              </Button>
            </>
          )}
          
          {user?.role === 'intervenant' && (
            <>
              <Button color="inherit" onClick={() => navigate('/intervenant')}>
                Mes Cours
              </Button>
              <Button color="inherit" onClick={() => navigate('/intervenant/students')}>
                Mes Étudiants
              </Button>
            </>
          )}

          <Button color="inherit" onClick={handleLogout}>
            Déconnexion
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 