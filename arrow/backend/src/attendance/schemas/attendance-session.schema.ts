import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'attendance_sessions' })
export class AttendanceSession extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Course', required: false })
  courseId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Intervenant', required: false })
  intervenerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Cohorte', required: true })
  classGroupId: Types.ObjectId;

  @Prop({
    type: {
      date: { type: Date, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      room: { type: String, required: false },
    },
    required: true,
  })
  schedule: {
    date: Date;
    startTime: string;
    endTime: string;
    room?: string;
  };

  @Prop({
    type: {
      startTime: String,
      endTime: String,
      duration: Number,
    },
  })
  actualTiming?: {
    startTime?: string;
    endTime?: string;
    duration?: number;
  };

  @Prop({
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled',
  })
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

  @Prop({
    type: {
      expectedStudents: { type: Number, default: 0 },
      present: { type: Number, default: 0 },
      absent: { type: Number, default: 0 },
      late: { type: Number, default: 0 },
      excused: { type: Number, default: 0 },
      attendanceRate: { type: Number, default: 0 },
    },
    default: {},
  })
  statistics: {
    expectedStudents: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    attendanceRate: number;
  };

  @Prop([
    {
      studentId: { type: Types.ObjectId, ref: 'Etudiant' },
      studentName: String,
      status: { type: String, enum: ['present', 'absent', 'late', 'excused'], default: 'absent' },
      arrivalTime: String,
      departureTime: String,
      lateMinutes: Number,
      excuse: {
        type: {
          type: String,
          documentUrl: String,
          validated: Boolean,
        },
        default: {},
      },
      participation: {
        type: {
          score: { type: Number, min: 0, max: 10 },
          notes: String,
          homeworkSubmitted: Boolean,
        },
        default: {},
      },
      markedBy: { type: Types.ObjectId, ref: 'User' },
      markedAt: Date,
      lastModified: Date,
    },
  ])
  studentAttendance: Array<{
    studentId: Types.ObjectId;
    studentName?: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    arrivalTime?: string;
    departureTime?: string;
    lateMinutes?: number;
    excuse?: { type?: string; documentUrl?: string; validated?: boolean };
    participation?: { score?: number; notes?: string; homeworkSubmitted?: boolean };
    markedBy?: Types.ObjectId;
    markedAt?: Date;
    lastModified?: Date;
  }>;

  @Prop({
    type: {
      weather: String,
      specialEvent: Boolean,
      notes: String,
      validatedBy: { type: Types.ObjectId, ref: 'User' },
    },
    default: {},
  })
  metadata?: {
    weather?: string;
    specialEvent?: boolean;
    notes?: string;
    validatedBy?: Types.ObjectId;
  };
}

export const AttendanceSessionSchema = SchemaFactory.createForClass(AttendanceSession);
AttendanceSessionSchema.index({ 'schedule.date': -1, classGroupId: 1 });
AttendanceSessionSchema.index({ 'studentAttendance.studentId': 1 });
AttendanceSessionSchema.index({ status: 1, 'schedule.date': -1 });






