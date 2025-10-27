import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { intervenantsService } from '../../services/intervenants';
import { Intervenant } from '../../types/intervenant';

// Types pour la recherche globale
interface SearchResult {
  id: string;
  type: 'intervenant' | 'formation' | 'document' | 'session';
  title: string;
  description: string;
  data?: any;
}

const Home = () => {
  const navigate = useNavigate();

  // État pour la recherche
  const [searchQuery, setSearchQuery] = useState('');
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
        intervenant.nom.toLowerCase().includes(queryLower) ||
        intervenant.prenom.toLowerCase().includes(queryLower) ||
        intervenant.email.toLowerCase().includes(queryLower) ||
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

  const handleAddIntervenant = () => {
    navigate('/add-intervenant');
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
              // Extraction de la clé des props
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

        {/* KPIs Qualiopi */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Indicateurs Qualiopi
          <Tooltip title="Indicateurs de performance selon le référentiel Qualiopi">
            <IconButton size="small" sx={{ ml: 1 }}>
              <Info fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>

        <Grid container spacing={3}>
          {/* Satisfaction */}
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Satisfaction"
              value={kpiData.satisfaction.global}
              subtitle={`${kpiData.satisfaction.evolution}% ce mois`}
              icon={<TrendingUp color="primary" />}
              color="#2196f3"
            />
          </Grid>

          {/* Réussite */}
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Taux de Réussite"
              value={kpiData.reussite.certification}
              subtitle={`${kpiData.reussite.presence}% de présence`}
              icon={<School color="secondary" />}
              color="#ff4081"
            />
          </Grid>

          {/* Compétences */}
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Objectifs Atteints"
              value={kpiData.competences.objectifsAtteints}
              subtitle="Progression globale"
              icon={<Assessment color="success" />}
              color="#4caf50"
            />
          </Grid>

          {/* Qualité Intervenants */}
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Qualité Intervenants"
              value={kpiData.qualiteIntervenants.conformite}
              subtitle={`${kpiData.qualiteIntervenants.evaluation}/5 satisfaction`}
              icon={<Person color="info" />}
              color="#ff9800"
            />
          </Grid>
        </Grid>

        {/* Détails supplémentaires des KPIs */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Détails de la Satisfaction
              </Typography>
              {/* Ajoutez ici des graphiques ou des détails supplémentaires */}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Suivi des Compétences
              </Typography>
              {/* Ajoutez ici des graphiques ou des détails supplémentaires */}
            </Paper>
          </Grid>
        </Grid>

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
                <Button 
                  variant="contained" 
                  sx={{ bgcolor: '#333' }}
                  onClick={handleAddIntervenant}
                >
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