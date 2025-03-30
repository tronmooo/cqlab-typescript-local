import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  FormatQuote as FormatIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ReactJson from 'react-json-view';
import { useTheme } from '../context/ThemeContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(3),
  height: 'calc(100vh - 200px)',
  display: 'flex',
  flexDirection: 'column',
}));

const JsonContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));

const ActionBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`workbench-tabpanel-${index}`}
      aria-labelledby={`workbench-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const TestWorkbench: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [jsonData, setJsonData] = useState({
    name: 'Test Workbench',
    version: '1.0.0',
    tests: [
      {
        id: 1,
        name: 'Sample Test',
        status: 'pending',
        data: {
          input: {},
          expected: {},
        },
      },
    ],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { mode } = useTheme();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleJsonEdit = (edit: any) => {
    setJsonData(edit.updated_src);
    setIsEditing(true);
  };

  const handleSave = () => {
    try {
      // Here you would typically save the JSON data to your backend
      setSuccess('JSON data saved successfully');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save JSON data');
    }
  };

  const handleReset = () => {
    setJsonData({
      name: 'Test Workbench',
      version: '1.0.0',
      tests: [
        {
          id: 1,
          name: 'Sample Test',
          status: 'pending',
          data: {
            input: {},
            expected: {},
          },
        },
      ],
    });
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const handleFormat = () => {
    try {
      const formatted = JSON.stringify(jsonData, null, 2);
      setJsonData(JSON.parse(formatted));
    } catch (err) {
      setError('Failed to format JSON');
    }
  };

  return (
    <StyledPaper>
      <Typography variant="h4" gutterBottom>
        Test Workbench
      </Typography>

      <ActionBar>
        <Tooltip title="Format JSON">
          <IconButton onClick={handleFormat} color="primary">
            <FormatIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reset">
          <IconButton onClick={handleReset} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Save Changes">
          <IconButton 
            onClick={handleSave} 
            color="primary"
            disabled={!isEditing}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>
      </ActionBar>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="JSON View" />
        <Tab label="Form View" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <JsonContainer>
          <ReactJson
            src={jsonData}
            theme={mode === 'dark' ? 'monokai' : 'rjv-default'}
            onEdit={handleJsonEdit}
            onAdd={handleJsonEdit}
            onDelete={handleJsonEdit}
            enableClipboard={true}
            displayDataTypes={false}
            name={false}
            collapsed={2}
            displayObjectSize={false}
            style={{
              backgroundColor: 'transparent',
              fontSize: '14px',
              fontFamily: 'monospace',
            }}
          />
        </JsonContainer>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Typography variant="body1" color="textSecondary">
          Form view coming soon...
        </Typography>
      </TabPanel>
    </StyledPaper>
  );
};

export default TestWorkbench; 