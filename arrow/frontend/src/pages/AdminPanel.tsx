import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { useAuth } from '../context/authContext';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalIntervenants: 0,
    totalCourses: 0
  });

  // Simuler le chargement des statistiques
  useEffect(() => {
    // Remplacer par un appel API réel
    const fetchStats = async () => {
      // Simulation de données
      setStats({
        totalUsers: 25,
        totalIntervenants: 8,
        totalCourses: 12
      });
    };

    fetchStats();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Panneau d'administration
        </Typography>
        
        {user && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6">
              Bienvenue, {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Vous êtes connecté en tant qu'administrateur
            </Typography>
          </Paper>
        )}

        <Grid container spacing={3}>
          {/* Statistiques */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  Utilisateurs
                </Typography>
                <Typography variant="h3" component="div" sx={{ mt: 2 }}>
                  {stats.totalUsers}
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ mt: 2 }}
                  onClick={() => console.log('Gérer les utilisateurs')}
                >
                  Gérer les utilisateurs
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  Intervenants
                </Typography>
                <Typography variant="h3" component="div" sx={{ mt: 2 }}>
                  {stats.totalIntervenants}
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ mt: 2 }}
                  onClick={() => console.log('Gérer les intervenants')}
                >
                  Gérer les intervenants
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  Cours
                </Typography>
                <Typography variant="h3" component="div" sx={{ mt: 2 }}>
                  {stats.totalCourses}
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ mt: 2 }}
                  onClick={() => console.log('Gérer les cours')}
                >
                  Gérer les cours
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Actions administratives */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Actions rapides
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                <Button variant="contained" color="primary">
                  Ajouter un utilisateur
                </Button>
                <Button variant="contained" color="secondary">
                  Ajouter un intervenant
                </Button>
                <Button variant="contained">
                  Créer un cours
                </Button>
                <Button variant="outlined" color="error">
                  Maintenance système
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          {/* Activités récentes */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Activités récentes
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Nouvel utilisateur inscrit" 
                    secondary="Il y a 2 heures" 
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="Cours mis à jour" 
                    secondary="Il y a 5 heures" 
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="Intervenant ajouté" 
                    secondary="Hier" 
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminPanel; 