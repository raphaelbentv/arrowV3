import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Grid 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const roles = [
    {
      title: 'Administrateur',
      description: 'Accès à la gestion complète de la plateforme',
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      action: () => navigate('/login?role=admin')
    },
    {
      title: 'Intervenant',
      description: 'Gestion des cours et suivi des étudiants',
      icon: <SchoolIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      action: () => navigate('/login?role=intervenant')
    },
    {
      title: 'Étudiant',
      description: 'Accès aux cours et aux ressources pédagogiques',
      icon: <PersonIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      action: () => navigate('/login?role=student')
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      {/* En-tête */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Bienvenue sur Arrow
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Plateforme de gestion des formations
        </Typography>
      </Box>

      {/* Cartes des rôles */}
      <Grid container spacing={4} justifyContent="center">
        {roles.map((role) => (
          <Grid item xs={12} sm={6} md={4} key={role.title}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent sx={{ 
                flexGrow: 1, 
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}>
                {role.icon}
                <Typography gutterBottom variant="h5" component="h2">
                  {role.title}
                </Typography>
                <Typography color="text.secondary">
                  {role.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={role.action}
                >
                  Se connecter
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pied de page */}
      <Box sx={{ textAlign: 'center', mt: 6, mb: 4 }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Arrow. Tous droits réservés.
        </Typography>
      </Box>
    </Container>
  );
};

export default Dashboard; 