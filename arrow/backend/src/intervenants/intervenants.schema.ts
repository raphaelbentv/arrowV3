import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IntervenantDocument = Intervenant & Document;

@Schema({ timestamps: true })
export class Intervenant {
  // 🏷️ Informations Générales
  @Prop({ required: true })
  nom: string; // Texte

  @Prop({ required: true })
  prenom: string; // Texte

  @Prop()
  photo: string; // URL de l'image

  @Prop({ required: true, unique: true })
  email: string; // Texte (email unique)

  @Prop({ required: true })
  telephone: string; // Texte (format téléphone)

  @Prop()
  adresse: string; // Texte

  @Prop()
  dateNaissance: Date; // Date

  // 🏢 Informations Professionnelles
  @Prop({ required: true })
  poste: string; // Texte

  @Prop({ required: true })
  statut: string; // Texte (ex: salarié, indépendant, auto-entrepreneur)

  @Prop()
  experience: string; // Texte

  @Prop({ type: [String] })
  domainesExpertise: string[]; // Liste de textes

  @Prop()
  diplomes: string; // Texte ou chemin vers un fichier PDF

  @Prop()
  cv: string; // Chemin vers un fichier PDF

  // 📜 Données Contractuelles
  @Prop({ required: true })
  typeContrat: string; // Texte (ex: CDD, CDI, freelance, prestation)

  @Prop()
  dateDebutMission: Date; // Date

  @Prop()
  dateFinMission: Date; // Date

  @Prop()
  tarification: string; // Texte (horaire ou forfaitaire)

  @Prop()
  heuresPrevues: number; // Nombre

  @Prop()
  rib: string; // Chemin vers un fichier PDF

  @Prop()
  clauses: string; // Texte ou fichier PDF

  // 🎓 Informations Pédagogiques
  @Prop({ type: [String] })
  modulesEnseignes: string[]; // Liste de textes

  @Prop()
  heuresParModule: number; // Nombre

  @Prop()
  niveauEtudiants: string; // Texte

  @Prop()
  supportsPedagogiques: string; // Chemin vers un fichier PDF ou ZIP

  @Prop()
  methodesPedagogiques: string; // Texte

  // 📑 Documents Administratifs
  @Prop()
  pieceIdentite: string; // Chemin vers un scan (PDF ou image)

  @Prop()
  numeroSiret: string; // Texte

  @Prop()
  assuranceRC: string; // Chemin vers un fichier PDF

  @Prop()
  extraitKbis: string; // Chemin vers un fichier PDF

  @Prop()
  justificatifsDiplomes: string; // Chemin vers un fichier PDF

  @Prop()
  conventionContrat: string; // Chemin vers un fichier PDF

  @Prop()
  attestationURSSAF: string; // Chemin vers un fichier PDF

  // 📊 Suivi et Évaluation
  @Prop({ type: [String] })
  appreciationsEtudiants: string[]; // Liste de textes

  @Prop({ type: [String] })
  feedbackResponsables: string[]; // Liste de textes

  @Prop()
  pointsAmelioration: string; // Texte

  @Prop()
  disponibilites: string; // Texte

  @Prop()
  engagement: string; // Texte

  _id: any;
}

export const IntervenantSchema = SchemaFactory.createForClass(Intervenant);
