export enum StatutInscription {
  INSCRIT = 'Inscrit',
  EN_ATTENTE = 'En attente',
  ADMIS = 'Admis',
  NON_ADMIS = 'Non admis',
  DIPLOME = 'Diplômé',
  ABANDON = 'Abandon',
  EXCLUS = 'Exclu'
}

export enum TypeFinancement {
  BOURSE = 'Bourse',
  APPRENTISSAGE = 'Apprentissage',
  ALTERNANCE = 'Alternance',
  AUTO_FINANCE = 'Autofinancé',
  ENTREPRISE = 'Entreprise',
  CPF = 'CPF',
  AUTRE = 'Autre'
}

export interface Note {
  module: string;
  note: number;
  date: string;
  commentaire?: string;
}

export interface Etudiant {
  _id: string;
  nom: string;
  prenom: string;
  photo?: string;
  email: string;
  telephone: string;
  adresse?: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  nationalite?: string;
  genre?: 'M' | 'F' | 'Autre';
  numeroEtudiant?: string;
  statutInscription: StatutInscription;
  dateInscription?: string;
  cohorteActuelle?: {
    _id: string;
    nom: string;
    anneeScolaire?: string;
    typeFormation?: string;
  } | string;
  cohortesHistorique?: Array<{
    _id: string;
    nom: string;
    anneeScolaire?: string;
  }> | string[];
  formationSuivie?: string;
  niveau?: string;
  cv?: string;
  lettreMotivation?: string;
  diplomes?: string;
  piecesIdentite?: string;
  justificatifsFinancement?: string;
  typeFinancement?: TypeFinancement;
  montantFinancement?: number;
  organismeFinanceur?: string;
  dateDebutFinancement?: string;
  dateFinFinancement?: string;
  moyenneGenerale?: number;
  tauxPresence?: number;
  tauxProgression?: number;
  notes?: Note[];
  absences?: string[];
  retards?: string[];
  situationActuelle?: string;
  objectifs?: string;
  difficultesRencontrees?: string;
  commentaires?: string;
  tags?: string[];
  compteUtilisateur?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEtudiantDto {
  nom: string;
  prenom: string;
  photo?: string;
  email: string;
  telephone: string;
  adresse?: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  nationalite?: string;
  genre?: 'M' | 'F' | 'Autre';
  numeroEtudiant?: string;
  statutInscription?: StatutInscription;
  dateInscription?: string;
  cohorteActuelle?: string;
  formationSuivie?: string;
  niveau?: string;
  cv?: string;
  lettreMotivation?: string;
  diplomes?: string;
  piecesIdentite?: string;
  justificatifsFinancement?: string;
  typeFinancement?: TypeFinancement;
  montantFinancement?: number;
  organismeFinanceur?: string;
  dateDebutFinancement?: string;
  dateFinFinancement?: string;
  moyenneGenerale?: number;
  tauxPresence?: number;
  tauxProgression?: number;
  situationActuelle?: string;
  objectifs?: string;
  difficultesRencontrees?: string;
  commentaires?: string;
  tags?: string[];
}

export interface UpdateEtudiantDto extends Partial<CreateEtudiantDto> {}

export interface EtudiantFilters {
  statutInscription?: StatutInscription;
  cohorte?: string;
  typeFinancement?: TypeFinancement;
  recherche?: string;
}
