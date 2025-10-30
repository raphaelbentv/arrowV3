import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EtudiantDocument = Etudiant & Document;

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

@Schema({ timestamps: true, collection: 'apprenants' })
export class Etudiant {
  // 🏷️ Informations Personnelles
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  prenom: string;

  @Prop()
  photo?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  telephone: string;

  @Prop()
  adresse?: string;

  @Prop({ type: Date })
  dateNaissance?: Date;

  @Prop()
  lieuNaissance?: string;

  @Prop()
  nationalite?: string;

  @Prop({ enum: ['M', 'F', 'Autre'] })
  genre?: string;

  @Prop()
  numeroEtudiant?: string;

  // 📚 Informations Scolaires
  @Prop({ required: true, enum: StatutInscription, default: StatutInscription.EN_ATTENTE })
  statutInscription: StatutInscription;

  @Prop({ type: Date })
  dateInscription?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Cohorte' })
  cohorteActuelle?: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Cohorte', default: [] })
  cohortesHistorique: Types.ObjectId[];

  @Prop()
  formationSuivie?: string;

  @Prop()
  niveau?: string;

  // 📄 Documents (références vers le schéma Document)
  @Prop({ type: [Types.ObjectId], ref: 'Document', default: [] })
  documents?: Types.ObjectId[];

  // 📄 Documents (anciens champs string - pour compatibilité/rétrocompatibilité)
  @Prop()
  cv?: string; // @deprecated - Utiliser documents à la place

  @Prop()
  lettreMotivation?: string; // @deprecated - Utiliser documents à la place

  @Prop()
  diplomes?: string; // @deprecated - Utiliser documents à la place

  @Prop()
  piecesIdentite?: string; // @deprecated - Utiliser documents à la place

  @Prop()
  justificatifsFinancement?: string; // @deprecated - Utiliser documents à la place

  // 💰 Informations Financières
  @Prop({ enum: TypeFinancement })
  typeFinancement?: TypeFinancement;

  @Prop()
  montantFinancement?: number;

  @Prop()
  organismeFinanceur?: string;

  @Prop({ type: Date })
  dateDebutFinancement?: Date;

  @Prop({ type: Date })
  dateFinFinancement?: Date;

  // 📊 Suivi Pédagogique
  @Prop({ type: Number, default: 0, min: 0, max: 20 })
  moyenneGenerale?: number;

  @Prop({ type: Number, default: 0, min: 0, max: 100 })
  tauxPresence?: number;

  @Prop({ type: Number, default: 0, min: 0, max: 100 })
  tauxProgression?: number;

  @Prop({ type: [Object], default: [] })
  notes?: Array<{
    module: string;
    note: number;
    date: Date;
    commentaire?: string;
  }>;

  @Prop({ type: [String], default: [] })
  absences?: string[];

  @Prop({ type: [String], default: [] })
  retards?: string[];

  // 📝 Informations Complémentaires
  @Prop()
  situationActuelle?: string;

  @Prop()
  objectifs?: string;

  @Prop()
  difficultesRencontrees?: string;

  @Prop()
  commentaires?: string;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  // 🔗 Relations
  @Prop({ type: Types.ObjectId, ref: 'User' })
  compteUtilisateur?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Admin' })
  createdBy?: Types.ObjectId;

  _id: any;
}

export const EtudiantSchema = SchemaFactory.createForClass(Etudiant);
