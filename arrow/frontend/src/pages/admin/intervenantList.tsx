import React, { useState, useEffect } from 'react';
import { intervenantsService } from '../../services/intervenants';
import { Intervenant } from '../../types/intervenant';
import MainLayout from '../../components/layout/MainLayout';

const IntervenantList: React.FC = () => {
  // États pour gérer les données et l'UI
  const [intervenants, setIntervenants] = useState<Intervenant[]>([]);
  const [filteredIntervenants, setFilteredIntervenants] = useState<Intervenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIntervenant, setSelectedIntervenant] = useState<Intervenant | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });
  const [connectionInfo, setConnectionInfo] = useState<string>('');

  // Charger les intervenants au chargement de la page
  useEffect(() => {
    fetchIntervenants();
  }, []);

  // Fonction pour récupérer les intervenants depuis l'API
  const fetchIntervenants = async () => {
    try {
      setLoading(true);
      setConnectionInfo('Tentative de connexion à la base de données...');
      
      // Vérifier si le token est présent
      const token = localStorage.getItem('token');
      if (!token) {
        setConnectionInfo('Aucun token d\'authentification trouvé. Veuillez vous reconnecter.');
        setError('Authentification requise. Veuillez vous connecter pour accéder aux données.');
        setLoading(false);
        return;
      }
      
      setConnectionInfo('Token trouvé, envoi de la requête à l\'API...');
      const data = await intervenantsService.getAll();
      
      if (data && data.length > 0) {
        setConnectionInfo('Connexion réussie. Données récupérées avec succès.');
        setIntervenants(data);
        setFilteredIntervenants(data);
        setError(null);
      } else {
        setConnectionInfo('Connexion réussie, mais aucun intervenant trouvé dans la base de données.');
        setIntervenants([]);
        setFilteredIntervenants([]);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des intervenants:', err);
      setConnectionInfo('Échec de la connexion à la base de données.');
      setError('Impossible de charger les intervenants. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  // Fonction de recherche
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query) {
      setFilteredIntervenants(intervenants);
      return;
    }
    
    const filtered = intervenants.filter(intervenant => 
      intervenant.nom?.toLowerCase().includes(query) ||
      intervenant.prenom?.toLowerCase().includes(query) ||
      intervenant.email?.toLowerCase().includes(query) ||
      intervenant.telephone?.toLowerCase().includes(query) ||
      intervenant.poste?.toLowerCase().includes(query) ||
      (intervenant.domainesExpertise && 
        intervenant.domainesExpertise.some(domaine => 
          domaine.toLowerCase().includes(query)
        )) ||
      (intervenant.modulesEnseignes && 
        intervenant.modulesEnseignes.some(module => 
          module.toLowerCase().includes(query)
        ))
    );
    
    setFilteredIntervenants(filtered);
  };

  // Ouvrir la boîte de dialogue de confirmation de suppression
  const handleOpenDeleteDialog = (intervenant: Intervenant) => {
    setSelectedIntervenant(intervenant);
    setDeleteDialogOpen(true);
  };

  // Fermer la boîte de dialogue de confirmation de suppression
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedIntervenant(null);
  };

  // Supprimer un intervenant
  const handleDeleteIntervenant = async () => {
    if (!selectedIntervenant) return;
    
    try {
      // Ici, vous devrez implémenter la méthode de suppression dans votre service
      // await intervenantsService.delete(selectedIntervenant._id);
      
      // Pour l'instant, simulons la suppression côté client
      const updatedIntervenants = intervenants.filter(
        intervenant => intervenant._id !== selectedIntervenant._id
      );
      setIntervenants(updatedIntervenants);
      setFilteredIntervenants(
        filteredIntervenants.filter(
          intervenant => intervenant._id !== selectedIntervenant._id
        )
      );
      
      setSnackbar({
        open: true,
        message: `${selectedIntervenant.prenom} ${selectedIntervenant.nom} a été supprimé avec succès.`,
        severity: 'success'
      });
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'intervenant:', err);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression de l\'intervenant.',
        severity: 'error'
      });
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // Fermer le snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Afficher un message spécifique si aucun intervenant n'est trouvé
  if (!loading && intervenants.length === 0 && !error) {
    return (
      <MainLayout>
        <Container>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Gestion des Intervenants
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Liste et gestion des intervenants de la plateforme
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => {
              setSnackbar({
                open: true,
                message: 'Fonctionnalité d\'ajout à implémenter',
                severity: 'info'
              });
            }}
            sx={{ mb: 3 }}
          >
            Ajouter un intervenant
          </Button>
          
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aucun intervenant trouvé dans la base de données
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Utilisez le bouton "Ajouter un intervenant" ci-dessus pour commencer à créer des profils d'intervenants.
            </Typography>
          </Paper>
        </Container>
      </MainLayout>
    );
  }

  // Afficher un indicateur de chargement pendant le chargement des données
  if (loading) {
    return (
      <MainLayout>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            {connectionInfo}
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  // Afficher un message d'erreur si le chargement a échoué
  if (error) {
    return (
      <MainLayout>
        <Container>
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
            {connectionInfo}
          </Typography>
          <Box mt={2} display="flex" justifyContent="center">
            <Button variant="contained" onClick={fetchIntervenants}>
              Réessayer
            </Button>
          </Box>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* En-tête de la page */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Gestion des Intervenants
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Liste et gestion des intervenants de la plateforme
          </Typography>
        </Box>

        {/* Barre d'outils avec recherche et bouton d'ajout */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}>
          <TextField
            placeholder="Rechercher un intervenant..."
            variant="outlined"
            value={searchQuery}
            onChange={handleSearch}
            sx={{ flexGrow: 1, maxWidth: { xs: '100%', sm: '60%' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => {
              // Navigation vers la page d'ajout d'intervenant
              // navigate('/admin/intervenants/ajouter');
              setSnackbar({
                open: true,
                message: 'Fonctionnalité d\'ajout à implémenter',
                severity: 'info'
              });
            }}
          >
            Ajouter un intervenant
          </Button>
        </Box>

        {/* Tableau des intervenants */}
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table sx={{ minWidth: 650 }} aria-label="tableau des intervenants">
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Nom</TableCell>
                <TableCell sx={{ color: 'white' }}>Email</TableCell>
                <TableCell sx={{ color: 'white' }}>Téléphone</TableCell>
                <TableCell sx={{ color: 'white' }}>Poste</TableCell>
                <TableCell sx={{ color: 'white' }}>Statut</TableCell>
                <TableCell sx={{ color: 'white' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredIntervenants.length > 0 ? (
                filteredIntervenants.map((intervenant) => (
                  <TableRow key={intervenant._id} hover>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {intervenant.prenom} {intervenant.nom}
                      </Box>
                    </TableCell>
                    <TableCell>{intervenant.email}</TableCell>
                    <TableCell>{intervenant.telephone}</TableCell>
                    <TableCell>{intervenant.poste}</TableCell>
                    <TableCell>{intervenant.statut}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        aria-label="voir"
                        onClick={() => {
                          // navigate(`/admin/intervenants/${intervenant._id}`);
                          setSnackbar({
                            open: true,
                            message: 'Fonctionnalité de visualisation à implémenter',
                            severity: 'info'
                          });
                        }}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton 
                        aria-label="modifier"
                        onClick={() => {
                          // navigate(`/admin/intervenants/${intervenant._id}/edit`);
                          setSnackbar({
                            open: true,
                            message: 'Fonctionnalité de modification à implémenter',
                            severity: 'info'
                          });
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        aria-label="supprimer" 
                        color="error"
                        onClick={() => handleOpenDeleteDialog(intervenant)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {searchQuery ? 'Aucun intervenant ne correspond à votre recherche.' : 'Aucun intervenant disponible.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Boîte de dialogue de confirmation de suppression */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Confirmer la suppression
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Êtes-vous sûr de vouloir supprimer l'intervenant {selectedIntervenant?.prenom} {selectedIntervenant?.nom} ?
              Cette action est irréversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Annuler</Button>
            <Button onClick={handleDeleteIntervenant} color="error" autoFocus>
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar pour les notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </MainLayout>
  );
};

export default IntervenantList;