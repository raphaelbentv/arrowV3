import React, { useState } from 'react';
import { 
  GraduationCap, 
  UserCog, 
  BookOpen, 
  TrendingUp,
  Layers,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
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

const COLORS = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#06B6D4',
  purple: '#8B5CF6',
};

// Header du dashboard
function DashboardHeader({ 
  lastUpdate, 
  onRefresh 
}: { 
  lastUpdate: Date;
  onRefresh: () => void;
}) {
  const [dateFilter, setDateFilter] = useState('30days');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Ici vous pouvez implémenter la logique de recherche
    console.log('Recherche dashboard:', query);
  };

  return (
    <div className="mb-8">
      {/* Titre et date de dernière mise à jour */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 
            className="text-4xl font-black uppercase tracking-[0.15em] mb-2"
            style={{
              background: 'linear-gradient(180deg, #3d9bff, #87ceeb, #5dbaff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Dashboard Admin
          </h1>
          <p 
            className="text-sm font-bold uppercase tracking-[0.2em]"
            style={{ color: '#87ceeb' }}
          >
            Vue d'ensemble en temps réel • Dernière mise à jour : {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold uppercase tracking-[0.1em] text-xs transition-all hover:scale-105"
          style={{
            background: 'rgba(61, 155, 255, 0.2)',
            border: '2px solid #3d9bff',
            color: '#3d9bff',
          }}
        >
          <RefreshCw size={16} />
          Actualiser
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative max-w-2xl">
          <Search 
            size={20} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
            style={{ color: '#87ceeb' }}
          />
          <input
            type="text"
            placeholder="Rechercher des cohortes, étudiants, intervenants..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg text-sm font-bold uppercase tracking-[0.1em] transition-all focus:outline-none focus:ring-2"
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '2px solid rgba(61, 155, 255, 0.3)',
              color: '#87ceeb',
              boxShadow: '0 0 0 0 rgba(61, 155, 255, 0)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3d9bff';
              e.target.style.boxShadow = '0 0 0 2px rgba(61, 155, 255, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(61, 155, 255, 0.3)';
              e.target.style.boxShadow = '0 0 0 0 rgba(61, 155, 255, 0)';
            }}
          />
        </div>
      </div>

      {/* Filtres de date */}
      <div className="flex items-center gap-2">
        <Filter size={20} style={{ color: '#87ceeb' }} />
        <div className="flex gap-2 flex-wrap">
          {['Aujourd\'hui', '7 jours', '30 jours', 'Personnalisé'].map((filter) => (
            <button
              key={filter}
              onClick={() => setDateFilter(filter.toLowerCase())}
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                dateFilter === filter.toLowerCase() 
                  ? 'bg-[#3d9bff] text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const data = mockDashboardData;

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // Ici, vous feriez un appel API pour rafraîchir les données
  };

  // Préparer les données pour le graphique de présence
  const attendanceChartData = data.attendanceChart.map(item => ({
    date: new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    Présentes: item.present,
    Absentes: item.absent,
  }));

  return (
    <div className="space-y-8 animate-fade-in" style={{ padding: '2rem' }}>
        {/* Header */}
        <DashboardHeader lastUpdate={lastUpdate} onRefresh={handleRefresh} />

        {/* Section KPIs - 5 cards */}
        <section>
          <h2 
            className="text-2xl font-black uppercase tracking-[0.1em] mb-6"
            style={{ color: '#3d9bff' }}
          >
            Résumé Général
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
          </div>
        </section>

        {/* Section Graphiques */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Graphique principal - LineChart */}
            <div className="lg:col-span-8">
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
            </div>

            {/* Colonne droite - PieChart et Top 3 */}
            <div className="lg:col-span-4 space-y-6">
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
          </div>
        </section>

        {/* Section Suivi Temps Réel */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Dernières Sessions */}
            <div className="lg:col-span-7">
              <ChartCard title="Dernières Sessions" height={400}>
                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-2">
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
                        className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all hover:scale-[1.01]"
                      >
                        {/* Avatar */}
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm"
                          style={{
                            background: `${COLORS.primary}20`,
                            color: COLORS.primary,
                            border: `2px solid ${COLORS.primary}40`,
                          }}
                        >
                          {session.intervenantAvatar}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm" style={{ color: '#3d9bff' }}>
                            {session.cohorte}
                          </p>
                          <p className="text-xs text-gray-400">
                            {session.intervenant} • {session.date} à {session.time}
                          </p>
                        </div>

                        {/* Badge présence */}
                        <div className="flex items-center gap-3">
                          <div
                            className="px-3 py-1 rounded-full text-xs font-bold"
                            style={{
                              background: `${presenceColor}20`,
                              color: presenceColor,
                              border: `1px solid ${presenceColor}60`,
                            }}
                          >
                            {session.presence}%
                          </div>
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: statusColor }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ChartCard>
            </div>

            {/* Activité Récente */}
            <div className="lg:col-span-5">
              <ChartCard title="Activité Récente" height={400}>
                <div className="space-y-2 max-h-[340px] overflow-y-auto">
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
                        <div 
                          className="h-px my-2"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${activity.color}40, transparent)`,
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </ChartCard>
            </div>
          </div>
        </section>

        {/* Section Alertes */}
        <section>
          <h2 
            className="text-2xl font-black uppercase tracking-[0.1em] mb-6"
            style={{ color: '#3d9bff' }}
          >
            Alertes & Actions Requises
          </h2>
          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid rgba(239, 68, 68, 0.3)',
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
        <section>
          <h2 
            className="text-2xl font-black uppercase tracking-[0.1em] mb-6"
            style={{ color: '#3d9bff' }}
          >
            Cohortes Actives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
