import React, { useState, useEffect } from 'react';
import { 
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  TextField,
  InputAdornment,
  Autocomplete,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  TrendingUp,
  School,
  Person,
  Assessment,
} from '@mui/icons-material';
import { intervenantsService } from '../services/intervenants';
import { Intervenant } from '../types/intervenant';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/authContext';

// Types pour la recherche globale
interface SearchResult {
  id: string;
  type: 'intervenant' | 'formation' | 'document' | 'session';
  title: string;
  description: string;
  data?: any;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  useAuth();

  // État pour la recherche
  const [, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [intervenants, setIntervenants] = useState<Intervenant[]>([]);
  const [loading, setLoading] = useState(false);

  // Données KPI (à connecter avec l'API)
  const kpiData = {
    satisfaction: {
      global: 92,
      evolution: +2.5,
      details: 'Basé sur 150 retours'
    },
    reussite: {
      certification: 88,
      abandon: 5,
      presence: 95
    },
    competences: {
      objectifsAtteints: 85,
      progression: 90,
      validation: 87
    },
    qualiteIntervenants: {
      evaluation: 4.5,
      conformite: 98,
      miseAJour: 95
    }
  };

  // Chargement des intervenants
  useEffect(() => {
    const fetchIntervenants = async () => {
      try {
        setLoading(true);
        const data = await intervenantsService.getAll();
        setIntervenants(data);
      } catch (error) {
        console.error('Erreur lors du chargement des intervenants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIntervenants();
  }, []);

  // Fonction de recherche
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchResults([]);
      return;
    }

    const queryLower = query.toLowerCase();
    
    // Recherche dans les intervenants
    const intervenantResults = intervenants
      .filter(intervenant => 
        intervenant.nom?.toLowerCase().includes(queryLower) ||
        intervenant.prenom?.toLowerCase().includes(queryLower) ||
        intervenant.email?.toLowerCase().includes(queryLower) ||
        (intervenant.modulesEnseignes && 
         intervenant.modulesEnseignes.some(module => 
           module.toLowerCase().includes(queryLower)
         )) ||
        (intervenant.domainesExpertise && 
         intervenant.domainesExpertise.some(domaine => 
           domaine.toLowerCase().includes(queryLower)
         ))
      )
      .map(intervenant => ({
        id: intervenant._id,
        type: 'intervenant' as const,
        title: `${intervenant.prenom} ${intervenant.nom}`,
        description: intervenant.poste || 'Intervenant',
        data: intervenant
      }));

    setSearchResults(intervenantResults);
  };


  const KPICard = ({ title, value, subtitle, icon, color }: {
    title: string;
    value: number;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
  }) => (
    <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
          {icon}
        </Box>
        <Typography variant="h4" sx={{ color: color, mb: 1 }}>
          {value}%
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={value} 
          sx={{ 
            mt: 2,
            height: 8,
            borderRadius: 5,
            bgcolor: `${color}22`,
            '& .MuiLinearProgress-bar': {
              bgcolor: color,
            }
          }} 
        />
      </CardContent>
    </Card>
  );

  const dashboardContent = (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* En-tête du Dashboard avec bouton de déconnexion */}
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Tableau de Bord Administrateur
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Vue d'ensemble des indicateurs et des activités
          </Typography>
        </Box>
      </Box>

      {/* Barre de Recherche Globale */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          mb: 4,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Autocomplete
          fullWidth
          freeSolo
          loading={loading}
          options={searchResults}
          getOptionLabel={(option) => 
            typeof option === 'string' ? option : option.title
          }
          renderOption={(props, option) => {
            const { key, ...otherProps } = props;
            return (
              <li key={key} {...otherProps}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body1">
                    {option.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.type === 'intervenant' ? '👤 Intervenant' : ''} - {option.description}
                  </Typography>
                </Box>
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Rechercher un intervenant, une formation, un document..."
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          )}
          onChange={(_, value) => {
            if (typeof value === 'string') {
              handleSearch(value);
            } else if (value) {
              if (value.type === 'intervenant') {
                navigate(`/intervenants/${value.id}`);
              }
            }
          }}
          onInputChange={(_, newInputValue) => {
            handleSearch(newInputValue);
          }}
        />
      </Paper>

      {/* KPIs */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <KPICard
            title="Satisfaction"
            value={kpiData.satisfaction.global}
            subtitle={kpiData.satisfaction.details}
            icon={<TrendingUp sx={{ color: '#4CAF50' }} />}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <KPICard
            title="Taux de Réussite"
            value={kpiData.reussite.certification}
            subtitle={`${kpiData.reussite.presence}% de présence`}
            icon={<School sx={{ color: '#2196F3' }} />}
            color="#2196F3"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <KPICard
            title="Compétences"
            value={kpiData.competences.objectifsAtteints}
            subtitle={`${kpiData.competences.progression}% de progression`}
            icon={<Assessment sx={{ color: '#9C27B0' }} />}
            color="#9C27B0"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <KPICard
            title="Qualité Intervenants"
            value={kpiData.qualiteIntervenants.conformite}
            subtitle={`${kpiData.qualiteIntervenants.miseAJour}% à jour`}
            icon={<Person sx={{ color: '#FF9800' }} />}
            color="#FF9800"
          />
        </Grid>
      </Grid>
    </Container>
  );

  return (
    <MainLayout>
      {dashboardContent}
    </MainLayout>
  );
};

export default AdminDashboard; 