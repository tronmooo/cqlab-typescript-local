import React from 'react';
import { IconButton, Tooltip, useTheme as useMuiTheme } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { mode, toggleColorMode } = useTheme();
  const muiTheme = useMuiTheme();
  
  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton
        onClick={toggleColorMode}
        color="inherit"
        aria-label="toggle theme"
        sx={{
          transition: 'all 0.3s ease',
          transform: mode === 'dark' ? 'rotate(0deg)' : 'rotate(180deg)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            transform: mode === 'dark' 
              ? 'rotate(20deg) scale(1.1)' 
              : 'rotate(200deg) scale(1.1)',
          },
        }}
      >
        {mode === 'dark' ? (
          <LightModeIcon 
            sx={{ 
              color: muiTheme.palette.primary.contrastText,
              animation: mode === 'dark' ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%': { opacity: 0.8 },
                '50%': { opacity: 1 },
                '100%': { opacity: 0.8 },
              },
            }} 
          />
        ) : (
          <DarkModeIcon 
            sx={{ 
              color: muiTheme.palette.primary.contrastText,
            }} 
          />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 