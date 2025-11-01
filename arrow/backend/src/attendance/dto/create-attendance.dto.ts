export class CreateAttendanceSessionDto {
  classGroupId!: string;
  courseId?: string;
  date!: string; // ISO date
  startTime?: string;
  endTime?: string;
  room?: string;
}

export class MarkAttendanceDto {
  studentId!: string;
  status!: 'present' | 'absent' | 'late' | 'excused';
}







