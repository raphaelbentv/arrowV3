import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';

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
    <div className="container mx-auto p-6">
      <Typography variant="h1" className="mb-4">Ajouter un Intervenant</Typography>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Informations Générales */}
          <div className="col-span-2">
            <Typography variant="h2" className="mt-8 mb-2">Informations Générales</Typography>
            <Separator className="mb-4" />
          </div>
          
          <div>
            <Label htmlFor="nom">Nom *</Label>
            <Input
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="prenom">Prénom *</Label>
            <Input
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="telephone">Téléphone *</Label>
            <Input
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="adresse">Adresse</Label>
            <Input
              id="adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="dateNaissance">Date de Naissance</Label>
            <Input
              id="dateNaissance"
              name="dateNaissance"
              type="date"
              value={formData.dateNaissance}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="photo">Photo</Label>
            <Input
              id="photo"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
            />
          </div>

          {/* Informations Professionnelles */}
          <div className="col-span-2">
            <Typography variant="h2" className="mt-8 mb-2">Informations Professionnelles</Typography>
            <Separator className="mb-4" />
          </div>
          
          <div>
            <Label htmlFor="poste">Poste *</Label>
            <Input
              id="poste"
              name="poste"
              value={formData.poste}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="statut">Statut *</Label>
            <Input
              id="statut"
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="experience">Expérience</Label>
            <Input
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="domainesExpertise">Domaines d'Expertise</Label>
            <Input
              id="domainesExpertise"
              name="domainesExpertise"
              value={formData.domainesExpertise}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="diplomes">Diplômes</Label>
            <Input
              id="diplomes"
              name="diplomes"
              value={formData.diplomes}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="cv">CV</Label>
            <Input
              id="cv"
              name="cv"
              value={formData.cv}
              onChange={handleChange}
            />
          </div>

          {/* Données Contractuelles */}
          <div className="col-span-2">
            <Typography variant="h2" className="mt-8 mb-2">Données Contractuelles</Typography>
            <Separator className="mb-4" />
          </div>
          
          <div>
            <Label htmlFor="typeContrat">Type de Contrat *</Label>
            <Input
              id="typeContrat"
              name="typeContrat"
              value={formData.typeContrat}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="dateDebutMission">Date Début Mission</Label>
            <Input
              id="dateDebutMission"
              name="dateDebutMission"
              type="date"
              value={formData.dateDebutMission}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="dateFinMission">Date Fin Mission</Label>
            <Input
              id="dateFinMission"
              name="dateFinMission"
              type="date"
              value={formData.dateFinMission}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="tarification">Tarification</Label>
            <Input
              id="tarification"
              name="tarification"
              value={formData.tarification}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="heuresPrevues">Heures Prévues</Label>
            <Input
              id="heuresPrevues"
              name="heuresPrevues"
              type="number"
              value={formData.heuresPrevues}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="rib">RIB</Label>
            <Input
              id="rib"
              name="rib"
              value={formData.rib}
              onChange={handleChange}
            />
          </div>
          
          <div className="col-span-2">
            <Label htmlFor="clauses">Clauses</Label>
            <Input
              id="clauses"
              name="clauses"
              value={formData.clauses}
              onChange={handleChange}
            />
          </div>

          {/* Informations Pédagogiques */}
          <div className="col-span-2">
            <Typography variant="h2" className="mt-8 mb-2">Informations Pédagogiques</Typography>
            <Separator className="mb-4" />
          </div>
          
          <div>
            <Label htmlFor="modulesEnseignes">Modules Enseignés</Label>
            <Input
              id="modulesEnseignes"
              name="modulesEnseignes"
              value={formData.modulesEnseignes}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="heuresParModule">Heures par Module</Label>
            <Input
              id="heuresParModule"
              name="heuresParModule"
              type="number"
              value={formData.heuresParModule}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="niveauEtudiants">Niveau Étudiants</Label>
            <Input
              id="niveauEtudiants"
              name="niveauEtudiants"
              value={formData.niveauEtudiants}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="supportsPedagogiques">Supports Pédagogiques</Label>
            <Input
              id="supportsPedagogiques"
              name="supportsPedagogiques"
              value={formData.supportsPedagogiques}
              onChange={handleChange}
            />
          </div>
          
          <div className="col-span-2">
            <Label htmlFor="methodesPedagogiques">Méthodes Pédagogiques</Label>
            <Input
              id="methodesPedagogiques"
              name="methodesPedagogiques"
              value={formData.methodesPedagogiques}
              onChange={handleChange}
            />
          </div>

          {/* Documents Administratifs */}
          <div className="col-span-2">
            <Typography variant="h2" className="mt-8 mb-2">Documents Administratifs</Typography>
            <Separator className="mb-4" />
          </div>
          
          <div>
            <Label htmlFor="pieceIdentite">Pièce d'Identité</Label>
            <Input
              id="pieceIdentite"
              name="pieceIdentite"
              value={formData.pieceIdentite}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="numeroSiret">Numéro SIRET</Label>
            <Input
              id="numeroSiret"
              name="numeroSiret"
              value={formData.numeroSiret}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="assuranceRC">Assurance RC</Label>
            <Input
              id="assuranceRC"
              name="assuranceRC"
              value={formData.assuranceRC}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="extraitKbis">Extrait Kbis</Label>
            <Input
              id="extraitKbis"
              name="extraitKbis"
              value={formData.extraitKbis}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="justificatifsDiplomes">Justificatifs Diplômes</Label>
            <Input
              id="justificatifsDiplomes"
              name="justificatifsDiplomes"
              value={formData.justificatifsDiplomes}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="conventionContrat">Convention Contrat</Label>
            <Input
              id="conventionContrat"
              name="conventionContrat"
              value={formData.conventionContrat}
              onChange={handleChange}
            />
          </div>
          
          <div className="col-span-2">
            <Label htmlFor="attestationURSSAF">Attestation URSSAF</Label>
            <Input
              id="attestationURSSAF"
              name="attestationURSSAF"
              value={formData.attestationURSSAF}
              onChange={handleChange}
            />
          </div>

          {/* Suivi et Évaluation */}
          <div className="col-span-2">
            <Typography variant="h2" className="mt-8 mb-2">Suivi et Évaluation</Typography>
            <Separator className="mb-4" />
          </div>
          
          <div>
            <Label htmlFor="appreciationsEtudiants">Appréciations Étudiants</Label>
            <Input
              id="appreciationsEtudiants"
              name="appreciationsEtudiants"
              value={formData.appreciationsEtudiants}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="feedbackResponsables">Feedback Responsables</Label>
            <Input
              id="feedbackResponsables"
              name="feedbackResponsables"
              value={formData.feedbackResponsables}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="pointsAmelioration">Points d'Amélioration</Label>
            <Input
              id="pointsAmelioration"
              name="pointsAmelioration"
              value={formData.pointsAmelioration}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="disponibilites">Disponibilités</Label>
            <Input
              id="disponibilites"
              name="disponibilites"
              value={formData.disponibilites}
              onChange={handleChange}
            />
          </div>
          
          <div className="col-span-2">
            <Label htmlFor="engagement">Engagement</Label>
            <Input
              id="engagement"
              name="engagement"
              value={formData.engagement}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-2 mt-6">
            <Button type="submit" className="w-full md:w-auto">
              Ajouter
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddIntervenant;
