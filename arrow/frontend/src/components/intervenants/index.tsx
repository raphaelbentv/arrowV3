import { useEffect, useState } from 'react';
import { Box, Grid, Container, Paper } from '@mui/material';
import { Intervenant } from '../../types/intervenant';
import { intervenantsService } from '../../services/intervenants';
import SearchBar from '../common/SearchBar';
import IntervenantCard from '../intervenantCard';

const Intervenants = () => {
  const [intervenants, setIntervenants] = useState<Intervenant[]>([]);
  const [filteredIntervenants, setFilteredIntervenants] = useState<Intervenant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIntervenants = async () => {
      try {
        setLoading(true);
        const data = await intervenantsService.getAll();
        setIntervenants(data);
        setFilteredIntervenants(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des intervenants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIntervenants();
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredIntervenants(intervenants);
      return;
    }

    const queryLower = query.toLowerCase();
    const filtered = intervenants.filter(intervenant =>
      intervenant.nom?.toLowerCase().includes(queryLower) ||
      intervenant.prenom?.toLowerCase().includes(queryLower)
    );
    setFilteredIntervenants(filtered);
  };

  return (
    <Container>
      <Box sx={{ mb: 4, mt: 2 }}>
        <SearchBar
          data={intervenants}
          onSearch={handleSearch}
          loading={loading}
          placeholder="Rechercher un intervenant..."
        />
      </Box>

      <Paper 
        sx={{ 
          width: '100%',
          minWidth: '100%',
          flexGrow: 1,
          p: 2,
          boxSizing: 'border-box'
        }}
      >
        <Grid 
          container 
          spacing={3}
          sx={{
            width: '100%',
            margin: 0,
            '& .MuiGrid-item': {
              width: {
                xs: '100%',
                sm: '50%',
                md: '33.333%'
              },
              minWidth: {
                xs: '100%',
                sm: '300px',
                md: '300px'
              }
            }
          }}
        >
          {filteredIntervenants.map((intervenant) => (
            <Grid item key={intervenant._id}>
              <IntervenantCard intervenant={intervenant} />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Intervenants; 