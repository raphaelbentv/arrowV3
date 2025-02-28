import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Version simplifiée pour le développement
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirection directe vers le dashboard sans vérification
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Connexion Administrateur
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            Mode développement - Authentification désactivée
          </Typography>
          
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Accéder au Dashboard
            </Button>
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            L'authentification est temporairement désactivée pour le développement.
          </Alert>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminLogin;
