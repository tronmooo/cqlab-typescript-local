import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const ProfileContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 800,
  margin: '0 auto',
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(4),
}));

const Profile: React.FC = () => {
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    organization: 'Healthcare Organization',
    role: 'Clinical Analyst',
    bio: 'Experienced in clinical decision support systems and workflow optimization.',
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Here you would typically make an API call to update the profile
      setSuccessMessage('Profile updated successfully');
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Failed to update profile');
      setSuccessMessage(null);
    }
  };

  return (
    <ProfileContainer>
      <Paper elevation={3} sx={{ p: 4 }}>
        <ProfileHeader>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              fontSize: '2.5rem',
            }}
          >
            {profile.firstName[0]}{profile.lastName[0]}
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              {profile.firstName} {profile.lastName}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {profile.role}
            </Typography>
          </Box>
        </ProfileHeader>

        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={profile.firstName}
                onChange={handleChange('firstName')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={profile.lastName}
                onChange={handleChange('lastName')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={profile.email}
                onChange={handleChange('email')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Organization"
                value={profile.organization}
                onChange={handleChange('organization')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Role"
                value={profile.role}
                onChange={handleChange('role')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={4}
                value={profile.bio}
                onChange={handleChange('bio')}
              />
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
    </ProfileContainer>
  );
};

export default Profile; 