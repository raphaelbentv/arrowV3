// Données mockées pour le dashboard admin

export const mockDashboardData = {
  stats: {
    students: { 
      value: 245, 
      trend: +12, 
      sparkline: [220, 225, 230, 235, 240, 242, 245] 
    },
    teachers: { 
      value: 18, 
      trend: +2, 
      sparkline: [16, 16, 17, 17, 17, 18, 18] 
    },
    cohorts: { 
      value: 12, 
      trend: 0, 
      sparkline: [12, 12, 12, 12, 12, 12, 12] 
    },
    courses: { 
      value: 34, 
      trend: +5, 
      sparkline: [29, 30, 31, 31, 32, 33, 34] 
    },
    attendance: { 
      value: 87.5, 
      trend: -2.3, 
      sparkline: [89, 88.5, 88, 87.8, 87.6, 87.5, 87.5] 
    },
    successRate: { 
      value: 92.3, 
      trend: +3.5, 
      sparkline: [88, 89, 90, 90.5, 91, 91.5, 92.3] 
    },
    satisfaction: { 
      value: 4.7, 
      trend: +0.2, 
      sparkline: [4.5, 4.5, 4.6, 4.6, 4.65, 4.7, 4.7] 
    },
    completionRate: { 
      value: 78.5, 
      trend: +5.2, 
      sparkline: [73, 74, 75, 76, 77, 77.5, 78.5] 
    },
    scheduledSessions: { 
      value: 42, 
      trend: +8, 
      sparkline: [34, 35, 36, 38, 39, 40, 42] 
    },
    retentionRate: { 
      value: 85.2, 
      trend: +2.1, 
      sparkline: [83, 83.5, 84, 84.5, 84.8, 85, 85.2] 
    }
  },
  attendanceChart: Array.from({ length: 30 }, (_, i) => ({
    date: `2024-01-${String(i + 1).padStart(2, '0')}`,
    present: Math.floor(200 + Math.random() * 40),
    absent: Math.floor(20 + Math.random() * 15),
  })),
  presenceDistribution: [
    { name: 'Présent', value: 210, color: '#10B981' },
    { name: 'Absent', value: 25, color: '#EF4444' },
    { name: 'Retard', value: 10, color: '#F59E0B' },
  ],
  topCohortes: [
    { name: 'Cohorte A', rate: 94, color: '#10B981' },
    { name: 'Cohorte B', rate: 91, color: '#10B981' },
    { name: 'Cohorte C', rate: 88, color: '#F59E0B' },
  ],
  recentSessions: [
    { 
      id: 1, 
      cohorte: 'Cohorte A - Développement Web', 
      intervenant: 'Jean Dupont',
      intervenantAvatar: 'JD',
      date: '2024-01-15',
      time: '14:00',
      presence: 92,
      status: 'Terminé'
    },
    { 
      id: 2, 
      cohorte: 'Cohorte B - Data Science', 
      intervenant: 'Marie Martin',
      intervenantAvatar: 'MM',
      date: '2024-01-14',
      time: '10:00',
      presence: 85,
      status: 'Terminé'
    },
    { 
      id: 3, 
      cohorte: 'Cohorte C - UI/UX Design', 
      intervenant: 'Pierre Durand',
      intervenantAvatar: 'PD',
      date: '2024-01-13',
      time: '16:00',
      presence: 88,
      status: 'Terminé'
    },
    { 
      id: 4, 
      cohorte: 'Cohorte D - Marketing', 
      intervenant: 'Sophie Bernard',
      intervenantAvatar: 'SB',
      date: '2024-01-16',
      time: '09:00',
      presence: 0,
      status: 'À venir'
    },
  ],
  activities: [
    { 
      type: 'student', 
      icon: 'UserPlus',
      action: 'Nouvel étudiant ajouté', 
      name: 'Sophie Bernard', 
      timestamp: new Date('2024-01-15T14:30:00'),
      color: '#3B82F6'
    },
    { 
      type: 'cohorte', 
      icon: 'CalendarPlus',
      action: 'Cohorte créée', 
      name: 'Cohorte D - Marketing Digital', 
      timestamp: new Date('2024-01-15T10:15:00'),
      color: '#8B5CF6'
    },
    { 
      type: 'user', 
      icon: 'Edit',
      action: 'Utilisateur modifié', 
      name: 'Admin - Jean Dupont', 
      timestamp: new Date('2024-01-14T16:45:00'),
      color: '#06B6D4'
    },
    { 
      type: 'call', 
      icon: 'Phone',
      action: 'Session terminée', 
      name: 'Cohorte A - Développement Web', 
      timestamp: new Date('2024-01-14T18:00:00'),
      color: '#10B981'
    },
  ],
  alerts: {
    studentsAtRisk: {
      count: 8,
      items: [
        { name: 'Marc Dubois', presence: 65, cohorte: 'Cohorte A' },
        { name: 'Julie Martin', presence: 68, cohorte: 'Cohorte B' },
        { name: 'Paul Durand', presence: 62, cohorte: 'Cohorte C' },
      ]
    },
    scheduleConflicts: {
      count: 3,
      items: [
        { cohorte: 'Cohorte A', date: '2024-01-20', conflict: 'Salle occupée' },
        { cohorte: 'Cohorte B', date: '2024-01-21', conflict: 'Intervenant indisponible' },
      ]
    },
    pendingEvaluations: {
      count: 12,
      items: [
        { student: 'Sophie Bernard', course: 'Développement Web', date: '2024-01-10' },
        { student: 'Marc Dubois', course: 'Data Science', date: '2024-01-11' },
      ]
    }
  },
  cohorts: [
    { 
      id: 1, 
      name: 'Cohorte A - Développement Web', 
      students: 25, 
      intervenant: 'Jean Dupont', 
      nextSession: '2024-01-20',
      progress: 72,
      color: '#3B82F6',
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Cohorte B - Data Science', 
      students: 20, 
      intervenant: 'Marie Martin', 
      nextSession: '2024-01-19',
      progress: 65,
      color: '#8B5CF6',
      status: 'active'
    },
    { 
      id: 3, 
      name: 'Cohorte C - UI/UX Design', 
      students: 18, 
      intervenant: 'Pierre Durand', 
      nextSession: '2024-01-18',
      progress: 58,
      color: '#06B6D4',
      status: 'active'
    },
    { 
      id: 4, 
      name: 'Cohorte D - Marketing Digital', 
      students: 22, 
      intervenant: 'Sophie Bernard', 
      nextSession: '2024-01-22',
      progress: 45,
      color: '#F59E0B',
      status: 'active'
    },
  ]
};

