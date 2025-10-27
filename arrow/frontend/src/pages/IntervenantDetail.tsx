import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Intervenant } from '../types/intervenant';
import { intervenantsService } from '../services/intervenants';
interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {children}
    </Box>
  </Box>
);

const IntervenantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [intervenant, setIntervenant] = useState<Intervenant | null>(null);
  const [error, setError] = useState<string>("");
  const [tabValue, setTabValue] = React.useState(0);
  const theme = useTheme();

  useEffect(() => {
    const fetchIntervenant = async () => {
      try {
        if (id) {
          const data = await intervenantsService.getOne(id);
          setIntervenant(data);
        }
      } catch (error) {
        setError("Erreur lors du chargement de l'intervenant");
      }
    };
    fetchIntervenant();
  }, [id]);

  if (error) return (
    <Box sx={{ p: 3, textAlign: 'center', color: theme.palette.error.main }}>
      <Typography variant="h5">{error}</Typography>
    </Box>
  );
  
  if (!intervenant) return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography>Chargement...</Typography>
    </Box>
  );

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Non spécifié';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <Typography
      variant="h5"
      gutterBottom
      sx={{
        mt: 4,
        color: theme.palette.primary.main,
        fontWeight: 600,
        borderBottom: `2px solid ${theme.palette.primary.main}`,
        paddingBottom: 1
      }}
    >
      {children}
    </Typography>
  );

  const SubTitle = ({ children }: { children: React.ReactNode }) => (
    <Typography
      variant="subtitle1"
      sx={{
        fontWeight: 500,
        color: theme.palette.text.secondary,
        mb: 0.5
      }}
    >
      {children}
    </Typography>
  );

  const InfoText = ({ children }: { children: React.ReactNode }) => (
    <Typography
      sx={{
        fontSize: '1rem',
        color: theme.palette.text.primary,
        mb: 2
      }}
    >
      {children || 'Non spécifié'}
    </Typography>
  );

  const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {children}
    </Box>
  </Box>
);

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3, md: 4 },
      maxWidth: '1200px', 
      margin: '0 auto',
      backgroundColor: theme.palette.background.default,
      overflow: 'hidden'
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 },
          background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* En-tête avec Avatar */}
        <Box sx={{ 
          mb: { xs: 2, sm: 3, md: 4 },
          textAlign: 'center',
          position: 'relative'
        }}>
          <Avatar 
            sx={{ 
              width: { xs: 80, sm: 100, md: 120 },
              height: { xs: 80, sm: 100, md: 120 },
              margin: '0 auto 20px',
              bgcolor: theme.palette.primary.main,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              border: `4px solid ${theme.palette.background.paper}`
            }}
          >
            {intervenant.nom[0]}
          </Avatar>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: 1,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
            }}
          >
            {intervenant.nom} {intervenant.prenom}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 1, 
            mb: 2,
            flexWrap: 'wrap'
          }}>
            <Chip 
              label={intervenant.poste}
              color="primary"
              sx={{ fontWeight: 600 }}
            />
            <Chip 
              label={intervenant.statut}
              color="secondary"
              sx={{ fontWeight: 600 }}
            />
          </Box>
          <Divider sx={{ my: { xs: 2, sm: 3 } }} />
        </Box>

        <Grid container spacing={{ xs: 3, sm: 4, md: 5 }}>
          {/* Groupes d'informations */}
          <Grid item xs={12}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: theme.palette.primary.main,
                mb: 3,
                pb: 1,
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                fontSize: { xs: '1.2rem', sm: '1.5rem' }
              }}
            >
              Informations Personnelles
            </Typography>
            <Grid container spacing={3}>
              {/* Informations de Contact */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ 
                  p: { xs: 2, sm: 3 },
                  bgcolor: 'rgba(255,255,255,0.03)',
                  borderRadius: 2,
                  height: '100%',
                  overflow: 'hidden'
                }}>
                  <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main }}>
                    Informations de Contact
                  </Typography>
                  <InfoSection title="Email">
                    {intervenant.email}
                  </InfoSection>
                  <InfoSection title="Téléphone">
                    {intervenant.telephone}
                  </InfoSection>
                  <InfoSection title="Adresse">
                    {intervenant.adresse}
                  </InfoSection>
                </Paper>
              </Grid>
              {/* Informations Professionnelles */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ 
                  p: { xs: 2, sm: 3 },
                  bgcolor: 'rgba(255,255,255,0.03)',
                  borderRadius: 2,
                  height: '100%',
                  overflow: 'hidden'
                }}>
                  <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main }}>
                    Informations Professionnelles
                  </Typography>
                  <InfoSection title="Expérience">
                    {intervenant.experience}
                  </InfoSection>
                  <InfoSection title="Domaines d'expertise">
                    {intervenant.domainesExpertise?.map((domaine, index) => (
                      <Chip key={index} label={domaine} />
                    ))}
                  </InfoSection>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Données Contractuelles et Mission */}
          <Grid item xs={12}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: theme.palette.primary.main,
                mb: 3,
                pb: 1,
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                fontSize: { xs: '1.2rem', sm: '1.5rem' }
              }}
            >
              Données Contractuelles et Mission
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ 
                  p: { xs: 2, sm: 3 },
                  bgcolor: 'rgba(255,255,255,0.03)',
                  borderRadius: 2,
                  height: '100%',
                  overflow: 'hidden'
                }}>
                  <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main }}>
                    Informations Générales
                  </Typography>
                  <InfoSection title="Date de Naissance">
                    {formatDate(intervenant.dateNaissance)}
                  </InfoSection>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ 
                  p: { xs: 2, sm: 3 },
                  bgcolor: 'rgba(255,255,255,0.03)',
                  borderRadius: 2,
                  height: '100%',
                  overflow: 'hidden'
                }}>
                  <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main }}>
                    Données Contractuelles
                  </Typography>
                  <InfoSection title="Période de Mission">
                    {`Du ${formatDate(intervenant.dateDebutMission)} au ${formatDate(intervenant.dateFinMission)}`}
                  </InfoSection>
                  <InfoSection title="Heures Prévues">
                    {intervenant.heuresPrevues}
                  </InfoSection>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Informations Pédagogiques et Évaluation */}
          <Grid item xs={12}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: theme.palette.primary.main,
                mb: 3,
                pb: 1,
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                fontSize: { xs: '1.2rem', sm: '1.5rem' }
              }}
            >
              Informations Pédagogiques et Évaluation
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ 
                  p: { xs: 2, sm: 3 },
                  bgcolor: 'rgba(255,255,255,0.03)',
                  borderRadius: 2,
                  height: '100%',
                  overflow: 'hidden'
                }}>
                  <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main }}>
                    Informations Pédagogiques
                  </Typography>
                  <InfoSection title="Modules enseignés">
                    {intervenant.modulesEnseignes?.map((module, index) => (
                      <Chip key={index} label={module} />
                    ))}
                  </InfoSection>
                  <InfoSection title="Niveau des Étudiants">
                    {intervenant.niveauEtudiants}
                  </InfoSection>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ 
                  p: { xs: 2, sm: 3 },
                  bgcolor: 'rgba(255,255,255,0.03)',
                  borderRadius: 2,
                  height: '100%',
                  overflow: 'hidden'
                }}>
                  <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main }}>
                    Suivi et Évaluation
                  </Typography>
                  <InfoSection title="Appréciations des Étudiants">
                    {intervenant.appreciationsEtudiants?.map((appreciation, index) => (
                      <Chip key={index} label={appreciation} />
                    ))}
                  </InfoSection>
                  <InfoSection title="Points d'Amélioration">
                    {intervenant.pointsAmelioration}
                  </InfoSection>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Documents Administratifs */}
          <Grid item xs={12}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: theme.palette.primary.main,
                mb: 3,
                pb: 1,
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                fontSize: { xs: '1.2rem', sm: '1.5rem' }
              }}
            >
              Documents Administratifs
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ 
                  p: { xs: 2, sm: 3 },
                  bgcolor: 'rgba(255,255,255,0.03)',
                  borderRadius: 2,
                  height: '100%',
                  overflow: 'hidden'
                }}>
                  <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main }}>
                    Documents Administratifs
                  </Typography>
                  {[
                    { label: 'Pièce d\'Identité', value: intervenant.pieceIdentite },
                    { label: 'Numéro SIRET', value: intervenant.numeroSiret },
                    { label: 'Assurance RC', value: intervenant.assuranceRC },
                    { label: 'Extrait Kbis', value: intervenant.extraitKbis },
                    { label: 'Justificatifs Diplômes', value: intervenant.justificatifsDiplomes },
                  ].map((doc, index) => (
                    <InfoSection key={index} title={doc.label}>
                      {doc.value ? 'Document fourni' : 'Non fourni'}
                    </InfoSection>
                  ))}
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default IntervenantDetail;