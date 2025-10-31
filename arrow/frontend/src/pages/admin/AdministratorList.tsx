import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Search, UserPlus, Loader2, Eye, EyeOff, Upload, Save } from 'lucide-react';
import { administratorsService, Administrator } from '../../services/administrators';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import styles from '@/components/admin/cards.module.css';
import { cn } from '@/lib/utils';

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
    password: '',
    photo: '',
    telephoneMobile: '',
    telephoneFixe: '',
    posteFonction: '',
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
        password: '',
        photo: admin.photo || '',
        telephoneMobile: admin.telephoneMobile || '',
        telephoneFixe: admin.telephoneFixe || '',
        posteFonction: admin.posteFonction || '',
      });
    } else {
      setSelectedAdmin(null);
      setFormData({
        email: '',
        nom: '',
        prenom: '',
        password: '',
        photo: '',
        telephoneMobile: '',
        telephoneFixe: '',
        posteFonction: '',
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
      password: '',
      photo: '',
      telephoneMobile: '',
      telephoneFixe: '',
      posteFonction: '',
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
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <Loader2 className="w-12 h-12 animate-spin" style={{ color: '#3d9bff' }} />
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto px-4 md:px-8" style={{ maxWidth: '1400px', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="flex flex-col items-start mb-8">
          <h1 
            className="text-3xl font-black tracking-[0.15em] uppercase mb-4"
            style={{
              background: 'linear-gradient(180deg, #3d9bff, #87ceeb, #5dbaff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 25px rgba(61, 155, 255, 0.45))',
            }}
          >
            Gestion des Administrateurs
          </h1>
          <p 
            className="text-base font-bold tracking-[0.08em] uppercase"
            style={{
              color: '#87ceeb',
              textShadow: '0 0 10px rgba(135, 206, 235, 0.5)',
            }}
          >
            Ajouter, modifier et supprimer les administrateurs
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <div className="flex flex-col gap-2" style={{ width: '100%' }}>
              <Label
                htmlFor="search-admin"
                className="block text-sm md:text-base uppercase font-bold"
                style={{
                  fontFamily: "'League Spartan', sans-serif",
                  color: '#87ceeb',
                  letterSpacing: '0.08em',
                  marginBottom: '0.5rem',
                }}
              >
                Recherche
              </Label>
              <div style={{ position: 'relative' }}>
                <Search 
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" 
                  style={{ 
                    color: 'rgba(135, 206, 235, 0.6)', 
                    width: '18px', 
                    height: '18px',
                  }} 
                />
                <Input
                  id="search-admin"
                  type="text"
                  placeholder="Rechercher un administrateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="tracking-[0.02em] w-full pl-10"
                  style={{
                    fontFamily: "'League Spartan', sans-serif",
                    height: '3rem',
                    background: 'rgba(17,24,39,0.6)',
                    border: '2px solid rgba(61,155,255,0.35)',
                    color: '#cfeaff',
                    fontSize: '0.95rem',
                    paddingRight: '1rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    boxShadow: '0 0 10px rgba(61,155,255,0.1)',
                    margin: 0,
                    width: '100%',
                  }}
                />
              </div>
            </div>
          </div>

          <Button
            onClick={() => handleOpenEditDialog()}
            className="Add-button"
          >
            <UserPlus size={18} />
            Ajouter un administrateur
          </Button>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            border: '2px solid rgba(220, 38, 38, 0.5)',
            color: '#ff6b6b',
            background: 'rgba(220, 38, 38, 0.2)',
            marginBottom: '1.5rem',
          }}>
            {error}
          </div>
        )}

        <div className={cn(styles['base-card'], styles['card-spacing-normal'])}>
          <div className={styles['card-header']}>
            <h2 className={styles['card-title']} style={{ margin: 0 }}>
              Liste des administrateurs
            </h2>
          </div>
          <div className={styles['card-section']} style={{ padding: 0 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(61, 155, 255, 0.3)', background: 'rgba(61, 155, 255, 0.05)' }}>
                    <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: '#3d9bff', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Nom</th>
                    <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: '#3d9bff', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Email</th>
                    <th style={{ padding: '1.25rem 1.5rem', textAlign: 'center', color: '#3d9bff', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#87ceeb' }}>
                        <p style={{ fontFamily: "'League Spartan', sans-serif", fontSize: '1rem', fontWeight: 700 }}>
                          {searchTerm ? 'Aucun administrateur trouvé' : 'Aucun administrateur'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredAdmins.map((admin) => (
                      <tr key={admin._id} style={{ borderBottom: '1px solid rgba(61, 155, 255, 0.1)' }}>
                        <td style={{ padding: '1.25rem 1.5rem', color: '#cfeaff', fontFamily: "'League Spartan', sans-serif" }}>
                          {admin.prenom} {admin.nom}
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', color: '#87ceeb', fontFamily: "'League Spartan', sans-serif" }}>{admin.email}</td>
                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button 
                              onClick={() => handleOpenEditDialog(admin)}
                              style={{
                                padding: '0.5rem',
                                background: 'rgba(61, 155, 255, 0.15)',
                                border: '2px solid rgba(61, 155, 255, 0.4)',
                                borderRadius: '8px',
                                color: '#3d9bff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                                boxShadow: '0 0 10px rgba(61,155,255,0.2)',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(61, 155, 255, 0.25)';
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(61,155,255,0.4)';
                                e.currentTarget.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(61, 155, 255, 0.15)';
                                e.currentTarget.style.boxShadow = '0 0 10px rgba(61,155,255,0.2)';
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleOpenDeleteDialog(admin)}
                              style={{
                                padding: '0.5rem',
                                background: 'rgba(220, 38, 38, 0.15)',
                                border: '2px solid rgba(220, 38, 38, 0.4)',
                                borderRadius: '8px',
                                color: '#ff6b6b',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                                boxShadow: '0 0 10px rgba(220,38,38,0.2)',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(220, 38, 38, 0.25)';
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(220,38,38,0.4)';
                                e.currentTarget.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(220, 38, 38, 0.15)';
                                e.currentTarget.style.boxShadow = '0 0 10px rgba(220,38,38,0.2)';
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className={cn(styles['base-card'])} style={{
            maxWidth: '450px',
            width: '90%',
            borderColor: 'rgba(220, 38, 38, 0.5)',
            boxShadow: '0 0 40px rgba(220, 38, 38, 0.3), inset 0 0 30px rgba(220, 38, 38, 0.1)',
          }}>
            <div className={styles['card-header']} style={{
              borderBottom: '1px solid rgba(220, 38, 38, 0.2)',
              background: 'rgba(220, 38, 38, 0.05)',
            }}>
              <h3 className={styles['card-title']} style={{ margin: 0, color: '#ff6b6b', textShadow: '0 0 15px rgba(255, 107, 107, 0.5)' }}>
                Confirmer la suppression
              </h3>
            </div>
            <div className={styles['card-section']}>
              <p style={{ 
                fontFamily: "'League Spartan', sans-serif",
                color: '#87ceeb', 
                marginBottom: '2rem',
                lineHeight: '1.6',
              }}>
                Êtes-vous sûr de vouloir supprimer l'administrateur <strong style={{ color: '#cfeaff' }}>{selectedAdmin?.prenom} {selectedAdmin?.nom}</strong> ?
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button
                  onClick={handleCloseDeleteDialog}
                  className="Add-button"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleDeleteAdmin}
                  className="Add-button"
                >
                  Supprimer
                </Button>
              </div>
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
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className={cn(styles['base-card'])} style={{
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 0 50px rgba(61, 155, 255, 0.3), inset 0 0 40px rgba(61, 155, 255, 0.1)',
          }}>
            <div className={styles['card-header']}>
              <h3 className={styles['card-title']} style={{ margin: 0 }}>
                {selectedAdmin ? 'Modifier' : 'Ajouter'} un administrateur
              </h3>
            </div>
            
            <div className={styles['card-section']} style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'flex-start' }}>
                {/* Photo de profil */}
                <div style={{ width: '100%', maxWidth: '400px' }}>
                  <Label style={{ 
                    fontFamily: "'League Spartan', sans-serif",
                    color: '#87ceeb', 
                    marginBottom: '0.75rem', 
                    display: 'block',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    letterSpacing: '0.08em',
                  }}>
                    Photo de profil
                  </Label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            handleFormChange({
                              target: { name: 'photo', value: reader.result as string }
                            } as React.ChangeEvent<HTMLInputElement>);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                    <label
                      htmlFor="photo"
                      style={{
                        fontFamily: "'League Spartan', sans-serif",
                        padding: '0.75rem 1.5rem',
                        borderRadius: '10px',
                        border: '2px solid rgba(61,155,255,0.5)',
                        background: 'rgba(61,155,255,0.15)',
                        color: '#87ceeb',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(61,155,255,0.25)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(61,155,255,0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(61,155,255,0.15)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <Upload size={16} />
                      {formData.photo ? 'Modifier' : 'Uploader'}
                    </label>
                    {formData.photo && (
                      <img
                        src={formData.photo}
                        alt="Photo de profil"
                        style={{
                          width: '70px',
                          height: '70px',
                          objectFit: 'cover',
                          borderRadius: '50%',
                          border: '2px solid rgba(61,155,255,0.35)',
                          boxShadow: '0 0 15px rgba(61,155,255,0.3)',
                        }}
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ width: '100%', maxWidth: '400px' }}>
                  <div>
                    <Label htmlFor="prenom" style={{ 
                      fontFamily: "'League Spartan', sans-serif",
                      color: '#87ceeb', 
                      marginBottom: '0.75rem', 
                      display: 'block',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      letterSpacing: '0.08em',
                    }}>
                      Prénom <span style={{ color: '#ef4444' }}>*</span>
                    </Label>
                    <Input
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleFormChange}
                      placeholder="Prénom"
                      required
                      style={{
                        fontFamily: "'League Spartan', sans-serif",
                        border: '2px solid rgba(61, 155, 255, 0.35)',
                        background: 'rgba(17,24,39,0.6)',
                        color: '#cfeaff',
                      }}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="nom" style={{ 
                      fontFamily: "'League Spartan', sans-serif",
                      color: '#87ceeb', 
                      marginBottom: '0.75rem', 
                      display: 'block',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      letterSpacing: '0.08em',
                    }}>
                      Nom <span style={{ color: '#ef4444' }}>*</span>
                    </Label>
                    <Input
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleFormChange}
                      placeholder="Nom"
                      required
                      style={{
                        fontFamily: "'League Spartan', sans-serif",
                        border: '2px solid rgba(61, 155, 255, 0.35)',
                        background: 'rgba(17,24,39,0.6)',
                        color: '#cfeaff',
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ width: '100%', maxWidth: '400px' }}>
                  <Label htmlFor="email" style={{ 
                    fontFamily: "'League Spartan', sans-serif",
                    color: '#87ceeb', 
                    marginBottom: '0.75rem', 
                    display: 'block',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    letterSpacing: '0.08em',
                  }}>
                    Email <span style={{ color: '#ef4444' }}>*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="Email"
                    required
                    style={{
                      fontFamily: "'League Spartan', sans-serif",
                      border: '2px solid rgba(61, 155, 255, 0.35)',
                      background: 'rgba(17,24,39,0.6)',
                      color: '#cfeaff',
                    }}
                  />
                </div>

                {!selectedAdmin && (
                  <div style={{ width: '100%', maxWidth: '400px' }}>
                    <Label htmlFor="password" style={{ 
                      fontFamily: "'League Spartan', sans-serif",
                      color: '#87ceeb', 
                      marginBottom: '0.75rem', 
                      display: 'block',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      letterSpacing: '0.08em',
                    }}>
                      Mot de passe <span style={{ color: '#ef4444' }}>*</span>
                    </Label>
                    <div style={{ position: 'relative' }}>
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleFormChange}
                        placeholder="Mot de passe (min. 8 caractères)"
                        required
                        minLength={8}
                        style={{
                          fontFamily: "'League Spartan', sans-serif",
                          border: '2px solid rgba(61, 155, 255, 0.35)',
                          background: 'rgba(17,24,39,0.6)',
                          color: '#cfeaff',
                          paddingRight: '3rem',
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
                          padding: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#3d9bff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#87ceeb';
                        }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ width: '100%', maxWidth: '400px' }}>
                  <div>
                    <Label htmlFor="telephoneMobile" style={{ 
                      fontFamily: "'League Spartan', sans-serif",
                      color: '#87ceeb', 
                      marginBottom: '0.75rem', 
                      display: 'block',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      letterSpacing: '0.08em',
                    }}>
                      Téléphone mobile
                    </Label>
                    <Input
                      id="telephoneMobile"
                      name="telephoneMobile"
                      type="tel"
                      value={formData.telephoneMobile}
                      onChange={handleFormChange}
                      placeholder="Téléphone mobile"
                      style={{
                        fontFamily: "'League Spartan', sans-serif",
                        border: '2px solid rgba(61, 155, 255, 0.35)',
                        background: 'rgba(17,24,39,0.6)',
                        color: '#cfeaff',
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="telephoneFixe" style={{ 
                      fontFamily: "'League Spartan', sans-serif",
                      color: '#87ceeb', 
                      marginBottom: '0.75rem', 
                      display: 'block',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      letterSpacing: '0.08em',
                    }}>
                      Téléphone fixe
                    </Label>
                    <Input
                      id="telephoneFixe"
                      name="telephoneFixe"
                      type="tel"
                      value={formData.telephoneFixe}
                      onChange={handleFormChange}
                      placeholder="Téléphone fixe"
                      style={{
                        fontFamily: "'League Spartan', sans-serif",
                        border: '2px solid rgba(61, 155, 255, 0.35)',
                        background: 'rgba(17,24,39,0.6)',
                        color: '#cfeaff',
                      }}
                    />
                  </div>
                </div>

                <div style={{ width: '100%', maxWidth: '400px' }}>
                  <Label htmlFor="posteFonction" style={{ 
                    fontFamily: "'League Spartan', sans-serif",
                    color: '#87ceeb', 
                    marginBottom: '0.75rem', 
                    display: 'block',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    letterSpacing: '0.08em',
                  }}>
                    Poste/Fonction
                  </Label>
                  <Input
                    id="posteFonction"
                    name="posteFonction"
                    value={formData.posteFonction}
                    onChange={handleFormChange}
                    placeholder="Poste/Fonction"
                    style={{
                      fontFamily: "'League Spartan', sans-serif",
                      border: '2px solid rgba(61, 155, 255, 0.35)',
                      background: 'rgba(17,24,39,0.6)',
                      color: '#cfeaff',
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div style={{ 
              padding: '1.5rem',
              borderTop: '1px solid rgba(61, 155, 255, 0.2)',
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'flex-end',
            }}>
              <Button
                onClick={handleCloseEditDialog}
                className="Add-button"
              >
                Annuler
              </Button>
              <Button 
                onClick={handleSaveAdmin} 
                disabled={submitting}
                className="Add-button"
              >
                {submitting && <Loader2 className="animate-spin" size={18} />}
                <Save size={18} />
                {selectedAdmin ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdministratorList;