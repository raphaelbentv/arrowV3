/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Intervenant } from "../types/intervenant";
import { intervenantsService } from "../services/intervenants";
import { Box, Typography, Paper, Grid, TextField } from "@mui/material";
import IntervenantCard from './intervenantCard';

const Intervenants = () => {
  const [intervenants, setIntervenants] = useState<Intervenant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await intervenantsService.getAll();
        setIntervenants(data);
      } catch (err) {
        setError("Erreur lors du chargement des intervenants");
      }
    };
    fetchData();
  }, []);

  const filteredIntervenants = intervenants.filter(intervenant => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase().trim();
    return (
      intervenant.nom?.toLowerCase().includes(searchLower) ||
      intervenant.prenom?.toLowerCase().includes(searchLower) ||
      (intervenant.domainesExpertise || []).some(domaine => 
        domaine.toLowerCase().includes(searchLower)
      )
    );
  });

  if (error) return <div>Erreur: {error}</div>;

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Liste des Intervenants
      </Typography>
      <TextField
        fullWidth
        label="Rechercher un intervenant"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Paper sx={{ padding: 2 }}>
        <Grid container spacing={3}>
          {filteredIntervenants.map((intervenant) => (
            <Grid item xs={12} sm={6} md={4} key={intervenant._id}>
              <IntervenantCard
                intervenant={intervenant}
                email={intervenant.email || ''}
                telephone={intervenant.telephone || ''}
                domainesExpertise={intervenant.domainesExpertise || []}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Intervenants;