import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ModuleCoursDocument = ModuleCours & Document;

export enum EvaluationType {
  CONTROLE_CONTINU = 'controle_continu',
  EXAMEN_FINAL = 'examen_final',
  PROJET = 'projet',
  PARTICIPATION = 'participation',
}

@Schema({ timestamps: true, collection: 'modules' })
export class ModuleCours {
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true, unique: true, index: true })
  code: string;

  @Prop()
  descriptionCourte?: string;

  @Prop({ type: Number, min: 0 })
  nombreHeuresTotal?: number;

  @Prop({ type: Number, min: 0 })
  coefficient?: number;

  @Prop({ type: Types.ObjectId, ref: 'Intervenant' })
  intervenantPrincipalId?: Types.ObjectId;

  @Prop({ type: String })
  semestre?: string;

  @Prop({ enum: EvaluationType })
  typeEvaluationPrincipal?: EvaluationType;

  @Prop({ type: Number, min: 0, max: 1 })
  poidsEvaluation?: number; // 0..1 pour la moyenne

  @Prop({ type: Boolean, default: true })
  actif?: boolean;

  _id: any;
}

export const ModuleCoursSchema = SchemaFactory.createForClass(ModuleCours);

