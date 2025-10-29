import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className={cn("rounded-lg border-l-4 p-4 transition-all cursor-pointer", colors.bg, colors.border)}>
      <div 
        onClick={handleClick}
        className="flex items-center gap-3"
      >
        <Icon size={24} style={{ color: colors.icon }} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("font-bold text-lg", colors.text)}>{count}</span>
            <span className="text-sm text-gray-400 capitalize">{type === 'risk' ? 'Étudiants à risque' : type === 'conflict' ? 'Conflits planning' : 'Évaluations en attente'}</span>
          </div>
          {count > 0 && severity === 'high' && (
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse ml-6 mt-1" />
          )}
        </div>
      </div>
      {expanded && items.length > 0 && (
        <div className="mt-3 space-y-2 pl-7">
          {items.slice(0, 3).map((item, index) => (
            <div key={index} className="text-sm text-gray-400 p-2 rounded bg-black/20">
              {type === 'risk' && `${item.name} (${item.presence}%)`}
              {type === 'conflict' && `${item.cohorte} - ${item.conflict}`}
              {type === 'evaluation' && `${item.student} - ${item.course}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

