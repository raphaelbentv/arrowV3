import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactElement;
  color?: string;
  path: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  color = '#FFD700',
  path,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(path)}
      sx={{
        height: '100%',
        cursor: 'pointer',
        background: 'background.paper',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 32px ${color}25`,
          border: `1px solid ${color}`,
          '& .action-icon': {
            transform: 'rotate(-45deg)',
            backgroundColor: color,
            color: '#000',
          },
        },
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 2,
            backgroundColor: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          {React.cloneElement(icon, {
            sx: { fontSize: 36, color: color },
          })}
        </Box>

        <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>
          {title}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.label', mb: 2, flexGrow: 1 }}>
          {description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            className="action-icon"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              transition: 'all 0.3s ease',
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActionCard;