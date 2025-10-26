import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

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
  sx?: SxProps<Theme>;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = '#FFD700',
  progress,
  trend,
  sx,
}) => {
  return (
    <Card
      sx={{
        height: '100%',
        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 215, 0, 0.01) 100%)',
        border: '1px solid rgba(255, 215, 0, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(255, 215, 0, 0.15)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
        },
        ...sx,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.label', mb: 1, textTransform: 'uppercase', fontSize: '0.75rem' }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ color: color, fontWeight: 900, mb: 0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ color: 'text.label' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                backgroundColor: `${color}15`,
                borderRadius: 2,
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {React.cloneElement(icon, {
                sx: { fontSize: 32, color: color },
              })}
            </Box>
          )}
        </Box>

        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: 'text.label' }}>
                Progression
              </Typography>
              <Typography variant="caption" sx={{ color: color, fontWeight: 600 }}>
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: color,
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        )}

        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography
              variant="caption"
              sx={{
                color: trend.isPositive ? 'success.main' : 'error.main',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.label', ml: 1 }}>
              vs mois dernier
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;