import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { User, Mail, Phone, GraduationCap, Calendar, TrendingUp } from 'lucide-react';
import { Etudiant, StatutInscription } from '../../types/etudiant';
import { cn } from '@/lib/utils';
import styles from '../admin/cards.module.css';

interface EtudiantCardProps {
  etudiant: Etudiant;
  onEdit?: (etudiant: Etudiant) => void;
  onDelete?: (id: string) => void;
  onView?: (etudiant: Etudiant) => void;
}

export const EtudiantCard: React.FC<EtudiantCardProps> = ({
  etudiant,
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

  const neon = neonPalette[computeStableIndex(etudiant._id || etudiant.nom || 'neon')];

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('fr-FR');
  };

  const getStatutColor = (statut: StatutInscription) => {
    switch (statut) {
      case StatutInscription.INSCRIT:
      case StatutInscription.ADMIS:
        return '#10B981'; // vert
      case StatutInscription.EN_ATTENTE:
        return '#F59E0B'; // jaune
      case StatutInscription.DIPLOME:
        return '#3B82F6'; // bleu
      case StatutInscription.ABANDON:
      case StatutInscription.EXCLUS:
        return '#EF4444'; // rouge
      default:
        return '#6B7280'; // gris
    }
  };

  const getInitiales = () => {
    const nom = etudiant.nom?.charAt(0)?.toUpperCase() || '';
    const prenom = etudiant.prenom?.charAt(0)?.toUpperCase() || '';
    return `${nom}${prenom}`;
  };

  const moyenne = etudiant.moyenneGenerale ?? 0;
  const presence = etudiant.tauxPresence ?? 0;

  return (
    <div
      className={cn(styles['base-card'], styles['card-clickable'], styles['etudiant-card'])}
      style={{
        borderTop: `4px solid ${neon}`,
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        padding: '0.75rem',
        minWidth: '320px',
        minHeight: '320px',
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
        if (onView) onView(etudiant);
      }}
    >

      {/* Header avec photo centrée */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0.375rem', flex: '0 0 auto' }}>
        {etudiant.photo ? (
          <img
            src={etudiant.photo}
            alt={`${etudiant.prenom} ${etudiant.nom}`}
            className="rounded-full object-cover"
            style={{
              width: '2.5rem',
              height: '2.5rem',
              minWidth: '2.5rem',
              maxWidth: '2.5rem',
              minHeight: '2.5rem',
              maxHeight: '2.5rem',
              border: `2px solid ${neon}`,
              marginBottom: '0.375rem',
              flexShrink: 0,
            }}
          />
        ) : (
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
            {getInitiales()}
          </div>
        )}
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
          {etudiant.prenom} {etudiant.nom}
        </h4>
        {etudiant.numeroEtudiant && (
          <p className={styles['card-text-secondary']} style={{ fontSize: 'clamp(0.8rem, 2.8vw, 0.9rem)', textAlign: 'center' }}>
            {etudiant.numeroEtudiant}
          </p>
        )}
        {etudiant.email && (
          <p className={`${styles['card-text-secondary']} ${styles['mobile-only']}`} style={{ fontSize: 'clamp(0.8rem, 2.8vw, 0.9rem)', textAlign: 'center' }}>
            {etudiant.email}
          </p>
        )}
      </div>

      {/* Statut badge */}
      <div style={{ marginBottom: '0.375rem', flex: '0 0 auto' }}>
        <span
          className={styles['card-badge']}
          style={{
            background: `${getStatutColor(etudiant.statutInscription)}20`,
            color: getStatutColor(etudiant.statutInscription),
            border: `1px solid ${getStatutColor(etudiant.statutInscription)}60`,
            fontSize: 'clamp(0.85rem, 2.8vw, 0.95rem)',
            padding: '0.4rem 0.6rem',
            display: 'inline-block',
            width: '100%',
            textAlign: 'center',
          }}
        >
          {etudiant.statutInscription}
        </span>
      </div>

      {/* Métriques compactes */}
      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.5rem', minHeight: 0 }}>
        {moyenne > 0 && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold" style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)' }}>Moyenne</span>
              <span className="text-xs font-bold" style={{ color: neon, fontSize: 'clamp(0.9rem, 2.8vw, 1rem)' }}>
                {moyenne.toFixed(1)}/20
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  background: `linear-gradient(90deg, ${neon}, ${neon}DD)`,
                  width: `${(moyenne / 20) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
        {presence > 0 && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold" style={{ color: '#87ceeb', fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)' }}>Présence</span>
              <span className="text-xs font-bold" style={{ color: neon, fontSize: 'clamp(0.9rem, 2.8vw, 1rem)' }}>
                {presence.toFixed(0)}%
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  background: `linear-gradient(90deg, ${neon}, ${neon}DD)`,
                  width: `${presence}%`,
                }}
              />
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
              onView(etudiant);
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
              onEdit(etudiant);
            }}
          >
            Mod.
          </button>
        )}
      </div>
    </div>
  );
};
