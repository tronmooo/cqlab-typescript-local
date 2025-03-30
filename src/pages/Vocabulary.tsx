import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Divider, 
  Button, 
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CodeIcon from '@mui/icons-material/Code';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface CodeSystem {
  id: string;
  name: string;
  url: string;
  version: string;
}

interface Code {
  id: string;
  system: string;
  code: string;
  display: string;
  description?: string;
}

interface ValueSet {
  id: string;
  name: string;
  description: string;
  codes: string[];
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vocabulary-tabpanel-${index}`}
      aria-labelledby={`vocabulary-tab-${index}`}
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

const Vocabulary: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add state for the dialogs
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [itemType, setItemType] = useState<'valueSet' | 'code' | 'codeSystem'>('valueSet');
  
  // Add state for notifications
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  // Function to show a notification
  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  // Function to close the snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };
  
  // Open view dialog
  const handleViewItem = (item: any, type: 'valueSet' | 'code' | 'codeSystem') => {
    setSelectedItem(item);
    setItemType(type);
    setViewDialogOpen(true);
  };
  
  // Open edit dialog
  const handleEditItem = (item: any, type: 'valueSet' | 'code' | 'codeSystem') => {
    setSelectedItem(item);
    setItemType(type);
    setEditDialogOpen(true);
  };
  
  // Handle delete action
  const handleDeleteItem = (item: any, type: 'valueSet' | 'code' | 'codeSystem') => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      // Here you would call an API to delete the item
      // For now, just show a notification
      showNotification(`${type} deleted successfully`, 'success');
    }
  };
  
  // Handle create action
  const handleAddItem = (type: 'valueSet' | 'code' | 'codeSystem') => {
    setItemType(type);
    setSelectedItem(null);
    setEditDialogOpen(true);
  };

  // Sample code systems
  const codeSystems: CodeSystem[] = [
    {
      id: 'cs-001',
      name: 'LOINC',
      url: 'http://loinc.org',
      version: '2.73'
    },
    {
      id: 'cs-002',
      name: 'SNOMED CT',
      url: 'http://snomed.info/sct',
      version: '2022-09'
    },
    {
      id: 'cs-003',
      name: 'RxNorm',
      url: 'http://www.nlm.nih.gov/research/umls/rxnorm',
      version: '09/2022'
    },
    {
      id: 'cs-004',
      name: 'ICD-10',
      url: 'http://hl7.org/fhir/sid/icd-10',
      version: '2023'
    }
  ];

  // Sample codes
  const codes: Code[] = [
    {
      id: 'code-001',
      system: 'http://loinc.org',
      code: '8462-4',
      display: 'Diastolic blood pressure',
      description: 'Measurement of diastolic blood pressure'
    },
    {
      id: 'code-002',
      system: 'http://loinc.org',
      code: '8480-6',
      display: 'Systolic blood pressure',
      description: 'Measurement of systolic blood pressure'
    },
    {
      id: 'code-003',
      system: 'http://loinc.org',
      code: '85354-9',
      display: 'Blood pressure panel with all children optional',
      description: 'Panel containing blood pressure measurements'
    },
    {
      id: 'code-004',
      system: 'http://loinc.org',
      code: '9830-1',
      display: 'Cholesterol in HDL [Mass Ratio] in Serum or Plasma',
      description: 'Measurement of HDL cholesterol'
    }
  ];

  // Sample value sets
  const valueSets: ValueSet[] = [
    {
      id: 'vs-001',
      name: 'Blood Pressure Measurements',
      description: 'Codes related to blood pressure measurements',
      codes: ['code-001', 'code-002', 'code-003']
    },
    {
      id: 'vs-002',
      name: 'Cholesterol Panel',
      description: 'Codes related to cholesterol measurements',
      codes: ['code-004']
    },
    {
      id: 'vs-003',
      name: 'Mammography',
      description: 'Codes related to mammography procedures',
      codes: []
    }
  ];

  const filteredCodes = searchQuery
    ? codes.filter(code => 
        code.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
        code.display.toLowerCase().includes(searchQuery.toLowerCase()))
    : codes;

  return (
    <Box p={3}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          CQVocabulary
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          View configured value sets and codes used by the logic in CQDefine.
        </Typography>
        <Divider sx={{ mt: 2 }} />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="vocabulary tabs">
          <Tab label="Value Sets" id="vocabulary-tab-0" />
          <Tab label="All Codes" id="vocabulary-tab-1" />
          <Tab label="Code Systems" id="vocabulary-tab-2" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box display="flex" justifyContent="flex-end" mb={3}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => handleAddItem('valueSet')}
          >
            Add New Value Set
          </Button>
        </Box>

        <Grid container spacing={3}>
          {valueSets.map((valueSet) => (
            <Grid item xs={12} key={valueSet.id}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {valueSet.name}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {valueSet.description}
                    </Typography>
                    <Chip 
                      label={`${valueSet.codes.length} codes`} 
                      size="small" 
                      color="primary" 
                      sx={{ mt: 1 }} 
                    />
                  </Box>
                  <Box>
                    <IconButton 
                      size="small" 
                      color="primary" 
                      sx={{ mr: 1 }}
                      onClick={() => handleViewItem(valueSet, 'valueSet')}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="primary" 
                      sx={{ mr: 1 }}
                      onClick={() => handleEditItem(valueSet, 'valueSet')}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteItem(valueSet, 'valueSet')}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                {valueSet.codes.length > 0 && (
                  <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Code</TableCell>
                          <TableCell>Display</TableCell>
                          <TableCell>System</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {valueSet.codes.map(codeId => {
                          const code = codes.find(c => c.id === codeId);
                          if (!code) return null;
                          return (
                            <TableRow key={code.id}>
                              <TableCell>{code.code}</TableCell>
                              <TableCell>{code.display}</TableCell>
                              <TableCell>{code.system}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box mb={3}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search codes by code or display name"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Paper elevation={2}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>System</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Display</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCodes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell>{code.system}</TableCell>
                    <TableCell>{code.code}</TableCell>
                    <TableCell>{code.display}</TableCell>
                    <TableCell>{code.description || '-'}</TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small" 
                        color="primary" 
                        sx={{ mr: 1 }}
                        onClick={() => handleViewItem(code, 'code')}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="primary" 
                        sx={{ mr: 1 }}
                        onClick={() => handleEditItem(code, 'code')}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteItem(code, 'code')}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Box display="flex" justifyContent="flex-end" mb={3}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => handleAddItem('codeSystem')}
          >
            Add New Code System
          </Button>
        </Box>

        <Paper elevation={2}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell>Version</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {codeSystems.map((system) => (
                  <TableRow key={system.id}>
                    <TableCell>{system.name}</TableCell>
                    <TableCell>{system.url}</TableCell>
                    <TableCell>{system.version}</TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small" 
                        color="primary" 
                        sx={{ mr: 1 }}
                        onClick={() => handleViewItem(system, 'codeSystem')}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="primary" 
                        sx={{ mr: 1 }}
                        onClick={() => handleEditItem(system, 'codeSystem')}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteItem(system, 'codeSystem')}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      {/* Add dialogs */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>View {itemType}</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <pre>{JSON.stringify(selectedItem, null, 2)}</pre>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedItem ? `Edit ${itemType}` : `Add New ${itemType}`}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {selectedItem ? 'Edit form would go here' : 'Creation form would go here'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              setEditDialogOpen(false);
              showNotification(`${itemType} ${selectedItem ? 'updated' : 'created'} successfully`);
            }}
            variant="contained" 
            color="primary"
          >
            {selectedItem ? 'Save Changes' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Vocabulary; 