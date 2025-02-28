import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const AdminLogin: React.FC = () => {
  console.log('Rendu du composant AdminLogin');
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Tentative de connexion avec email:', email);
    setLoading(true);
    setError('');

    try {
      console.log('Envoi de la requête de connexion...');
      const response = await api.post('/auth/login', { email, password });
      console.log('Réponse reçue:', response.data);
      
      if (response.data.user && response.data.user.isAdmin) {
        console.log('Connexion réussie - Utilisateur admin');
        // Stocker le token et les infos utilisateur
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Rediriger vers le dashboard admin
        console.log('Redirection vers le dashboard admin');
        navigate('/admin/dashboard', { replace: true });
      } else {
        console.log('Connexion échouée - Utilisateur non admin');
        setError('Accès réservé aux administrateurs');
        // Réinitialiser le mot de passe pour plus de sécurité
        setPassword('');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError('Identifiants invalides. Veuillez réessayer.');
      // Réinitialiser le mot de passe en cas d'erreur
      setPassword('');
    } finally {
      setLoading(false);
      console.log('Fin de la tentative de connexion');
    }
  };

  // Surveiller les changements d'état
  React.useEffect(() => {
    console.log('État actuel:', { email, error, loading, currentPath: location.pathname });
  }, [email, error, loading, location]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Connexion Administrateur
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            Veuillez vous connecter pour accéder au tableau de bord
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => {
                console.log('Email modifié:', e.target.value);
                setEmail(e.target.value);
              }}
              error={!!error}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                console.log('Mot de passe modifié');
                setPassword(e.target.value);
              }}
              error={!!error}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Se connecter'
              )}
            </Button>
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            En mode développement, utilisez n'importe quel email/mot de passe.
          </Alert>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminLogin;
