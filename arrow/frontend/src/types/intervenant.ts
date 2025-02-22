
export interface Intervenant {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  poste: string;
  statut: string;
  adresse?: string;
  dateNaissance?: Date;
  photo?: string;
  domainesExpertise?: string[];
  diplomes?: string;
  cv?: string;
  typeContrat: string;
  dateDebutMission?: Date;
  dateFinMission?: Date;
  tarification?: string;
  heuresPrevues?: number;
  rib?: string;
  clauses?: string;
  modulesEnseignes?: string[];
  heuresParModule?: number;
  niveauEtudiants?: string;
  supportsPedagogiques?: string;
  methodesPedagogiques?: string;
  pieceIdentite?: string;
  numeroSiret?: string;
  assuranceRC?: string;
  extraitKbis?: string;
  justificatifsDiplomes?: string;
  conventionContrat?: string;
  attestationURSSAF?: string;
  appreciationsEtudiants?: string[];
  feedbackResponsables?: string[];
  pointsAmelioration?: string;
  disponibilites?: string;
  engagement?: string;
} 