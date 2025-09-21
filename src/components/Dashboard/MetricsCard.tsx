import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme,
  Avatar
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface MetricsCardProps {
  title: string;
  value: string;
  growth: number;
  icon: React.ReactElement;
  color: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, growth, icon, color }) => {
  const theme = useTheme();
  
  const formatGrowth = (growth: number) => {
    if (growth === 0) return { text: 'No change', color: 'default' as const };
    const text = `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
    const chipColor = growth > 0 ? 'success' : 'error';
    return { text, color: chipColor };
  };

  const { text: growthText, color: growthColor } = formatGrowth(growth);

  return (
    <Card 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${theme.palette[color].light}15 0%, ${theme.palette[color].main}25 100%)`,
        border: `1px solid ${theme.palette[color].main}30`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[12],
          background: `linear-gradient(135deg, ${theme.palette[color].light}25 0%, ${theme.palette[color].main}35 100%)`,
        }
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Avatar 
            sx={{ 
              bgcolor: `${theme.palette[color].main}20`,
              color: theme.palette[color].main,
              width: 40,
              height: 40
            }}
          >
            {icon}
          </Avatar>
        </Box>
        
        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            fontWeight: 700,
            color: theme.palette[color].main,
            mb: 1
          }}
        >
          {value}
        </Typography>
        
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Chip
            icon={growth > 0 ? <TrendingUp /> : growth < 0 ? <TrendingDown /> : undefined}
            label={growthText}
            color={growthColor}
            size="small"
            sx={{ 
              fontWeight: 600,
              '& .MuiChip-icon': {
                fontSize: '1rem'
              }
            }}
          />
          <Typography variant="caption" color="text.secondary">
            vs previous period
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricsCard;