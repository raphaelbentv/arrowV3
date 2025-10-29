import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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
  EN_PREPARATION = 'En préparation',
  ACTIVE = 'Active',
  CLOTUREE = 'Clôturée'
}

// Enum pour les types de financement
export enum TypeFinancement {
  OPCO = 'OPCO',
  ECOLE = 'École',
  ENTREPRISE = 'Entreprise',
  AUTO_FINANCE = 'Autofinancé',
  AUTRE = 'Autre'
}

@Schema({ timestamps: true, collection: 'cohortes' })
export class Cohorte {
  // --- Identification ---
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true, enum: ['2023-2024', '2024-2025', '2025-2026'] })
  anneeScolaire: string;

  @Prop({ required: true, enum: TypeFormation })
  typeFormation: TypeFormation;

  @Prop()
  diplome?: string;

  @Prop({ required: true, enum: StatutCohorte, default: StatutCohorte.EN_PREPARATION })
  statut: StatutCohorte;

  // --- Organisation ---
  @Prop({ type: Date })
  dateDebut: Date;

  @Prop({ type: Date })
  dateFin: Date;

  @Prop({ type: Number, default: 0 })
  volumeHoraireTotal: number;

  // --- Composition ---
  @Prop({ type: [Types.ObjectId], ref: 'Apprenants', default: [] })
  etudiants: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Intervenants', default: [] })
  intervenants: Types.ObjectId[];

  // --- Structure pédagogique ---
  @Prop({ type: [Types.ObjectId], ref: 'Modules', default: [] })
  modules: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Cours', default: [] })
  cours: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  dossiersCours: string[];

  // --- Suivi pédagogique ---
  @Prop({ type: Number, default: 0 })
  tauxPresenceMoyen: number;

  @Prop({ type: Number, default: 0 })
  tauxProgression: number;

  @Prop({ type: Date })
  dernierAppel: Date;

  @Prop({ type: Number, default: 0 })
  nbSessionsPrevues: number;

  @Prop({ type: Number, default: 0 })
  nbSessionsEffectuees: number;

  // --- Traçabilité & gestion ---
  @Prop({ type: Types.ObjectId, ref: 'Admin' })
  createdBy: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop()
  notesInternes?: string;

  @Prop({ type: [String], enum: ['BTS', 'Bachelor', 'Mastère', 'En ligne', 'Présentiel'], default: [] })
  tags: string[];
}

export const CohorteSchema = SchemaFactory.createForClass(Cohorte);