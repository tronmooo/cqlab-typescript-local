import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Grid,
  Divider,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';

const SettingsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 1200,
  margin: '0 auto'
}));

const SettingsSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3)
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Settings: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({
    general: {
      theme: 'light',
      language: 'en',
      autoSave: true,
      notifications: true
    },
    editor: {
      fontSize: 14,
      tabSize: 2,
      wordWrap: true,
      minimap: true
    },
    flow: {
      autoLayout: true,
      snapToGrid: true,
      showGrid: true,
      gridSize: 20
    }
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSettingChange = (section: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleSave = () => {
    // TODO: Implement settings save
    console.log('Saving settings:', settings);
  };

  return (
    <SettingsContainer>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="General" />
          <Tab label="Editor" />
          <Tab label="Flow" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <SettingsSection>
            <Typography variant="h6" gutterBottom>
              General Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Theme"
                  select
                  value={settings.general.theme}
                  onChange={(e) => handleSettingChange('general', 'theme', e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Language"
                  select
                  value={settings.general.language}
                  onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.general.autoSave}
                      onChange={(e) => handleSettingChange('general', 'autoSave', e.target.checked)}
                    />
                  }
                  label="Auto Save"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.general.notifications}
                      onChange={(e) => handleSettingChange('general', 'notifications', e.target.checked)}
                    />
                  }
                  label="Enable Notifications"
                />
              </Grid>
            </Grid>
          </SettingsSection>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <SettingsSection>
            <Typography variant="h6" gutterBottom>
              Editor Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Font Size"
                  value={settings.editor.fontSize}
                  onChange={(e) => handleSettingChange('editor', 'fontSize', Number(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Tab Size"
                  value={settings.editor.tabSize}
                  onChange={(e) => handleSettingChange('editor', 'tabSize', Number(e.target.value))}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.editor.wordWrap}
                      onChange={(e) => handleSettingChange('editor', 'wordWrap', e.target.checked)}
                    />
                  }
                  label="Word Wrap"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.editor.minimap}
                      onChange={(e) => handleSettingChange('editor', 'minimap', e.target.checked)}
                    />
                  }
                  label="Show Minimap"
                />
              </Grid>
            </Grid>
          </SettingsSection>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <SettingsSection>
            <Typography variant="h6" gutterBottom>
              Flow Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.flow.autoLayout}
                      onChange={(e) => handleSettingChange('flow', 'autoLayout', e.target.checked)}
                    />
                  }
                  label="Auto Layout"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.flow.snapToGrid}
                      onChange={(e) => handleSettingChange('flow', 'snapToGrid', e.target.checked)}
                    />
                  }
                  label="Snap to Grid"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.flow.showGrid}
                      onChange={(e) => handleSettingChange('flow', 'showGrid', e.target.checked)}
                    />
                  }
                  label="Show Grid"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Grid Size"
                  value={settings.flow.gridSize}
                  onChange={(e) => handleSettingChange('flow', 'gridSize', Number(e.target.value))}
                />
              </Grid>
            </Grid>
          </SettingsSection>
        </TabPanel>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
        >
          Save Settings
        </Button>
      </Box>
    </SettingsContainer>
  );
};

export default Settings; 