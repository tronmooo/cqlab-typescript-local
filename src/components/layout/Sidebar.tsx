import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Storage as DatabaseIcon,
  MenuBook as LibraryIcon,
  Translate as VocabularyIcon,
  Code as CodeIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
  AccountTree as FlowChartIcon,
  Person as PersonIcon,
  Science as TestIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  drawerWidth: number;
  handleDrawerClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, handleDrawerClose, drawerWidth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Flows', icon: <FlowChartIcon />, path: '/flows' },
    { text: 'Library', icon: <LibraryIcon />, path: '/library' },
    { text: 'Vocabulary', icon: <VocabularyIcon />, path: '/vocabulary' },
    { text: 'Mock Data', icon: <DatabaseIcon />, path: '/mock-data' },
    { text: 'Test Workbench', icon: <TestIcon />, path: '/test-workbench' },
    { text: 'Code Editor', icon: <CodeIcon />, path: '/code' },
  ];

  const bottomMenuItems = [
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Help', icon: <HelpIcon />, path: '/help' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile && open) {
      handleDrawerClose();
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: theme.spacing(2, 2),
        ...theme.mixins.toolbar,
        justifyContent: 'center',
        borderBottom: `1px solid ${theme.palette.mode === 'light' 
          ? 'rgba(0, 0, 0, 0.08)' 
          : 'rgba(255, 255, 255, 0.05)'}`,
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            fontSize: '1.2rem',
            background: theme.palette.mode === 'light'
              ? 'linear-gradient(45deg, #e53935 30%, #ff6f60 90%)'
              : 'linear-gradient(45deg, #ff6e6e 30%, #ff9e9e 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          CQLab
        </Typography>
      </Box>
      <List sx={{ flexGrow: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.5 }}>
            <Tooltip title={open ? '' : item.text} placement="right">
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  mx: 1,
                  borderRadius: theme.shape.borderRadius,
                  backgroundColor: isActive(item.path) 
                    ? `${theme.palette.mode === 'light' 
                        ? 'rgba(229, 57, 53, 0.08)' 
                        : 'rgba(255, 110, 110, 0.15)'}`
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light'
                      ? 'rgba(229, 57, 53, 0.12)'
                      : 'rgba(255, 110, 110, 0.25)',
                    transform: 'translateX(4px)',
                  },
                  transition: 'all 0.2s',
                }}
                onClick={() => handleNavigate(item.path)}
                selected={isActive(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: isActive(item.path) 
                      ? theme.palette.primary.main 
                      : theme.palette.text.secondary,
                    transition: 'all 0.2s',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: open ? 1 : 0,
                    color: isActive(item.path) 
                      ? theme.palette.primary.main 
                      : theme.palette.text.primary,
                    '& .MuiTypography-root': {
                      fontWeight: isActive(item.path) ? 600 : 400,
                      fontSize: '0.9rem',
                    },
                    transition: 'opacity 0.2s',
                  }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ 
        borderColor: theme.palette.mode === 'light' 
          ? 'rgba(0, 0, 0, 0.08)' 
          : 'rgba(255, 255, 255, 0.05)' 
      }} />
      <List sx={{ py: 2 }}>
        {bottomMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.5 }}>
            <Tooltip title={open ? '' : item.text} placement="right">
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  mx: 1,
                  borderRadius: theme.shape.borderRadius,
                  backgroundColor: isActive(item.path) 
                    ? `${theme.palette.mode === 'light' 
                        ? 'rgba(229, 57, 53, 0.08)' 
                        : 'rgba(255, 110, 110, 0.15)'}`
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light'
                      ? 'rgba(229, 57, 53, 0.12)'
                      : 'rgba(255, 110, 110, 0.25)',
                    transform: 'translateX(4px)',
                  },
                  transition: 'all 0.2s',
                }}
                selected={location.pathname === item.path}
                onClick={() => handleNavigate(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: isActive(item.path) 
                      ? theme.palette.primary.main 
                      : theme.palette.text.secondary,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ 
                    opacity: open ? 1 : 0,
                    color: isActive(item.path) 
                      ? theme.palette.primary.main 
                      : theme.palette.text.primary,
                    '& .MuiTypography-root': {
                      fontWeight: isActive(item.path) ? 600 : 400,
                      fontSize: '0.9rem',
                    },
                  }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar; 