import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Divider, 
  Button, 
  Chip, 
  Card,
  CardContent,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FunctionIcon from '@mui/icons-material/Functions';
import CodeIcon from '@mui/icons-material/Code';
import AssessmentIcon from '@mui/icons-material/Assessment';

interface LibraryFunction {
  name: string;
  displayName: string;
  type: string;
  description: string;
  isParameterized?: boolean;
}

interface Library {
  id: string;
  name: string;
  version: string;
  lastUpdated: string;
  description: string;
  tags: string[];
  functions: LibraryFunction[];
}

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
      id={`library-tabpanel-${index}`}
      aria-labelledby={`library-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Library: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedLibrary, setSelectedLibrary] = useState<string | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state for creating a new library
  const [newLibrary, setNewLibrary] = useState({
    name: '',
    version: '1.0.0',
    description: '',
    tags: ''
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLibrarySelect = (id: string) => {
    setSelectedLibrary(id);
    setSelectedFunction(null);
  };

  const handleFunctionSelect = (functionName: string) => {
    setSelectedFunction(functionName);
  };
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset form data
    setNewLibrary({
      name: '',
      version: '1.0.0',
      description: '',
      tags: ''
    });
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLibrary(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmitNewLibrary = () => {
    // Here you would typically make an API call to create the new library
    // For now, just close the modal and show a success message
    console.log('Creating new library:', newLibrary);
    alert('Library creation is not implemented in this demo. Check console for details.');
    handleCloseModal();
  };

  // Sample library items
  const libraryItems: Library[] = [
    {
      id: 'lib-001',
      name: 'BreastCancerScreeningLibrary',
      version: '1.0.0',
      lastUpdated: '2025-03-01',
      description: 'Library for breast cancer screening recommendations based on age and risk factors.',
      tags: ['screening', 'breast cancer', 'preventive care'],
      functions: [
        {
          name: 'isFemale',
          displayName: 'Is Female',
          type: 'evaluate',
          description: 'Determines if gender is female'
        },
        {
          name: 'isOver45',
          displayName: 'Is over 45 years old',
          type: 'evaluate',
          description: 'Determines if patient is over 45'
        },
        {
          name: 'hadBreastCancerScreeningInLast2Years',
          displayName: 'Has had breast cancer screening in last 2 years',
          type: 'evaluate',
          description: 'Checks for breast cancer screening using the mammography value set'
        }
      ]
    },
    {
      id: 'lib-002',
      name: 'BasicRetrieveLibrary',
      version: '2.1.0',
      lastUpdated: '2025-02-20',
      description: 'Basic patient data retrieval and evaluation functions.',
      tags: ['retrieval', 'basic', 'patient data'],
      functions: [
        {
          name: 'isFemale',
          displayName: 'Is female',
          type: 'evaluate',
          description: 'Determines if gender is female'
        },
        {
          name: 'getPatientAgeInYears',
          displayName: 'Get patient\'s age in years',
          type: 'retrieve',
          description: 'Retrieves the patient\'s age in years'
        },
        {
          name: 'isOver18',
          displayName: 'Is over 18 years old',
          type: 'evaluate',
          description: 'Determines if patient is over 18'
        }
      ]
    },
    {
      id: 'lib-003',
      name: 'ParameterizedRetrieveLibrary',
      version: '1.2.0',
      lastUpdated: '2025-03-10',
      description: 'Parameterized retrieval functions for laboratory values and evaluations.',
      tags: ['lab values', 'parameterized', 'cholesterol'],
      functions: [
        {
          name: 'getCholesterolReading',
          displayName: 'Get cholesterol reading',
          type: 'retrieve',
          description: 'Gets the most recent cholesterol reading in mg/dL'
        },
        {
          name: 'isCholesterolAboveThreshold',
          displayName: 'Is cholesterol reading above threshold',
          type: 'evaluate',
          description: 'Provide a threshold to see if patient has cholesterol above that. Allows a "high threshold" to be configurable.',
          isParameterized: true
        },
        {
          name: 'isCholesterolReadingAbove200',
          displayName: 'Is cholesterol reading above 200 mg/dL',
          type: 'evaluate',
          description: 'Checks to see if the cholesterol reading is above 200 mg/dL'
        }
      ]
    }
  ];

  const selectedLibraryData = selectedLibrary 
    ? libraryItems.find(lib => lib.id === selectedLibrary) 
    : null;

  const selectedFunctionData = selectedLibraryData && selectedFunction 
    ? selectedLibraryData.functions.find(func => func.name === selectedFunction) 
    : null;

  return (
    <Box p={3}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          CQDefine
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          View the currently configured logic libraries that execute against data sources.
        </Typography>
        <Divider sx={{ mt: 2 }} />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="library tabs">
          <Tab label="Library Registry / All" id="library-tab-0" />
          <Tab label="Functions" id="library-tab-1" />
          <Tab label="Test Runner" id="library-tab-2" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box display="flex" justifyContent="flex-end" mb={3}>
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            Add New Library
          </Button>
        </Box>

        <Grid container spacing={3}>
          {!selectedLibrary ? (
            // Show all libraries when none is selected
            libraryItems.map((lib) => (
              <Grid item xs={12} md={6} key={lib.id}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 0, 
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }
                  }}
                  onClick={() => handleLibrarySelect(lib.id)}
                >
                  <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                    <Typography variant="h6">{lib.name}</Typography>
                    <Typography variant="body2">Version: {lib.version}</Typography>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="body1" paragraph>
                      {lib.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Last updated: {lib.lastUpdated}
                    </Typography>
                    <Box mt={2}>
                      {lib.tags.map((tag) => (
                        <Chip 
                          label={tag} 
                          size="small" 
                          variant="outlined"
                          key={tag}
                          sx={{ mr: 1, mb: 1 }} 
                        />
                      ))}
                    </Box>
                    <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="textSecondary">
                        {lib.functions.length} functions
                      </Typography>
                      <Box>
                        <Button size="small" sx={{ mr: 1 }}>View</Button>
                        <Button size="small" color="primary">Edit</Button>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))
          ) : (
            // Show detailed view of selected library
            <Grid item xs={12}>
              <Box display="flex" mb={2}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => setSelectedLibrary(null)}
                  sx={{ mr: 2 }}
                >
                  Back to All Libraries
                </Button>
                <Typography variant="h5">
                  {selectedLibraryData?.name}
                </Typography>
              </Box>

              <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Functions</Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List component="div">
                  {selectedLibraryData?.functions.map((func) => (
                    <ListItem 
                      key={func.name}
                      button
                      selected={selectedFunction === func.name}
                      onClick={() => handleFunctionSelect(func.name)}
                      sx={{ 
                        mb: 1, 
                        border: '1px solid', 
                        borderColor: 'divider',
                        borderRadius: 1,
                        '&.Mui-selected': {
                          bgcolor: 'action.selected',
                          borderColor: 'primary.main'
                        }
                      }}
                    >
                      <ListItemIcon>
                        {func.type === 'evaluate' ? <AssessmentIcon color="primary" /> : <CodeIcon color="secondary" />}
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Box display="flex" alignItems="center">
                            <Typography variant="subtitle1">
                              {func.displayName}
                            </Typography>
                            <Chip 
                              label={`[${func.name}]`} 
                              size="small" 
                              variant="outlined" 
                              sx={{ ml: 1 }} 
                            />
                            <Chip 
                              label={`[${func.type}]`} 
                              size="small"
                              color={func.type === 'evaluate' ? 'primary' : 'secondary'}
                              sx={{ ml: 1 }} 
                            />
                            {func.isParameterized && (
                              <Chip 
                                label="[parameterized]" 
                                size="small"
                                color="warning"
                                sx={{ ml: 1 }} 
                              />
                            )}
                          </Box>
                        }
                        secondary={func.description}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>

              {selectedFunction && selectedFunctionData && (
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Selected: {selectedLibraryData?.name}.{selectedFunctionData.name}
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>Library</Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedLibraryData?.name} [{selectedLibraryData?.name}]
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>Definition</Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedFunctionData.displayName} [{selectedFunctionData.name}]
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>Parameters</Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedFunctionData.isParameterized ? 'Threshold: number' : 'None'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>Return Type</Typography>
                      <Button variant="outlined" size="small">View Schema</Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="contained" color="primary" fullWidth>
                        Test With Example Data
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              )}
            </Grid>
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>All Functions</Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <List>
            {libraryItems.flatMap(lib => lib.functions.map(func => (
              <ListItem 
                key={`${lib.name}-${func.name}`}
                sx={{ 
                  mb: 1, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  borderRadius: 1
                }}
              >
                <ListItemIcon>
                  {func.type === 'evaluate' ? <AssessmentIcon color="primary" /> : <CodeIcon color="secondary" />}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Box display="flex" alignItems="center" flexWrap="wrap">
                      <Typography variant="body1" sx={{ mr: 1 }}>
                        {lib.name}:
                      </Typography>
                      <Typography variant="subtitle1">
                        {func.displayName}
                      </Typography>
                      <Chip 
                        label={`[${func.name}]`} 
                        size="small" 
                        variant="outlined" 
                        sx={{ ml: 1 }} 
                      />
                      <Chip 
                        label={`[${func.type}]`} 
                        size="small"
                        color={func.type === 'evaluate' ? 'primary' : 'secondary'}
                        sx={{ ml: 1 }} 
                      />
                      {func.isParameterized && (
                        <Chip 
                          label="[parameterized]" 
                          size="small"
                          color="warning"
                          sx={{ ml: 1 }} 
                        />
                      )}
                    </Box>
                  }
                  secondary={func.description}
                />
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => {
                    handleLibrarySelect(lib.id);
                    handleFunctionSelect(func.name);
                    setTabValue(0);
                  }}
                >
                  View
                </Button>
              </ListItem>
            )))}
          </List>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>Test Library Functions</Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="body1">
            Select a library and function from the Library Registry tab to test it with example data.
          </Typography>
        </Paper>
      </TabPanel>

      {/* Add New Library Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="add-library-modal"
        aria-describedby="modal-to-add-new-library"
      >
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: 400, 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4,
          borderRadius: 2
        }}>
          <Typography id="add-library-modal" variant="h6" component="h2" gutterBottom>
            Add New Library
          </Typography>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Library Name"
              name="name"
              value={newLibrary.name}
              onChange={handleFormChange}
              margin="normal"
              required
              helperText="Enter a unique name for the library (e.g., MedicationLibrary)"
            />
            <TextField
              fullWidth
              label="Version"
              name="version"
              value={newLibrary.version}
              onChange={handleFormChange}
              margin="normal"
              required
              helperText="Semantic version (e.g., 1.0.0)"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={newLibrary.description}
              onChange={handleFormChange}
              margin="normal"
              multiline
              rows={3}
              helperText="Describe the purpose of this library"
            />
            <TextField
              fullWidth
              label="Tags"
              name="tags"
              value={newLibrary.tags}
              onChange={handleFormChange}
              margin="normal"
              helperText="Comma-separated tags (e.g., medication, pharmacy, clinical)"
            />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseModal} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleSubmitNewLibrary}
                disabled={!newLibrary.name || !newLibrary.version}
              >
                Create Library
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Library; 