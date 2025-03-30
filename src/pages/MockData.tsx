import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CodeIcon from '@mui/icons-material/Code';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import ValidateIcon from '@mui/icons-material/Verified';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const MockDataContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 1200,
  margin: '0 auto'
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
      id={`mock-data-tabpanel-${index}`}
      aria-labelledby={`mock-data-tab-${index}`}
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

interface PatientData {
  id: string;
  name: string;
  age: number;
  dob: string;
  gender: string;
  mrn: string;
  conditions: string[];
  medications: string[];
  lastVisit: string;
}

interface FlowData {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  lastUpdated: string;
  testCases: number;
}

interface TestScenario {
  id: string;
  name: string;
  description: string;
  patientId: string;
  flowId: string;
  expectedResult: string;
  status: string;
}

interface JsonData {
  patients?: Array<unknown>;
  flows?: Array<unknown>;
  scenarios?: Array<unknown>;
}

// Add validation rules
const validationRules = {
  patient: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s-']+$/
    },
    dob: {
      required: true,
      maxDate: new Date().toISOString().split('T')[0],
      minDate: '1900-01-01'
    },
    mrn: {
      required: true,
      pattern: /^[A-Z0-9-]+$/,
      minLength: 5,
      maxLength: 20
    },
    conditions: {
      maxItems: 20,
      unique: true
    },
    medications: {
      maxItems: 30,
      unique: true
    }
  },
  flow: {
    name: {
      required: true,
      minLength: 3,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s-]+$/
    },
    description: {
      required: true,
      maxLength: 500
    },
    type: {
      required: true,
      enum: ['Clinical', 'Administrative', 'Quality']
    }
  },
  scenario: {
    name: {
      required: true,
      minLength: 3,
      maxLength: 100
    },
    description: {
      required: true,
      maxLength: 500
    },
    expectedResult: {
      required: true,
      maxLength: 200
    }
  }
};

// Add validation functions
const validatePatient = (patient: PatientData): string[] => {
  const errors: string[] = [];
  const rules = validationRules.patient;

  if (!patient.name || !rules.name.pattern.test(patient.name)) {
    errors.push('Name must contain only letters, spaces, hyphens, and apostrophes');
  }
  if (!patient.dob || new Date(patient.dob) > new Date(rules.dob.maxDate)) {
    errors.push('Date of birth must be in the past');
  }
  if (!patient.mrn || !rules.mrn.pattern.test(patient.mrn)) {
    errors.push('MRN must contain only uppercase letters, numbers, and hyphens');
  }
  if (patient.conditions.length > rules.conditions.maxItems) {
    errors.push(`Maximum ${rules.conditions.maxItems} conditions allowed`);
  }
  if (patient.medications.length > rules.medications.maxItems) {
    errors.push(`Maximum ${rules.medications.maxItems} medications allowed`);
  }

  return errors;
};

const validateFlow = (flow: FlowData): string[] => {
  const errors: string[] = [];
  const rules = validationRules.flow;

  if (!flow.name || !rules.name.pattern.test(flow.name)) {
    errors.push('Name must contain only letters, numbers, spaces, and hyphens');
  }
  if (!flow.description) {
    errors.push('Description is required');
  }
  if (!flow.type || !rules.type.enum.includes(flow.type)) {
    errors.push('Invalid flow type');
  }

  return errors;
};

const validateScenario = (scenario: TestScenario): string[] => {
  const errors: string[] = [];
  const rules = validationRules.scenario;

  if (!scenario.name || scenario.name.length < rules.name.minLength) {
    errors.push(`Name must be at least ${rules.name.minLength} characters`);
  }
  if (!scenario.description) {
    errors.push('Description is required');
  }
  if (!scenario.expectedResult) {
    errors.push('Expected result is required');
  }

  return errors;
};

// Add import/export functions
const exportToCSV = (data: any[], filename: string) => {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      return Array.isArray(value) ? `"${value.join(';')}"` : `"${value}"`;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

const importFromCSV = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.replace(/"/g, ''));
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index].includes(';') 
              ? values[index].split(';') 
              : values[index];
          });
          return row;
        });
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Add type guards
const isPatientData = (data: any): data is PatientData => {
  return (
    typeof data === 'object' &&
    'id' in data &&
    'name' in data &&
    'dob' in data &&
    'gender' in data &&
    'mrn' in data &&
    'conditions' in data &&
    'medications' in data &&
    'lastVisit' in data
  );
};

