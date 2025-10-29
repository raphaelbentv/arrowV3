import React from 'react';
import { Users, User, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from './ProgressBar';
import { cn } from '@/lib/utils';

interface CohorteCardProps {
  cohorte: {
    id: number;
    name: string;
    students: number;
    intervenant: string;
    nextSession: string;
    progress: number;
    color: string;
    status: string;
  };
  onViewDetails?: (id: number) => void;
  onViewPlanning?: (id: number) => void;
}

export function CohorteCard({ cohorte, onViewDetails, onViewPlanning }: CohorteCardProps) {
  const navigate = useNavigate();

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(cohorte.id);
    } else {
      navigate(`/admin/cohortes/${cohorte.id}`);
    }
  };

  const handleViewPlanning = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewPlanning) {
      onViewPlanning(cohorte.id);
    } else {
      navigate(`/admin/cohortes/${cohorte.id}/planning`);
    }
  };

  const handleViewStats = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/admin/cohortes/${cohorte.id}/stats`);
  };

  return (
    <div
      className={cn(
        "rounded-xl p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl cursor-pointer",
      )}
      style={{
        background: 'rgba(0, 0, 0, 0.6)',
        border: '2px solid rgba(61, 155, 255, 0.3)',
        borderTop: `4px solid ${cohorte.color}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderTopColor = cohorte.color;
        e.currentTarget.style.borderTopWidth = '6px';
        e.currentTarget.style.boxShadow = `0 12px 48px ${cohorte.color}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderTopColor = cohorte.color;
        e.currentTarget.style.borderTopWidth = '4px';
        e.currentTarget.style.boxShadow = 'none';
      }}
      onClick={handleViewDetails}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <h4 
            className="text-xl font-bold"
            style={{ color: cohorte.color }}
          >
            {cohorte.name}
          </h4>
        </div>
        <span 
          className="px-3 py-1 rounded-full text-xs font-bold uppercase"
          style={{
            background: cohorte.status === 'active' ? `${cohorte.color}20` : '#gray-50020',
            color: cohorte.color,
            border: `1px solid ${cohorte.color}60`,
          }}
        >
          {cohorte.status}
        </span>
      </div>

      {/* Grid d'infos */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Users size={18} style={{ color: '#87ceeb' }} />
          <span className="text-sm text-gray-400">{cohorte.students} étudiants</span>
        </div>
        <div className="flex items-center gap-2">
          <User size={18} style={{ color: '#87ceeb' }} />
          <span className="text-sm text-gray-400">{cohorte.intervenant}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={18} style={{ color: '#87ceeb' }} />
          <span className="text-sm text-gray-400">{cohorte.nextSession}</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp size={18} style={{ color: '#87ceeb' }} />
          <span className="text-sm text-gray-400">Active</span>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mb-4">
        <ProgressBar 
          value={cohorte.progress} 
          color={cohorte.color}
          label="Progression du programme"
          animated
        />
      </div>

      {/* Footer avec boutons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleViewDetails}
          className="flex-1 py-2 px-4 rounded-lg font-bold uppercase tracking-[0.1em] text-xs transition-all hover:scale-105"
          style={{
            background: `${cohorte.color}20`,
            border: `2px solid ${cohorte.color}`,
            color: cohorte.color,
          }}
        >
          Voir cohorte
        </button>
        <button
          onClick={handleViewPlanning}
          className="flex-1 py-2 px-4 rounded-lg font-bold uppercase tracking-[0.1em] text-xs transition-all hover:scale-105"
          style={{
            background: 'rgba(61, 155, 255, 0.1)',
            border: '2px solid rgba(61, 155, 255, 0.5)',
            color: '#87ceeb',
          }}
        >
          Planning
        </button>
        <button
          onClick={handleViewStats}
          className="px-4 py-2 rounded-lg font-bold uppercase tracking-[0.1em] text-xs transition-all hover:scale-105"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            color: '#87ceeb',
          }}
        >
          Stats
        </button>
      </div>
    </div>
  );
}

