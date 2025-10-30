import api from './api';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  RETARD = 'retard',
}

export interface Attendance {
  _id: string;
  etudiantId: string;
  sessionId: string;
  status: AttendanceStatus;
  justificatifDocId?: string;
  commentaire?: string;
  saisiPar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAttendanceDto {
  etudiantId: string;
  sessionId: string;
  status: AttendanceStatus;
  commentaire?: string;
  saisiPar?: string;
}

export const attendanceService = {
  async upsertOne(data: CreateAttendanceDto): Promise<Attendance> {
    const response = await api.post('/attendance', data);
    return response.data;
  },

  async attachJustificatif(attendanceId: string, docId: string): Promise<Attendance> {
    const response = await api.patch(`/attendance/${attendanceId}/justificatif/${docId}`);
    return response.data;
  },

  async getBySession(sessionId: string): Promise<Attendance[]> {
    const response = await api.get(`/attendance/session/${sessionId}`);
    return response.data;
  },

  async getByEtudiant(etudiantId: string): Promise<Attendance[]> {
    const response = await api.get(`/attendance/etudiant/${etudiantId}`);
    return response.data;
  },
};

