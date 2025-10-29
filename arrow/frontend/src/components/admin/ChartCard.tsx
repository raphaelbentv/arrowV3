import React from 'react';
import { cn } from '@/lib/utils';
import styles from './cards.module.css';

interface ChartCardProps {
  title?: string;
  children: React.ReactNode;
  height?: number;
  className?: string;
}

export function ChartCard({ title, children, height = 300, className }: ChartCardProps) {
  return (
    <div
      className={cn(styles['base-card'], styles['chart-card'], className)}
    >
      {title && (
        <div className={styles['card-header']}>
          <h3 className={styles['card-title']}>
            {title}
          </h3>
        </div>
      )}
      <div className={styles['card-body']}>
        <div style={{ height: `${height}px` }}>
          {children}
        </div>
      </div>
    </div>
  );
}

