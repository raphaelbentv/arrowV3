import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Loader2 } from 'lucide-react';
import { Etudiant, CreateEtudiantDto, StatutInscription, TypeFinancement } from '../../types/etudiant';
import { cohortesService } from '../../services/cohortes';
import { Cohorte } from '../../types/cohorte';
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
  const [cohortes, setCohortes] = useState<Cohorte[]>([]);
  const [loadingCohortes, setLoadingCohortes] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const commonInputStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.5)',
    border: '2px solid rgba(61,155,255,0.35)',
    color: '#87ceeb',
    height: '56px',
    padding: '0.875rem 1rem',
    fontSize: '1rem',
    textAlign: 'left',
    width: '100%',
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

  useEffect(() => {
    const loadCohortes = async () => {
      try {
        setLoadingCohortes(true);
        const data = await cohortesService.getAll();
        setCohortes(data);
      } catch (e) {
        console.error('Erreur chargement cohortes', e);
      } finally {
        setLoadingCohortes(false);
      }
    };
    loadCohortes();
  }, []);

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

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        {/* Informations personnelles */}
        <div className={styles['card-section']}>
          <h4 className={styles['card-title']} style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
            Informations personnelles
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start justify-start">
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

        {/* Coordonnées & identité */}
        <div className={styles['card-section']}>
          <h4 className={styles['card-title']} style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
            Coordonnées & identité
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start justify-start">
            <div className="md:col-span-2">
              <Label htmlFor="adresse" className="mb-2 block">Adresse</Label>
              <Input id="adresse" value={formData.adresse || ''} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} style={commonInputStyle} placeholder="Adresse complète" />
            </div>
            <div>
              <Label htmlFor="lieuNaissance" className="mb-2 block">Lieu de naissance</Label>
              <Input id="lieuNaissance" value={formData.lieuNaissance || ''} onChange={(e) => setFormData({ ...formData, lieuNaissance: e.target.value })} style={commonInputStyle} placeholder="Ville, pays" />
            </div>
            <div>
              <Label htmlFor="nationalite" className="mb-2 block">Nationalité</Label>
              <Input id="nationalite" value={formData.nationalite || ''} onChange={(e) => setFormData({ ...formData, nationalite: e.target.value })} style={commonInputStyle} placeholder="Nationalité" />
            </div>
            <div style={{ marginBottom: openSelects.genre ? 220 : 0 }}>
              <Label htmlFor="genre" className="mb-2 block">Genre</Label>
              <Select open={openSelects.genre} onOpenChange={(o) => setOpenSelects({ ...openSelects, genre: o })} value={formData.genre || 'none'} onValueChange={(v) => setFormData({ ...formData, genre: v === 'none' ? undefined : (v as any) })}>
                <SelectTrigger id="genre" style={commonInputStyle}>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Non renseigné</SelectItem>
                  <SelectItem value="M">Masculin</SelectItem>
                  <SelectItem value="F">Féminin</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="photo" className="mb-2 block">Photo (URL)</Label>
              <Input id="photo" value={(formData as any).photo || ''} onChange={(e) => setFormData({ ...formData, photo: e.target.value } as any)} style={commonInputStyle} placeholder="https://..." />
            </div>
          </div>
        </div>

        {/* Informations scolaires */}
        <div className={styles['card-section']}>
          <h4 className={styles['card-title']} style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
            Informations scolaires
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start justify-start">
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
            <div className="md:col-span-2" style={{ marginBottom: openSelects.statut ? 220 : 0 }}>
              <Label htmlFor="cohorteActuelle" className="mb-2 block">Cohorte actuelle</Label>
              <Select
                value={(formData as any).cohorteActuelle || 'none'}
                onValueChange={(v) => setFormData({ ...formData, cohorteActuelle: v === 'none' ? undefined : v } as any)}
                open={openSelects.statut}
                onOpenChange={(o) => setOpenSelects({ ...openSelects, statut: o })}
              >
                <SelectTrigger id="cohorteActuelle" style={commonInputStyle}>
                  <SelectValue placeholder={loadingCohortes ? 'Chargement...' : 'Sélectionner...'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Non assigné</SelectItem>
                  {cohortes.map((c) => (
                    <SelectItem key={c._id} value={c._id}>{c.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Informations financières */}
        <div className={styles['card-section']}>
          <h4 className={styles['card-title']} style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
            Informations financières
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start justify-start">
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
            <div>
              <Label htmlFor="dateDebutFinancement" className="mb-2 block">Début financement</Label>
              <Input id="dateDebutFinancement" type="date" value={(formData as any).dateDebutFinancement || ''} onChange={(e) => setFormData({ ...formData, dateDebutFinancement: e.target.value } as any)} style={commonInputStyle} />
            </div>
            <div>
              <Label htmlFor="dateFinFinancement" className="mb-2 block">Fin financement</Label>
              <Input id="dateFinFinancement" type="date" value={(formData as any).dateFinFinancement || ''} onChange={(e) => setFormData({ ...formData, dateFinFinancement: e.target.value } as any)} style={commonInputStyle} />
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

        {/* Parcours & commentaires */}
        <div className={styles['card-section']}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="situationActuelle" className="mb-2 block">Situation actuelle</Label>
              <Input id="situationActuelle" value={formData.situationActuelle || ''} onChange={(e) => setFormData({ ...formData, situationActuelle: e.target.value })} style={commonInputStyle} placeholder="Alternant, en stage, ..." />
            </div>
            <div>
              <Label htmlFor="objectifs" className="mb-2 block">Objectifs</Label>
              <Input id="objectifs" value={formData.objectifs || ''} onChange={(e) => setFormData({ ...formData, objectifs: e.target.value })} style={commonInputStyle} placeholder="Objectifs de formation" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="tags" className="mb-2 block">Tags</Label>
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const newTag = tagInput.trim();
                    if (!newTag) return;
                    const current = formData.tags || [];
                    if (current.includes(newTag)) {
                      setTagInput('');
                      return;
                    }
                    setFormData({ ...formData, tags: [...current, newTag] });
                    setTagInput('');
                  }
                }}
                style={commonInputStyle}
                placeholder="Saisir un tag puis Entrée"
              />
              {/* Aperçu des tags avec wrap pour éviter le manque de place */}
              <div
                aria-label="Tags actuels"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginTop: '0.5rem',
                }}
              >
                {(formData.tags || []).map((tag, idx) => (
                  <span
                    key={`${tag}-${idx}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      background: 'rgba(61,155,255,0.15)',
                      border: '1px solid rgba(61,155,255,0.35)',
                      color: '#cfeaff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {tag}
                    <button
                      type="button"
                      aria-label={`Retirer ${tag}`}
                      onClick={() => {
                        const newTags = (formData.tags || []).filter((_, i) => i !== idx)
                        setFormData({ ...formData, tags: newTags })
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#9ccfff',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Label htmlFor="commentaires" className="mb-2 block mt-4">Commentaires</Label>
          <Textarea id="commentaires" value={formData.commentaires || ''} onChange={(e) => setFormData({ ...formData, commentaires: e.target.value })} className="particle-input" style={{ height: 'auto', minHeight: '120px' }} placeholder="Commentaires sur l'étudiant..." />
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
