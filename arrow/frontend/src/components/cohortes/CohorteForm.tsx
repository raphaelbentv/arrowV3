import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Chip } from '@/components/ui/chip';
import { Plus, Loader2 } from 'lucide-react';
import { CohorteFormData, CreateCohorteDto, Cohorte, TypeFormation, StatutCohorte, TypeFinancement } from '../../types/cohorte';

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
}

export const CohorteForm: React.FC<CohorteFormProps> = ({
  cohorte,
  onSubmit,
  onCancel,
  isLoading = false,
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
        nombreEtudiantsPrevu: cohorte.nombreEtudiantsPrevu,
        nombreEtudiantsInscrits: cohorte.nombreEtudiantsInscrits,
        responsablePedagogique: cohorte.responsablePedagogique || '',

        // Organisation
        dateDebut: cohorte.dateDebut.split('T')[0],
        dateFin: cohorte.dateFin.split('T')[0],
        volumeHoraireTotal: cohorte.volumeHoraireTotal,

        // Structure pédagogique
        matieres: cohorte.matieres || [],
        modules: cohorte.modules || [],
        progressionPedagogique: cohorte.progressionPedagogique || '',

        // Suivi administratif
        statut: cohorte.statut,
        nombreEtudiantsFinances: cohorte.nombreEtudiantsFinances,
        nombreEtudiantsAutofinances: cohorte.nombreEtudiantsAutofinances,
        montantTotalFacture: cohorte.montantTotalFacture,
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
      // Transformer les données du formulaire pour correspondre au DTO du backend
      const createData: CreateCohorteDto = {
        // Informations générales
        nom: formData.nom,
        anneeScolaire: formData.anneeScolaire,
        typeFormation: formData.typeFormation,
        diplomeVise: formData.diplomeVise || undefined,
        niveauRNCP: formData.niveauRNCP || undefined,
        etablissement: formData.etablissement || undefined,
        formationAssociee: formData.formationAssociee || undefined,

        // Composition
        nombreEtudiantsPrevu: formData.nombreEtudiantsPrevu || undefined,
        nombreEtudiantsInscrits: formData.nombreEtudiantsInscrits || undefined,
        responsablePedagogique: formData.responsablePedagogique || undefined,

        // Organisation
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin,
        volumeHoraireTotal: formData.volumeHoraireTotal || undefined,

        // Structure pédagogique
        matieres: formData.matieres.length > 0 ? formData.matieres : undefined,
        modules: formData.modules.length > 0 ? formData.modules : undefined,
        progressionPedagogique: formData.progressionPedagogique || undefined,

        // Suivi administratif
        statut: formData.statut,
        nombreEtudiantsFinances: formData.nombreEtudiantsFinances || undefined,
        nombreEtudiantsAutofinances: formData.nombreEtudiantsAutofinances || undefined,
        montantTotalFacture: formData.montantTotalFacture || undefined,
        typeFinanceur: formData.typeFinanceur || undefined,
        nomFinanceur: formData.nomFinanceur || undefined,

        // Métadonnées
        creePar: 'admin@dev.com', // En DEV_MODE, utiliser l'email de l'admin
        commentairesInternes: formData.commentairesInternes || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,

        // Champs legacy
        description: formData.description || undefined,
        actif: true,
      };

      await onSubmit(createData);
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {cohorte ? 'Modifier la cohorte' : 'Créer une nouvelle cohorte'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 🧱 Informations générales */}
          <Accordion defaultValue="general">
            <AccordionItem value="general">
              <AccordionTrigger>🧱 Informations générales</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nom">Nom de la cohorte *</Label>
                    <Input
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Ex: BTS COM1 2024–2025"
                      className={errors.nom ? 'border-red-500' : ''}
                    />
                    {errors.nom && <p className="text-sm text-red-500 mt-1">{errors.nom}</p>}
                  </div>

                  <div>
                    <Label htmlFor="anneeScolaire">Année scolaire *</Label>
                    <Input
                      id="anneeScolaire"
                      name="anneeScolaire"
                      value={formData.anneeScolaire}
                      onChange={handleChange}
                      placeholder="Ex: 2024-2025"
                      className={errors.anneeScolaire ? 'border-red-500' : ''}
                    />
                    {errors.anneeScolaire && <p className="text-sm text-red-500 mt-1">{errors.anneeScolaire}</p>}
                  </div>

                  <div>
                    <Label htmlFor="typeFormation">Type de formation *</Label>
                    <Select 
                      value={formData.typeFormation} 
                      onValueChange={(value) => handleSelectChange('typeFormation', value)}
                    >
                      <SelectTrigger>
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
                    <Label htmlFor="diplomeVise">Diplôme visé</Label>
                    <Input
                      id="diplomeVise"
                      name="diplomeVise"
                      value={formData.diplomeVise}
                      onChange={handleChange}
                      placeholder="Ex: BTS Communication"
                    />
                  </div>

                  <div>
                    <Label htmlFor="niveauRNCP">Niveau RNCP</Label>
                    <Input
                      id="niveauRNCP"
                      name="niveauRNCP"
                      value={formData.niveauRNCP}
                      onChange={handleChange}
                      placeholder="Ex: Niveau 5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="etablissement">Établissement</Label>
                    <Input
                      id="etablissement"
                      name="etablissement"
                      value={formData.etablissement}
                      onChange={handleChange}
                      placeholder="Ex: École Supérieure de Commerce"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="formationAssociee">Formation associée</Label>
                    <Input
                      id="formationAssociee"
                      name="formationAssociee"
                      value={formData.formationAssociee}
                      onChange={handleChange}
                      placeholder="Ex: REF-FORM-001"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 👥 Composition */}
            <AccordionItem value="composition">
              <AccordionTrigger>👥 Composition</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombreEtudiantsPrevu">Nombre d'étudiants prévu</Label>
                    <Input
                      id="nombreEtudiantsPrevu"
                      name="nombreEtudiantsPrevu"
                      type="number"
                      value={formData.nombreEtudiantsPrevu}
                      onChange={handleNumberChange}
                      min={0}
                    />
                  </div>

                  <div>
                    <Label htmlFor="nombreEtudiantsInscrits">Nombre d'étudiants inscrits</Label>
                    <Input
                      id="nombreEtudiantsInscrits"
                      name="nombreEtudiantsInscrits"
                      type="number"
                      value={formData.nombreEtudiantsInscrits}
                      onChange={handleNumberChange}
                      min={0}
                      className={errors.nombreEtudiantsInscrits ? 'border-red-500' : ''}
                    />
                    {errors.nombreEtudiantsInscrits && <p className="text-sm text-red-500 mt-1">{errors.nombreEtudiantsInscrits}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="responsablePedagogique">Responsable pédagogique</Label>
                    <Input
                      id="responsablePedagogique"
                      name="responsablePedagogique"
                      value={formData.responsablePedagogique}
                      onChange={handleChange}
                      placeholder="Ex: professeur@ecole.fr"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 📅 Organisation et planification */}
            <AccordionItem value="organisation">
              <AccordionTrigger>📅 Organisation et planification</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateDebut">Date de début *</Label>
                    <Input
                      id="dateDebut"
                      name="dateDebut"
                      type="date"
                      value={formData.dateDebut}
                      onChange={handleChange}
                      className={errors.dateDebut ? 'border-red-500' : ''}
                    />
                    {errors.dateDebut && <p className="text-sm text-red-500 mt-1">{errors.dateDebut}</p>}
                  </div>

                  <div>
                    <Label htmlFor="dateFin">Date de fin *</Label>
                    <Input
                      id="dateFin"
                      name="dateFin"
                      type="date"
                      value={formData.dateFin}
                      onChange={handleChange}
                      className={errors.dateFin ? 'border-red-500' : ''}
                    />
                    {errors.dateFin && <p className="text-sm text-red-500 mt-1">{errors.dateFin}</p>}
                  </div>

                  <div>
                    <Label htmlFor="volumeHoraireTotal">Volume horaire total</Label>
                    <Input
                      id="volumeHoraireTotal"
                      name="volumeHoraireTotal"
                      type="number"
                      value={formData.volumeHoraireTotal}
                      onChange={handleNumberChange}
                      min={0}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 📂 Structure pédagogique */}
            <AccordionItem value="pedagogie">
              <AccordionTrigger>📂 Structure pédagogique</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <Label>Matières</Label>
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
                    <Label>Modules</Label>
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
                    <Label htmlFor="progressionPedagogique">Progression pédagogique</Label>
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
              </AccordionContent>
            </AccordionItem>

            {/* 🔍 Suivi administratif et financier */}
            <AccordionItem value="admin">
              <AccordionTrigger>🔍 Suivi administratif et financier</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="statut">Statut</Label>
                    <Select value={formData.statut} onValueChange={(value) => handleSelectChange('statut', value)}>
                      <SelectTrigger>
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
                    <Label htmlFor="nombreEtudiantsFinances">Nombre d'étudiants financés</Label>
                    <Input
                      id="nombreEtudiantsFinances"
                      name="nombreEtudiantsFinances"
                      type="number"
                      value={formData.nombreEtudiantsFinances}
                      onChange={handleNumberChange}
                      min={0}
                    />
                  </div>

                  <div>
                    <Label htmlFor="nombreEtudiantsAutofinances">Nombre d'étudiants autofinancés</Label>
                    <Input
                      id="nombreEtudiantsAutofinances"
                      name="nombreEtudiantsAutofinances"
                      type="number"
                      value={formData.nombreEtudiantsAutofinances}
                      onChange={handleNumberChange}
                      min={0}
                    />
                  </div>

                  <div>
                    <Label htmlFor="montantTotalFacture">Montant total facturé (€)</Label>
                    <Input
                      id="montantTotalFacture"
                      name="montantTotalFacture"
                      type="number"
                      value={formData.montantTotalFacture}
                      onChange={handleNumberChange}
                      min={0}
                    />
                  </div>

                  <div>
                    <Label htmlFor="typeFinanceur">Type de financeur</Label>
                    <Select value={formData.typeFinanceur} onValueChange={(value) => handleSelectChange('typeFinanceur', value)}>
                      <SelectTrigger>
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
                    <Label htmlFor="nomFinanceur">Nom du financeur</Label>
                    <Input
                      id="nomFinanceur"
                      name="nomFinanceur"
                      value={formData.nomFinanceur}
                      onChange={handleChange}
                      placeholder="Ex: OPCO EP"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 🧾 Métadonnées et traçabilité */}
            <AccordionItem value="metadata">
              <AccordionTrigger>🧾 Métadonnées et traçabilité</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="commentairesInternes">Commentaires internes</Label>
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
                    <Label>Tags</Label>
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
                    <Label htmlFor="description">Description</Label>
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Enregistrement...' : cohorte ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
