import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IntervenantDocument = Intervenant & Document;

@Schema({ timestamps: true })
export class Intervenant {
  // 🏷️ Informations Générales
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  prenom: string;

  @Prop()
  photo: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  telephone: string;

  @Prop()
  adresse: string;

  @Prop()
  dateNaissance: Date;

  // 🏢 Informations Professionnelles
  @Prop({ required: true })
  poste: string;

  @Prop({ required: true })
  statut: string; // salarié, indépendant, auto-entrepreneur

  @Prop()
  experience: string;

  @Prop({ type: [String] })
  domainesExpertise: string[];

  @Prop()
  diplomes: string;

  @Prop()
  cv: string;

  // 📜 Données Contractuelles
  @Prop({ required: true })
  typeContrat: string; // CDD, CDI, freelance, prestation

  @Prop()
  dateDebutMission: Date;

  @Prop()
  dateFinMission: Date;

  @Prop()
  tarification: string; // horaire ou forfaitaire

  @Prop()
  heuresPrevues: number;

  @Prop()
  rib: string;

  @Prop()
  clauses: string;

  // 🎓 Informations Pédagogiques
  @Prop({ type: [String] })
  modulesEnseignes: string[];

  @Prop()
  heuresParModule: number;

  @Prop()
  niveauEtudiants: string;

  @Prop()
  supportsPedagogiques: string;

  @Prop()
  methodesPedagogiques: string;

  // 📑 Documents Administratifs
  @Prop()
  pieceIdentite: string;

  @Prop()
  numeroSiret: string;

  @Prop()
  assuranceRC: string;

  @Prop()
  extraitKbis: string;

  @Prop()
  justificatifsDiplomes: string;

  @Prop()
  conventionContrat: string;

  @Prop()
  attestationURSSAF: string;

  // 📊 Suivi et Évaluation
  @Prop({ type: [String] })
  appreciationsEtudiants: string[];

  @Prop({ type: [String] })
  feedbackResponsables: string[];

  @Prop()
  pointsAmelioration: string;

  @Prop()
  disponibilites: string;

  @Prop()
  engagement: string;
    _id: any;
}

export const IntervenantSchema = SchemaFactory.createForClass(Intervenant);