import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactElement;
  color?: string;
  progress?: number; // 0-100
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = '#FFD700',
  progress,
  trend,
  className = '',
}) => {
  return (
    <Card
      className={`h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 215, 0, 0.01) 100%)',
        borderColor: 'rgba(255, 215, 0, 0.1)',
      }}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs uppercase text-muted-foreground mb-2">
              {title}
            </p>
            <h3 className="text-3xl font-black mb-1" style={{ color }}>
              {value}
            </h3>
            {subtitle && (
              <p className="text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          {icon && (
            <div
              className="rounded-lg p-3 flex items-center justify-center"
              style={{ backgroundColor: `${color}15` }}
            >
              {React.cloneElement(icon, {
                style: { fontSize: 32, color },
                className: 'w-8 h-8'
              })}
            </div>
          )}
        </div>

        {progress !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-muted-foreground">
                Progression
              </span>
              <span className="text-xs font-semibold" style={{ color }}>
                {progress}%
              </span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        {trend && (
          <div className="flex items-center mt-4">
            <span
              className={`text-xs font-semibold flex items-center ${
                trend.isPositive ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground ml-2">
              vs mois dernier
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;