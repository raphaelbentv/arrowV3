import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: ''
  });

  // Charger les utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/users');
        setUsers(response.data);
      } catch (err: any) {
        console.error('Erreur lors du chargement des utilisateurs:', err);
        setError('Impossible de charger les utilisateurs');
        
        // Si l'erreur est due à un problème d'authentification, rediriger vers la page de connexion
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  // Ouvrir le dialogue de suppression
  const handleOpenDeleteDialog = (user: any) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  // Fermer le dialogue de suppression
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  // Supprimer un utilisateur
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await api.delete(`/admin/users/${selectedUser._id}`);
      setUsers(users.filter(user => user._id !== selectedUser._id));
      handleCloseDeleteDialog();
    } catch (err: any) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', err);
      setError('Impossible de supprimer l\'utilisateur');
    }
  };

  // Ouvrir le dialogue d'édition
  const handleOpenEditDialog = (user: any) => {
    setSelectedUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    });
    setEditDialogOpen(true);
  };

  // Fermer le dialogue d'édition
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  // Mettre à jour le formulaire d'édition
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | { target: { name?: string; value: unknown } }) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name as string]: value
    });
  };

  // Mettre à jour un utilisateur
  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await api.put(`/admin/users/${selectedUser._id}`, editForm);
      setUsers(users.map(user => user._id === selectedUser._id ? response.data : user));
      handleCloseEditDialog();
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
      setError('Impossible de mettre à jour l\'utilisateur');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Gestion des utilisateurs
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/admin/users/new')}
          >
            Ajouter un utilisateur
          </Button>
        </Box>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rôle</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenEditDialog(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleOpenDeleteDialog(user)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Dialogue de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer l'utilisateur {selectedUser?.firstName} {selectedUser?.lastName} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Annuler</Button>
          <Button onClick={handleDeleteUser} color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue d'édition */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Modifier l'utilisateur</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="Prénom"
              name="firstName"
              value={editForm.firstName}
              onChange={handleEditFormChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Nom"
              name="lastName"
              value={editForm.lastName}
              onChange={handleEditFormChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              value={editForm.email}
              onChange={handleEditFormChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Rôle</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={editForm.role}
                label="Rôle"
                onChange={handleEditFormChange}
              >
                <MenuItem value="admin">Administrateur</MenuItem>
                <MenuItem value="intervenant">Intervenant</MenuItem>
                <MenuItem value="etudiant">Étudiant</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Annuler</Button>
          <Button onClick={handleUpdateUser} color="primary">Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminUsers;
