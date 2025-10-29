import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Search, UserPlus, Loader2, Eye, EyeOff } from 'lucide-react';
import { Navbar } from '@/components/ui/Navbar';
import { administratorsService, Administrator } from '../../services/administrators';

// Utilisation de l'interface Administrator du service
type Admin = Administrator;

const AdministratorList: React.FC = () => {
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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Authentification désactivée pour le développement
    console.log('Mode développement : authentification désactivée');

    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const data = await administratorsService.getAll();
        setAdmins(data);
      } catch (err: any) {
        console.error('Erreur lors du chargement des administrateurs:', err);
        setError('Impossible de charger les administrateurs');
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
    setShowPassword(false);
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
        // Modification d'un admin existant
        const updatedAdmin = await administratorsService.update(selectedAdmin._id, formData);
        setAdmins(admins.map(admin => 
          admin._id === selectedAdmin._id ? updatedAdmin : admin
        ));
      } else {
        // Création d'un nouvel admin
        const newAdmin = await administratorsService.create(formData);
        setAdmins([...admins, newAdmin]);
      }

      handleCloseEditDialog();
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar role="admin" activeLink="/admin/administrators" />
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{ background: '#0a0a0a' }}>
          <Loader2 className="w-12 h-12 animate-spin" style={{ color: '#3d9bff' }} />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar role="admin" activeLink="/admin/administrators" />
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
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleOpenEditDialog(admin)}
                          style={{
                            padding: '0.5rem',
                            background: 'rgba(61, 155, 255, 0.2)',
                            border: '1px solid rgba(61, 155, 255, 0.4)',
                            borderRadius: '8px',
                            color: '#3d9bff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleOpenDeleteDialog(admin)}
                          style={{
                            padding: '0.5rem',
                            background: 'rgba(220, 38, 38, 0.2)',
                            border: '1px solid rgba(220, 38, 38, 0.4)',
                            borderRadius: '8px',
                            color: '#ff6b6b',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de suppression */}
      {deleteDialogOpen && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.9)',
            border: '2px solid rgba(220, 38, 38, 0.5)',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
          }}>
            <h3 style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '1.2rem' }}>
              Confirmer la suppression
            </h3>
            <p style={{ color: '#87ceeb', marginBottom: '2rem' }}>
              Êtes-vous sûr de vouloir supprimer l'administrateur <strong>{selectedAdmin?.prenom} {selectedAdmin?.nom}</strong> ?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={handleCloseDeleteDialog}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(61, 155, 255, 0.2)',
                  border: '1px solid rgba(61, 155, 255, 0.4)',
                  borderRadius: '8px',
                  color: '#3d9bff',
                  cursor: 'pointer',
                }}
              >
                Annuler
              </button>
              <button 
                onClick={handleDeleteAdmin}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(220, 38, 38, 0.2)',
                  border: '1px solid rgba(220, 38, 38, 0.4)',
                  borderRadius: '8px',
                  color: '#ff6b6b',
                  cursor: 'pointer',
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout/modification */}
      {editDialogOpen && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.9)',
            border: '2px solid rgba(61, 155, 255, 0.5)',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
          }}>
            <h3 style={{ color: '#3d9bff', marginBottom: '1.5rem', fontSize: '1.2rem' }}>
              {selectedAdmin ? 'Modifier' : 'Ajouter'} un administrateur
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ color: '#87ceeb', display: 'block', marginBottom: '0.5rem' }}>
                  Prénom
                </label>
                <input
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleFormChange}
                  placeholder="Prénom"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: '2px solid rgba(61, 155, 255, 0.4)',
                    borderRadius: '8px',
                    color: '#87ceeb',
                  }}
                />
              </div>
              
              <div>
                <label style={{ color: '#87ceeb', display: 'block', marginBottom: '0.5rem' }}>
                  Nom
                </label>
                <input
                  name="nom"
                  value={formData.nom}
                  onChange={handleFormChange}
                  placeholder="Nom"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: '2px solid rgba(61, 155, 255, 0.4)',
                    borderRadius: '8px',
                    color: '#87ceeb',
                  }}
                />
              </div>
              
              <div>
                <label style={{ color: '#87ceeb', display: 'block', marginBottom: '0.5rem' }}>
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Email"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: '2px solid rgba(61, 155, 255, 0.4)',
                    borderRadius: '8px',
                    color: '#87ceeb',
                  }}
                />
              </div>
              
              <div>
                <label style={{ color: '#87ceeb', display: 'block', marginBottom: '0.5rem' }}>
                  Mot de passe
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleFormChange}
                    placeholder="Mot de passe"
                    style={{
                      width: '100%',
                      padding: '0.75rem 3rem 0.75rem 0.75rem',
                      background: 'rgba(0, 0, 0, 0.6)',
                      border: '2px solid rgba(61, 155, 255, 0.4)',
                      borderRadius: '8px',
                      color: '#87ceeb',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#87ceeb',
                      cursor: 'pointer',
                    }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button 
                onClick={handleCloseEditDialog}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(61, 155, 255, 0.2)',
                  border: '1px solid rgba(61, 155, 255, 0.4)',
                  borderRadius: '8px',
                  color: '#3d9bff',
                  cursor: 'pointer',
                }}
              >
                Annuler
              </button>
              <button 
                onClick={handleSaveAdmin} 
                disabled={submitting}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#3d9bff',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#000',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                {submitting && <Loader2 className="animate-spin" size={16} />}
                {selectedAdmin ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdministratorList;