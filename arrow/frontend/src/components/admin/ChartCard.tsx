import React from 'react';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title?: string;
  children: React.ReactNode;
  height?: number;
  className?: string;
}

export function ChartCard({ title, children, height = 300, className }: ChartCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-6 transition-all duration-200 hover:shadow-2xl",
        className
      )}
      style={{
        background: 'rgba(0, 0, 0, 0.6)',
        border: '2px solid rgba(61, 155, 255, 0.3)',
      }}
    >
      {title && (
        <h3 
          className="text-lg font-bold uppercase tracking-[0.1em] mb-4"
          style={{ color: '#87ceeb' }}
        >
          {title}
        </h3>
      )}
      <div style={{ height: `${height}px` }}>
        {children}
      </div>
    </div>
  );
}

