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
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalIntervenants: 0,
    totalCourses: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Charger les données de l'utilisateur depuis le localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Erreur lors du parsing des données utilisateur:', err);
      }
    } else {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      navigate('/admin/login');
    }
  }, [navigate]);

  // Charger les statistiques depuis l'API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Vous pouvez créer un endpoint spécifique pour les statistiques
        const usersResponse = await api.get('/admin/users/count');
        const intervenantsResponse = await api.get('/admin/intervenants/count');
        
        setStats({
          totalUsers: usersResponse.data.count || 0,
          totalIntervenants: intervenantsResponse.data.count || 0,
          totalCourses: 0 // À implémenter si vous avez des cours
        });
      } catch (err: any) {
        console.error('Erreur lors du chargement des statistiques:', err);
        setError('Impossible de charger les statistiques');
        
        // Si l'erreur est due à un problème d'authentification, rediriger vers la page de connexion
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user && user.isAdmin) {
      fetchStats();
    }
  }, [user, navigate]);

  // Fonction pour se déconnecter
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Panneau d'administration
          </Typography>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Déconnexion
          </Button>
        </Box>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        {user && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6">
              Bienvenue, {user.prenom} {user.nom}
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
                  onClick={() => navigate('/admin/users')}
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
                  onClick={() => navigate('/admin/intervenants')}
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
                  onClick={() => navigate('/admin/courses')}
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
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate('/admin/users/new')}
                >
                  Ajouter un utilisateur
                </Button>
                <Button 
                  variant="contained" 
                  color="secondary"
                  onClick={() => navigate('/admin/intervenants/new')}
                >
                  Ajouter un intervenant
                </Button>
                <Button 
                  variant="contained"
                  onClick={() => navigate('/admin/courses/new')}
                >
                  Créer un cours
                </Button>
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={() => console.log('Maintenance système')}
                >
                  Maintenance système
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          {/* Activités récentes - À implémenter avec des données réelles */}
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