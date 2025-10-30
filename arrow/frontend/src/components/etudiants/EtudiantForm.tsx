import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Loader2 } from 'lucide-react';
import { Etudiant, CreateEtudiantDto, StatutInscription, TypeFinancement } from '../../types/etudiant';
import { cn } from '@/lib/utils';
import styles from '../admin/cards.module.css';

// Composant Textarea
const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

interface EtudiantFormProps {
  etudiant?: Etudiant;
  onSubmit: (data: CreateEtudiantDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  onDeleteEtudiant?: (id: string) => Promise<void>;
}

export const EtudiantForm: React.FC<EtudiantFormProps> = ({
  etudiant,
  onSubmit,
  onCancel,
  isLoading = false,
  onDeleteEtudiant,
}) => {
  const [formData, setFormData] = useState<CreateEtudiantDto>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    statutInscription: StatutInscription.EN_ATTENTE,
    adresse: '',
    dateNaissance: '',
    lieuNaissance: '',
    nationalite: '',
    genre: undefined,
    numeroEtudiant: '',
    dateInscription: '',
    formationSuivie: '',
    niveau: '',
    typeFinancement: undefined,
    montantFinancement: undefined,
    organismeFinanceur: '',
    situationActuelle: '',
    objectifs: '',
    commentaires: '',
    tags: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openSelects, setOpenSelects] = useState({
    statut: false,
    genre: false,
    financement: false,
  });

