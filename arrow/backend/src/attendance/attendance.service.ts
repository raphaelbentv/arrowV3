import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Attendance, AttendanceDocument, AttendanceStatus } from './attendance.schema';
import { AttendanceSession } from './schemas/attendance-session.schema';
import { CreateAttendanceSessionDto, MarkAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name) private readonly attendanceModel: Model<AttendanceDocument>,
    @InjectModel(AttendanceSession.name) private readonly sessionModel: Model<AttendanceSession>,
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

  // ----- New session-based attendance API -----
  async createSession(dto: CreateAttendanceSessionDto) {
    const schedule = {
      date: new Date(dto.date),
      startTime: dto.startTime || '09:00',
      endTime: dto.endTime || '10:30',
      room: dto.room || 'A204',
    } as any;
    const session = await this.sessionModel.create({
      courseId: dto.courseId ? new Types.ObjectId(dto.courseId) : undefined,
      classGroupId: new Types.ObjectId(dto.classGroupId),
      schedule,
      status: 'scheduled',
      statistics: { expectedStudents: 0, present: 0, absent: 0, late: 0, excused: 0, attendanceRate: 0 },
      studentAttendance: [],
    });
    return session;
  }

  async markAttendance(sessionId: string, data: MarkAttendanceDto) {
    const session = await this.sessionModel.findById(sessionId);
    if (!session) throw new NotFoundException('Session introuvable');
    if (!session.studentAttendance) session.studentAttendance = [] as any;
    const idx = (session.studentAttendance as any[]).findIndex((s: any) => String(s.studentId) === data.studentId);
    if (idx >= 0) {
      (session.studentAttendance as any[])[idx].status = data.status;
      (session.studentAttendance as any[])[idx].lastModified = new Date();
    } else {
      (session.studentAttendance as any[]).push({
        studentId: new Types.ObjectId(data.studentId),
        status: data.status,
        markedAt: new Date(),
      });
    }

    // update stats
    const counts = { present: 0, absent: 0, late: 0, excused: 0 } as any;
    (session.studentAttendance as any[]).forEach((s: any) => { counts[s.status] = (counts[s.status] || 0) + 1; });
    const total = (session.studentAttendance as any[]).length;
    session.statistics = {
      expectedStudents: Math.max(session.statistics?.expectedStudents || 0, total),
      ...counts,
      attendanceRate: total ? Math.round(((counts.present + counts.late) / total) * 100) : 0,
    } as any;
    await session.save();
    return session;
  }

  async getTodaySessions() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return await this.sessionModel.find({ 'schedule.date': { $gte: today, $lt: tomorrow } });
  }

  async getStudentStats(studentId: string) {
    const id = new Types.ObjectId(studentId);
    return await this.sessionModel.aggregate([
      { $unwind: '$studentAttendance' },
      { $match: { 'studentAttendance.studentId': id } },
      { $group: { _id: '$studentAttendance.status', count: { $sum: 1 } } },
    ]);
  }
}


