import React, { useState, useEffect } from 'react';
import { administratorsService } from '../../services/administrators';
import MainLayout from '../../components/layout/MainLayout';

interface Administrator {
  _id: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  statut: boolean;
}

interface AddAdminDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (admin: Omit<Administrator, '_id'>) => void;
}

const AddAdminDialog: React.FC<AddAdminDialogProps> = ({ open, onClose, onAdd }) => {
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    nom: '',
    prenom: '',
    role: 'admin',
    statut: true as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newAdmin);
    setNewAdmin({
      email: '',
      nom: '',
      prenom: '',
      role: 'admin',
      statut: true
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter un administrateur</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            required
            value={newAdmin.email}
            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Nom"
            fullWidth
            value={newAdmin.nom}
            onChange={(e) => setNewAdmin({ ...newAdmin, nom: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Prénom"
            fullWidth
            value={newAdmin.prenom}
            onChange={(e) => setNewAdmin({ ...newAdmin, prenom: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained" color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const AdministratorList: React.FC = () => {
  console.log('🔄 Rendu du composant AdministratorList');
  
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [filteredAdministrators, setFilteredAdministrators] = useState<Administrator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Administrator | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    console.log('👋 useEffect déclenché - Appel de fetchAdministrators');
    fetchAdministrators();
  }, []);

  const fetchAdministrators = async () => {
    console.log('🎯 Début de fetchAdministrators');
    try {
      setLoading(true);
      console.log('📡 Appel de administratorsService.getAll()');
      const data = await administratorsService.getAll();
      console.log('📥 Données reçues:', data);
      setAdministrators(data);
      setError(null);
    } catch (err: any) {
      console.error('❌ Erreur dans fetchAdministrators:', err);
      setError(err.message || 'Erreur lors du chargement des administrateurs');
    } finally {
      console.log('✅ Fin de fetchAdministrators, loading mis à false');
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);
    
    const filtered = administrators.filter(admin => 
      admin.email.toLowerCase().includes(query) ||
      admin.nom.toLowerCase().includes(query) ||
      admin.prenom.toLowerCase().includes(query)
    );
    
    setFilteredAdministrators(filtered);
  };

  const handleAddAdmin = async (newAdmin: Omit<Administrator, '_id'>) => {
    try {
      const adminToCreate = {
        ...newAdmin,
        statut: newAdmin.statut ? true : false
      };
      await administratorsService.create(adminToCreate);
      setAddDialogOpen(false);
      fetchAdministrators();
      setSnackbar({
        open: true,
        message: 'Administrateur ajouté avec succès',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Erreur lors de l\'ajout de l\'administrateur',
        severity: 'error'
      });
    }
  };

  const handleDeleteClick = (admin: Administrator) => {
    setSelectedAdmin(admin);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedAdmin) {
      try {
        await administratorsService.delete(selectedAdmin._id);
        setDeleteDialogOpen(false);
        fetchAdministrators();
        setSnackbar({
          open: true,
          message: 'Administrateur supprimé avec succès',
          severity: 'success'
        });
      } catch (err) {
        setSnackbar({
          open: true,
          message: 'Erreur lors de la suppression',
          severity: 'error'
        });
      }
    }
  };

  if (loading) {
    console.log('⏳ Affichage du loader');
    return (
      <MainLayout>
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        </Container>
      </MainLayout>
    );
  }

  if (error) {
    console.log('❌ Affichage de l\'erreur:', error);
    return (
      <MainLayout>
        <Container>
          <Alert severity="error">{error}</Alert>
        </Container>
      </MainLayout>
    );
  }

  console.log('🎨 Rendu du tableau avec', filteredAdministrators.length, 'administrateurs');
  
  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Gestion des Administrateurs
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Liste et gestion des administrateurs de la plateforme
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}>
          <TextField
            placeholder="Rechercher un administrateur..."
            variant="outlined"
            value={searchTerm}
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
            onClick={() => setAddDialogOpen(true)}
          >
            Ajouter un administrateur
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Prénom</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAdministrators.map((admin) => {
                console.log('👤 Rendu de l\'administrateur:', admin);
                return (
                  <TableRow key={admin._id}>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.nom}</TableCell>
                    <TableCell>{admin.prenom}</TableCell>
                    <TableCell>{admin.role}</TableCell>
                    <TableCell>{admin.statut ? 'Actif' : 'Inactif'}</TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={() => {
                          console.log('🗑️ Clic sur supprimer pour:', admin._id);
                          handleDeleteClick(admin);
                        }} 
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </MainLayout>
  );
};

export default AdministratorList; 