  const commonInputStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.5)',
    border: '2px solid rgba(61,155,255,0.35)',
    color: '#87ceeb',
    height: '56px',
    padding: '0.875rem 1rem',
    fontSize: '1rem',
  };

  useEffect(() => {
    if (etudiant) {
      setFormData({
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        email: etudiant.email,
        telephone: etudiant.telephone,
        statutInscription: etudiant.statutInscription,
        adresse: etudiant.adresse || '',
        dateNaissance: etudiant.dateNaissance?.split('T')[0] || '',
        lieuNaissance: etudiant.lieuNaissance || '',
        nationalite: etudiant.nationalite || '',
        genre: etudiant.genre,
        numeroEtudiant: etudiant.numeroEtudiant || '',
        dateInscription: etudiant.dateInscription?.split('T')[0] || '',
        cohorteActuelle: typeof etudiant.cohorteActuelle === 'object' ? etudiant.cohorteActuelle._id : etudiant.cohorteActuelle,
        formationSuivie: etudiant.formationSuivie || '',
        niveau: etudiant.niveau || '',
        typeFinancement: etudiant.typeFinancement,
        montantFinancement: etudiant.montantFinancement,
        organismeFinanceur: etudiant.organismeFinanceur || '',
        situationActuelle: etudiant.situationActuelle || '',
        objectifs: etudiant.objectifs || '',
        commentaires: etudiant.commentaires || '',
        tags: etudiant.tags || [],
      });
    }
  }, [etudiant]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis';

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  return (
    <div
      className={cn(styles['base-card'])}
      style={{
        borderTop: '4px solid #3d9bff',
        boxShadow: 'none',
        padding: '2rem',
      }}
    >
      <h3 className={styles['card-title']} style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>
        {etudiant ? 'Modifier l\'étudiant' : 'Nouvel étudiant'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations personnelles */}
        <div className={styles['card-section']}>
          <h4 className={styles['card-title']} style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
            Informations personnelles
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom" className="mb-2 block">
                Nom <span style={{ color: '#ef4444' }}>*</span>
              </Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                style={commonInputStyle}
                placeholder="Nom"
              />
              {errors.nom && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.nom}</p>}
            </div>
            <div>
              <Label htmlFor="prenom" className="mb-2 block">
                Prénom <span style={{ color: '#ef4444' }}>*</span>
              </Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                style={commonInputStyle}
                placeholder="Prénom"
              />
              {errors.prenom && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.prenom}</p>}
            </div>
            <div>
              <Label htmlFor="email" className="mb-2 block">
                Email <span style={{ color: '#ef4444' }}>*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={commonInputStyle}
                placeholder="email@exemple.com"
              />
              {errors.email && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="telephone" className="mb-2 block">
                Téléphone <span style={{ color: '#ef4444' }}>*</span>
              </Label>
              <Input
                id="telephone"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                style={commonInputStyle}
                placeholder="0612345678"
              />
              {errors.telephone && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.telephone}</p>}
            </div>
            <div>
              <Label htmlFor="dateNaissance" className="mb-2 block">Date de naissance</Label>
              <Input
                id="dateNaissance"
                type="date"
                value={formData.dateNaissance}
                onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                style={commonInputStyle}
              />
            </div>
            <div>
              <Label htmlFor="numeroEtudiant" className="mb-2 block">Numéro étudiant</Label>
              <Input
                id="numeroEtudiant"
                value={formData.numeroEtudiant}
                onChange={(e) => setFormData({ ...formData, numeroEtudiant: e.target.value })}
                style={commonInputStyle}
                placeholder="ETU2024001"
              />
            </div>
          </div>
        </div>

        {/* Informations scolaires */}
        <div className={styles['card-section']}>
          <h4 className={styles['card-title']} style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
            Informations scolaires
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div style={{ marginBottom: openSelects.statut ? 220 : 0 }}>
              <Label htmlFor="statut" className="mb-2 block">
                Statut d'inscription <span style={{ color: '#ef4444' }}>*</span>
              </Label>
              <Select
                open={openSelects.statut}
                onOpenChange={(o) => setOpenSelects({ ...openSelects, statut: o })}
                value={formData.statutInscription}
                onValueChange={(v) => setFormData({ ...formData, statutInscription: v as StatutInscription })}
              >
                <SelectTrigger id="statut" style={commonInputStyle}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(StatutInscription).map((statut) => (
                    <SelectItem key={statut} value={statut}>
                      {statut}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dateInscription" className="mb-2 block">Date d'inscription</Label>
              <Input
                id="dateInscription"
                type="date"
                value={formData.dateInscription}
                onChange={(e) => setFormData({ ...formData, dateInscription: e.target.value })}
                style={commonInputStyle}
              />
            </div>
            <div>
              <Label htmlFor="formationSuivie" className="mb-2 block">Formation suivie</Label>
              <Input
                id="formationSuivie"
                value={formData.formationSuivie}
                onChange={(e) => setFormData({ ...formData, formationSuivie: e.target.value })}
                style={commonInputStyle}
                placeholder="BTS Communication"
              />
            </div>
            <div>
              <Label htmlFor="niveau" className="mb-2 block">Niveau</Label>
              <Input
                id="niveau"
                value={formData.niveau}
                onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
                style={commonInputStyle}
                placeholder="Bac+2"
              />
            </div>
          </div>
        </div>

        {/* Informations financières */}
        <div className={styles['card-section']}>
          <h4 className={styles['card-title']} style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
            Informations financières
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div style={{ marginBottom: openSelects.financement ? 220 : 0 }}>
              <Label htmlFor="typeFinancement" className="mb-2 block">Type de financement</Label>
              <Select
                open={openSelects.financement}
                onOpenChange={(o) => setOpenSelects({ ...openSelects, financement: o })}
                value={formData.typeFinancement || 'none'}
                onValueChange={(v) => setFormData({ ...formData, typeFinancement: v === 'none' ? undefined : (v as TypeFinancement) })}
              >
                <SelectTrigger id="typeFinancement" style={commonInputStyle}>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {Object.values(TypeFinancement).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="montantFinancement" className="mb-2 block">Montant financement</Label>
              <Input
                id="montantFinancement"
                type="number"
                value={formData.montantFinancement || ''}
                onChange={(e) => setFormData({ ...formData, montantFinancement: e.target.value ? Number(e.target.value) : undefined })}
                style={commonInputStyle}
                placeholder="5000"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="organismeFinanceur" className="mb-2 block">Organisme financeur</Label>
              <Input
                id="organismeFinanceur"
                value={formData.organismeFinanceur}
                onChange={(e) => setFormData({ ...formData, organismeFinanceur: e.target.value })}
                style={commonInputStyle}
                placeholder="CROUS"
              />
            </div>
          </div>
        </div>

        {/* Commentaires */}
        <div className={styles['card-section']}>
          <Label htmlFor="commentaires" className="mb-2 block">Commentaires</Label>
          <Textarea
            id="commentaires"
            value={formData.commentaires || ''}
            onChange={(e) => setFormData({ ...formData, commentaires: e.target.value })}
            style={{
              ...commonInputStyle,
              height: 'auto',
              minHeight: '100px',
            }}
            placeholder="Commentaires sur l'étudiant..."
          />
        </div>

        {/* Actions */}
        <div className={styles['card-footer']} style={{ justifyContent: 'space-between', marginTop: '2rem' }}>
          <div>
            {etudiant && onDeleteEtudiant && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (window.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
                    onDeleteEtudiant(etudiant._id);
                  }
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '2px solid #ef4444',
                  color: '#ef4444',
                }}
              >
                Supprimer
              </Button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button
              type="button"
              onClick={onCancel}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: '#87ceeb',
              }}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className={styles['card-button-primary']}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                etudiant ? 'Enregistrer' : 'Créer'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
