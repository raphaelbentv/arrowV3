import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SchoolDocument = School & Document;

@Schema({ timestamps: true, collection: 'SchoolInfos' })
export class School {
  // Identité
  @Prop({ required: true })
  nomEcole: string;

  @Prop()
  raisonSociale?: string;

  @Prop({ required: true })
  numeroSIRET: string;

  @Prop()
  codeUAI?: string;

  // Coordonnées
  @Prop({ required: true })
  adresseNumeroRue: string;

  @Prop({ required: true })
  codePostal: string;

  @Prop({ required: true })
  ville: string;

  @Prop({ required: true, default: 'France' })
  pays: string;

  @Prop({ required: true })
  telephone: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  siteWeb?: string;

  // Direction
  @Prop({ required: true })
  nomDirecteur: string;

  @Prop({ required: true })
  emailDirecteur: string;

  @Prop({ required: true })
  nomResponsablePedagogique: string;

  @Prop({ required: true })
  emailResponsablePedagogique: string;

  // Branding
  @Prop()
  logo?: string;

  @Prop({ default: '#3d9bff' })
  couleurPrincipale?: string;
}

export const SchoolSchema = SchemaFactory.createForClass(School);

