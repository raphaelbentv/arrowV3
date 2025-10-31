import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import styles from '@/components/admin/cards.module.css';
import { cn } from '@/lib/utils';
import { Save, Upload } from 'lucide-react';
import { schoolService, SchoolData } from '@/services/school';

export const SchoolPage: React.FC = () => {
  const [formData, setFormData] = useState<SchoolData>({
    nomEcole: '',
    raisonSociale: '',
    numeroSIRET: '',
    codeUAI: '',
    adresseNumeroRue: '',
    codePostal: '',
    ville: '',
    pays: 'France',
    telephone: '',
    email: '',
    siteWeb: '',
    nomDirecteur: '',
    emailDirecteur: '',
    nomResponsablePedagogique: '',
    emailResponsablePedagogique: '',
    logo: '',
    couleurPrincipale: '#3d9bff',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSchoolData();
  }, []);

  const loadSchoolData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await schoolService.get();
      if (data) {
        setFormData({
          nomEcole: data.nomEcole || '',
          raisonSociale: data.raisonSociale || '',
          numeroSIRET: data.numeroSIRET || '',
          codeUAI: data.codeUAI || '',
          adresseNumeroRue: data.adresseNumeroRue || '',
          codePostal: data.codePostal || '',
          ville: data.ville || '',
          pays: data.pays || 'France',
          telephone: data.telephone || '',
          email: data.email || '',
          siteWeb: data.siteWeb || '',
          nomDirecteur: data.nomDirecteur || '',
          emailDirecteur: data.emailDirecteur || '',
          nomResponsablePedagogique: data.nomResponsablePedagogique || '',
          emailResponsablePedagogique: data.emailResponsablePedagogique || '',
          logo: data.logo || '',
          couleurPrincipale: data.couleurPrincipale || '#3d9bff',
        });
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement des données de l\'école');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof SchoolData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setMessage(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      await schoolService.createOrUpdate(formData);
      setMessage('Informations de l\'école enregistrées avec succès');
    } catch (err) {
      console.error(err);
      setError('Erreur lors de l\'enregistrement des informations');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Uploader le logo
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('logo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto px-4 md:px-8" style={{ maxWidth: '1200px', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#87ceeb', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800, filter: 'drop-shadow(0 0 20px rgba(61, 155, 255, 0.5))' }}>
          Chargement des données...
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
        Informations de l'Établissement
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

      <form onSubmit={handleSubmit}>
        {/* Section Identité */}
        <div className={cn(styles['base-card'], styles['card-spacing-normal'])} style={{ marginBottom: '2rem' }}>
          <div className={styles['card-header']}>
            <h2 className={styles['card-title']} style={{ margin: 0 }}>
              Identité
            </h2>
          </div>
          <div className={styles['card-section']}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nomEcole" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
                  Nom de l'école <span style={{ color: '#ef4444' }}>*</span>
                </Label>
                <Input
                  id="nomEcole"
                  value={formData.nomEcole}
                  onChange={(e) => handleChange('nomEcole', e.target.value)}
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
                <Label htmlFor="raisonSociale" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
                  Raison sociale
                </Label>
                <Input
                  id="raisonSociale"
                  value={formData.raisonSociale}
                  onChange={(e) => handleChange('raisonSociale', e.target.value)}
                  style={{ 
                    fontFamily: "'League Spartan', sans-serif",
                    border: '2px solid rgba(61, 155, 255, 0.35)',
                    background: 'rgba(17,24,39,0.6)',
                    color: '#cfeaff',
                  }}
                />
              </div>
              <div>
                <Label htmlFor="numeroSIRET" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
                  Numéro SIRET <span style={{ color: '#ef4444' }}>*</span>
                </Label>
                <Input
                  id="numeroSIRET"
                  value={formData.numeroSIRET}
                  onChange={(e) => handleChange('numeroSIRET', e.target.value)}
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
                <Label htmlFor="codeUAI" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
                  Code UAI
                </Label>
                <Input
                  id="codeUAI"
                  value={formData.codeUAI}
                  onChange={(e) => handleChange('codeUAI', e.target.value)}
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
        </div>

        {/* Section Coordonnées */}
        <div className={cn(styles['base-card'], styles['card-spacing-normal'])} style={{ marginBottom: '2rem' }}>
          <div className={styles['card-header']}>
            <h2 className={styles['card-title']} style={{ margin: 0 }}>
              Coordonnées
            </h2>
          </div>
          <div className={styles['card-section']}>
            <div className="mb-4">
              <Label style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block', fontSize: '0.875rem', fontWeight: 700 }}>
                Adresse complète
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="adresseNumeroRue" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block', fontSize: '0.875rem' }}>
                    Numéro et rue <span style={{ color: '#ef4444' }}>*</span>
                  </Label>
                  <Input
                    id="adresseNumeroRue"
                    value={formData.adresseNumeroRue}
                    onChange={(e) => handleChange('adresseNumeroRue', e.target.value)}
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
                  <Label htmlFor="codePostal" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block', fontSize: '0.875rem' }}>
                    Code postal <span style={{ color: '#ef4444' }}>*</span>
                  </Label>
                  <Input
                    id="codePostal"
                    value={formData.codePostal}
                    onChange={(e) => handleChange('codePostal', e.target.value)}
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
                  <Label htmlFor="ville" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block', fontSize: '0.875rem' }}>
                    Ville <span style={{ color: '#ef4444' }}>*</span>
                  </Label>
                  <Input
                    id="ville"
                    value={formData.ville}
                    onChange={(e) => handleChange('ville', e.target.value)}
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
                  <Label htmlFor="pays" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block', fontSize: '0.875rem' }}>
                    Pays <span style={{ color: '#ef4444' }}>*</span>
                  </Label>
                  <Input
                    id="pays"
                    value={formData.pays}
                    onChange={(e) => handleChange('pays', e.target.value)}
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <Label htmlFor="telephone" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
                  Téléphone principal <span style={{ color: '#ef4444' }}>*</span>
                </Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleChange('telephone', e.target.value)}
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
                  Email de contact <span style={{ color: '#ef4444' }}>*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
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
                <Label htmlFor="siteWeb" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
                  Site web
                </Label>
                <Input
                  id="siteWeb"
                  type="url"
                  value={formData.siteWeb}
                  onChange={(e) => handleChange('siteWeb', e.target.value)}
                  placeholder="https://"
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
        </div>

        {/* Section Direction */}
        <div className={cn(styles['base-card'], styles['card-spacing-normal'])} style={{ marginBottom: '2rem' }}>
          <div className={styles['card-header']}>
            <h2 className={styles['card-title']} style={{ margin: 0 }}>
              Direction
            </h2>
          </div>
          <div className={styles['card-section']}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nomDirecteur" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
                  Nom du directeur/directrice <span style={{ color: '#ef4444' }}>*</span>
                </Label>
                <Input
                  id="nomDirecteur"
                  value={formData.nomDirecteur}
                  onChange={(e) => handleChange('nomDirecteur', e.target.value)}
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
                <Label htmlFor="emailDirecteur" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
                  Email du directeur <span style={{ color: '#ef4444' }}>*</span>
                </Label>
                <Input
                  id="emailDirecteur"
                  type="email"
                  value={formData.emailDirecteur}
                  onChange={(e) => handleChange('emailDirecteur', e.target.value)}
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
                <Label htmlFor="nomResponsablePedagogique" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
                  Nom du responsable pédagogique <span style={{ color: '#ef4444' }}>*</span>
                </Label>
                <Input
                  id="nomResponsablePedagogique"
                  value={formData.nomResponsablePedagogique}
                  onChange={(e) => handleChange('nomResponsablePedagogique', e.target.value)}
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
                <Label htmlFor="emailResponsablePedagogique" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.75rem', display: 'block' }}>
                  Email du responsable pédagogique <span style={{ color: '#ef4444' }}>*</span>
                </Label>
                <Input
                  id="emailResponsablePedagogique"
                  type="email"
                  value={formData.emailResponsablePedagogique}
                  onChange={(e) => handleChange('emailResponsablePedagogique', e.target.value)}
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
          </div>
        </div>

        {/* Section Branding */}
        <div className={cn(styles['base-card'], styles['card-spacing-normal'])} style={{ marginBottom: '2rem' }}>
          <div className={styles['card-header']}>
            <h2 className={styles['card-title']} style={{ margin: 0 }}>
              Branding <span style={{ fontSize: '0.875rem', fontWeight: 400, color: '#87ceeb', opacity: 0.7 }}>(optionnel pour MVP)</span>
            </h2>
          </div>
          <div className={styles['card-section']}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="logo" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.5rem', display: 'block' }}>
                  Logo de l'école
                </Label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="logo"
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
                    Uploader un logo
                  </label>
                  {formData.logo && (
                    <img
                      src={formData.logo}
                      alt="Logo de l'école"
                      style={{
                        maxHeight: '60px',
                        maxWidth: '150px',
                        objectFit: 'contain',
                        borderRadius: '8px',
                      }}
                    />
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="couleurPrincipale" style={{ fontFamily: "'League Spartan', sans-serif", color: '#87ceeb', marginBottom: '0.5rem', display: 'block' }}>
                  Couleur principale
                </Label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Input
                    id="couleurPrincipale"
                    type="color"
                    value={formData.couleurPrincipale}
                    onChange={(e) => handleChange('couleurPrincipale', e.target.value)}
                    style={{
                      width: '80px',
                      height: '3rem',
                      padding: '0.25rem',
                      fontFamily: "'League Spartan', sans-serif",
                      cursor: 'pointer',
                      border: '2px solid rgba(61, 155, 255, 0.35)',
                      background: 'rgba(17,24,39,0.6)',
                    }}
                  />
                  <Input
                    type="text"
                    value={formData.couleurPrincipale}
                    onChange={(e) => handleChange('couleurPrincipale', e.target.value)}
                    placeholder="#3d9bff"
                    style={{ 
                      fontFamily: "'League Spartan', sans-serif", 
                      flex: 1,
                      border: '2px solid rgba(61, 155, 255, 0.35)',
                      background: 'rgba(17,24,39,0.6)',
                      color: '#cfeaff',
                    }}
                  />
                </div>
                <p style={{ fontFamily: "'League Spartan', sans-serif", fontSize: '0.75rem', color: '#87ceeb', opacity: 0.7, marginTop: '0.5rem' }}>
                  Pour personnalisation future
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
          <Button
            type="submit"
            disabled={saving}
            className="Add-button"
            style={{ minWidth: '200px' }}
          >
            <Save size={18} />
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SchoolPage;

