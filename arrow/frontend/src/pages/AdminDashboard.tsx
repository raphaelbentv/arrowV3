import React, { useState, useEffect } from 'react';
import { 
  Container,
  Typography,
  Grid,
  Box,
  TextField,
  InputAdornment,
  Autocomplete,
  LinearProgress,
  Card,
  CardContent,
  Stack,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  TrendingUp,
  School,
  Person,
  Assessment,
  ArrowForward,
  Bolt,
  Group,
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


  const KPICard = ({ title, value, subtitle, icon, color, glow }: {
    title: string;
    value: number;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    glow?: string;
  }) => (
    <Card sx={{ 
      height: '100%', 
      bgcolor: 'transparent',
      border: '1px solid',
      borderColor: 'rgba(255, 0, 110, 0.3)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: color,
        transform: 'translateY(-4px)',
        boxShadow: `0 10px 30px ${glow || color}40`,
      }
    }}>
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      }} />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 300 }}>
            {title}
          </Typography>
          <Box sx={{ 
            color: color,
            filter: `drop-shadow(0 0 8px ${glow || color})`
          }}>
            {icon}
          </Box>
        </Box>
        <Typography 
          variant="h3" 
          sx={{ 
            color: color,
            fontWeight: 900,
            letterSpacing: '-0.05em',
            mb: 1,
            textShadow: `0 0 20px ${glow || color}60`,
          }}
        >
          {value}%
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, opacity: 0.8 }}>
          {subtitle}
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={value} 
          sx={{ 
            mt: 2,
            height: 4,
            borderRadius: 2,
            bgcolor: 'rgba(255, 0, 110, 0.1)',
            '& .MuiLinearProgress-bar': {
              bgcolor: color,
              boxShadow: `0 0 10px ${color}`,
              borderRadius: 2,
            }
          }} 
        />
      </CardContent>
    </Card>
  );

  const dashboardContent = (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* En-tête du Dashboard avec bouton de déconnexion */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h3" 
          gutterBottom
          sx={{
            fontWeight: 900,
            letterSpacing: '-0.05em',
            background: 'linear-gradient(90deg, #FF006E 0%, #C77DFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px rgba(255, 0, 110, 0.3)',
          }}
        >
          Dashboard Admin
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 300, opacity: 0.7 }}>
          Vue d'ensemble en temps réel
        </Typography>
      </Box>

      {/* Barre de Recherche Globale */}
      <Box
        sx={{ 
          mb: 6,
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
      </Box>

      {/* KPIs */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <KPICard
            title="Satisfaction"
            value={kpiData.satisfaction.global}
            subtitle={kpiData.satisfaction.details}
            icon={<TrendingUp sx={{ fontSize: 32 }} />}
            color="#00FF88"
            glow="#00FF88"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <KPICard
            title="Taux de Réussite"
            value={kpiData.reussite.certification}
            subtitle={`${kpiData.reussite.presence}% de présence`}
            icon={<School sx={{ fontSize: 32 }} />}
            color="#FF006E"
            glow="#FF006E"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <KPICard
            title="Compétences"
            value={kpiData.competences.objectifsAtteints}
            subtitle={`${kpiData.competences.progression}% de progression`}
            icon={<Assessment sx={{ fontSize: 32 }} />}
            color="#C77DFF"
            glow="#C77DFF"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <KPICard
            title="Qualité Intervenants"
            value={kpiData.qualiteIntervenants.conformite}
            subtitle={`${kpiData.qualiteIntervenants.miseAJour}% à jour`}
            icon={<Person sx={{ fontSize: 32 }} />}
            color="#FF3399"
            glow="#FF3399"
          />
        </Grid>
      </Grid>

      {/* Actions rapides */}
      <Divider sx={{ my: 6, borderColor: 'rgba(255, 0, 110, 0.2)' }} />
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 4 }}>
          Actions rapides
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%', 
              cursor: 'pointer',
              bgcolor: 'transparent',
              border: '1px solid rgba(255, 0, 110, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                borderColor: '#FF006E',
                transform: 'translateY(-8px)',
                boxShadow: '0 10px 40px rgba(255, 0, 110, 0.3)',
              }
            }}
            onClick={() => navigate('/admin/cohortes')}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 0, 110, 0.1)',
                  border: '1px solid rgba(255, 0, 110, 0.3)'
                }}>
                  <School sx={{ fontSize: 32, color: '#FF006E' }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Cohortes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Gérer les groupes
                  </Typography>
                </Box>
                <ArrowForward sx={{ color: '#FF006E' }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%', 
              cursor: 'pointer',
              bgcolor: 'transparent',
              border: '1px solid rgba(255, 0, 110, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                borderColor: '#C77DFF',
                transform: 'translateY(-8px)',
                boxShadow: '0 10px 40px rgba(199, 125, 255, 0.3)',
              }
            }}
            onClick={() => navigate('/admin/users')}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: 'rgba(199, 125, 255, 0.1)',
                  border: '1px solid rgba(199, 125, 255, 0.3)'
                }}>
                  <Group sx={{ fontSize: 32, color: '#C77DFF' }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Utilisateurs
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Administrer les comptes
                  </Typography>
                </Box>
                <ArrowForward sx={{ color: '#C77DFF' }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%', 
              cursor: 'pointer',
              bgcolor: 'transparent',
              border: '1px solid rgba(255, 0, 110, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                borderColor: '#00FF88',
                transform: 'translateY(-8px)',
                boxShadow: '0 10px 40px rgba(0, 255, 136, 0.3)',
              }
            }}
            onClick={() => navigate('/admin/intervenant-list')}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: 'rgba(0, 255, 136, 0.1)',
                  border: '1px solid rgba(0, 255, 136, 0.3)'
                }}>
                  <Bolt sx={{ fontSize: 32, color: '#00FF88' }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Intervenants
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Gérer les profs
                  </Typography>
                </Box>
                <ArrowForward sx={{ color: '#00FF88' }} />
              </Stack>
            </CardContent>
          </Card>
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