import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import styles from '@/components/admin/cards.module.css';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/authContext';
import { administratorsService } from '@/services/administrators';
import { Save, Upload, Eye, EyeOff } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Informations personnelles
  const [photo, setPhoto] = useState<string>('');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephoneMobile, setTelephoneMobile] = useState('');
  const [telephoneFixe, setTelephoneFixe] = useState('');
  const [posteFonction, setPosteFonction] = useState('');
  
  // Paramètres de connexion
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Historique
  const [derniereConnexion, setDerniereConnexion] = useState<string | null>(null);
  const [derniereModification, setDerniereModification] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      if (user.id !== 'dev-admin-id') {
        const admin = await administratorsService.getById(user.id);
        setPrenom(admin.prenom || '');
        setNom(admin.nom || '');
        setEmail(admin.email || '');
        setPhoto((admin as any).photo || '');
        setTelephoneMobile((admin as any).telephoneMobile || '');
        setTelephoneFixe((admin as any).telephoneFixe || '');
        setPosteFonction((admin as any).posteFonction || '');
        setDerniereConnexion((admin as any).derniereConnexion ? new Date((admin as any).derniereConnexion).toLocaleString('fr-FR') : null);
        setDerniereModification((admin as any).derniereModificationProfil ? new Date((admin as any).derniereModificationProfil).toLocaleString('fr-FR') : null);
      } else {
        setPrenom(user.firstName || '');
        setNom(user.lastName || '');
        setEmail(user.email || '');
      }
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    if (!user?.id) return;
    
    try {
      setSaving(true);
      if (user.id === 'dev-admin-id') {
        setMessage('Profil mis à jour (simulation dev)');
      } else {
        await administratorsService.updateProfile(user.id, {
          prenom,
          nom,
          email,
          telephoneMobile,
          telephoneFixe,
          posteFonction,
          photo,
        });
        setMessage('Profil mis à jour avec succès');
        await loadProfile();
      }
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    
    if (newPassword !== confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    if (!user?.id) return;
    
    try {
      setChangingPassword(true);
      if (user.id === 'dev-admin-id') {
        setMessage('Mot de passe changé (simulation dev)');
      } else {
        await administratorsService.changePassword(user.id, currentPassword, newPassword, confirmPassword);
        setMessage('Mot de passe changé avec succès');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto px-4 md:px-8" style={{ maxWidth: '1200px', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#87ceeb', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800, filter: 'drop-shadow(0 0 20px rgba(61, 155, 255, 0.5))' }}>
          Chargement du profil...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 md:px-8" style={{ maxWidth: '1200px', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h1 
        className="text-3xl font-black tracking-[0.15em] uppercase mb-6"
        style={{
          background: 'linear-gradient(180deg, #3d9bff, #87ceeb, #5dbaff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 25px rgba(61, 155, 255, 0.45))',
        }}
      >
        Mon profil
      </h1>

      {message && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '12px',
          border: '1px solid rgba(61,155,255,0.35)',
          color: '#cfeaff',
          background: 'rgba(61,155,255,0.08)',
          marginBottom: '1.5rem',
        }}>
          {message}
        </div>
      )}

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

      {/* Section 1: Informations personnelles */}
      <div className={cn(styles['base-card'], styles['card-spacing-normal'])} style={{ marginBottom: '2rem' }}>
        <div className={styles['card-header']}>
          <h2 className={styles['card-title']} style={{ margin: 0 }}>
            1️⃣ Informations Personnelles
          </h2>
        </div>
        <div className={styles['card-section']}>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Photo de profil */}
              <div className="md:col-span-2">
                <Label htmlFor="photo" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
                  Photo de profil
                </Label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
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
                      transition: 'all 0.2s',
                      fontWeight: 700,
                      fontSize: '0.875rem',
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
                    {photo ? 'Modifier la photo' : 'Uploader une photo'}
                  </label>
                  {photo && (
                    <img
                      src={photo}
                      alt="Photo de profil"
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        border: '2px solid rgba(61,155,255,0.35)',
                      }}
                    />
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="prenom" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
                  Prénom <span style={{ color: '#ef4444' }}>*</span>
                </Label>
                <Input
                  id="prenom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
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
                <Label htmlFor="nom" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
                  Nom <span style={{ color: '#ef4444' }}>*</span>
                </Label>
                <Input
                  id="nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
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
                <Label htmlFor="email" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
                  Email professionnel <span style={{ color: '#ef4444' }}>*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                <Label htmlFor="telephoneMobile" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
                  Téléphone mobile
                </Label>
                <Input
                  id="telephoneMobile"
                  type="tel"
                  value={telephoneMobile}
                  onChange={(e) => setTelephoneMobile(e.target.value)}
                  style={{
                    fontFamily: "'League Spartan', sans-serif",
                    border: '2px solid rgba(61, 155, 255, 0.35)',
                    background: 'rgba(17,24,39,0.6)',
                    color: '#cfeaff',
                  }}
                />
              </div>

              <div>
                <Label htmlFor="telephoneFixe" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
                  Téléphone fixe
                </Label>
                <Input
                  id="telephoneFixe"
                  type="tel"
                  value={telephoneFixe}
                  onChange={(e) => setTelephoneFixe(e.target.value)}
                  style={{
                    fontFamily: "'League Spartan', sans-serif",
                    border: '2px solid rgba(61, 155, 255, 0.35)',
                    background: 'rgba(17,24,39,0.6)',
                    color: '#cfeaff',
                  }}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="posteFonction" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
                  Poste/Fonction
                </Label>
                <Input
                  id="posteFonction"
                  value={posteFonction}
                  onChange={(e) => setPosteFonction(e.target.value)}
                  style={{
                    fontFamily: "'League Spartan', sans-serif",
                    border: '2px solid rgba(61, 155, 255, 0.35)',
                    background: 'rgba(17,24,39,0.6)',
                    color: '#cfeaff',
                  }}
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <Button type="submit" disabled={saving} className="Add-button">
                  <Save size={18} />
                  {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Section 2: Paramètres de connexion */}
      <div className={cn(styles['base-card'], styles['card-spacing-normal'])} style={{ marginBottom: '2rem' }}>
        <div className={styles['card-header']}>
          <h2 className={styles['card-title']} style={{ margin: 0 }}>
            2️⃣ Paramètres de Connexion
          </h2>
        </div>
        <div className={styles['card-section']}>
          {/* Identifiant de connexion (non modifiable) */}
          <div className="mb-6">
            <Label style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
              Identifiant de connexion (email - non modifiable)
            </Label>
            <Input
              value={email}
              disabled
              style={{
                fontFamily: "'League Spartan', sans-serif",
                border: '2px solid rgba(61, 155, 255, 0.25)',
                background: 'rgba(17,24,39,0.4)',
                color: '#87ceeb',
                opacity: 0.7,
                cursor: 'not-allowed',
              }}
            />
          </div>

          {/* Changer le mot de passe */}
          <form onSubmit={onChangePassword}>
            <h3 style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Changer le mot de passe
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="currentPassword" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
                  Mot de passe actuel <span style={{ color: '#ef4444' }}>*</span>
                </Label>
                <div style={{ position: 'relative' }}>
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
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
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
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
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
                  Nouveau mot de passe <span style={{ color: '#ef4444' }}>*</span>
                </Label>
                <div style={{ position: 'relative' }}>
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                    onClick={() => setShowNewPassword(!showNewPassword)}
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
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
                  Confirmer nouveau mot de passe <span style={{ color: '#ef4444' }}>*</span>
                </Label>
                <div style={{ position: 'relative' }}>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <Button type="submit" disabled={changingPassword} className="Add-button">
                  {changingPassword ? 'Changement en cours...' : 'Changer le mot de passe'}
                </Button>
              </div>
            </div>
          </form>

          {/* Authentification à deux facteurs (pour V2) */}
          <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(61,155,255,0.2)' }}>
            <Label style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.5rem', display: 'block' }}>
              Authentification à deux facteurs
            </Label>
            <p style={{ fontFamily: "'League Spartan', sans-serif", fontSize: '0.875rem', color: '#87ceeb', opacity: 0.7 }}>
              Fonctionnalité prévue pour la version 2
            </p>
          </div>
        </div>
      </div>

      {/* Section 6: Historique et sécurité */}
      <div className={cn(styles['base-card'], styles['card-spacing-normal'])}>
        <div className={styles['card-header']}>
          <h2 className={styles['card-title']} style={{ margin: 0 }}>
            6️⃣ Historique et Sécurité
          </h2>
        </div>
        <div className={styles['card-section']}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
                Dernière connexion
              </Label>
              <Input
                value={derniereConnexion || 'Non disponible'}
                disabled
                style={{
                  fontFamily: "'League Spartan', sans-serif",
                  border: '2px solid rgba(61, 155, 255, 0.25)',
                  background: 'rgba(17,24,39,0.4)',
                  color: '#87ceeb',
                  opacity: 0.7,
                  cursor: 'not-allowed',
                }}
              />
            </div>
            <div>
              <Label style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
                Dernière modification profil
              </Label>
              <Input
                value={derniereModification || 'Non disponible'}
                disabled
                style={{
                  fontFamily: "'League Spartan', sans-serif",
                  border: '2px solid rgba(61, 155, 255, 0.25)',
                  background: 'rgba(17,24,39,0.4)',
                  color: '#87ceeb',
                  opacity: 0.7,
                  cursor: 'not-allowed',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
