import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Icons for the applications
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TranslateIcon from '@mui/icons-material/Translate';
import StorageIcon from '@mui/icons-material/Storage';
import SettingsIcon from '@mui/icons-material/Settings';
import CodeIcon from '@mui/icons-material/Code';
import HelpIcon from '@mui/icons-material/Help';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const applications = [
    {
      title: 'CQFlow',
      description: 'Create and manage clinical flow diagrams',
      icon: <AccountTreeIcon fontSize="large" color="primary" />,
      path: '/flows'
    },
    {
      title: 'Library',
      description: 'Browse and manage clinical logic libraries',
      icon: <MenuBookIcon fontSize="large" color="secondary" />,
      path: '/library'
    },
    {
      title: 'Vocabulary',
      description: 'Manage clinical vocabularies and value sets',
      icon: <TranslateIcon fontSize="large" color="success" />,
      path: '/vocabulary'
    },
    {
      title: 'Mock Data',
      description: 'Create and manage test data',
      icon: <StorageIcon fontSize="large" color="warning" />,
      path: '/mock-data'
    },
    {
      title: 'Settings',
      description: 'Configure application settings',
      icon: <SettingsIcon fontSize="large" color="info" />,
      path: '/settings'
    },
    {
      title: 'Code Editor',
      description: 'Write and test code',
      icon: <CodeIcon fontSize="large" color="error" />,
      path: '/code'
    },
    {
      title: 'Help',
      description: 'Documentation and support',
      icon: <HelpIcon fontSize="large" />,
      path: '/help'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to CQLab
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Select an application to get started
      </Typography>
      
      <Grid container spacing={3}>
        {applications.map((app) => (
          <Grid item xs={12} sm={6} md={4} key={app.title}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {app.icon}
                  <Typography variant="h6" sx={{ ml: 2 }}>
                    {app.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {app.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(app.path)}>
                  Open {app.title}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard; 