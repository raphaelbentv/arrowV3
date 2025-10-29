import React from 'react';
import { Users, User, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from './ProgressBar';
import { cn } from '@/lib/utils';
import styles from './cards.module.css';

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
      navigate('/admin/cohortes');
    }
  };

  const handleViewPlanning = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewPlanning) {
      onViewPlanning(cohorte.id);
    } else {
      navigate('/admin/cohortes');
    }
  };

  const handleViewStats = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/admin/cohortes');
  };

  return (
    <div
      className={cn(styles['base-card'], styles['card-clickable'], styles['cohorte-card'])}
      style={{
        borderTop: `4px solid ${cohorte.color}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderTopWidth = '6px';
        e.currentTarget.style.boxShadow = `0 12px 48px ${cohorte.color}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderTopWidth = '4px';
        e.currentTarget.style.boxShadow = 'none';
      }}
      onClick={handleViewDetails}
    >
      {/* Header */}
      <div className={styles['card-header']}>
        <div className={styles['card-row']} style={{ marginBottom: 0 }}>
          <span className="text-2xl">🎓</span>
          <h4 
            className={styles['card-title']}
            style={{ color: cohorte.color, margin: 0, fontSize: '1.25rem' }}
          >
            {cohorte.name}
          </h4>
        </div>
        <span 
          className={styles['card-badge']}
          style={{
            background: cohorte.status === 'active' ? `${cohorte.color}20` : 'rgba(128, 128, 128, 0.2)',
            color: cohorte.color,
            border: `1px solid ${cohorte.color}60`,
          }}
        >
          {cohorte.status}
        </span>
      </div>

      {/* Grid d'infos */}
      <div className={styles['card-section']}>
        <div className={styles['card-grid']} style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <div className={styles['card-row']}>
            <div className={styles['card-icon-container']} style={{ padding: '0.5rem' }}>
              <Users size={18} style={{ color: '#87ceeb' }} />
            </div>
            <span className={styles['card-text-secondary']}>{cohorte.students} étudiants</span>
          </div>
          <div className={styles['card-row']}>
            <div className={styles['card-icon-container']} style={{ padding: '0.5rem' }}>
              <User size={18} style={{ color: '#87ceeb' }} />
            </div>
            <span className={styles['card-text-secondary']}>{cohorte.intervenant}</span>
          </div>
          <div className={styles['card-row']}>
            <div className={styles['card-icon-container']} style={{ padding: '0.5rem' }}>
              <Calendar size={18} style={{ color: '#87ceeb' }} />
            </div>
            <span className={styles['card-text-secondary']}>{cohorte.nextSession}</span>
          </div>
          <div className={styles['card-row']}>
            <div className={styles['card-icon-container']} style={{ padding: '0.5rem' }}>
              <TrendingUp size={18} style={{ color: '#87ceeb' }} />
            </div>
            <span className={styles['card-text-secondary']}>Active</span>
          </div>
        </div>
      </div>

      {/* Barre de progression */}
      <div className={styles['card-section']}>
        <ProgressBar 
          value={cohorte.progress} 
          color={cohorte.color}
          label="Progression du programme"
          animated
        />
      </div>

      {/* Footer avec boutons */}
      <div className={styles['card-footer']}>
        <button
          onClick={handleViewDetails}
          className={cn(styles['card-button'], styles['card-button-primary'])}
          style={{ flex: 1, background: `${cohorte.color}20`, borderColor: cohorte.color, color: cohorte.color }}
        >
          Voir cohorte
        </button>
        <button
          onClick={handleViewPlanning}
          className={cn(styles['card-button'], styles['card-button-primary'])}
          style={{ flex: 1 }}
        >
          Planning
        </button>
        <button
          onClick={handleViewStats}
          className={styles['card-button']}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: '#87ceeb',
          }}
        >
          Stats
        </button>
      </div>
    </div>
  );
}

