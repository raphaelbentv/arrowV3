import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  trend?: number;
  sparklineData?: number[];
  color: string;
  href?: string;
  suffix?: string;
}

export function StatCard({ 
  icon: Icon, 
  title, 
  value, 
  trend = 0, 
  sparklineData = [], 
  color,
  href,
  suffix = ''
}: StatCardProps) {
  const navigate = useNavigate();
  const [animatedValue, setAnimatedValue] = useState(0);
  const isPositive = trend >= 0;

  // Animation du compteur
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setAnimatedValue(value);
        clearInterval(timer);
      } else {
        setAnimatedValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  // Formatage des données pour le sparkline
  const chartData = sparklineData.map((val, index) => ({
    value: val,
    index
  }));

  const handleClick = () => {
    if (href) {
      navigate(href);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "cursor-pointer rounded-xl p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl",
        href && "cursor-pointer"
      )}
      style={{
        background: `linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6))`,
        border: `2px solid ${color}40`,
        boxShadow: `0 8px 32px ${color}20`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}80`;
        e.currentTarget.style.boxShadow = `0 12px 48px ${color}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${color}40`;
        e.currentTarget.style.boxShadow = `0 8px 32px ${color}20`;
      }}
    >
      {/* Header avec icon et trend */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-3 rounded-lg"
          style={{
            background: `${color}20`,
          }}
        >
          <Icon size={32} style={{ color }} />
        </div>
        {trend !== 0 && (
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp size={16} style={{ color: '#10B981' }} />
            ) : (
              <TrendingDown size={16} style={{ color: '#EF4444' }} />
            )}
            <span
              className="text-xs font-semibold"
              style={{ color: isPositive ? '#10B981' : '#EF4444' }}
            >
              {isPositive ? '+' : ''}{trend.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Chiffre principal */}
      <div className="mb-2">
        <h3 
          className="text-4xl font-black mb-1"
          style={{ color }}
        >
          {Math.round(animatedValue).toLocaleString()}{suffix}
        </h3>
        <p 
          className="text-sm font-bold uppercase tracking-wide"
          style={{ color: '#87ceeb' }}
        >
          {title}
        </p>
      </div>

      {/* Sparkline */}
      {sparklineData.length > 0 && (
        <div className="mt-4 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.6} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#gradient-${title})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

