// Enum pour les types de formation
export enum TypeFormation {
  BTS = 'BTS',
  BACHELOR = 'Bachelor',
  MASTERE = 'Mastère',
  AUTRE = 'Autre'
}

// Enum pour les statuts de cohorte
export enum StatutCohorte {
  EN_PREPARATION = 'en_preparation',
  ACTIVE = 'active',
  CLOTUREE = 'cloturee'
}

// Enum pour les types de financement
export enum TypeFinancement {
  OPCO = 'OPCO',
  ECOLE = 'École',
  ENTREPRISE = 'Entreprise',
  AUTO_FINANCE = 'Autofinancé',
  AUTRE = 'Autre'
}

export interface Cohorte {
  _id: string;
  
  // 🧱 Informations générales
  nom: string;
  anneeScolaire: string;
  typeFormation: TypeFormation;
  diplomeVise?: string;
  niveauRNCP?: string;
  etablissement?: string;
  formationAssociee?: string;

  // 👥 Composition
  nombreEtudiantsPrevu: number;
  nombreEtudiantsInscrits: number;
  etudiants: string[];
  intervenants: string[];
  responsablePedagogique?: string;

  // 📅 Organisation et planification
  dateDebut: string;
  dateFin: string;
  volumeHoraireTotal: number;
  repartitionHeures: {
    module: string;
    matiere: string;
    volumeHoraire: number;
    intervenant: string;
  }[];

  // 📂 Structure pédagogique
  matieres: string[];
  modules: string[];
  progressionPedagogique?: string;
  supportsCours: string[];

  // 🔍 Suivi administratif et financier
  statut: StatutCohorte;
  nombreEtudiantsFinances: number;
  nombreEtudiantsAutofinances: number;
  montantTotalFacture: number;
  typeFinanceur?: TypeFinancement;
  nomFinanceur?: string;

  // 🧾 Métadonnées et traçabilité
  creePar: string;
  dateCreation: string;
  dateDerniereModification: string;
  commentairesInternes?: string;
  tags: string[];

  // Champs legacy pour compatibilité
  description?: string;
  actif: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCohorteDto {
  // 🧱 Informations générales
  nom: string;
  anneeScolaire: string;
  typeFormation: TypeFormation;
  diplomeVise?: string;
  niveauRNCP?: string;
  etablissement?: string;
  formationAssociee?: string;

  // 👥 Composition
  nombreEtudiantsPrevu?: number;
  nombreEtudiantsInscrits?: number;
  responsablePedagogique?: string;

  // 📅 Organisation et planification
  dateDebut: string;
  dateFin: string;
  volumeHoraireTotal?: number;

  // 📂 Structure pédagogique
  matieres?: string[];
  modules?: string[];
  progressionPedagogique?: string;

  // 🔍 Suivi administratif et financier
  statut?: StatutCohorte;
  nombreEtudiantsFinances?: number;
  nombreEtudiantsAutofinances?: number;
  montantTotalFacture?: number;
  typeFinanceur?: TypeFinancement;
  nomFinanceur?: string;

  // 🧾 Métadonnées et traçabilité
  creePar: string;
  commentairesInternes?: string;
  tags?: string[];

  // Champs legacy pour compatibilité
  description?: string;
  actif?: boolean;
}

export interface UpdateCohorteDto {
  // Tous les champs de CreateCohorteDto sont optionnels pour la mise à jour
  nom?: string;
  anneeScolaire?: string;
  typeFormation?: TypeFormation;
  diplomeVise?: string;
  niveauRNCP?: string;
  etablissement?: string;
  formationAssociee?: string;
  nombreEtudiantsPrevu?: number;
  nombreEtudiantsInscrits?: number;
  responsablePedagogique?: string;
  dateDebut?: string;
  dateFin?: string;
  volumeHoraireTotal?: number;
  matieres?: string[];
  modules?: string[];
  progressionPedagogique?: string;
  statut?: StatutCohorte;
  nombreEtudiantsFinances?: number;
  nombreEtudiantsAutofinances?: number;
  montantTotalFacture?: number;
  typeFinanceur?: TypeFinancement;
  nomFinanceur?: string;
  commentairesInternes?: string;
  tags?: string[];
  description?: string;
  actif?: boolean;
}

export interface AssignStudentsDto {
  etudiantIds: string[];
}

export interface CohorteFormData {
  // Informations générales
  nom: string;
  anneeScolaire: string;
  typeFormation: TypeFormation;
  diplomeVise: string;
  niveauRNCP: string;
  etablissement: string;
  formationAssociee: string;

  // Composition
  nombreEtudiantsPrevu: number;
  nombreEtudiantsInscrits: number;
  responsablePedagogique: string;

  // Organisation
  dateDebut: string;
  dateFin: string;
  volumeHoraireTotal: number;

  // Structure pédagogique
  matieres: string[];
  modules: string[];
  progressionPedagogique: string;

  // Suivi administratif
  statut: StatutCohorte;
  nombreEtudiantsFinances: number;
  nombreEtudiantsAutofinances: number;
  montantTotalFacture: number;
  typeFinanceur: TypeFinancement;
  nomFinanceur: string;

  // Métadonnées
  commentairesInternes: string;
  tags: string[];
  description: string;
}

export interface CohorteFilters {
  anneeScolaire?: string;
  typeFormation?: TypeFormation;
  statut?: StatutCohorte;
  etablissement?: string;
  tags?: string[];
  actif?: boolean;
}
