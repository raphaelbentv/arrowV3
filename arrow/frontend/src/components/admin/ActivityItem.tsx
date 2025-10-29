import React from 'react';
import { UserPlus, CalendarPlus, Edit, Phone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import styles from './cards.module.css';

interface ActivityItemProps {
  icon: 'UserPlus' | 'CalendarPlus' | 'Edit' | 'Phone';
  title: string;
  timestamp: Date;
  user?: string;
  color?: string;
}

const iconMap = {
  UserPlus,
  CalendarPlus,
  Edit,
  Phone,
};

export function ActivityItem({ icon, title, timestamp, user, color = '#3B82F6' }: ActivityItemProps) {
  const Icon = iconMap[icon];
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });

  return (
    <div className={styles['card-row']} style={{ padding: '0.75rem', borderRadius: '8px', transition: 'background 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(61, 155, 255, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
      <div className={styles['card-icon-container']} style={{ background: `${color}20`, padding: '0.5rem' }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div className={styles['card-content']} style={{ flex: 1, minWidth: 0 }}>
        <p className={styles['card-text-primary']} style={{ marginBottom: user || timeAgo ? '0.25rem' : 0, fontSize: '0.875rem' }}>
          {title}
        </p>
        {user && (
          <p className={styles['card-text-secondary']} style={{ marginBottom: '0.25rem', fontSize: '0.75rem' }}>
            {user}
          </p>
        )}
        <p className={styles['card-text-muted']} style={{ fontSize: '0.75rem' }}>
          {timeAgo}
        </p>
      </div>
    </div>
  );
}

