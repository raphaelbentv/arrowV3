/* eslint-disable no-console */
// Script: Crée une session d'appel complète avec des étudiants existants
// Usage: node scripts/seed-attendance-session.js

const path = require('path');
const mongoose = require('mongoose');
// Charger le .env du backend
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

async function main() {
  const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/arrow';
  if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
    console.warn('⚠️  MONGODB_URI/MONGO_URI non trouvée dans backend/.env, fallback sur', MONGO_URI);
  } else {
    console.log('🔗 URI Mongo détectée depuis .env');
  }
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('✅ Connecté à MongoDB');

  // Collections existantes
  const Cohorte = mongoose.connection.collection('cohortes');
  const Etudiants = mongoose.connection.collection('apprenants');

  // Prendre une cohorte existante (active si possible)
  const cohorte = (await Cohorte.find({}).sort({ createdAt: -1 }).limit(1).toArray())[0];
  if (!cohorte) throw new Error('Aucune cohorte trouvée. Seed des cohortes d’abord.');
  console.log('📚 Cohorte utilisée:', cohorte.nom, cohorte._id);

  // Récupérer d'abord les étudiants liés à la cohorte si dispo, sinon n'importe lesquels
  let students = [];
  const idsFromCohorte = Array.isArray(cohorte.etudiants) ? cohorte.etudiants : [];
  if (idsFromCohorte.length > 0) {
    students = await Etudiants.find({ _id: { $in: idsFromCohorte } }).limit(24).toArray();
  }
  if (students.length === 0) {
    students = await Etudiants.find({}).limit(24).toArray();
  }
  if (students.length === 0) throw new Error('Aucun étudiant trouvé. Seed des étudiants d’abord.');
  console.log(`👥 Étudiants sélectionnés: ${students.length}`);

  // Modèle ad-hoc pour AttendanceSession (même shape que le schema TS)
  const attendanceSessionSchema = new mongoose.Schema(
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      intervenerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Intervenant' },
      classGroupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cohorte', required: true },
      schedule: {
        date: { type: Date, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        room: { type: String },
      },
      actualTiming: {
        startTime: String,
        endTime: String,
        duration: Number,
      },
      status: { type: String, enum: ['scheduled', 'in_progress', 'completed', 'cancelled'], default: 'scheduled' },
      statistics: {
        expectedStudents: { type: Number, default: 0 },
        present: { type: Number, default: 0 },
        absent: { type: Number, default: 0 },
        late: { type: Number, default: 0 },
        excused: { type: Number, default: 0 },
        attendanceRate: { type: Number, default: 0 },
      },
      studentAttendance: [
        {
          studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Etudiant' },
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
          markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          markedAt: Date,
          lastModified: Date,
        },
      ],
      metadata: {
        weather: String,
        specialEvent: Boolean,
        notes: String,
        validatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    },
    { timestamps: true, collection: 'attendance_sessions' }
  );

  const AttendanceSession = mongoose.model('AttendanceSession', attendanceSessionSchema);

  // Construire la session de test
  const now = new Date();
  const sessionDoc = new AttendanceSession({
    classGroupId: cohorte._id,
    schedule: {
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      startTime: '11:15',
      endTime: '12:45',
      room: 'B102',
    },
    status: 'in_progress',
    studentAttendance: students.map((s, idx) => ({
      studentId: s._id,
      studentName: `${s.prenom || ''} ${s.nom || ''}`.trim(),
      status: idx % 6 === 0 ? 'late' : idx % 5 === 0 ? 'excused' : idx % 4 === 0 ? 'absent' : 'present',
      arrivalTime: idx % 6 === 0 ? '11:27' : undefined,
      lateMinutes: idx % 6 === 0 ? 12 : undefined,
      participation: { score: Math.min(10, 6 + (idx % 5)), notes: idx % 3 === 0 ? 'Bon engagement' : undefined },
      markedAt: new Date(),
      lastModified: new Date(),
    })),
  });

  // Statistiques rapides
  const counts = { present: 0, absent: 0, late: 0, excused: 0 };
  sessionDoc.studentAttendance.forEach((sa) => { counts[sa.status]++; });
  const total = sessionDoc.studentAttendance.length;
  sessionDoc.statistics = {
    expectedStudents: total,
    present: counts.present,
    absent: counts.absent,
    late: counts.late,
    excused: counts.excused,
    attendanceRate: Math.round(((counts.present + counts.late) / total) * 100),
  };

  const saved = await sessionDoc.save();
  console.log('✅ Session d’appel créée:', saved._id.toString());
  console.log('📊 Stats:', saved.statistics);

  await mongoose.disconnect();
  console.log('🔌 Déconnecté');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


