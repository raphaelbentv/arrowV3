import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Chip } from '@/components/ui/chip';
import { Typography } from '@/components/ui/typography';
import { Plus, Loader2 } from 'lucide-react';
import { CohorteFormData, CreateCohorteDto, UpdateCohorteDto, Cohorte, TypeFormation, StatutCohorte, TypeFinancement } from '../../types/cohorte';

interface CohorteFormProps {
  cohorte?: Cohorte;
  onSubmit: (data: CreateCohorteDto | UpdateCohorteDto) => Promise<void>;
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

  useEffect(() => {
    if (cohorte) {
      setFormData({
        // Informations générales
        nom: cohorte.nom,
        anneeScolaire: cohorte.anneeScolaire,
        typeFormation: cohorte.typeFormation,
        diplomeVise: cohorte.diplomeVise || '',
        niveauRNCP: cohorte.niveauRNCP || '',
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

  const handleSelectChange = (e: SelectChangeEvent) => {
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

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const addToList = (listName: 'matieres' | 'modules' | 'tags', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [listName]: [...prev[listName], value.trim()]
      }));
    }
  };

  const removeFromList = (listName: 'matieres' | 'modules' | 'tags', index: number) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index)
    }));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>
          {cohorte ? 'Modifier la cohorte' : 'Créer une nouvelle cohorte'}
        </Typography>

        {/* 🧱 Informations générales */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">🧱 Informations générales</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom de la cohorte"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  error={!!errors.nom}
                  helperText={errors.nom}
                  placeholder="Ex: BTS COM1 2024–2025"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Année scolaire"
                  name="anneeScolaire"
                  value={formData.anneeScolaire}
                  onChange={handleChange}
                  error={!!errors.anneeScolaire}
                  helperText={errors.anneeScolaire}
                  placeholder="Ex: 2024-2025"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Type de formation</InputLabel>
                  <Select
                    name="typeFormation"
                    value={formData.typeFormation}
                    onChange={handleSelectChange}
                    label="Type de formation"
                  >
                    <MenuItem value={TypeFormation.BTS}>BTS</MenuItem>
                    <MenuItem value={TypeFormation.BACHELOR}>Bachelor</MenuItem>
                    <MenuItem value={TypeFormation.MASTERE}>Mastère</MenuItem>
                    <MenuItem value={TypeFormation.AUTRE}>Autre</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Diplôme visé"
                  name="diplomeVise"
                  value={formData.diplomeVise}
                  onChange={handleChange}
                  placeholder="Ex: BTS Communication"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Niveau RNCP"
                  name="niveauRNCP"
                  value={formData.niveauRNCP}
                  onChange={handleChange}
                  placeholder="Ex: Niveau 5"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Établissement"
                  name="etablissement"
                  value={formData.etablissement}
                  onChange={handleChange}
                  placeholder="Ex: École Supérieure de Commerce"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Formation associée"
                  name="formationAssociee"
                  value={formData.formationAssociee}
                  onChange={handleChange}
                  placeholder="Ex: REF-FORM-001"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* 👥 Composition */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">👥 Composition</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre d'étudiants prévu"
                  name="nombreEtudiantsPrevu"
                  type="number"
                  value={formData.nombreEtudiantsPrevu}
                  onChange={handleNumberChange}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre d'étudiants inscrits"
                  name="nombreEtudiantsInscrits"
                  type="number"
                  value={formData.nombreEtudiantsInscrits}
                  onChange={handleNumberChange}
                  error={!!errors.nombreEtudiantsInscrits}
                  helperText={errors.nombreEtudiantsInscrits}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Responsable pédagogique"
                  name="responsablePedagogique"
                  value={formData.responsablePedagogique}
                  onChange={handleChange}
                  placeholder="Ex: professeur@ecole.fr"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* 📅 Organisation et planification */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">📅 Organisation et planification</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date de début"
                  name="dateDebut"
                  type="date"
                  value={formData.dateDebut}
                  onChange={handleChange}
                  error={!!errors.dateDebut}
                  helperText={errors.dateDebut}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date de fin"
                  name="dateFin"
                  type="date"
                  value={formData.dateFin}
                  onChange={handleChange}
                  error={!!errors.dateFin}
                  helperText={errors.dateFin}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Volume horaire total"
                  name="volumeHoraireTotal"
                  type="number"
                  value={formData.volumeHoraireTotal}
                  onChange={handleNumberChange}
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* 📂 Structure pédagogique */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">📂 Structure pédagogique</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Matières</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Ajouter une matière"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToList('matieres', (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).parentElement?.querySelector('input');
                      if (input) {
                        addToList('matieres', input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Ajouter
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.matieres.map((matiere, index) => (
                    <Chip
                      key={index}
                      label={matiere}
                      onDelete={() => removeFromList('matieres', index)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Modules</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Ajouter un module"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToList('modules', (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).parentElement?.querySelector('input');
                      if (input) {
                        addToList('modules', input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Ajouter
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.modules.map((module, index) => (
                    <Chip
                      key={index}
                      label={module}
                      onDelete={() => removeFromList('modules', index)}
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Progression pédagogique"
                  name="progressionPedagogique"
                  value={formData.progressionPedagogique}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  placeholder="Description de la progression pédagogique..."
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* 🔍 Suivi administratif et financier */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">🔍 Suivi administratif et financier</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Statut</InputLabel>
                  <Select
                    name="statut"
                    value={formData.statut}
                    onChange={handleSelectChange}
                    label="Statut"
                  >
                    <MenuItem value={StatutCohorte.EN_PREPARATION}>En préparation</MenuItem>
                    <MenuItem value={StatutCohorte.ACTIVE}>Active</MenuItem>
                    <MenuItem value={StatutCohorte.CLOTUREE}>Clôturée</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre d'étudiants financés"
                  name="nombreEtudiantsFinances"
                  type="number"
                  value={formData.nombreEtudiantsFinances}
                  onChange={handleNumberChange}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre d'étudiants autofinancés"
                  name="nombreEtudiantsAutofinances"
                  type="number"
                  value={formData.nombreEtudiantsAutofinances}
                  onChange={handleNumberChange}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Montant total facturé (€)"
                  name="montantTotalFacture"
                  type="number"
                  value={formData.montantTotalFacture}
                  onChange={handleNumberChange}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type de financeur</InputLabel>
                  <Select
                    name="typeFinanceur"
                    value={formData.typeFinanceur}
                    onChange={handleSelectChange}
                    label="Type de financeur"
                  >
                    <MenuItem value={TypeFinancement.OPCO}>OPCO</MenuItem>
                    <MenuItem value={TypeFinancement.ECOLE}>École</MenuItem>
                    <MenuItem value={TypeFinancement.ENTREPRISE}>Entreprise</MenuItem>
                    <MenuItem value={TypeFinancement.AUTO_FINANCE}>Autofinancé</MenuItem>
                    <MenuItem value={TypeFinancement.AUTRE}>Autre</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom du financeur"
                  name="nomFinanceur"
                  value={formData.nomFinanceur}
                  onChange={handleChange}
                  placeholder="Ex: OPCO EP"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* 🧾 Métadonnées et traçabilité */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">🧾 Métadonnées et traçabilité</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Commentaires internes"
                  name="commentairesInternes"
                  value={formData.commentairesInternes}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  placeholder="Notes internes sur la cohorte..."
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Tags</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Ajouter un tag"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToList('tags', (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).parentElement?.querySelector('input');
                      if (input) {
                        addToList('tags', input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Ajouter
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => removeFromList('tags', index)}
                      color="default"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  placeholder="Description générale de la cohorte..."
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? 'Enregistrement...' : cohorte ? 'Modifier' : 'Créer'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};
