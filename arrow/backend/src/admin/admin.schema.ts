import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true, collection: 'admins' })
export class Admin {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  prenom: string;

  @Prop({ default: true })
  isAdmin: boolean;

  @Prop({ default: [] })
  permissions: string[];

  // Informations personnelles supplémentaires
  @Prop()
  photo?: string;

  @Prop()
  telephoneMobile?: string;

  @Prop()
  telephoneFixe?: string;

  @Prop()
  posteFonction?: string;

  // Historique et sécurité
  @Prop({ type: Date })
  derniereConnexion?: Date;

  @Prop({ type: Date })
  derniereModificationProfil?: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);