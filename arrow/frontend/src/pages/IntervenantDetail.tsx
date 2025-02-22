import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Intervenant } from '../types/intervenant';
import { intervenantsService } from '../services/intervenants';
import { 
  Box, 
  Paper, 
  Grid, 
  Typography, 
  Tabs, 
  Tab, 
  Avatar,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton
} from '@mui/material';
import { Edit, Person, Work, School, Description, Assignment } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>}
    </div>
  );
}

const IntervenantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [intervenant, setIntervenant] = useState<Intervenant | null>(null);
  const [error, setError] = useState<string>("");
  const [tabValue, setTabValue] = React.useState(0);

  useEffect(() => {
    const fetchIntervenant = async () => {
      try {
        const data = await intervenantsService.getOne(id!);
        setIntervenant(data);
      } catch (err) {
        setError("Erreur lors du chargement de l'intervenant");
      }
    };
    fetchIntervenant();
  }, [id]);

  if (error) return <div>Erreur: {error}</div>;
  if (!intervenant) return <div>Chargement...</div>;

  // Convertir la date de naissance en objet Date
  const dateNaissance = intervenant.dateNaissance ? new Date(intervenant.dateNaissance) : null;

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      {/* En-tête */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, bgcolor: 'grey.900', color: 'primary.main' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm="auto">
            <Avatar 
              src={intervenant.photo} 
              sx={{ width: { xs: 60, sm: 100 }, height: { xs: 60, sm: 100 }, bgcolor: 'grey.800' }}
            >
              {intervenant.nom[0]}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h5" sx={{ color: 'primary.main', fontSize: { xs: '1.2rem', sm: '2rem' } }}>
              {`${intervenant.prenom} ${intervenant.nom}`}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {intervenant.poste}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Chip 
                label={intervenant.statut} 
                color="primary" 
                size="small" 
                sx={{ mr: 1 }} 
              />
              <Chip 
                label={intervenant.typeContrat} 
                variant="outlined" 
                size="small" 
              />
            </Box>
          </Grid>
          <Grid item>
            <IconButton sx={{ color: 'primary.main' }}>
              <Edit />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>

      {/* Navigation par onglets */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(_e, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ minHeight: { xs: 48, sm: 64 } }}
        >
          <Tab icon={<Person />} label="Infos" sx={{ minWidth: 72 }} />
          <Tab icon={<Work />} label="Pro" sx={{ minWidth: 72 }} />
          <Tab icon={<School />} label="Pédagogie" sx={{ minWidth: 72 }} />
          <Tab icon={<Description />} label="Docs" sx={{ minWidth: 72 }} />
          <Tab icon={<Assignment />} label="Évaluations" sx={{ minWidth: 72 }} />
        </Tabs>
      </Paper>

      {/* Contenu des onglets */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Contact</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography><strong>Email:</strong> {intervenant.email}</Typography>
                <Typography><strong>Téléphone:</strong> {intervenant.telephone}</Typography>
                <Typography><strong>Adresse:</strong> {intervenant.adresse}</Typography>
                <Typography>
                  <strong>Date de naissance:</strong> {
                    dateNaissance ? dateNaissance.toLocaleDateString() : 'N/A'
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Autres cartes d'informations similaires */}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Expertise</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  {intervenant.domainesExpertise?.map((domaine, index) => (
                    <Chip 
                      key={index} 
                      label={domaine} 
                      sx={{ m: 0.5 }} 
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Autres cartes professionnelles */}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Pédagogie</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography><strong>Modules Enseignés:</strong> {intervenant.modulesEnseignes?.join(', ')}</Typography>
                <Typography><strong>Niveau des Étudiants:</strong> {intervenant.niveauEtudiants}</Typography>
                <Typography><strong>Supports Pédagogiques:</strong> {intervenant.supportsPedagogiques}</Typography>
                <Typography><strong>Méthodes Pédagogiques:</strong> {intervenant.methodesPedagogiques}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Documents</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography><strong>Pièce d'Identité:</strong> {intervenant.pieceIdentite}</Typography>
                <Typography><strong>Numéro SIRET:</strong> {intervenant.numeroSiret}</Typography>
                <Typography><strong>Assurance RC:</strong> {intervenant.assuranceRC}</Typography>
                <Typography><strong>Extrait Kbis:</strong> {intervenant.extraitKbis}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        </TabPanel>
      </Box>
  );
}

export default IntervenantDetail;