import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Users, User, Calendar, TrendingUp } from 'lucide-react';
import { Cohorte, StatutCohorte } from '../../types/cohorte';
import { cn } from '@/lib/utils';
import styles from '../admin/cards.module.css';

interface CohorteCardProps {
  cohorte: Cohorte;
  onEdit?: (cohorte: Cohorte) => void;
  onDelete?: (id: string) => void;
  onView?: (cohorte: Cohorte) => void;
}

export const CohorteCard: React.FC<CohorteCardProps> = ({
  cohorte,
  onEdit,
  onDelete,
  onView,
}) => {
  // Palette néon et couleur stable par cohorte (hash simple sur l'id/nom)
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

  const neon = neonPalette[computeStableIndex(cohorte._id || cohorte.nom || 'neon')];

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('fr-FR');
  };

  const getStatutLabel = (statut: StatutCohorte) => {
    switch (statut) {
      case StatutCohorte.EN_PREPARATION:
        return 'En préparation';
      case StatutCohorte.ACTIVE:
        return 'Active';
      case StatutCohorte.CLOTUREE:
        return 'Clôturée';
      default:
        return 'Inconnu';
    }
  };

  const montantFmt = (cohorte.montantTotalFacture ?? 0).toLocaleString('fr-FR');
  const progression = Math.max(0, Math.min(100, cohorte.tauxProgression ?? 0));

  const exportCohortePdf = async () => {
    try {
      const baseURL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api/v1';
      const url = `${baseURL}/cohortes/${cohorte._id}/export/pdf`;
      const resp = await fetch(url, { method: 'GET' });
      if (!resp.ok) throw new Error('Export PDF échoué');
      const blob = await resp.blob();
      const link = document.createElement('a');
      const href = URL.createObjectURL(blob);
      link.href = href;
      link.download = `${cohorte.nom.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(href);
    } catch (e) {
      console.error(e);
      alert('Impossible de générer le PDF pour cette cohorte.');
    }
  };

  return (
    <div
      className={cn(styles['base-card'], styles['card-clickable'], styles['cohorte-card'])}
      style={{ borderTop: `4px solid ${neon}`, boxShadow: 'none' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderTopWidth = '6px';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 48px ' + neon + '40';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderTopWidth = '4px';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {/* Header */}
      <div className={styles['card-header']}>
        <div className={styles['card-row']} style={{ marginBottom: 0 }}>
          <span className="text-2xl">🎓</span>
          <h4
            className={styles['card-title']}
            style={{ color: neon, margin: 0, fontSize: '1.25rem' }}
          >
            {cohorte.nom}
          </h4>
        </div>
        <span
          className={styles['card-badge']}
          style={{ background: neon + '20', color: neon, border: '1px solid ' + neon + '60' }}
        >
          {getStatutLabel(cohorte.statut).toLowerCase()}
        </span>
      </div>

      {/* Grid d'infos */}
      <div className={styles['card-section']}>
        <div className={styles['card-grid']} style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <div className={styles['card-row']}>
            <div className={styles['card-icon-container']} style={{ padding: '0.5rem' }}>
              <Users size={18} style={{ color: '#87ceeb' }} />
            </div>
            <span className={styles['card-text-secondary']}>
              {(cohorte.nombreEtudiantsInscrits ?? 0)} étudiants
            </span>
          </div>
          <div className={styles['card-row']}>
            <div className={styles['card-icon-container']} style={{ padding: '0.5rem' }}>
              <User size={18} style={{ color: '#87ceeb' }} />
            </div>
            <span className={styles['card-text-secondary']}>
              {Array.isArray(cohorte.intervenants) && cohorte.intervenants.length > 0 ? `${cohorte.intervenants.length} intervenant(s)` : '—'}
            </span>
          </div>
          <div className={styles['card-row']}>
            <div className={styles['card-icon-container']} style={{ padding: '0.5rem' }}>
              <Calendar size={18} style={{ color: '#87ceeb' }} />
            </div>
            <span className={styles['card-text-secondary']}>{formatDate(cohorte.dateDebut)}</span>
          </div>
          <div className={styles['card-row']}>
            <div className={styles['card-icon-container']} style={{ padding: '0.5rem' }}>
              <TrendingUp size={18} style={{ color: '#87ceeb' }} />
            </div>
            <span className={styles['card-text-secondary']}>
              {getStatutLabel(cohorte.statut)}
            </span>
          </div>
        </div>
      </div>

      {/* Progression */}
      {typeof cohorte.tauxProgression === 'number' && (
        <div className={styles['card-section']}>
          <div className="w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-400">Progression du programme</span>
              <span className="text-sm font-bold" style={{ color: neon }}>{progression}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  background: `linear-gradient(90deg, ${neon}, ${neon}DD)`,
                  width: `${progression}%`,
                  transition: 'width 1s ease-out',
                  boxShadow: `${neon}40 0px 0px 10px`
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer boutons */}
      <div className={styles['card-footer']} style={{ justifyContent: 'space-between' }}>
        {/* Gauche: Export PDF */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={styles['card-button']}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: '#87ceeb'
            }}
            onClick={exportCohortePdf}
          >
            Exporter PDF
          </button>
        </div>
        {/* Droite: Voir + Modifier (modifier réduit et orange) */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {onView && (
            <button
              className={cn(styles['card-button'], styles['card-button-primary'])}
              onClick={() => onView(cohorte)}
            >
              Voir
            </button>
          )}
          {onEdit && (
            <button
              className={styles['card-button']}
              style={{
                padding: '0.5rem 0.9rem',
                fontSize: '0.7rem',
                background: 'rgba(245, 158, 11, 0.15)',
                borderColor: '#f59e0b',
                color: '#f59e0b'
              }}
              onClick={() => onEdit(cohorte)}
            >
              Modifier
            </button>
          )}
        </div>
        {/* Bouton supprimer retiré ici pour éviter les erreurs; suppression via le formulaire d'édition */}
      </div>
    </div>
  );
};
