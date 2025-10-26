import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CohorteDocument = Cohorte & Document;

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

@Schema({ timestamps: true })
export class Cohorte {
  // 🧱 Informations générales
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  anneeScolaire: string;

  @Prop({ required: true, enum: TypeFormation })
  typeFormation: TypeFormation;

  @Prop()
  diplomeVise?: string;

  @Prop()
  niveauRNCP?: string;

  @Prop()
  etablissement?: string;

  @Prop()
  formationAssociee?: string;

  // 👥 Composition
  @Prop({ default: 0 })
  nombreEtudiantsPrevu: number;

  @Prop({ default: 0 })
  nombreEtudiantsInscrits: number;

  @Prop({ type: [String], default: [] })
  etudiants: string[];

  @Prop({ type: [String], default: [] })
  intervenants: string[];

  @Prop()
  responsablePedagogique?: string;

  // 📅 Organisation et planification
  @Prop({ required: true, type: Date })
  dateDebut: Date;

  @Prop({ required: true, type: Date })
  dateFin: Date;

  @Prop({ default: 0 })
  volumeHoraireTotal: number;

  @Prop({
    type: [{
      module: String,
      matiere: String,
      volumeHoraire: Number,
      intervenant: String
    }],
    default: []
  })
  repartitionHeures: {
    module: string;
    matiere: string;
    volumeHoraire: number;
    intervenant: string;
  }[];

  // 📂 Structure pédagogique
  @Prop({ type: [String], default: [] })
  matieres: string[];

  @Prop({ type: [String], default: [] })
  modules: string[];

  @Prop()
  progressionPedagogique?: string;

  @Prop({ type: [String], default: [] })
  supportsCours: string[];

  // 🔍 Suivi administratif et financier
  @Prop({ required: true, enum: StatutCohorte, default: StatutCohorte.EN_PREPARATION })
  statut: StatutCohorte;

  @Prop({ default: 0 })
  nombreEtudiantsFinances: number;

  @Prop({ default: 0 })
  nombreEtudiantsAutofinances: number;

  @Prop({ default: 0 })
  montantTotalFacture: number;

  @Prop({ enum: TypeFinancement })
  typeFinanceur?: TypeFinancement;

  @Prop()
  nomFinanceur?: string;

  // 🧾 Métadonnées et traçabilité
  @Prop({ required: true })
  creePar: string;

  @Prop({ type: Date, default: Date.now })
  dateCreation: Date;

  @Prop({ type: Date, default: Date.now })
  dateDerniereModification: Date;

  @Prop()
  commentairesInternes?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  // Champs legacy pour compatibilité
  @Prop()
  description?: string;

  @Prop({ default: true })
  actif: boolean;
}

export const CohorteSchema = SchemaFactory.createForClass(Cohorte);