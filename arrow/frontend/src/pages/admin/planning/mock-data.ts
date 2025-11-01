export interface CourseData {
  id: string;
  title: string;
  cohort: string;
  cohortColor: string;
  room: string;
  instructor: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number; // 0 = Dimanche, 1 = Lundi, etc.
  attendanceDone: boolean;
  studentsCount: number;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  moduleId?: string;
  instructorId?: string;
}

export const coursesData: CourseData[] = [
  {
    id: '1',
    title: 'Marketing Digital',
    cohort: 'BTS-COM-24',
    cohortColor: 'blue',
    room: 'A204',
    instructor: 'M. Dupont',
    startTime: '09:00',
    endTime: '12:00',
    dayOfWeek: 1, // Lundi
    attendanceDone: true,
    studentsCount: 25,
    status: 'completed'
  },
  {
    id: '2',
    title: 'Communication Web',
    cohort: 'BTS-COM-24',
    cohortColor: 'blue',
    room: 'A205',
    instructor: 'Mme. Martin',
    startTime: '14:00',
    endTime: '17:00',
    dayOfWeek: 1,
    attendanceDone: false,
    studentsCount: 25,
    status: 'planned'
  },
  {
    id: '3',
    title: 'Gestion de Projet',
    cohort: 'BACHELOR-MKT-24',
    cohortColor: 'green',
    room: 'B101',
    instructor: 'M. Bernard',
    startTime: '08:00',
    endTime: '11:00',
    dayOfWeek: 2, // Mardi
    attendanceDone: false,
    studentsCount: 30,
    status: 'planned'
  },
  {
    id: '4',
    title: 'Développement Front-end',
    cohort: 'BTS-COM-24',
    cohortColor: 'blue',
    room: 'A204',
    instructor: 'M. Leroy',
    startTime: '09:00',
    endTime: '12:00',
    dayOfWeek: 3, // Mercredi
    attendanceDone: false,
    studentsCount: 25,
    status: 'ongoing'
  },
  {
    id: '5',
    title: 'Stratégie Marketing',
    cohort: 'BACHELOR-MKT-24',
    cohortColor: 'green',
    room: 'B102',
    instructor: 'Mme. Dubois',
    startTime: '14:00',
    endTime: '17:00',
    dayOfWeek: 3,
    attendanceDone: true,
    studentsCount: 30,
    status: 'completed'
  },
  {
    id: '6',
    title: 'UX/UI Design',
    cohort: 'BTS-COM-24',
    cohortColor: 'blue',
    room: 'A204',
    instructor: 'Mme. Martin',
    startTime: '08:00',
    endTime: '11:00',
    dayOfWeek: 4, // Jeudi
    attendanceDone: false,
    studentsCount: 25,
    status: 'planned'
  },
  {
    id: '7',
    title: 'E-commerce',
    cohort: 'BACHELOR-MKT-24',
    cohortColor: 'green',
    room: 'B103',
    instructor: 'M. Dupont',
    startTime: '13:00',
    endTime: '16:00',
    dayOfWeek: 4,
    attendanceDone: false,
    studentsCount: 30,
    status: 'planned'
  },
  {
    id: '8',
    title: 'Réseaux Sociaux',
    cohort: 'BTS-COM-24',
    cohortColor: 'blue',
    room: 'A205',
    instructor: 'Mme. Martin',
    startTime: '09:00',
    endTime: '12:00',
    dayOfWeek: 5, // Vendredi
    attendanceDone: false,
    studentsCount: 25,
    status: 'planned'
  },
  {
    id: '9',
    title: 'Analyse de Données',
    cohort: 'BACHELOR-MKT-24',
    cohortColor: 'green',
    room: 'B101',
    instructor: 'M. Bernard',
    startTime: '14:00',
    endTime: '17:00',
    dayOfWeek: 5,
    attendanceDone: false,
    studentsCount: 30,
    status: 'planned'
  },
  {
    id: '10',
    title: 'SEO & SEM',
    cohort: 'BTS-COM-24',
    cohortColor: 'blue',
    room: 'A204',
    instructor: 'M. Leroy',
    startTime: '08:00',
    endTime: '10:30',
    dayOfWeek: 1,
    attendanceDone: true,
    studentsCount: 25,
    status: 'completed'
  },
  {
    id: '11',
    title: 'JavaScript Avancé',
    cohort: 'BTS-COM-24',
    cohortColor: 'blue',
    room: 'A204',
    instructor: 'M. Leroy',
    startTime: '10:00',
    endTime: '13:00',
    dayOfWeek: 1,
    attendanceDone: false,
    studentsCount: 25,
    status: 'ongoing'
  },
  {
    id: '12',
    title: 'Content Marketing',
    cohort: 'BACHELOR-MKT-24',
    cohortColor: 'green',
    room: 'B102',
    instructor: 'Mme. Dubois',
    startTime: '08:00',
    endTime: '11:00',
    dayOfWeek: 2,
    attendanceDone: false,
    studentsCount: 30,
    status: 'planned'
  },
  {
    id: '14',
    title: 'Branding & Identity',
    cohort: 'BACHELOR-MKT-24',
    cohortColor: 'green',
    room: 'B103',
    instructor: 'Mme. Dubois',
    startTime: '09:00',
    endTime: '12:00',
    dayOfWeek: 3,
    attendanceDone: false,
    studentsCount: 30,
    status: 'ongoing'
  },
  {
    id: '15',
    title: 'Base de Données',
    cohort: 'BTS-COM-24',
    cohortColor: 'blue',
    room: 'A204',
    instructor: 'M. Bernard',
    startTime: '10:00',
    endTime: '13:00',
    dayOfWeek: 3,
    attendanceDone: true,
    studentsCount: 25,
    status: 'completed'
  },
  {
    id: '16',
    title: 'Influence Marketing',
    cohort: 'BACHELOR-MKT-24',
    cohortColor: 'green',
    room: 'B101',
    instructor: 'M. Dupont',
    startTime: '08:00',
    endTime: '10:00',
    dayOfWeek: 4,
    attendanceDone: false,
    studentsCount: 30,
    status: 'planned'
  },
  {
    id: '17',
    title: 'Backend API',
    cohort: 'BTS-COM-24',
    cohortColor: 'blue',
    room: 'A204',
    instructor: 'M. Bernard',
    startTime: '10:00',
    endTime: '13:00',
    dayOfWeek: 4,
    attendanceDone: false,
    studentsCount: 25,
    status: 'ongoing'
  },
  {
    id: '18',
    title: 'Publicité Digitale',
    cohort: 'BACHELOR-MKT-24',
    cohortColor: 'green',
    room: 'B102',
    instructor: 'M. Dupont',
    startTime: '09:00',
    endTime: '12:00',
    dayOfWeek: 5,
    attendanceDone: false,
    studentsCount: 30,
    status: 'planned'
  },
  {
    id: '19',
    title: 'Projet Portfolio',
    cohort: 'BTS-COM-24',
    cohortColor: 'blue',
    room: 'A205',
    instructor: 'Mme. Martin',
    startTime: '08:00',
    endTime: '11:00',
    dayOfWeek: 5,
    attendanceDone: false,
    studentsCount: 25,
    status: 'planned'
  },
];

export const cohorts = [
  { id: 'all', name: 'Toutes les cohortes' },
  { id: 'BTS-COM-24', name: 'BTS-COM-24' },
  { id: 'BACHELOR-MKT-24', name: 'BACHELOR-MKT-24' },
  { id: 'MBA-2024', name: 'MBA-2024' },
];

export const instructors = [
  { id: 'all', name: 'Tous les intervenants' },
  { id: 'dupont', name: 'M. Dupont' },
  { id: 'martin', name: 'Mme. Martin' },
  { id: 'bernard', name: 'M. Bernard' },
  { id: 'leroy', name: 'M. Leroy' },
  { id: 'dubois', name: 'Mme. Dubois' },
];

export const rooms = [
  { id: 'all', name: 'Toutes les salles' },
  { id: 'A204', name: 'A204' },
  { id: 'A205', name: 'A205' },
  { id: 'B101', name: 'B101' },
  { id: 'B102', name: 'B102' },
  { id: 'B103', name: 'B103' },
];

