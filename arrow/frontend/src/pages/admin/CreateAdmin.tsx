import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CreateAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Données envoyées:', formData);

    try {
      const response = await api.post('/admin/initial', formData);
      console.log('Réponse du serveur:', response.data);
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);
    } catch (err: any) {
      console.error('Erreur détaillée:', err.response?.data);
      if (err.response?.status === 409) {
        setError('Un administrateur avec cet email existe déjà');
      } else {
        setError(err.response?.data?.message || 'Erreur lors de la création de l\'administrateur');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Ajouter un administrateur
          </Typography>

          {success ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              Administrateur créé avec succès ! Redirection...
            </Alert>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="prenom"
                label="Prénom"
                name="prenom"
                autoComplete="given-name"
                value={formData.prenom}
                onChange={handleChange}
                autoFocus
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="nom"
                label="Nom"
                name="nom"
                autoComplete="family-name"
                value={formData.nom}
                onChange={handleChange}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Créer l\'administrateur'
                  )}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/admin/users')}
                  disabled={loading}
                >
                  Annuler
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateAdmin; 