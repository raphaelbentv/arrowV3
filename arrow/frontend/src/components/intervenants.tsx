/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Intervenant } from "../types/intervenant";
import { intervenantsService } from "../services/intervenants";
import { Box, Typography, Paper, Grid } from "@mui/material";
import IntervenantCard from './intervenantCard';

const Intervenants = () => {
  const [intervenants, setIntervenants] = useState<Intervenant[]>([]);
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

  if (error) return <div>Erreur: {error}</div>;

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Liste des Intervenants
      </Typography>
      <Paper sx={{ padding: 2 }}>
        <Grid container spacing={3}>
          {intervenants.map((intervenant) => (
            <Grid item xs={12} sm={6} md={4} key={intervenant._id}>
              <IntervenantCard
                id={intervenant._id}
                nom={intervenant.nom}
                prenom={intervenant.prenom}
                poste={intervenant.poste}
                statut={String(intervenant.statut || '')}
                email={String(intervenant.email || '')}
                telephone={String(intervenant.telephone || '')}
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