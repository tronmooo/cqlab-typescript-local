import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const AccountContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 800,
  margin: '0 auto',
}));

const Account: React.FC = () => {
  const [account, setAccount] = useState({
    username: 'johndoe',
    email: 'john.doe@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    emailNotifications: true,
    apiKeys: [
      { id: '1', name: 'Production API Key', lastUsed: '2024-03-15' },
      { id: '2', name: 'Development API Key', lastUsed: '2024-03-14' },
    ],
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccount({
      ...account,
      [field]: event.target.value,
    });
  };

  const handleToggle = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccount({
      ...account,
      [field]: event.target.checked,
    });
  };

  const handleDeleteApiKey = (id: string) => {
    setAccount({
      ...account,
      apiKeys: account.apiKeys.filter(key => key.id !== id),
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (account.newPassword !== account.confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }
    try {
      // Here you would typically make an API call to update the account
      setSuccessMessage('Account settings updated successfully');
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Failed to update account settings');
      setSuccessMessage(null);
    }
  };

  return (
    <AccountContainer>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Account Settings
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                value={account.username}
                onChange={handleChange('username')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={account.email}
                onChange={handleChange('email')}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Security
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                value={account.currentPassword}
                onChange={handleChange('currentPassword')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={account.newPassword}
                onChange={handleChange('newPassword')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                value={account.confirmPassword}
                onChange={handleChange('confirmPassword')}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={account.twoFactorEnabled}
                    onChange={handleToggle('twoFactorEnabled')}
                  />
                }
                label="Enable Two-Factor Authentication"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Notifications
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={account.emailNotifications}
                    onChange={handleToggle('emailNotifications')}
                  />
                }
                label="Email Notifications"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  API Keys
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  size="small"
                >
                  Add API Key
                </Button>
              </Box>
              <List>
                {account.apiKeys.map((key) => (
                  <ListItem key={key.id}>
                    <ListItemText
                      primary={key.name}
                      secondary={`Last used: ${key.lastUsed}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteApiKey(key.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12}>
              {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage(null)}>
                  {successMessage}
                </Alert>
              )}
              {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage(null)}>
                  {errorMessage}
                </Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 2 }}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </AccountContainer>
  );
};

export default Account; 