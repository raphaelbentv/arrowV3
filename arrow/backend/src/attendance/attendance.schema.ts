import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AttendanceDocument = Attendance & Document;

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  RETARD = 'retard',
}

@Schema({ timestamps: true, collection: 'attendance' })
export class Attendance {
  @Prop({ type: Types.ObjectId, ref: 'Etudiant', required: true })
  etudiantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  sessionId: Types.ObjectId;

  @Prop({ type: String, enum: AttendanceStatus, required: true })
  status: AttendanceStatus;

  @Prop({ type: Types.ObjectId, ref: 'Document' })
  justificatifDocId?: Types.ObjectId;

  @Prop()
  commentaire?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  saisiPar?: Types.ObjectId;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
AttendanceSchema.index({ etudiantId: 1, sessionId: 1 }, { unique: true });

