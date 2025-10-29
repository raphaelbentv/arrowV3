import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  color?: string;
  label?: string;
  animated?: boolean;
  className?: string;
}

export function ProgressBar({ 
  value, 
  color = '#3B82F6', 
  label, 
  animated = true,
  className 
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(value, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-400">{label}</span>
          <span className="text-sm font-bold" style={{ color }}>{percentage}%</span>
        </div>
      )}
      <div 
        className="h-2 rounded-full overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            width: `${percentage}%`,
            transition: animated ? 'width 1s ease-out' : 'none',
            boxShadow: `0 0 10px ${color}40`,
          }}
        />
      </div>
    </div>
  );
}

