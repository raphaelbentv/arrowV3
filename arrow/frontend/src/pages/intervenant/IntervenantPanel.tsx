import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  CircularProgress, 
  Box,
  Grid,
  Paper,
  Alert
} from '@mui/material';
import { intervenantsService } from '../../services/intervenants';
import { Intervenant } from '../../types/intervenant';

const IntervenantPanel: React.FC = () => {
  const [intervenants, setIntervenants] = useState<Intervenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIntervenants = async () => {
      try {
        setLoading(true);
        const data = await intervenantsService.getAll();
        setIntervenants(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors de la récupération des intervenants');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIntervenants();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Liste des Intervenants
      </Typography>

      <Grid container spacing={3}>
        {intervenants.map((intervenant) => (
          <Grid item xs={12} sm={6} md={4} key={intervenant._id}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2,
                '&:hover': {
                  boxShadow: 6,
                  cursor: 'pointer'
                }
              }}
            >
              <Typography variant="h6" gutterBottom>
                {intervenant.nom} {intervenant.prenom}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {intervenant.email}
              </Typography>
              {intervenant.telephone && (
                <Typography variant="body2" color="text.secondary">
                  Téléphone: {intervenant.telephone}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {intervenants.length === 0 && !error && (
        <Box textAlign="center" mt={4}>
          <Typography variant="body1" color="text.secondary">
            Aucun intervenant trouvé
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default IntervenantPanel; 