import React from 'react';
import { BookOpen, Clock, Calendar, Award } from 'lucide-react';
import { ModuleCours } from '../../types/module';
import { cn } from '@/lib/utils';
import styles from '../admin/cards.module.css';

interface ModuleCardProps {
  module: ModuleCours;
  onEdit?: (module: ModuleCours) => void;
  onDelete?: (id: string) => void;
  onView?: (module: ModuleCours) => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  onEdit,
  onDelete,
  onView,
}) => {
  const neonPalette = [
    '#3D9BFF', // bleu
    '#FF5ACD', // rose
    '#7CFF5A', // vert
    '#FFC857', // jaune
    '#9B5DFF', // violet
    '#00E5FF', // cyan
  ];

  const computeStableIndex = (key: string) => {
    let acc = 0;
    for (let i = 0; i < key.length; i++) acc = (acc * 31 + key.charCodeAt(i)) >>> 0;
    return acc % neonPalette.length;
  };

  const neon = neonPalette[computeStableIndex(module._id || module.code || 'neon')];

  return (
    <div
      className={cn(styles['base-card'], styles['card-clickable'], styles['module-card'])}
      style={{
        borderTop: `4px solid ${neon}`,
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        padding: '0.75rem',
        minWidth: '320px',
        minHeight: '280px',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderTopWidth = '6px';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 48px ${neon}40`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderTopWidth = '4px';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
      onClick={() => {
        if (onView) onView(module);
      }}
    >
      {/* Header avec icône centrée */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0.375rem', flex: '0 0 auto' }}>
        <div
          style={{
            width: '2.5rem',
            height: '2.5rem',
            minWidth: '2.5rem',
            maxWidth: '2.5rem',
            minHeight: '2.5rem',
            maxHeight: '2.5rem',
            borderRadius: '50%',
            background: `${neon}20`,
            color: neon,
            border: `2px solid ${neon}60`,
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.375rem',
            flexShrink: 0,
          }}
        >
          <BookOpen size={16} />
        </div>
        <h4
          className={styles['card-title']}
          style={{
            color: neon,
            margin: 0,
            fontSize: 'clamp(1rem, 3.5vw, 1.1rem)',
            textAlign: 'center',
            lineHeight: '1.2',
            marginBottom: '0.125rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {module.nom}
        </h4>
        {module.code && (
          <p className={styles['card-text-secondary']} style={{ fontSize: 'clamp(0.8rem, 2.8vw, 0.9rem)', textAlign: 'center' }}>
            {module.code}
          </p>
        )}
      </div>

      {/* Statut badge */}
      <div style={{ marginBottom: '0.375rem', flex: '0 0 auto' }}>
        <span
          className={styles['card-badge']}
          style={{
            background: module.actif ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            color: module.actif ? '#10B981' : '#EF4444',
            border: `1px solid ${module.actif ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)'}`,
            fontSize: 'clamp(0.85rem, 2.8vw, 0.95rem)',
            padding: '0.4rem 0.6rem',
            display: 'inline-block',
            width: '100%',
            textAlign: 'center',
          }}
        >
          {module.actif ? 'Actif' : 'Inactif'}
        </span>
      </div>

      {/* Description courte */}
      {module.descriptionCourte && (
        <p
          className={styles['card-text-secondary']}
          style={{
            fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
            marginBottom: '0.5rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            flex: '0 0 auto',
          }}
        >
          {module.descriptionCourte}
        </p>
      )}

      {/* Métriques compactes */}
      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.5rem', minHeight: 0 }}>
        {module.nombreHeuresTotal && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-1">
                <Clock size={12} style={{ color: '#87ceeb' }} />
                <span className="text-xs font-semibold" style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)' }}>Heures</span>
              </div>
              <span className="text-xs font-bold" style={{ color: neon, fontSize: 'clamp(0.9rem, 2.8vw, 1rem)' }}>
                {module.nombreHeuresTotal}h
              </span>
            </div>
          </div>
        )}
        {module.coefficient && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-1">
                <Award size={12} style={{ color: '#87ceeb' }} />
                <span className="text-xs font-semibold" style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)' }}>Coefficient</span>
              </div>
              <span className="text-xs font-bold" style={{ color: neon, fontSize: 'clamp(0.9rem, 2.8vw, 1rem)' }}>
                {module.coefficient}
              </span>
            </div>
          </div>
        )}
        {module.semestre && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-1">
                <Calendar size={12} style={{ color: '#87ceeb' }} />
                <span className="text-xs font-semibold" style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)' }}>Semestre</span>
              </div>
              <span className="text-xs font-bold" style={{ color: neon, fontSize: 'clamp(0.9rem, 2.8vw, 1rem)' }}>
                {module.semestre}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer boutons compacts */}
      <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.5rem', flex: '0 0 auto' }}>
        {onView && (
          <button
            type="button"
            className={styles['card-button']}
            style={{
              flex: 1,
              padding: '0.4rem 0.5rem',
              fontSize: 'clamp(0.85rem, 2.8vw, 0.95rem)',
              background: `${neon}20`,
              borderColor: neon,
              color: neon,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onView(module);
            }}
          >
            Voir
          </button>
        )}
        {onEdit && (
          <button
            type="button"
            className={styles['card-button']}
            style={{
              flex: 1,
              padding: '0.4rem 0.5rem',
              fontSize: 'clamp(0.85rem, 2.8vw, 0.95rem)',
              background: 'rgba(245, 158, 11, 0.15)',
              borderColor: '#f59e0b',
              color: '#f59e0b',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(module);
            }}
          >
            Mod.
          </button>
        )}
      </div>
    </div>
  );
};

