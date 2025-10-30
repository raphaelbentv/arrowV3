import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DocumentDocument = DocumentModel & Document;

export enum TypeDocument {
  // Documents étudiants
  CV = 'cv',
  LETTRE_MOTIVATION = 'lettreMotivation',
  DIPLOME = 'diplome',
  PIECE_IDENTITE = 'pieceIdentite',
  JUSTIFICATIF_FINANCEMENT = 'justificatifFinancement',
  PHOTO = 'photo',
  EMARGEMENT = 'emargement',
  JUSTIFICATIF_ABSENCE = 'justificatifAbsence',
  
  // Documents intervenants
  RIB = 'rib',
  ASSURANCE_RC = 'assuranceRC',
  EXTRATI_KBIS = 'extraitKbis',
  CONVENTION_CONTRAT = 'conventionContrat',
  ATTESTATION_URSSAF = 'attestationURSSAF',
  JUSTIFICATIF_DIPLOME = 'justificatifDiplome',
  SUPPORT_PEDAGOGIQUE = 'supportPedagogique',
  
  // Autres
  AUTRE = 'autre'
}

export enum TypeEntite {
  ETUDIANT = 'etudiant',
  INTERVENANT = 'intervenant',
  COHORTE = 'cohorte',
  SESSION = 'session',
  AUTRE = 'autre'
}

@Schema({ timestamps: true, collection: 'documents' })
export class DocumentModel {
  @Prop({ required: true })
  nomFichier: string; // Nom original du fichier
  
  @Prop({ required: true })
  cheminStockage: string; // Chemin relatif ou URL absolue
  
  @Prop({ required: true, enum: TypeDocument })
  typeDocument: TypeDocument;
  
  @Prop({ required: true, enum: TypeEntite })
  typeEntite: TypeEntite;
  
  @Prop({ required: true, type: Types.ObjectId })
  entiteId: Types.ObjectId; // ID de l'entité propriétaire (Etudiant, Intervenant, etc.)
  
  @Prop()
  mimeType?: string; // 'application/pdf', 'image/jpeg', 'image/png', etc.
  
  @Prop()
  taille?: number; // Taille en bytes
  
  @Prop({ type: Types.ObjectId, ref: 'User' })
  uploadPar?: Types.ObjectId; // Admin ou utilisateur qui a uploadé
  
  @Prop({ default: true })
  actif: boolean; // Pour soft delete
  
  @Prop()
  description?: string; // Description optionnelle du document
  
  _id: any;
}

export const DocumentSchema = SchemaFactory.createForClass(DocumentModel);

