import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Chip } from '@/components/ui/chip';
import { Plus, Loader2, X } from 'lucide-react';
import { CohorteFormData, CreateCohorteDto, Cohorte, TypeFormation, StatutCohorte, TypeFinancement } from '../../types/cohorte';
import { cn } from '@/lib/utils';
import styles from '../admin/cards.module.css';

// Composant Textarea simple
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

interface CohorteFormProps {
  cohorte?: Cohorte;
  onSubmit: (data: CreateCohorteDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  onDeleteCohorte?: (id: string) => Promise<void> | void;
}

export const CohorteForm: React.FC<CohorteFormProps> = ({
  cohorte,
  onSubmit,
  onCancel,
  isLoading = false,
  onDeleteCohorte,
}) => {
  const [formData, setFormData] = useState<CohorteFormData>({
    // Informations générales
    nom: '',
    anneeScolaire: '',
    typeFormation: TypeFormation.BTS,
    diplomeVise: '',
    niveauRNCP: '',
    etablissement: '',
    formationAssociee: '',

    // Composition
    nombreEtudiantsPrevu: 0,
    nombreEtudiantsInscrits: 0,
    responsablePedagogique: '',

    // Organisation
    dateDebut: '',
    dateFin: '',
    volumeHoraireTotal: 0,

    // Structure pédagogique
    matieres: [],
    modules: [],
    progressionPedagogique: '',

    // Suivi administratif
    statut: StatutCohorte.EN_PREPARATION,
    nombreEtudiantsFinances: 0,
    nombreEtudiantsAutofinances: 0,
    montantTotalFacture: 0,
    typeFinanceur: TypeFinancement.OPCO,
    nomFinanceur: '',

    // Métadonnées
    commentairesInternes: '',
    tags: [],
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newItemValue, setNewItemValue] = useState<{ [key: string]: string }>({
    matieres: '',
    modules: '',
    tags: '',
  });

  // Styles communs pour les champs (inspiré des inputs Admin)
  const commonInputStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.5)',
    border: '2px solid rgba(61,155,255,0.35)',
    color: '#87ceeb',
    height: '56px',
    padding: '0.875rem 1rem',
    fontSize: '1rem',
  };

  // Ouverture des selects pour créer de l'espace et éviter le chevauchement
  const [openSelects, setOpenSelects] = useState({
    annee: false,
    typeFormation: false,
    statut: false,
    typeFinanceur: false,
  });

