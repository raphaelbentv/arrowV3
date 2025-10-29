import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './cards.module.css';

interface AlertBadgeProps {
  type: 'risk' | 'conflict' | 'evaluation';
  count: number;
  severity: 'high' | 'medium' | 'low';
  onClick?: () => void;
  items?: any[];
}

const iconMap = {
  risk: AlertTriangle,
  conflict: AlertCircle,
  evaluation: Clock,
};

const colorMap = {
  high: { bg: 'bg-red-900/20', border: 'border-red-500', text: 'text-red-400', icon: '#EF4444' },
  medium: { bg: 'bg-orange-900/20', border: 'border-orange-500', text: 'text-orange-400', icon: '#F59E0B' },
  low: { bg: 'bg-yellow-900/20', border: 'border-yellow-500', text: 'text-yellow-400', icon: '#EAB308' },
};

export function AlertBadge({ type, count, severity, onClick, items = [] }: AlertBadgeProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = iconMap[type];
  const colors = colorMap[severity];

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (items.length > 0) {
      setExpanded(!expanded);
    }
  };

  return (
    <div className={cn(styles['base-card'], styles['card-small'], styles['alert-badge'], colors.bg, colors.border)} style={{ borderLeftWidth: '4px', borderLeftStyle: 'solid' }}>
      <div 
        onClick={handleClick}
        className={styles['card-row']}
      >
        <div className={styles['card-icon']}>
          <Icon size={24} style={{ color: colors.icon }} />
        </div>
        <div className={styles['card-content']} style={{ flex: 1 }}>
          <div className={styles['card-row']} style={{ marginBottom: 0 }}>
            <span className={cn(styles['card-value'], styles['card-value-small'], colors.text)} style={{ margin: 0 }}>{count}</span>
            <span className={styles['card-text-secondary']} style={{ textTransform: 'capitalize' }}>
              {type === 'risk' ? 'Étudiants à risque' : type === 'conflict' ? 'Conflits planning' : 'Évaluations en attente'}
            </span>
          </div>
          {count > 0 && severity === 'high' && (
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" style={{ marginLeft: '1.5rem', marginTop: '0.25rem' }} />
          )}
        </div>
      </div>
      {expanded && items.length > 0 && (
        <div className={styles['card-section']} style={{ paddingLeft: '1.75rem', marginTop: '0.75rem' }}>
          <div className={styles['card-list']}>
            {items.slice(0, 3).map((item, index) => (
              <div key={index} className={styles['card-text-secondary']} style={{ padding: '0.5rem', borderRadius: '6px', background: 'rgba(0, 0, 0, 0.2)' }}>
                {type === 'risk' && `${item.name} (${item.presence}%)`}
                {type === 'conflict' && `${item.cohorte} - ${item.conflict}`}
                {type === 'evaluation' && `${item.student} - ${item.course}`}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

