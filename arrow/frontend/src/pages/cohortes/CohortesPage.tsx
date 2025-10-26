import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Chip,
  Stack
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { CohorteCard } from '../../components/cohortes/CohorteCard';
import { CohorteForm } from '../../components/cohortes/CohorteForm';
import { Cohorte, CreateCohorteDto, UpdateCohorteDto, CohorteFilters } from '../../types/cohorte';
import { cohortesService } from '../../services/cohortes';

export const CohortesPage: React.FC = () => {
  const [cohortes, setCohortes] = useState<Cohorte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCohorte, setEditingCohorte] = useState<Cohorte | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState<CohorteFilters>({});

  useEffect(() => {
    loadCohortes();
  }, []);

  const loadCohortes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cohortesService.getAll();
      setCohortes(data);
    } catch (err) {
      setError('Erreur lors du chargement des cohortes');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCohorte = async (data: CreateCohorteDto) => {
    try {
      setIsSubmitting(true);
      await cohortesService.create(data);
      setShowForm(false);
      await loadCohortes();
    } catch (err) {
      setError('Erreur lors de la création de la cohorte');
      console.error('Erreur:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCohorte = async (data: UpdateCohorteDto) => {
    if (!editingCohorte) return;
    
    try {
      setIsSubmitting(true);
      await cohortesService.update(editingCohorte._id, data);
      setShowForm(false);
      setEditingCohorte(undefined);
      await loadCohortes();
    } catch (err) {
      setError('Erreur lors de la modification de la cohorte');
      console.error('Erreur:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCohorte = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette cohorte ?')) {
      return;
    }

    try {
      await cohortesService.delete(id);
      await loadCohortes();
    } catch (err) {
      setError('Erreur lors de la suppression de la cohorte');
      console.error('Erreur:', err);
    }
  };

  const handleEditCohorte = (cohorte: Cohorte) => {
    setEditingCohorte(cohorte);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCohorte(undefined);
  };

  const filteredCohortes = cohortes.filter(cohorte => {
    if (filters.annee && cohorte.annee !== filters.annee) return false;
    if (filters.cursus && cohorte.cursus !== filters.cursus) return false;
    if (filters.actif !== undefined && cohorte.actif !== filters.actif) return false;
    return true;
  });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Chargement des cohortes...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestion des Cohortes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowForm(true)}
        >
          Nouvelle Cohorte
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filtres */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filtres
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Année</InputLabel>
              <Select
                value={filters.annee || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, annee: e.target.value || undefined }))}
                label="Année"
              >
                <MenuItem value="">Toutes les années</MenuItem>
                <MenuItem value="2024-2025">2024-2025</MenuItem>
                <MenuItem value="2023-2024">2023-2024</MenuItem>
                <MenuItem value="2022-2023">2022-2023</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Cursus</InputLabel>
              <Select
                value={filters.cursus || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, cursus: e.target.value || undefined }))}
                label="Cursus"
              >
                <MenuItem value="">Tous les cursus</MenuItem>
                <MenuItem value="Développement Web">Développement Web</MenuItem>
                <MenuItem value="Data Science">Data Science</MenuItem>
                <MenuItem value="Cybersécurité">Cybersécurité</MenuItem>
                <MenuItem value="DevOps">DevOps</MenuItem>
                <MenuItem value="Mobile">Mobile</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={filters.actif === undefined ? '' : filters.actif.toString()}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  actif: e.target.value === '' ? undefined : e.target.value === 'true' 
                }))}
                label="Statut"
              >
                <MenuItem value="">Tous les statuts</MenuItem>
                <MenuItem value="true">Actif</MenuItem>
                <MenuItem value="false">Inactif</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Formulaire */}
      {showForm && (
        <Box sx={{ mb: 3 }}>
          <CohorteForm
            cohorte={editingCohorte}
            onSubmit={editingCohorte ? handleUpdateCohorte : handleCreateCohorte}
            onCancel={handleCancelForm}
            isLoading={isSubmitting}
          />
        </Box>
      )}

      {/* Liste des cohortes */}
      <Grid container spacing={3}>
        {filteredCohortes.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary">
                  Aucune cohorte trouvée
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {Object.keys(filters).some(key => filters[key as keyof CohorteFilters] !== undefined)
                    ? 'Essayez de modifier vos filtres'
                    : 'Commencez par créer votre première cohorte'
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          filteredCohortes.map((cohorte) => (
            <Grid item xs={12} sm={6} lg={4} key={cohorte._id}>
              <CohorteCard
                cohorte={cohorte}
                onEdit={handleEditCohorte}
                onDelete={handleDeleteCohorte}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};
