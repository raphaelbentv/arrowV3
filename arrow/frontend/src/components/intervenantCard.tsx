import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Intervenant } from '../types/intervenant';
import { cn } from '@/lib/utils';
import styles from './admin/cards.module.css';

interface IntervenantCardProps {
  intervenant: Intervenant;
  onView?: (intervenant: Intervenant) => void;
}

const IntervenantCard: React.FC<IntervenantCardProps> = ({ intervenant, onView }) => {
  const navigate = useNavigate();

  const neonPalette = [
    '#3D9BFF',
    '#FF5ACD',
    '#7CFF5A',
    '#FFC857',
    '#9B5DFF',
    '#00E5FF',
  ];

  const computeStableIndex = (key: string) => {
    let acc = 0;
    for (let i = 0; i < key.length; i++) acc = (acc * 31 + key.charCodeAt(i)) >>> 0;
    return acc % neonPalette.length;
  };

  const neon = neonPalette[computeStableIndex(intervenant._id || intervenant.nom || 'neon')];

  const isInactive = (() => {
    try {
      const raw = localStorage.getItem('intervenant_state');
      const state = raw ? JSON.parse(raw) : {};
      return !!(state[intervenant._id]?.inactive);
    } catch {
      return false;
    }
  })();

  const getInitiales = () => {
    const nom = intervenant.nom?.charAt(0)?.toUpperCase() || '';
    const prenom = intervenant.prenom?.charAt(0)?.toUpperCase() || '';
    return `${nom}${prenom}` || '?';
  };

  return (
    <div
      className={cn(styles['base-card'], styles['card-clickable'])}
      style={{
        borderTop: `4px solid ${neon}`,
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        padding: '0.75rem',
        minWidth: '320px',
        minHeight: '260px',
        overflow: 'hidden',
        opacity: isInactive ? 0.55 : 1,
        filter: isInactive ? 'grayscale(0.2)' : 'none',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderTopWidth = '6px';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 48px ${neon}40`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderTopWidth = '4px';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
      onClick={() => (onView ? onView(intervenant) : navigate(`/admin/intervenants/${intervenant._id}`))}
    >
      {isInactive && (
        <div style={{ position: 'absolute', top: 8, right: 8, fontSize: '0.7rem', fontWeight: 800, color: '#a0aec0' }}>INACTIF</div>
      )}
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0.5rem' }}>
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
          }}
        >
          {getInitiales()}
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
          {intervenant.prenom} {intervenant.nom}
        </h4>
        {intervenant.poste && (
          <p className={styles['card-text-secondary']} style={{ fontSize: 'clamp(0.8rem, 2.8vw, 0.9rem)', textAlign: 'center' }}>
            {intervenant.poste}
          </p>
        )}
      </div>

      {/* Badge statut */}
      {intervenant.statut && (
        <div style={{ marginBottom: '0.5rem' }}>
          <span
            className={styles['card-badge']}
            style={{
              background: `${neon}20`,
              color: neon,
              border: `1px solid ${neon}60`,
              fontSize: 'clamp(0.85rem, 2.8vw, 0.95rem)',
              padding: '0.35rem 0.6rem',
              display: 'inline-block',
              width: '100%',
              textAlign: 'center',
            }}
          >
            {intervenant.statut}
          </span>
        </div>
      )}

      {/* Infos */}
      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {intervenant.email && (
          <p className={styles['card-text-secondary']}>
            Email: {intervenant.email}
          </p>
        )}
        {intervenant.telephone && (
          <p className={styles['card-text-secondary']}>
            Téléphone: {intervenant.telephone}
          </p>
        )}
        {intervenant.domainesExpertise && intervenant.domainesExpertise.length > 0 && (
          <p className={styles['card-text-secondary']}>
            Domaines: {intervenant.domainesExpertise.join(', ')}
          </p>
        )}
        {intervenant.modulesEnseignes && intervenant.modulesEnseignes.length > 0 && (
          <p className={styles['card-text-secondary']}>
            Modules: {intervenant.modulesEnseignes.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
};

export default IntervenantCard;
