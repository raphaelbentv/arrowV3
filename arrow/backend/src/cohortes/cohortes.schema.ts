import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CohorteDocument = Cohorte & Document;

// Enum pour les types de formation
// Statut MVP: Active ou Terminée
export enum StatutCohorte {
  ACTIVE = 'Active',
  TERMINEE = 'Terminée'
}

// Sous-doc: inscription d'un étudiant dans une cohorte
@Schema({ _id: false })
export class CohorteEtudiant {
  @Prop({ type: Types.ObjectId, ref: 'Etudiants', required: true })
  etudiantId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  dateInscription: Date;

  @Prop({ type: String, enum: ['Actif', 'Abandon'], default: 'Actif' })
  statut: string;
}

export const CohorteEtudiantSchema = SchemaFactory.createForClass(CohorteEtudiant);

// Sous-doc: planning spécifique du module dans la cohorte
@Schema({ _id: false })
export class PlanningModule {
  @Prop({ type: String, required: true })
  jourSemaine: string; // ex: Lundi

  @Prop({ type: String, required: true })
  heureDebut: string; // ex: 09:00

  @Prop({ type: String, required: true })
  heureFin: string; // ex: 12:00

  @Prop({ type: String, required: true })
  salle: string;
}

export const PlanningModuleSchema = SchemaFactory.createForClass(PlanningModule);

// Sous-doc: module assigné à la cohorte avec intervenant
@Schema({ _id: false })
export class ModuleCohorte {
  @Prop({ type: Types.ObjectId, ref: 'Modules', required: true })
  moduleId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Intervenants', required: true })
  intervenantId: Types.ObjectId;

  @Prop({ type: PlanningModuleSchema, required: true })
  planning: PlanningModule;
}

export const ModuleCohorteSchema = SchemaFactory.createForClass(ModuleCohorte);

@Schema({ timestamps: true, collection: 'cohortes' })
export class Cohorte {
  // --- Identification ---
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true, unique: true })
  code: string; // code unique ex: BTS-COM-24

  @Prop({ type: Date, required: true })
  dateDebut: Date;

  @Prop({ type: Date, required: true })
  dateFinPrevue: Date;

  @Prop({ required: true, enum: StatutCohorte, default: StatutCohorte.ACTIVE })
  statut: StatutCohorte;

  // --- Références externes ---
  @Prop({ type: Types.ObjectId, ref: 'Intervenants' })
  responsablePedagogiqueId?: Types.ObjectId;

  // --- Composition ---
  @Prop({ type: [CohorteEtudiantSchema], default: [] })
  composition: CohorteEtudiant[];

  // --- Modules de la cohorte ---
  @Prop({ type: [ModuleCohorteSchema], default: [] })
  modulesCohorte: ModuleCohorte[];

  // --- Statistiques calculées (agrégées périodiquement) ---
  @Prop({ type: Number, default: 0 })
  nombreTotalEtudiants: number;

  @Prop({ type: Number, default: 0 })
  nombreEtudiantsActifs: number;

  @Prop({ type: Number, default: 0 })
  tauxPresenceGlobal: number; // 0..100

  @Prop({ type: Number, default: 0 })
  moyenneGenerale: number; // 0..20 ou 0..100 selon usage

  @Prop({ type: Number, default: 0 })
  tauxAbandon: number; // 0..100

  // --- Métadonnées ---
  @Prop({ type: Types.ObjectId, ref: 'Users' })
  createdBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Users' })
  updatedBy?: Types.ObjectId;
}

export const CohorteSchema = SchemaFactory.createForClass(Cohorte);