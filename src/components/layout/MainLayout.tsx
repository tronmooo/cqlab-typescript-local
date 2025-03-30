import React, { useState } from 'react';
import { Box, CssBaseline, Drawer, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const drawerWidth = 240;

const MainLayout: React.FC = () => {
  const [open, setOpen] = useState(true);
  const theme = useTheme();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            position: 'relative',
            zIndex: (theme) => theme.zIndex.drawer,
            background: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.mode === 'light' 
              ? 'rgba(0, 0, 0, 0.08)' 
              : 'rgba(255, 255, 255, 0.05)'}`,
          },
        }}
      >
        <Box sx={{ overflow: 'auto', height: '100%' }}>
          <Sidebar 
            open={open}
            drawerWidth={drawerWidth}
            handleDrawerClose={handleDrawerClose}
          />
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          backgroundImage: theme.palette.mode === 'light'
            ? 'linear-gradient(45deg, rgba(229, 57, 53, 0.03) 0%, rgba(255, 111, 96, 0.03) 100%)'
            : 'none',
          transition: theme.transitions.create(['background-color'], {
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        <Box 
          sx={{ 
            p: 3,
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.palette.mode === 'light'
              ? '0 2px 12px rgba(0,0,0,0.08)'
              : '0 2px 12px rgba(0,0,0,0.2)',
            transition: theme.transitions.create(['background-color', 'box-shadow'], {
              duration: theme.transitions.duration.standard,
            }),
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout; 