const isFlowData = (data: any): data is FlowData => {
  return (
    typeof data === 'object' &&
    'id' in data &&
    'name' in data &&
    'description' in data &&
    'type' in data &&
    'status' in data &&
    'lastUpdated' in data &&
    'testCases' in data
  );
};

const isTestScenario = (data: any): data is TestScenario => {
  return (
    typeof data === 'object' &&
    'id' in data &&
    'name' in data &&
    'description' in data &&
    'patientId' in data &&
    'flowId' in data &&
    'expectedResult' in data &&
    'status' in data
  );
};

// Add mock patients data
export const mockPatients: PatientData[] = [
  {
    id: 'patient1',
    name: 'Sarah Johnson',
    age: 45,
    dob: '1971-03-15',
    gender: 'Female',
    mrn: 'MRN12345',
    conditions: ['Hypertension'],
    medications: ['Lisinopril'],
    lastVisit: '2023-01-20'
  },
  {
    id: 'patient2',
    name: 'Michael Chen',
    age: 40,
    dob: '1975-08-22',
    gender: 'Male',
    mrn: 'MRN67890',
    conditions: ['Type 2 Diabetes'],
    medications: ['Metformin'],
    lastVisit: '2023-02-15'
  },
  {
    id: 'patient3',
    name: 'Emily Rodriguez',
    age: 40,
    dob: '1977-11-30',
    gender: 'Female',
    mrn: 'MRN13579',
    conditions: [],
    medications: [],
    lastVisit: '2023-03-01'
  },
  {
    id: 'patient4',
    name: 'David Wilson',
    age: 50,
    dob: '1968-04-18',
    gender: 'Male',
    mrn: 'MRN24680',
    conditions: ['High Cholesterol'],
    medications: ['Atorvastatin'],
    lastVisit: '2023-02-28'
  }
];

