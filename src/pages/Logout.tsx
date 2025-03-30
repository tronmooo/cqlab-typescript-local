import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';

const LogoutContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(3),
}));

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = React.useState(true);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Here you would typically make an API call to logout
        // For example: await logoutUser();
        
        // Clear any local storage or state
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Simulate a delay to show the loading state
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Redirect to login page
        navigate('/login');
      } catch (error) {
        console.error('Logout failed:', error);
        setIsLoggingOut(false);
      }
    };

    handleLogout();
  }, [navigate]);

  const handleManualLogout = () => {
    navigate('/login');
  };

  return (
    <LogoutContainer>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', maxWidth: 400, width: '100%' }}>
        <LogoutIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Logging Out
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          {isLoggingOut
            ? 'Please wait while we log you out...'
            : 'There was an error logging out. Please try again.'}
        </Typography>
        {isLoggingOut ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleManualLogout}
            startIcon={<LogoutIcon />}
          >
            Try Again
          </Button>
        )}
      </Paper>
    </LogoutContainer>
  );
};

export default Logout; 