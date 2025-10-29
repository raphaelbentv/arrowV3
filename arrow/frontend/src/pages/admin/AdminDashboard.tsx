import React from 'react';
import { 
  GraduationCap, 
  UserCog, 
  BookOpen, 
  TrendingUp,
  Layers,
  Award,
  Heart,
  Target,
  Calendar,
  UsersRound
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { StatCard, AlertBadge, CohorteCard, ActivityItem, ChartCard } from '@/components/admin';
import { mockDashboardData } from '@/data/mock-dashboard-data';
import styles from '@/components/admin/StatCard.module.css';
import cardStyles from '@/components/admin/cards.module.css';

const COLORS = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#06B6D4',
  purple: '#8B5CF6',
  pink: '#EC4899',
};

// Header du dashboard
function DashboardHeader({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ margin: 0, padding: 0, ...style }}>
      <h1 
        className="text-4xl font-black uppercase tracking-[0.15em]"
        style={{
          background: 'linear-gradient(180deg, #3d9bff, #87ceeb, #5dbaff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0,
          padding: 0,
        }}
      >
        Dashboard Admin
      </h1>
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const data = mockDashboardData;

  // Préparer les données pour le graphique de présence
  const attendanceChartData = data.attendanceChart.map(item => ({
    date: new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    Présentes: item.present,
    Absentes: item.absent,
  }));

  return (
    <div className="animate-fade-in" style={{ padding: 0, margin: 0 }}>
        {/* Header */}
        <DashboardHeader style={{ marginBottom: '4rem' }} />

        {/* Section KPIs - Statistiques principales */}
        <section style={{ margin: 0, padding: 0, marginBottom: '4rem' }}>
          <h2 
            className="text-2xl font-black uppercase tracking-[0.1em] mb-6"
            style={{ color: '#3d9bff', margin: 0, padding: 0, marginBottom: '1.5rem' }}
          >
            Résumé Général
          </h2>
          <div className={styles['cards-container']}>
            <StatCard
              icon={GraduationCap}
              title="Étudiants"
              value={data.stats.students.value}
              trend={data.stats.students.trend}
              sparklineData={data.stats.students.sparkline}
              color={COLORS.primary}
              href="/admin/students"
            />
            <StatCard
              icon={UserCog}
              title="Intervenants"
              value={data.stats.teachers.value}
              trend={data.stats.teachers.trend}
              sparklineData={data.stats.teachers.sparkline}
              color={COLORS.purple}
              href="/admin/intervenant-list"
            />
            <StatCard
              icon={Layers}
              title="Cohortes"
              value={data.stats.cohorts.value}
              trend={data.stats.cohorts.trend}
              sparklineData={data.stats.cohorts.sparkline}
              color={COLORS.info}
              href="/admin/cohortes"
            />
            <StatCard
              icon={BookOpen}
              title="Cours"
              value={data.stats.courses.value}
              trend={data.stats.courses.trend}
              sparklineData={data.stats.courses.sparkline}
              color={COLORS.warning}
              href="/admin/courses"
            />
            <StatCard
              icon={TrendingUp}
              title="Présence"
              value={data.stats.attendance.value}
              trend={data.stats.attendance.trend}
              sparklineData={data.stats.attendance.sparkline}
              color={COLORS.success}
              href="/admin/calls"
              suffix="%"
            />
            <StatCard
              icon={Award}
              title="Taux de Réussite"
              value={data.stats.successRate.value}
              trend={data.stats.successRate.trend}
              sparklineData={data.stats.successRate.sparkline}
              color={COLORS.success}
              suffix="%"
            />
            <StatCard
              icon={Heart}
              title="Satisfaction"
              value={data.stats.satisfaction.value}
              trend={data.stats.satisfaction.trend}
              sparklineData={data.stats.satisfaction.sparkline}
              color={COLORS.pink}
              suffix="/5"
            />
            <StatCard
              icon={Target}
              title="Taux d'Achèvement"
              value={data.stats.completionRate.value}
              trend={data.stats.completionRate.trend}
              sparklineData={data.stats.completionRate.sparkline}
              color={COLORS.info}
              suffix="%"
            />
            <StatCard
              icon={Calendar}
              title="Sessions Planifiées"
              value={data.stats.scheduledSessions.value}
              trend={data.stats.scheduledSessions.trend}
              sparklineData={data.stats.scheduledSessions.sparkline}
              color={COLORS.warning}
            />
            <StatCard
              icon={UsersRound}
              title="Taux de Rétention"
              value={data.stats.retentionRate.value}
              trend={data.stats.retentionRate.trend}
              sparklineData={data.stats.retentionRate.sparkline}
              color={COLORS.primary}
              suffix="%"
            />
          </div>
        </section>

        {/* Section Graphiques */}
        <section style={{ margin: 0, padding: 0, marginBottom: '4rem' }}>
          <div className={cardStyles['cards-container-flex']}>
            <ChartCard title="Évolution des Présences (30 jours)" height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceChartData}>
                    <defs>
                      <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COLORS.success} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.error} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COLORS.error} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#87ceeb"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#87ceeb"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(0, 0, 0, 0.9)', 
                        border: '1px solid #3d9bff',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="Présentes" 
                      stroke={COLORS.success} 
                      fillOpacity={1} 
                      fill="url(#colorPresent)"
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Absentes" 
                      stroke={COLORS.error} 
                      fillOpacity={1} 
                      fill="url(#colorAbsent)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

            {/* PieChart Donut */}
            <ChartCard title="Répartition Présences" height={200}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.presenceDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.presenceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(0, 0, 0, 0.9)', 
                        border: '1px solid #3d9bff',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-2">
                  <p className="text-2xl font-bold" style={{ color: COLORS.success }}>
                    {data.presenceDistribution[0].value}
                  </p>
                  <p className="text-xs text-gray-400">Présents</p>
                </div>
              </ChartCard>

            {/* Top 3 Cohortes */}
            <ChartCard title="Top 3 Cohortes" height={150}>
                <div className="space-y-3">
                  {data.topCohortes.map((cohorte, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ background: cohorte.color }}
                        />
                        <span className="text-sm text-gray-300">{cohorte.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 rounded-full bg-gray-800 overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${cohorte.rate}%`,
                              background: cohorte.color,
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold" style={{ color: cohorte.color }}>
                          {cohorte.rate}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>
          </div>
        </section>

        {/* Section Suivi Temps Réel */}
        <section style={{ margin: 0, padding: 0, marginBottom: '4rem' }}>
          <div className={cardStyles['cards-container-flex']}>
            <ChartCard title="Dernières Sessions" height={400}>
                <div className={cardStyles['card-list']} style={{ maxHeight: '340px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  {data.recentSessions.map((session) => {
                    const presenceColor = 
                      session.presence >= 90 ? COLORS.success :
                      session.presence >= 70 ? COLORS.warning : COLORS.error;
                    const statusColor = 
                      session.status === 'En cours' ? COLORS.success :
                      session.status === 'Terminé' ? COLORS.info : '#gray-400';

                    return (
                      <div
                        key={session.id}
                        className={cardStyles['card-row']}
                        style={{
                          padding: '1rem',
                          borderRadius: '8px',
                          background: 'rgba(31, 41, 55, 0.5)',
                          transition: 'all 0.2s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(31, 41, 55, 0.8)';
                          e.currentTarget.style.transform = 'scale(1.01)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(31, 41, 55, 0.5)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {/* Avatar */}
                        <div
                          className={cardStyles['card-icon-container']}
                          style={{
                            width: '3rem',
                            height: '3rem',
                            borderRadius: '50%',
                            background: `${COLORS.primary}20`,
                            color: COLORS.primary,
                            border: `2px solid ${COLORS.primary}40`,
                            fontSize: '0.875rem',
                            fontWeight: 700,
                          }}
                        >
                          {session.intervenantAvatar}
                        </div>

                        {/* Info */}
                        <div className={cardStyles['card-content']} style={{ flex: 1, minWidth: 0 }}>
                          <p className={cardStyles['card-text-primary']} style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                            {session.cohorte}
                          </p>
                          <p className={cardStyles['card-text-secondary']} style={{ fontSize: '0.75rem' }}>
                            {session.intervenant} • {session.date} à {session.time}
                          </p>
                        </div>

                        {/* Badge présence */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span
                            className={cardStyles['card-badge']}
                            style={{
                              background: `${presenceColor}20`,
                              color: presenceColor,
                              border: `1px solid ${presenceColor}60`,
                            }}
                          >
                            {session.presence}%
                          </span>
                          <div
                            style={{
                              width: '0.5rem',
                              height: '0.5rem',
                              borderRadius: '50%',
                              background: statusColor,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ChartCard>

            <ChartCard title="Activité Récente" height={400}>
                <div className={cardStyles['card-list']} style={{ maxHeight: '340px', overflowY: 'auto' }}>
                  {data.activities.map((activity, index) => (
                    <React.Fragment key={index}>
                      <ActivityItem
                        icon={activity.icon as 'UserPlus' | 'CalendarPlus' | 'Edit' | 'Phone'}
                        title={activity.action}
                        timestamp={activity.timestamp}
                        user={activity.name}
                        color={activity.color}
                      />
                      {index < data.activities.length - 1 && (
                        <hr className={cardStyles['card-divider']} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </ChartCard>
          </div>
        </section>

        {/* Section Alertes */}
        <section style={{ margin: 0, padding: 0, marginBottom: '4rem' }}>
          <h2 
            className="text-2xl font-black uppercase tracking-[0.1em] mb-6"
            style={{ color: '#3d9bff', margin: 0, padding: 0, marginBottom: '1.5rem' }}
          >
            Alertes & Actions Requises
          </h2>
          <div 
            className={cardStyles['cards-container-flex']}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '1.5rem',
            }}
          >
            <AlertBadge
              type="risk"
              count={data.alerts.studentsAtRisk.count}
              severity="high"
              items={data.alerts.studentsAtRisk.items}
            />
            <AlertBadge
              type="conflict"
              count={data.alerts.scheduleConflicts.count}
              severity="medium"
              items={data.alerts.scheduleConflicts.items}
            />
            <AlertBadge
              type="evaluation"
              count={data.alerts.pendingEvaluations.count}
              severity="low"
              items={data.alerts.pendingEvaluations.items}
            />
          </div>
        </section>

        {/* Section Cohortes Actives */}
        <section style={{ margin: 0, padding: 0, marginBottom: '4rem' }}>
          <h2 
            className="text-2xl font-black uppercase tracking-[0.1em] mb-6"
            style={{ color: '#3d9bff', margin: 0, padding: 0, marginBottom: '1.5rem' }}
          >
            Cohortes Actives
          </h2>
          <div className={cardStyles['cards-container-flex']}>
            {data.cohorts.map((cohorte) => (
              <CohorteCard
                key={cohorte.id}
                cohorte={cohorte}
              />
            ))}
          </div>
        </section>

        {/* Animation CSS */}
        <style>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
        `}</style>
    </div>
  );
};

export default AdminDashboard;
