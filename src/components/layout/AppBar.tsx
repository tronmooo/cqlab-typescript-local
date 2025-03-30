import React, { useState } from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Tooltip,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  styled,
  useMediaQuery,
  useTheme as useMuiTheme,
  Divider,
} from '@mui/material';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Help as HelpIcon,
  AccountCircle,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  AccountTree as FlowChartIcon,
  MenuBook as LibraryIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface AppBarProps {
  open: boolean;
  handleDrawerOpen: () => void;
  drawerWidth: number;
}

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'drawerWidth',
})<{ open?: boolean; drawerWidth: number }>(({ theme, open, drawerWidth }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  [theme.breakpoints.down('md')]: {
    width: '100%',
    marginLeft: 0,
  },
}));

const AppBar: React.FC<AppBarProps> = ({ open, handleDrawerOpen, drawerWidth }) => {
  const { mode, toggleColorMode } = useTheme();
  const [accountAnchorEl, setAccountAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isTablet = useMediaQuery(muiTheme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAccountAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleMobileMenuClose();
  };

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  const mainNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Flows', path: '/flows', icon: <FlowChartIcon /> },
    { label: 'Library', path: '/library', icon: <LibraryIcon /> },
  ];

  return (
    <StyledAppBar position="fixed" open={open} drawerWidth={drawerWidth}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 2,
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          {/* Desktop navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex' }}>
              {mainNavItems.map((item) => (
                <Button 
                  key={item.path}
                  color="inherit" 
                  sx={{ 
                    mr: 1, 
                    borderRadius: 2,
                    fontWeight: isActive(item.path) ? 'bold' : 'normal',
                    bgcolor: isActive(item.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                  }}
                  onClick={() => handleNavigate(item.path)}
                  startIcon={!isTablet ? item.icon : undefined}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Show on all devices */}
          <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton color="inherit" onClick={toggleColorMode} size="large">
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          
          {/* Hide on mobile */}
          {!isMobile && (
            <>
              <Tooltip title="Notifications">
                <IconButton color="inherit" size="large">
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Help">
                <IconButton color="inherit" size="large" onClick={() => navigate('/help')}>
                  <HelpIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Settings">
                <IconButton color="inherit" size="large" onClick={() => navigate('/settings')}>
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          
          {/* Account menu - show on all devices */}
          <Box sx={{ ml: 1 }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleAccountMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                <AccountCircle />
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={accountAnchorEl}
              keepMounted
              open={Boolean(accountAnchorEl)}
              onClose={handleAccountMenuClose}
            >
              <MenuItem onClick={() => {
                handleAccountMenuClose();
                navigate('/profile');
              }}>Profile</MenuItem>
              <MenuItem onClick={() => {
                handleAccountMenuClose();
                navigate('/account');
              }}>My account</MenuItem>
              <MenuItem onClick={() => {
                handleAccountMenuClose();
                navigate('/logout');
              }}>Logout</MenuItem>
            </Menu>
          </Box>
          
          {/* Mobile menu */}
          {isMobile && (
            <Box sx={{ ml: 1 }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls="menu-mobile-appbar"
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="menu-mobile-appbar"
                anchorEl={mobileMenuAnchorEl}
                keepMounted
                open={Boolean(mobileMenuAnchorEl)}
                onClose={handleMobileMenuClose}
              >
                {mainNavItems.map((item) => (
                  <MenuItem 
                    key={item.path} 
                    onClick={() => handleNavigate(item.path)}
                    selected={isActive(item.path)}
                  >
                    <IconButton size="small" color="inherit">
                      {item.icon}
                    </IconButton>
                    <Typography variant="subtitle1" sx={{ ml: 1 }}>
                      {item.label}
                    </Typography>
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem onClick={() => handleNavigate('/settings')}>
                  <IconButton size="small" color="inherit">
                    <SettingsIcon />
                  </IconButton>
                  <Typography variant="subtitle1" sx={{ ml: 1 }}>
                    Settings
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/help')}>
                  <IconButton size="small" color="inherit">
                    <HelpIcon />
                  </IconButton>
                  <Typography variant="subtitle1" sx={{ ml: 1 }}>
                    Help
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default AppBar; 