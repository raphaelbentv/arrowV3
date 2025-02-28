import React from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Grid,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AdminPanelSettings, School, Person } from '@mui/icons-material';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const loginOptions = [
    {
      title: 'Administrateur',
      description: 'Accès au panneau d\'administration',
      icon: <AdminPanelSettings sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
      path: '/admin/login',
      available: true
    },
    {
      title: 'Intervenant',
      description: 'Accès à l\'espace intervenant',
      icon: <Person sx={{ fontSize: 60, color: theme.palette.secondary.main }} />,
      path: '/login/intervenant',
      available: false
    },
    {
      title: 'Étudiant',
      description: 'Accès à l\'espace étudiant',
      icon: <School sx={{ fontSize: 60, color: theme.palette.info.main }} />,
      path: '/login/etudiant',
      available: false
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        mt: 8, 
        mb: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Bienvenue sur Arrow
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="textSecondary">
          Choisissez votre espace de connexion
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {loginOptions.map((option) => (
            <Grid item xs={12} md={4} key={option.title}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                  opacity: option.available ? 1 : 0.7
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 2,
                  mt: 2 
                }}>
                  {option.icon}
                </Box>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {option.title}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {option.description}
                  </Typography>
                  {!option.available && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mt: 2,
                        color: 'warning.main',
                        fontStyle: 'italic'
                      }}
                    >
                      Bientôt disponible
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button 
                    size="large" 
                    variant="contained" 
                    onClick={() => navigate(option.path)}
                    disabled={!option.available}
                    fullWidth
                  >
                    Se connecter
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage; 