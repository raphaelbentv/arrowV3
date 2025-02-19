
import { 
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Paper,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ bgcolor: '#1a1a1a', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: '#252525' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#FFD700' }}>
            ArroW
          </Typography>
          <Button color="inherit" onClick={() => navigate('/login')}>
            Connexion
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, bgcolor: '#252525', color: 'white' }}>
              <Typography color="text.secondary" gutterBottom>
                Étudiants actifs
              </Typography>
              <Typography variant="h4" sx={{ color: '#FFD700' }}>
                256
              </Typography>
              <Typography color="success.main">
                ↑ +12% ce mois
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, bgcolor: '#252525', color: 'white' }}>
              <Typography color="text.secondary" gutterBottom>
                Intervenants
              </Typography>
              <Typography variant="h4" sx={{ color: '#FFD700' }}>
                45
              </Typography>
              <Typography color="success.main">
                ↑ +3 cette semaine
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, bgcolor: '#252525', color: 'white' }}>
              <Typography color="text.secondary" gutterBottom>
                Groupes actifs
              </Typography>
              <Typography variant="h4" sx={{ color: '#FFD700' }}>
                12
              </Typography>
              <Typography color="text.secondary">
                Formation en cours
              </Typography>
            </Paper>
          </Grid>

          {/* Actions and Activity */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, bgcolor: '#252525', color: 'white' }}>
              <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                Actions rapides
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="contained" sx={{ bgcolor: '#333' }}>
                  Ajouter un intervenant
                </Button>
                <Button variant="contained" sx={{ bgcolor: '#333' }}>
                  Ajouter un étudiant
                </Button>
                <Button variant="contained" sx={{ bgcolor: '#333' }}>
                  Gérer les groupes
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, bgcolor: '#252525', color: 'white' }}>
              <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                Activité récente
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Activity items */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    bgcolor: '#333', 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    👤
                  </Box>
                  <Box>
                    <Typography>Nouvel intervenant ajouté</Typography>
                    <Typography color="text.secondary" variant="body2">
                      Il y a 2h
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    bgcolor: '#333', 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    👥
                  </Box>
                  <Box>
                    <Typography>Nouveau groupe créé</Typography>
                    <Typography color="text.secondary" variant="body2">
                      Il y a 3h
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;