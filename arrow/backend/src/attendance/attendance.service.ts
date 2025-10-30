import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Attendance, AttendanceDocument, AttendanceStatus } from './attendance.schema';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name) private readonly attendanceModel: Model<AttendanceDocument>,
  ) {}

  async upsertOne(payload: { etudiantId: string; sessionId: string; status: AttendanceStatus; commentaire?: string; saisiPar?: string }): Promise<AttendanceDocument> {
    const filter = {
      etudiantId: new Types.ObjectId(payload.etudiantId),
      sessionId: new Types.ObjectId(payload.sessionId),
    };
    const update = {
      status: payload.status,
      commentaire: payload.commentaire,
      saisiPar: payload.saisiPar ? new Types.ObjectId(payload.saisiPar) : undefined,
    };
    return await this.attendanceModel.findOneAndUpdate(filter, update, { upsert: true, new: true, setDefaultsOnInsert: true });
  }

  async attachJustificatif(attendanceId: string, docId: string): Promise<AttendanceDocument> {
    const att = await this.attendanceModel.findByIdAndUpdate(attendanceId, { justificatifDocId: new Types.ObjectId(docId) }, { new: true });
    if (!att) throw new NotFoundException('Attendance not found');
    return att;
  }

  async listBySession(sessionId: string): Promise<AttendanceDocument[]> {
    return await this.attendanceModel.find({ sessionId: new Types.ObjectId(sessionId) }).exec();
  }

  async listByEtudiant(etudiantId: string): Promise<AttendanceDocument[]> {
    return await this.attendanceModel.find({ etudiantId: new Types.ObjectId(etudiantId) }).exec();
  }
}


