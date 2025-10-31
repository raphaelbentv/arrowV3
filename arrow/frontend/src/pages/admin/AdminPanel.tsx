import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Search, UserPlus, Loader2 } from 'lucide-react';
import { administratorsService, Administrator as AdminApi } from '../../services/administrators';

type Admin = AdminApi;

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    nom: '',
    prenom: '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const data = await administratorsService.getAll();
        setAdmins(data);
      } catch (err: any) {
        console.error('Erreur lors du chargement des administrateurs:', err);
        setError('Impossible de charger les administrateurs');
        
        if (err?.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [navigate]);

  const filteredAdmins = admins.filter(admin => 
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDeleteDialog = (admin: Admin) => {
    setSelectedAdmin(admin);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedAdmin(null);
  };

  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) return;

    try {
      await administratorsService.delete(selectedAdmin._id);
      setAdmins(admins.filter(admin => admin._id !== selectedAdmin._id));
      handleCloseDeleteDialog();
    } catch (err: any) {
      console.error('Erreur lors de la suppression:', err);
      setError('Impossible de supprimer l\'administrateur');
    }
  };

  const handleOpenEditDialog = (admin?: Admin) => {
    if (admin) {
      setSelectedAdmin(admin);
      setFormData({
        email: admin.email,
        nom: admin.nom,
        prenom: admin.prenom,
        password: ''
      });
    } else {
      setSelectedAdmin(null);
      setFormData({
        email: '',
        nom: '',
        prenom: '',
        password: ''
      });
    }
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedAdmin(null);
    setFormData({
      email: '',
      nom: '',
      prenom: '',
      password: ''
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAdmin = async () => {
    try {
      setSubmitting(true);
      setError('');

      if (selectedAdmin) {
        const updated = await administratorsService.update(selectedAdmin._id, formData);
        setAdmins(admins.map(admin => 
          admin._id === selectedAdmin._id ? updated : admin
        ));
      } else {
        const created = await administratorsService.create(formData);
        setAdmins([...admins, created]);
      }

      handleCloseEditDialog();
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <Loader2 className="w-12 h-12 animate-spin" style={{ color: '#3d9bff' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0a0a0a' }}>
        <div 
          className="fixed inset-0 opacity-30 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, #000000 0%, #0a1a2f 20%, #1a3a5a 40%, rgba(61, 155, 255, 0.2) 80%, rgba(135, 206, 235, 0.3) 100%)',
            zIndex: 0,
          }}
        />

        <div 
          className="fixed bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '50vh',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(61, 155, 255, 0.2) 40px, rgba(61, 155, 255, 0.2) 41px)',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'bottom',
            zIndex: 0,
          }}
        />

        <div className="relative px-4 py-12" style={{ zIndex: 10, maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 
              style={{
                fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: 'linear-gradient(180deg, #3d9bff, #87ceeb, #5dbaff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 25px rgba(61, 155, 255, 0.5))',
                marginBottom: '1rem',
              }}
            >
              GESTION ADMINISTRATEURS
            </h1>
            <p 
              style={{
                fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#87ceeb',
                textShadow: '0 0 10px rgba(135, 206, 235, 0.5)',
              }}
            >
              Ajouter, modifier et supprimer les administrateurs
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
              <Search 
                className="absolute left-4 top-1/2 transform -translate-y-1/2" 
                style={{ color: 'rgba(135, 206, 235, 0.6)', width: '20px', height: '20px' }} 
              />
              <input
                type="text"
                placeholder="Rechercher un administrateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '2px solid rgba(61, 155, 255, 0.4)',
                  borderRadius: '12px',
                  color: '#87ceeb',
                  fontSize: '1rem',
                }}
              />
            </div>

            <button
              onClick={() => handleOpenEditDialog()}
              style={{
                padding: '1rem 2rem',
                background: '#3d9bff',
                border: 'none',
                borderRadius: '12px',
                color: '#000',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <UserPlus size={20} />
              Ajouter un admin
            </button>
          </div>

          {error && (
            <div style={{
              padding: '1rem',
              background: 'rgba(220, 38, 38, 0.2)',
              border: '2px solid rgba(220, 38, 38, 0.5)',
              borderRadius: '12px',
              color: '#ff6b6b',
              marginBottom: '2rem',
            }}>
              {error}
            </div>
          )}

          <div style={{
            background: 'rgba(0, 0, 0, 0.6)',
            border: '2px solid rgba(61, 155, 255, 0.3)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(61, 155, 255, 0.3)' }}>
                  <th style={{ padding: '1.5rem', textAlign: 'left', color: '#3d9bff' }}>Nom</th>
                  <th style={{ padding: '1.5rem', textAlign: 'left', color: '#3d9bff' }}>Email</th>
                  <th style={{ padding: '1.5rem', textAlign: 'center', color: '#3d9bff' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((admin) => (
                  <tr key={admin._id} style={{ borderBottom: '1px solid rgba(61, 155, 255, 0.1)' }}>
                    <td style={{ padding: '1.5rem', color: '#87ceeb' }}>
                      {admin.prenom} {admin.nom}
                    </td>
                    <td style={{ padding: '1.5rem', color: '#87ceeb' }}>{admin.email}</td>
                    <td style={{ padding: '1.5rem', textAlign: 'center' }}>
                      <button onClick={() => handleOpenEditDialog(admin)}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleOpenDeleteDialog(admin)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      
      {deleteDialogOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.8)' }}>
          <div>
            <h3>Confirmer la suppression</h3>
            <p>Supprimer {selectedAdmin?.prenom} {selectedAdmin?.nom} ?</p>
            <button onClick={handleCloseDeleteDialog}>Annuler</button>
            <button onClick={handleDeleteAdmin}>Supprimer</button>
          </div>
        </div>
      )}

      {editDialogOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.8)' }}>
          <div>
            <h3>{selectedAdmin ? 'Modifier' : 'Ajouter'} un administrateur</h3>
            <input name="prenom" value={formData.prenom} onChange={handleFormChange} placeholder="Prénom" />
            <input name="nom" value={formData.nom} onChange={handleFormChange} placeholder="Nom" />
            <input name="email" value={formData.email} onChange={handleFormChange} placeholder="Email" />
            <input name="password" type="password" value={formData.password} onChange={handleFormChange} placeholder="Mot de passe" />
            <button onClick={handleCloseEditDialog}>Annuler</button>
            <button onClick={handleSaveAdmin} disabled={submitting}>
              {submitting && <Loader2 className="animate-spin" />}
              {selectedAdmin ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