  useEffect(() => {
    if (cohorte) {
      setFormData({
        // Informations générales
        nom: cohorte.nom,
        anneeScolaire: cohorte.anneeScolaire,
        typeFormation: cohorte.typeFormation,
        diplomeVise: cohorte.diplomeVise || '',
        niveauRNCP: cohorte.niveauRNCP || '',
        etablissement: cohorte.etablissement || '',
        formationAssociee: cohorte.formationAssociee || '',

        // Composition
        nombreEtudiantsPrevu: cohorte.nombreEtudiantsPrevu ?? 0,
        nombreEtudiantsInscrits: cohorte.nombreEtudiantsInscrits ?? 0,
        responsablePedagogique: cohorte.responsablePedagogique || '',

        // Organisation
        dateDebut: cohorte.dateDebut.split('T')[0],
        dateFin: cohorte.dateFin.split('T')[0],
        volumeHoraireTotal: cohorte.volumeHoraireTotal ?? 0,

        // Structure pédagogique
        matieres: cohorte.matieres || [],
        modules: cohorte.modules || [],
        progressionPedagogique: cohorte.progressionPedagogique || '',

        // Suivi administratif
        statut: cohorte.statut,
        nombreEtudiantsFinances: cohorte.nombreEtudiantsFinances ?? 0,
        nombreEtudiantsAutofinances: cohorte.nombreEtudiantsAutofinances ?? 0,
        montantTotalFacture: cohorte.montantTotalFacture ?? 0,
        typeFinanceur: cohorte.typeFinanceur || TypeFinancement.OPCO,
        nomFinanceur: cohorte.nomFinanceur || '',

        // Métadonnées
        commentairesInternes: cohorte.commentairesInternes || '',
        tags: cohorte.tags || [],
        description: cohorte.description || '',
      });
    }
  }, [cohorte]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    if (!formData.anneeScolaire.trim()) {
      newErrors.anneeScolaire = 'L\'année scolaire est requise';
    }

    if (!formData.dateDebut) {
      newErrors.dateDebut = 'La date de début est requise';
    }

    if (!formData.dateFin) {
      newErrors.dateFin = 'La date de fin est requise';
    }

    if (formData.dateDebut && formData.dateFin && formData.dateDebut >= formData.dateFin) {
      newErrors.dateFin = 'La date de fin doit être postérieure à la date de début';
    }

    if (formData.nombreEtudiantsInscrits > formData.nombreEtudiantsPrevu) {
      newErrors.nombreEtudiantsInscrits = 'Le nombre d\'inscrits ne peut pas dépasser le nombre prévu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Construire le payload avec seulement les champs définis (éviter undefined)
      const basePayload: any = {
        nom: formData.nom,
        anneeScolaire: formData.anneeScolaire,
        typeFormation: formData.typeFormation,
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin,
        statut: formData.statut,
      };

      // Ajouter les champs optionnels seulement s'ils ont une valeur
      if (formData.diplomeVise?.trim()) {
        basePayload.diplome = formData.diplomeVise;
      }
      if (formData.volumeHoraireTotal !== undefined && formData.volumeHoraireTotal > 0) {
        basePayload.volumeHoraireTotal = formData.volumeHoraireTotal;
      }
      if (formData.modules?.length) {
        basePayload.modules = formData.modules;
      }
      if (formData.commentairesInternes?.trim()) {
        basePayload.notesInternes = formData.commentairesInternes;
      }
      if (formData.tags?.length) {
        basePayload.tags = formData.tags;
      }

      // Pour la création, ajouter creePar
      if (!cohorte) {
        basePayload.creePar = 'admin@dev.com';
      }

      console.log('Payload envoyé:', basePayload);
      await onSubmit(basePayload);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur pour ce champ
    if (errors[name as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const addToList = (listName: 'matieres' | 'modules' | 'tags') => {
    const value = newItemValue[listName];
    if (value && value.trim()) {
      setFormData(prev => ({
        ...prev,
        [listName]: [...prev[listName], value.trim()]
      }));
      setNewItemValue(prev => ({ ...prev, [listName]: '' }));
    }
  };

  const removeFromList = (listName: 'matieres' | 'modules' | 'tags', index: number) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index)
    }));
  };

  return (
    <Card 
      className="w-full max-w-4xl mx-auto"
      style={{
        position: 'relative',
        background: 'rgba(0,0,0,0.55)',
        border: '2px solid rgba(61, 155, 255, 0.35)',
        borderRadius: 12,
        boxShadow: '0 12px 48px rgba(61, 155, 255, 0.12)'
      }}
    >
      <CardHeader>
        {/* Bouton fermeture (croix jaune) */}
        <button
          aria-label="Fermer"
          onClick={onCancel}
          className={cn(styles['card-button'])}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 10,
            borderColor: '#facc15',
            color: '#facc15',
            background: 'rgba(250,204,21,0.12)'
          }}
        >
          <X size={18} />
        </button>
        <CardTitle
          className="uppercase tracking-[0.12em] font-black"
          style={{
            background: 'linear-gradient(180deg, #3d9bff, #87ceeb, #5dbaff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 18px rgba(61, 155, 255, 0.35))'
          }}
        >
          {cohorte ? 'Modifier la cohorte' : 'Créer une nouvelle cohorte'}
        </CardTitle>
        <p className="mt-1 text-sm" style={{ color: '#87ceeb' }}>
          Renseignez les informations ci-dessous. Les champs marqués d’un * sont requis.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 🧱 Informations générales */}
          <h3 className="text-xl font-black uppercase tracking-[0.1em]" style={{ color: '#87ceeb' }}>🧱 Informations générales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <Label htmlFor="nom" className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Nom de la cohorte *</Label>
                    <Input
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Ex: BTS COM1 2024–2025"
                      className={errors.nom ? 'border-red-500' : ''}
                      style={commonInputStyle}
                    />
                    {errors.nom && <p className="text-sm text-red-500 mt-1">{errors.nom}</p>}
                  </div>

                  <div style={{ marginBottom: openSelects.annee ? 200 : 0 }}>
                    <Label htmlFor="anneeScolaire" className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Année scolaire *</Label>
                    <Select 
                      open={openSelects.annee}
                      onOpenChange={(o) => setOpenSelects((s) => ({ ...s, annee: o }))}
                      value={formData.anneeScolaire}
                      onValueChange={(value) => handleSelectChange('anneeScolaire', value)}
                    >
                      <SelectTrigger 
                        id="anneeScolaire"
                        className={`${errors.anneeScolaire ? 'border-red-500' : ''} h-14`}
                        style={{ background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(61,155,255,0.35)', color: '#87ceeb' }}
                      >
                        <SelectValue placeholder="Choisir l'année" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023-2024">2023-2024</SelectItem>
                        <SelectItem value="2024-2025">2024-2025</SelectItem>
                        <SelectItem value="2025-2026">2025-2026</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.anneeScolaire && <p className="text-sm text-red-500 mt-1">{errors.anneeScolaire}</p>}
                  </div>

                  <div style={{ marginBottom: openSelects.typeFormation ? 200 : 0 }}>
                    <Label htmlFor="typeFormation" className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Type de formation *</Label>
                    <Select 
                      open={openSelects.typeFormation}
                      onOpenChange={(o) => setOpenSelects((s) => ({ ...s, typeFormation: o }))}
                      value={formData.typeFormation} 
                      onValueChange={(value) => handleSelectChange('typeFormation', value)}
                    >
                      <SelectTrigger className="h-14" style={{ background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(61,155,255,0.35)', color: '#87ceeb' }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TypeFormation.BTS}>BTS</SelectItem>
                        <SelectItem value={TypeFormation.BACHELOR}>Bachelor</SelectItem>
                        <SelectItem value={TypeFormation.MASTERE}>Mastère</SelectItem>
                        <SelectItem value={TypeFormation.AUTRE}>Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="diplomeVise" className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Diplôme visé</Label>
                    <Input
                      id="diplomeVise"
                      name="diplomeVise"
                      value={formData.diplomeVise}
                      onChange={handleChange}
                      placeholder="Ex: BTS Communication"
                      className="w-full"
                      style={commonInputStyle}
                    />
                  </div>

                  <div>
                    <Label htmlFor="niveauRNCP" className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Niveau RNCP</Label>
                    <Input
                      id="niveauRNCP"
                      name="niveauRNCP"
                      value={formData.niveauRNCP}
                      onChange={handleChange}
                      placeholder="Ex: Niveau 5"
                      className="w-full"
                      style={commonInputStyle}
                    />
                  </div>

                  <div>
                    <Label htmlFor="etablissement" className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Établissement</Label>
                    <Input
                      id="etablissement"
                      name="etablissement"
                      value={formData.etablissement}
                      onChange={handleChange}
                      placeholder="Ex: École Supérieure de Commerce"
                      className="w-full"
                      style={commonInputStyle}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="formationAssociee" className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Formation associée</Label>
                    <Input
                      id="formationAssociee"
                      name="formationAssociee"
                      value={formData.formationAssociee}
                      onChange={handleChange}
                      placeholder="Ex: REF-FORM-001"
                      className="w-full"
                      style={commonInputStyle}
                    />
                  </div>
          </div>

          <Separator className="my-6" style={{ height: 2, background: 'linear-gradient(90deg, transparent, #3d9bff, transparent)' }} />
          <h3 className="text-xl font-black uppercase tracking-[0.1em]" style={{ color: '#87ceeb' }}>👥 Composition</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <Label htmlFor="nombreEtudiantsPrevu" className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Nombre d'étudiants prévu</Label>
                    <Input
                      id="nombreEtudiantsPrevu"
                      name="nombreEtudiantsPrevu"
                      type="number"
                      value={formData.nombreEtudiantsPrevu}
                      onChange={handleNumberChange}
                      min={0}
                      style={commonInputStyle}
                    />
                  </div>

                  <div>
                    <Label htmlFor="nombreEtudiantsInscrits" className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Nombre d'étudiants inscrits</Label>
                    <Input
                      id="nombreEtudiantsInscrits"
                      name="nombreEtudiantsInscrits"
                      type="number"
                      value={formData.nombreEtudiantsInscrits}
                      onChange={handleNumberChange}
                      min={0}
                      className={errors.nombreEtudiantsInscrits ? 'border-red-500' : ''}
                      style={commonInputStyle}
                    />
                    {errors.nombreEtudiantsInscrits && <p className="text-sm text-red-500 mt-1">{errors.nombreEtudiantsInscrits}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="responsablePedagogique" className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Responsable pédagogique</Label>
                    <Input
                      id="responsablePedagogique"
                      name="responsablePedagogique"
                      value={formData.responsablePedagogique}
                      onChange={handleChange}
                      placeholder="Ex: professeur@ecole.fr"
                      style={commonInputStyle}
                    />
                  </div>
                </div>

          <Separator className="my-6" style={{ height: 2, background: 'linear-gradient(90deg, transparent, #87ceeb, transparent)' }} />
          <h3 className="text-xl font-black uppercase tracking-[0.1em]" style={{ color: '#87ceeb' }}>📅 Organisation et planification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <Label htmlFor="dateDebut" className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Date de début *</Label>
                    <Input
                      id="dateDebut"
                      name="dateDebut"
                      type="date"
                      value={formData.dateDebut}
                      onChange={handleChange}
                      className={errors.dateDebut ? 'border-red-500' : ''}
                      style={commonInputStyle}
                    />
                    {errors.dateDebut && <p className="text-sm text-red-500 mt-1">{errors.dateDebut}</p>}
                  </div>

                  <div>
                    <Label htmlFor="dateFin" className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Date de fin *</Label>
                    <Input
                      id="dateFin"
                      name="dateFin"
                      type="date"
                      value={formData.dateFin}
                      onChange={handleChange}
                      className={errors.dateFin ? 'border-red-500' : ''}
                      style={commonInputStyle}
                    />
                    {errors.dateFin && <p className="text-sm text-red-500 mt-1">{errors.dateFin}</p>}
                  </div>

                  <div>
                    <Label htmlFor="volumeHoraireTotal" className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Volume horaire total</Label>
                    <Input
                      id="volumeHoraireTotal"
                      name="volumeHoraireTotal"
                      type="number"
                      value={formData.volumeHoraireTotal}
                      onChange={handleNumberChange}
                      min={0}
                      style={commonInputStyle}
                    />
                  </div>
                </div>

          <Separator className="my-6" style={{ height: 2, background: 'linear-gradient(90deg, transparent, #5dbaff, transparent)' }} />
          <h3 className="text-xl font-black uppercase tracking-[0.1em]" style={{ color: '#87ceeb' }}>📂 Structure pédagogique</h3>
          <div className="space-y-4">
                  <div>
                    <Label className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Matières</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Ajouter une matière"
                        value={newItemValue.matieres}
                        onChange={(e) => setNewItemValue({ ...newItemValue, matieres: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addToList('matieres');
                          }
                        }}
                        style={commonInputStyle}
                      />
                      <Button type="button" onClick={() => addToList('matieres')} size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.matieres.map((matiere, index) => (
                        <Chip 
                          key={index} 
                          variant="secondary" 
                          className="text-sm"
                          onDelete={() => removeFromList('matieres', index)}
                        >
                          {matiere}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Modules</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Ajouter un module"
                        value={newItemValue.modules}
                        onChange={(e) => setNewItemValue({ ...newItemValue, modules: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addToList('modules');
                          }
                        }}
                        style={commonInputStyle}
                      />
                      <Button type="button" onClick={() => addToList('modules')} size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.modules.map((module, index) => (
                        <Chip 
                          key={index} 
                          variant="outline" 
                          className="text-sm"
                          onDelete={() => removeFromList('modules', index)}
                        >
                          {module}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="progressionPedagogique" className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Progression pédagogique</Label>
                    <Textarea
                      id="progressionPedagogique"
                      name="progressionPedagogique"
                      value={formData.progressionPedagogique}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Description de la progression pédagogique..."
                    />
                  </div>
                </div>

          <Separator className="my-6" style={{ height: 2, background: 'linear-gradient(90deg, transparent, #ff6b6b, transparent)' }} />
          <h3 className="text-xl font-black uppercase tracking-[0.1em]" style={{ color: '#87ceeb' }}>🔍 Suivi administratif et financier</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div style={{ marginBottom: openSelects.statut ? 200 : 0 }}>
                    <Label htmlFor="statut" className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Statut</Label>
                    <Select open={openSelects.statut} onOpenChange={(o) => setOpenSelects((s) => ({ ...s, statut: o }))} value={formData.statut} onValueChange={(value) => handleSelectChange('statut', value)}>
                      <SelectTrigger className="h-14" style={{ background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(61,155,255,0.35)', color: '#87ceeb' }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={StatutCohorte.EN_PREPARATION}>En préparation</SelectItem>
                        <SelectItem value={StatutCohorte.ACTIVE}>Active</SelectItem>
                        <SelectItem value={StatutCohorte.CLOTUREE}>Clôturée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="nombreEtudiantsFinances" className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Nombre d'étudiants financés</Label>
                    <Input
                      id="nombreEtudiantsFinances"
                      name="nombreEtudiantsFinances"
                      type="number"
                      value={formData.nombreEtudiantsFinances}
                      onChange={handleNumberChange}
                      min={0}
                      style={commonInputStyle}
                    />
                  </div>

                  <div>
                    <Label htmlFor="nombreEtudiantsAutofinances" className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Nombre d'étudiants autofinancés</Label>
                    <Input
                      id="nombreEtudiantsAutofinances"
                      name="nombreEtudiantsAutofinances"
                      type="number"
                      value={formData.nombreEtudiantsAutofinances}
                      onChange={handleNumberChange}
                      min={0}
                      style={commonInputStyle}
                    />
                  </div>

                  <div>
                    <Label htmlFor="montantTotalFacture" className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Montant total facturé (€)</Label>
                    <Input
                      id="montantTotalFacture"
                      name="montantTotalFacture"
                      type="number"
                      value={formData.montantTotalFacture}
                      onChange={handleNumberChange}
                      min={0}
                      style={commonInputStyle}
                    />
                  </div>

                  <div style={{ marginBottom: openSelects.typeFinanceur ? 200 : 0 }}>
                    <Label htmlFor="typeFinanceur" className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Type de financeur</Label>
                    <Select open={openSelects.typeFinanceur} onOpenChange={(o) => setOpenSelects((s) => ({ ...s, typeFinanceur: o }))} value={formData.typeFinanceur} onValueChange={(value) => handleSelectChange('typeFinanceur', value)}>
                      <SelectTrigger className="h-14" style={{ background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(61,155,255,0.35)', color: '#87ceeb' }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TypeFinancement.OPCO}>OPCO</SelectItem>
                        <SelectItem value={TypeFinancement.ECOLE}>École</SelectItem>
                        <SelectItem value={TypeFinancement.ENTREPRISE}>Entreprise</SelectItem>
                        <SelectItem value={TypeFinancement.AUTO_FINANCE}>Autofinancé</SelectItem>
                        <SelectItem value={TypeFinancement.AUTRE}>Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="nomFinanceur" className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Nom du financeur</Label>
                    <Input
                      id="nomFinanceur"
                      name="nomFinanceur"
                      value={formData.nomFinanceur}
                      onChange={handleChange}
                      placeholder="Ex: OPCO EP"
                      style={commonInputStyle}
                    />
                  </div>
                </div>

          <Separator className="my-6" style={{ height: 2, background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
          <h3 className="text-xl font-black uppercase tracking-[0.1em]" style={{ color: '#87ceeb' }}>🧾 Métadonnées et traçabilité</h3>
          <div className="space-y-4">
                  <div>
                    <Label htmlFor="commentairesInternes" className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Commentaires internes</Label>
                    <Textarea
                      id="commentairesInternes"
                      name="commentairesInternes"
                      value={formData.commentairesInternes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Notes internes sur la cohorte..."
                    />
                  </div>

                  <div>
                    <Label className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Tags</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Ajouter un tag"
                        value={newItemValue.tags}
                        onChange={(e) => setNewItemValue({ ...newItemValue, tags: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addToList('tags');
                          }
                        }}
                        style={commonInputStyle}
                      />
                      <Button type="button" onClick={() => addToList('tags')} size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, index) => (
                        <Chip 
                          key={index} 
                          variant="default" 
                          className="text-sm"
                          onDelete={() => removeFromList('tags', index)}
                        >
                          {tag}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="font-semibold tracking-wide" style={{ color: '#87ceeb' }}>Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Description générale de la cohorte..."
                    />
                  </div>
                </div>

          <div className="flex items-center justify-between pt-6">
            <div>
              {cohorte && onDeleteCohorte && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onDeleteCohorte(cohorte._id)}
                  disabled={isLoading}
                  className={cn(styles['card-button'])}
                  style={{
                    borderColor: '#ef4444',
                    color: '#ef4444',
                    background: 'rgba(239,68,68,0.12)'
                  }}
                >
                  Supprimer la cohorte
                </Button>
              )}
            </div>
            <div className={cn(styles['card-button-group'])}>
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isLoading}
                className={cn(styles['card-button'], styles['card-button-primary'])}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                variant="ghost"
                className={cn(styles['card-button'], styles['card-button-primary'])}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Enregistrement...' : cohorte ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