const MockData: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'patient' | 'flow' | 'scenario'>('patient');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Sample data - in a real app, this would come from an API
  const [patients, setPatients] = useState<PatientData[]>([
    {
      id: 'patient-001',
      name: 'Jane Doe',
      age: 45,
      dob: '1975-05-12',
      gender: 'female',
      mrn: 'MRN12345',
      conditions: ['Hypertension', 'Type 2 Diabetes'],
      medications: ['Lisinopril', 'Metformin'],
      lastVisit: '2023-08-15'
    },
    {
      id: 'patient-002',
      name: 'John Smith',
      age: 50,
      dob: '1968-09-23',
      gender: 'male',
      mrn: 'MRN54321',
      conditions: ['High Cholesterol'],
      medications: ['Atorvastatin'],
      lastVisit: '2023-08-10'
    }
  ]);

  const [flows, setFlows] = useState<FlowData[]>([
    {
      id: 'flow-001',
      name: 'Breast Cancer Screening',
      description: 'Screening flow for female patients over 45',
      type: 'Clinical',
      status: 'Active',
      lastUpdated: '2023-08-15',
      testCases: 5
    },
    {
      id: 'flow-002',
      name: 'Hypertension Management',
      description: 'Flow for managing hypertensive patients',
      type: 'Clinical',
      status: 'Active',
      lastUpdated: '2023-08-10',
      testCases: 3
    }
  ]);

  const [scenarios, setScenarios] = useState<TestScenario[]>([
    {
      id: 'scenario-001',
      name: 'Normal Screening',
      description: 'Patient meets screening criteria',
      patientId: 'patient-001',
      flowId: 'flow-001',
      expectedResult: 'Schedule Screening',
      status: 'Passed'
    },
    {
      id: 'scenario-002',
      name: 'High Risk Patient',
      description: 'Patient with multiple risk factors',
      patientId: 'patient-002',
      flowId: 'flow-002',
      expectedResult: 'Urgent Review',
      status: 'Failed'
    }
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (type: 'patient' | 'flow' | 'scenario', item: any = null) => {
    setDialogType(type);
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Add handlers for import/export
  const handleExport = (type: 'patient' | 'flow' | 'scenario') => {
    try {
      const data = type === 'patient' ? patients : type === 'flow' ? flows : scenarios;
      const filename = `${type}s_${new Date().toISOString().split('T')[0]}.csv`;
      exportToCSV(data, filename);
      setSnackbar({
        open: true,
        message: `Successfully exported ${type}s`,
        severity: 'success'
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSnackbar({
        open: true,
        message: `Failed to export ${type}s: ${errorMessage}`,
        severity: 'error'
      });
    }
  };

  const handleImport = async (type: 'patient' | 'flow' | 'scenario', file: File) => {
    setIsLoading(true);
    try {
      const data = await importFromCSV(file) as Array<unknown>;
      const errors: string[] = [];
      
      data.forEach((item, index) => {
        let itemErrors: string[] = [];
        
        if (type === 'patient' && isPatientData(item)) {
          itemErrors = validatePatient(item);
        } else if (type === 'flow' && isFlowData(item)) {
          itemErrors = validateFlow(item);
        } else if (type === 'scenario' && isTestScenario(item)) {
          itemErrors = validateScenario(item);
        } else {
          itemErrors = [`Invalid data format for ${type}`];
        }
        
        if (itemErrors.length > 0) {
          errors.push(`Row ${index + 1}: ${itemErrors.join(', ')}`);
        }
      });

      if (errors.length > 0) {
        setValidationErrors(errors);
        setSnackbar({
          open: true,
          message: `Import failed: ${errors.length} validation errors`,
          severity: 'error'
        });
        return;
      }

      // Update state based on type with proper type guards
      if (type === 'patient') {
        const validPatients = data.filter((item): item is PatientData => isPatientData(item));
        setPatients((prevPatients: PatientData[]) => [...prevPatients, ...validPatients]);
      } else if (type === 'flow') {
        const validFlows = data.filter((item): item is FlowData => isFlowData(item));
        setFlows((prevFlows: FlowData[]) => [...prevFlows, ...validFlows]);
      } else {
        const validScenarios = data.filter((item): item is TestScenario => isTestScenario(item));
        setScenarios((prevScenarios: TestScenario[]) => [...prevScenarios, ...validScenarios]);
      }

      setSnackbar({
        open: true,
        message: `Successfully imported ${data.length} ${type}s`,
        severity: 'success'
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSnackbar({
        open: true,
        message: `Failed to import ${type}s: ${errorMessage}`,
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add validation handler
  const handleValidate = (type: 'patient' | 'flow' | 'scenario') => {
    const data = type === 'patient' ? patients : type === 'flow' ? flows : scenarios;
    const errors: string[] = [];
    
    data.forEach((item, index) => {
      let itemErrors: string[] = [];
      
      if (type === 'patient') {
        itemErrors = validatePatient(item as PatientData);
      } else if (type === 'flow') {
        itemErrors = validateFlow(item as FlowData);
      } else {
        itemErrors = validateScenario(item as TestScenario);
      }
      
      if (itemErrors.length > 0) {
        errors.push(`Item ${index + 1}: ${itemErrors.join(', ')}`);
      }
    });

    if (errors.length > 0) {
      setValidationErrors(errors);
      setSnackbar({
        open: true,
        message: `Found ${errors.length} validation errors`,
        severity: 'error'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'All items passed validation',
        severity: 'success'
      });
    }
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

  const renderPatientTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>DOB</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>MRN</TableCell>
            <TableCell>Conditions</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.id}</TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.dob}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.mrn}</TableCell>
                <TableCell>
                  {patient.conditions.map((condition) => (
                    <Chip
                      key={condition}
                      label={condition}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton 
                      size="small" 
                      color="primary" 
                      sx={{ mr: 1 }}
                      onClick={() => handleOpenDialog('patient', patient)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete patient ${patient.name}?`)) {
                          // Delete patient logic
                          const newPatients = patients.filter(p => p.id !== patient.id);
                          setPatients(newPatients);
                          showNotification(`Patient ${patient.name} deleted successfully`);
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={patients.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );

  const renderFlowTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Last Updated</TableCell>
            <TableCell>Test Cases</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {flows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((flow) => (
              <TableRow key={flow.id}>
                <TableCell>{flow.id}</TableCell>
                <TableCell>{flow.name}</TableCell>
                <TableCell>{flow.description}</TableCell>
                <TableCell>{flow.type}</TableCell>
                <TableCell>
                  <Chip
                    label={flow.status}
                    color={flow.status === 'Active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{flow.lastUpdated}</TableCell>
                <TableCell>{flow.testCases}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton 
                      size="small" 
                      color="primary" 
                      sx={{ mr: 1 }}
                      onClick={() => handleOpenDialog('flow', flow)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete flow ${flow.name}?`)) {
                          // Delete flow logic
                          const newFlows = flows.filter(f => f.id !== flow.id);
                          setFlows(newFlows);
                          showNotification(`Flow ${flow.name} deleted successfully`);
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={flows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );

  const renderScenarioTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Patient</TableCell>
            <TableCell>Flow</TableCell>
            <TableCell>Expected Result</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scenarios
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((scenario) => (
              <TableRow key={scenario.id}>
                <TableCell>{scenario.id}</TableCell>
                <TableCell>{scenario.name}</TableCell>
                <TableCell>{scenario.description}</TableCell>
                <TableCell>{scenario.patientId}</TableCell>
                <TableCell>{scenario.flowId}</TableCell>
                <TableCell>{scenario.expectedResult}</TableCell>
                <TableCell>
                  <Chip
                    label={scenario.status}
                    color={scenario.status === 'Passed' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton 
                      size="small" 
                      color="primary" 
                      sx={{ mr: 1 }}
                      onClick={() => handleOpenDialog('scenario', scenario)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete scenario ${scenario.name}?`)) {
                          // Delete scenario logic
                          const newScenarios = scenarios.filter(s => s.id !== scenario.id);
                          setScenarios(newScenarios);
                          showNotification(`Scenario ${scenario.name} deleted successfully`);
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={scenarios.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );

  return (
    <MockDataContainer>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Mock Data Management
        </Typography>
        <Typography color="text.secondary" paragraph>
          Create and manage test data for clinical decision support flows
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          High-quality mock data is crucial for developing robust CDS solutions. Ensure your test data accurately represents real-world scenarios.
        </Alert>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Patients" />
          <Tab label="Flows" />
          <Tab label="Test Scenarios" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('patient')}
            >
              Add Patient
            </Button>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              component="label"
              disabled={isLoading}
            >
              Import Patients
              <input
                type="file"
                hidden
                accept=".csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImport('patient', file);
                }}
              />
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => handleExport('patient')}
            >
              Export Patients
            </Button>
            <Button
              variant="outlined"
              startIcon={<ValidateIcon />}
              onClick={() => handleValidate('patient')}
            >
              Validate Patients
            </Button>
          </Box>
          {renderPatientTable()}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('flow')}
            >
              Add Flow
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
            >
              Refresh Flows
            </Button>
            <Button
              variant="outlined"
              startIcon={<ValidateIcon />}
            >
              Validate Flows
            </Button>
          </Box>
          {renderFlowTable()}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('scenario')}
            >
              Add Scenario
            </Button>
            <Button
              variant="outlined"
              startIcon={<PlayArrowIcon />}
            >
              Run All Tests
            </Button>
            <Button
              variant="outlined"
              startIcon={<ValidateIcon />}
            >
              Validate Scenarios
            </Button>
          </Box>
          {renderScenarioTable()}
        </TabPanel>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedItem ? 'Edit' : 'Add'} {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}
        </DialogTitle>
        <DialogContent>
          {/* Form fields based on dialogType */}
          <Box sx={{ pt: 2 }}>
            {dialogType === 'patient' && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    defaultValue={selectedItem?.name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    defaultValue={selectedItem?.dob}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      defaultValue={selectedItem?.gender || ''}
                      label="Gender"
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="MRN"
                    defaultValue={selectedItem?.mrn}
                  />
                </Grid>
              </Grid>
            )}
            {dialogType === 'flow' && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    defaultValue={selectedItem?.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    defaultValue={selectedItem?.description}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      defaultValue={selectedItem?.type || ''}
                      label="Type"
                    >
                      <MenuItem value="Clinical">Clinical</MenuItem>
                      <MenuItem value="Administrative">Administrative</MenuItem>
                      <MenuItem value="Quality">Quality</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      defaultValue={selectedItem?.status || ''}
                      label="Status"
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Draft">Draft</MenuItem>
                      <MenuItem value="Archived">Archived</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}
            {dialogType === 'scenario' && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    defaultValue={selectedItem?.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    defaultValue={selectedItem?.description}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Patient</InputLabel>
                    <Select
                      defaultValue={selectedItem?.patientId || ''}
                      label="Patient"
                    >
                      {patients.map((patient) => (
                        <MenuItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Flow</InputLabel>
                    <Select
                      defaultValue={selectedItem?.flowId || ''}
                      label="Flow"
                    >
                      {flows.map((flow) => (
                        <MenuItem key={flow.id} value={flow.id}>
                          {flow.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Expected Result"
                    defaultValue={selectedItem?.expectedResult}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleCloseDialog}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      {isLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </MockDataContainer>
  );
};

export default MockData; 