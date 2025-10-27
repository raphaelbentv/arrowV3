import React, { useState } from 'react';
const AddIntervenant = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    photo: '',
    email: '',
    telephone: '',
    adresse: '',
    dateNaissance: '',
    poste: '',
    statut: '',
    experience: '',
    domainesExpertise: '',
    diplomes: '',
    cv: '',
    typeContrat: '',
    dateDebutMission: '',
    dateFinMission: '',
    tarification: '',
    heuresPrevues: '',
    rib: '',
    clauses: '',
    modulesEnseignes: '',
    heuresParModule: '',
    niveauEtudiants: '',
    supportsPedagogiques: '',
    methodesPedagogiques: '',
    pieceIdentite: '',
    numeroSiret: '',
    assuranceRC: '',
    extraitKbis: '',
    justificatifsDiplomes: '',
    conventionContrat: '',
    attestationURSSAF: '',
    appreciationsEtudiants: '',
    feedbackResponsables: '',
    pointsAmelioration: '',
    disponibilites: '',
    engagement: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/intervenants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Intervenant ajouté avec succès');
        // Réinitialiser le formulaire ou rediriger l'utilisateur
      } else {
        alert('Erreur lors de l\'ajout de l\'intervenant');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout de l\'intervenant');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Ajouter un Intervenant</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Informations Générales */}
          <Grid item xs={12}>
            <Typography variant="h6">Informations Générales</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Prénom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Téléphone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date de Naissance"
              name="dateNaissance"
              type="date"
              value={formData.dateNaissance}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Photo"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
            />
          </Grid>

          {/* Informations Professionnelles */}
          <Grid item xs={12}>
            <Typography variant="h6">Informations Professionnelles</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Poste"
              name="poste"
              value={formData.poste}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Statut"
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Expérience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Domaines d'Expertise"
              name="domainesExpertise"
              value={formData.domainesExpertise}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Diplômes"
              name="diplomes"
              value={formData.diplomes}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="CV"
              name="cv"
              value={formData.cv}
              onChange={handleChange}
            />
          </Grid>

          {/* Données Contractuelles */}
          <Grid item xs={12}>
            <Typography variant="h6">Données Contractuelles</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Type de Contrat"
              name="typeContrat"
              value={formData.typeContrat}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date Début Mission"
              name="dateDebutMission"
              type="date"
              value={formData.dateDebutMission}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date Fin Mission"
              name="dateFinMission"
              type="date"
              value={formData.dateFinMission}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tarification"
              name="tarification"
              value={formData.tarification}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Heures Prévues"
              name="heuresPrevues"
              type="number"
              value={formData.heuresPrevues}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="RIB"
              name="rib"
              value={formData.rib}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Clauses"
              name="clauses"
              value={formData.clauses}
              onChange={handleChange}
            />
          </Grid>

          {/* Informations Pédagogiques */}
          <Grid item xs={12}>
            <Typography variant="h6">Informations Pédagogiques</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Modules Enseignés"
              name="modulesEnseignes"
              value={formData.modulesEnseignes}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Heures par Module"
              name="heuresParModule"
              type="number"
              value={formData.heuresParModule}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Niveau Étudiants"
              name="niveauEtudiants"
              value={formData.niveauEtudiants}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Supports Pédagogiques"
              name="supportsPedagogiques"
              value={formData.supportsPedagogiques}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Méthodes Pédagogiques"
              name="methodesPedagogiques"
              value={formData.methodesPedagogiques}
              onChange={handleChange}
            />
          </Grid>

          {/* Documents Administratifs */}
          <Grid item xs={12}>
            <Typography variant="h6">Documents Administratifs</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Pièce d'Identité"
              name="pieceIdentite"
              value={formData.pieceIdentite}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Numéro SIRET"
              name="numeroSiret"
              value={formData.numeroSiret}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Assurance RC"
              name="assuranceRC"
              value={formData.assuranceRC}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Extrait Kbis"
              name="extraitKbis"
              value={formData.extraitKbis}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Justificatifs Diplômes"
              name="justificatifsDiplomes"
              value={formData.justificatifsDiplomes}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Convention Contrat"
              name="conventionContrat"
              value={formData.conventionContrat}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Attestation URSSAF"
              name="attestationURSSAF"
              value={formData.attestationURSSAF}
              onChange={handleChange}
            />
          </Grid>

          {/* Suivi et Évaluation */}
          <Grid item xs={12}>
            <Typography variant="h6">Suivi et Évaluation</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Appréciations Étudiants"
              name="appreciationsEtudiants"
              value={formData.appreciationsEtudiants}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Feedback Responsables"
              name="feedbackResponsables"
              value={formData.feedbackResponsables}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Points d'Amélioration"
              name="pointsAmelioration"
              value={formData.pointsAmelioration}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Disponibilités"
              name="disponibilites"
              value={formData.disponibilites}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Engagement"
              name="engagement"
              value={formData.engagement}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Ajouter
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddIntervenant; 