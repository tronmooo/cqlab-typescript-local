import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress,
  Alert,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  Chip,
  Divider,
  Tooltip,
  TextField,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tabs,
  Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFlows, useDeleteFlow } from '../api/hooks';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CodeIcon from '@mui/icons-material/Code';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SimpleJsonEditor from '../components/flow/SimpleJsonEditor';
import { Workflow } from '../types/workflow';
import { validateFlowJson } from '../components/flow/JsonValidator';

// Interface for TabPanel props
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// TabPanel component
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`flow-creation-tabpanel-${index}`}
      aria-labelledby={`flow-creation-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Sample mock flows for local development
const mockFlows = [
  {
    id: 'breast',
    bindId: 'breast-cancer-screening',
    name: 'Breast Cancer Screening',
    description: 'Flow for breast cancer screening recommendations',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['breast', 'cancer', 'screening']
  },
  {
    id: 'cholesterol',
    bindId: 'cholesterol-check',
    name: 'Cholesterol Check',
    description: 'Flow for checking cholesterol levels and recommendations',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['cholesterol', 'heart', 'health']
  },
  {
    id: 'covid',
    bindId: 'covid-screening',
    name: 'COVID-19 Screening',
    description: 'Screening protocol for COVID-19',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['covid', 'screening', 'infectious']
  },
  {
    id: 'hypertension',
    bindId: 'hypertension-management',
    name: 'Hypertension Management',
    description: 'Flow for hypertension management and follow-up',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['hypertension', 'blood pressure', 'cardiovascular']
  }
];

const Flows: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useFlows();
  const deleteMutation = useDeleteFlow();
  const [flows, setFlows] = useState<any[]>([]);
  const [useMockData, setUseMockData] = useState(false);
  const [showAICreation, setShowAICreation] = useState(false);
  const [showManualCreation, setShowManualCreation] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [creationTabValue, setCreationTabValue] = useState(0);
  const [jsonEditorValue, setJsonEditorValue] = useState<string>(`{
  "nodes": [],
  "edges": [],
  "metadata": {
    "name": "",
    "description": "",
    "tags": ["new"],
    "version": "1.0.0",
    "status": "Draft"
  }
}`);
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Handle tab change in creation dialog
  const handleCreationTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCreationTabValue(newValue);
    
    // If switching to JSON tab, update JSON with form data
    if (newValue === 1 && creationTabValue === 0) {
      updateJsonFromForm();
    }
    // If switching to Form tab, update form with JSON data
    else if (newValue === 0 && creationTabValue === 1) {
      updateFormFromJson();
    }
  };
  
  // Update JSON from form data
  const updateJsonFromForm = () => {
    try {
      const currentJson = JSON.parse(jsonEditorValue);
      currentJson.metadata.name = manualName;
      currentJson.metadata.description = manualDescription;
      setJsonEditorValue(JSON.stringify(currentJson, null, 2));
    } catch (err) {
      console.error('Error updating JSON from form:', err);
    }
  };
  
  // Update form from JSON data
  const updateFormFromJson = () => {
    try {
      const currentJson = JSON.parse(jsonEditorValue);
      if (currentJson.metadata) {
        setManualName(currentJson.metadata.name || '');
        setManualDescription(currentJson.metadata.description || '');
      }
    } catch (err) {
      console.error('Error updating form from JSON:', err);
    }
  };
  
  // Handle JSON editor changes
  const handleJsonChange = (updatedJsonString: string) => {
    setJsonEditorValue(updatedJsonString);
    try {
      // Try to parse the JSON to validate it
      const parsedJson = JSON.parse(updatedJsonString);
      
      // Use the flow-specific validator
      const validationError = validateFlowJson(updatedJsonString);
      setJsonError(validationError);
      
      // If we're in JSON tab, update the form fields from the JSON
      if (creationTabValue === 1 && !validationError) {
        if (parsedJson.metadata) {
          setManualName(parsedJson.metadata.name || '');
          setManualDescription(parsedJson.metadata.description || '');
        }
      }
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  };

  useEffect(() => {
    // If API data is available, use it
    if (data) {
      setFlows(data);
      setUseMockData(false);
    }
    // If error or no data, fall back to mock data
    else if (isError || (!isLoading && !data)) {
      setFlows(mockFlows);
      setUseMockData(true);
    }
  }, [data, isError, isLoading]);

  // Filter flows based on search query
  const filteredFlows = flows.filter(flow => {
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = flow.name?.toLowerCase().includes(searchLower);
    const descMatch = flow.description?.toLowerCase().includes(searchLower);
    const tagMatch = flow.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower));
    return nameMatch || descMatch || tagMatch;
  });

  const handleEdit = (id: string) => {
    navigate(`/flows/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/flows/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this flow?')) {
      if (useMockData) {
        // For mock data, just filter the flows state
        setFlows(flows.filter(flow => flow.id !== id));
      } else {
        try {
          await deleteMutation.mutateAsync(id);
        } catch (error) {
          console.error('Failed to delete flow:', error);
        }
      }
    }
  };

  const handleCreate = () => {
    // Set default JSON
    setJsonEditorValue(`{
  "nodes": [],
  "edges": [],
  "metadata": {
    "name": "",
    "description": "",
    "tags": ["new"],
    "version": "1.0.0",
    "status": "Draft"
  }
}`);
    
    // Clear form fields before opening
    setManualName('');
    setManualDescription('');
    setCreationTabValue(0); // Start on the form tab
    setJsonError(null);
    setShowManualCreation(true);
  };

  const handleManualCreate = () => {
    // For JSON tab, make sure to get the latest value from the textarea
    if (creationTabValue === 1) {
      // Find the textarea element in the SimpleJsonEditor
      const textareaElement = document.querySelector('.SimpleJsonEditor-textarea');
      if (textareaElement) {
        const currentValue = (textareaElement as HTMLTextAreaElement).value;
        
        try {
          // Try to parse and validate the current value
          JSON.parse(currentValue);
          const validationError = validateFlowJson(currentValue);
          
          if (validationError) {
            setJsonError(validationError);
            setErrorMessage('Please fix the JSON errors before proceeding');
            return;
          }
          
          // Update the state with the current value
          setJsonEditorValue(currentValue);
        } catch (err) {
          setJsonError(err instanceof Error ? err.message : 'Invalid JSON format');
          setErrorMessage('Invalid JSON: Unable to parse');
          return;
        }
      }
    }
    
    // If we're on the JSON tab and there's a JSON error, don't proceed
    if (creationTabValue === 1 && jsonError) {
      setErrorMessage('Please fix the JSON errors before proceeding');
      return;
    }
    
    // If we're on the Form tab, validate the form fields
    if (creationTabValue === 0 && (!manualName.trim() || !manualDescription.trim())) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    // Prepare the flow data based on active tab
    let flowData;
    let newId: string;
    
    if (creationTabValue === 1) {
      // Use the JSON editor value
      try {
        flowData = JSON.parse(jsonEditorValue);
        newId = `flow-${Math.random().toString(36).substring(2, 9)}`;
        
        // Ensure required properties exist
        if (!flowData.metadata) {
          flowData.metadata = {};
        }
        
        // Add required IDs
        flowData.id = newId;
        flowData.bindId = `new-flow-${newId}`;
        
        // Add timestamps
        flowData.createdAt = new Date().toISOString();
        flowData.updatedAt = new Date().toISOString();
        
        // Ensure arrays exist
        if (!flowData.nodes) flowData.nodes = [];
        if (!flowData.edges) flowData.edges = [];
        if (!flowData.metadata.tags) flowData.metadata.tags = ['new'];
      } catch (err) {
        setErrorMessage('Invalid JSON: Unable to parse');
        return;
      }
    } else {
      // Use the form values
      newId = `flow-${Math.random().toString(36).substring(2, 9)}`;
      flowData = {
        id: newId,
        bindId: `new-flow-${newId}`,
        name: manualName,
        description: manualDescription,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['new'],
        nodes: [],  // Empty nodes array
        edges: [],  // Empty edges array
        metadata: {
          name: manualName,
          description: manualDescription,
          tags: ['new'],
          version: '1.0.0',
          status: 'Draft' as const
        }
      };
    }

    if (useMockData) {
      setFlows([...flows, flowData]);
      setSuccessMessage('Flow created successfully');
      setShowManualCreation(false);
      
      // Navigate to the new flow with a query parameter to indicate it's a new flow
      navigate(`/flows/${newId}?new=true`);
    } else {
      // For API integration, navigate to a new flow page with query params
      navigate('/flows/new?blank=true');
    }
  };

  const handleAICreate = async () => {
    if (!aiPrompt.trim()) {
      setErrorMessage('Please enter a description of the workflow you want to create');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/perplexity-workflow-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: aiPrompt,
          type: 'clinical'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate workflow');
      }

      const data = await response.json();
      const workflow = data.workflow;
      
      // Add metadata
      const workflowWithMetadata = {
        ...workflow,
        metadata: {
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          version: '1.0.0',
          author: 'System',
          status: 'Draft' as const
        }
      };

      setFlows([...flows, workflowWithMetadata]);
      setSuccessMessage('Workflow created successfully');
      setShowAICreation(false);
      setAIPrompt('');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to create workflow');
    } finally {
      setIsGenerating(false);
    }
  };

  // Add run flow functionality
  const handleRunFlow = (id: string, name: string) => {
    // Here you would typically call an API to run the flow
    // For now, just show a message
    setSuccessMessage(`Running flow: ${name}`);
    console.log('Running flow:', id);
    
    // Simulate running the flow
    setTimeout(() => {
      setSuccessMessage(`Flow ${name} executed successfully`);
    }, 2000);
  };

  if (isLoading && !useMockData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4">Flows</Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Manage and create clinical decision support flows
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreate}
            startIcon={<AddIcon />}
            sx={{ 
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
              }
            }}
          >
            Create Manually
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setShowAICreation(!showAICreation)}
            startIcon={<AutoFixHighIcon />}
            sx={{ 
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
              }
            }}
          >
            Create with AI
          </Button>
        </Box>
      </Box>

      {/* Add search bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            fullWidth
            placeholder="Search flows by name, description, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
            variant="outlined"
            size="small"
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreate}
            startIcon={<AddIcon />}
            size="small"
          >
            Create
          </Button>
        </Box>
      </Paper>

      <Collapse in={showAICreation}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Create a new workflow using AI
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Describe the workflow you want to create. The AI will generate a complete workflow based on your description.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Example: Create a workflow for diabetes screening that includes age checks, risk factor assessment, and follow-up recommendations"
              value={aiPrompt}
              onChange={(e) => setAIPrompt(e.target.value)}
              disabled={isGenerating}
            />
            <Button
              variant="contained"
              onClick={handleAICreate}
              disabled={isGenerating || !aiPrompt.trim()}
              sx={{ minWidth: 120 }}
            >
              {isGenerating ? <CircularProgress size={24} /> : 'Generate'}
            </Button>
          </Box>
        </Paper>
      </Collapse>

      <Dialog 
        open={showManualCreation} 
        onClose={() => setShowManualCreation(false)} 
        maxWidth="md" 
        fullWidth
        aria-labelledby="create-flow-dialog-title"
      >
        <DialogTitle id="create-flow-dialog-title">Create New Flow</DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={creationTabValue} 
              onChange={handleCreationTabChange}
              aria-label="flow creation tabs"
            >
              <Tab label="Form" id="flow-creation-tab-0" />
              <Tab label="JSON Editor" id="flow-creation-tab-1" />
            </Tabs>
          </Box>
          
          <TabPanel value={creationTabValue} index={0}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Flow Name"
                fullWidth
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                required
                autoFocus
                error={creationTabValue === 0 && manualName.trim() === ''}
                helperText={creationTabValue === 0 && manualName.trim() === '' ? 'Name is required' : ''}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={manualDescription}
                onChange={(e) => setManualDescription(e.target.value)}
                required
                error={creationTabValue === 0 && manualDescription.trim() === ''}
                helperText={creationTabValue === 0 && manualDescription.trim() === '' ? 'Description is required' : ''}
              />
            </Box>
          </TabPanel>
          
          <TabPanel value={creationTabValue} index={1}>
            <Box sx={{ minHeight: '300px' }}>
              <SimpleJsonEditor
                initialValue={jsonEditorValue}
                onApplyChanges={handleJsonChange}
                error={jsonError}
                height={300}
                autoApply={true}
              />
            </Box>
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowManualCreation(false)}>Cancel</Button>
          <Button 
            onClick={handleManualCreate} 
            variant="contained" 
            color="primary"
            disabled={(creationTabValue === 0 && (!manualName.trim() || !manualDescription.trim())) || 
                     (creationTabValue === 1 && !!jsonError)}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {useMockData && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Using mock data for development. Backend API not available.
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      {filteredFlows?.length === 0 ? (
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
          {searchQuery ? (
            <Typography variant="body1">No flows match your search criteria. Try adjusting your search.</Typography>
          ) : (
            <>
              <Typography variant="body1">No flows found. Create your first flow!</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleCreate}
                sx={{ mt: 2 }}
              >
                Create Flow
              </Button>
            </>
          )}
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={1}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width="20%">Name</TableCell>
                <TableCell width="30%">Description</TableCell>
                <TableCell width="20%">Tags</TableCell>
                <TableCell width="30%" align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFlows?.map((flow: any) => (
                <TableRow 
                  key={flow.id}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                    cursor: 'pointer'
                  }}
                  onClick={() => handleView(flow.id)}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight="medium">
                        {flow.name || flow.bindId || 'Untitled Flow'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      color="textSecondary"
                      sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {flow.description || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {flow.tags?.slice(0, 3).map((tag: string) => (
                        <Chip 
                          key={tag} 
                          label={tag} 
                          size="small" 
                          sx={{ 
                            fontSize: '0.7rem', 
                            height: '20px',
                            '& .MuiChip-label': { px: 1 } 
                          }} 
                        />
                      ))}
                      {flow.tags?.length > 3 && (
                        <Chip 
                          label={`+${flow.tags.length - 3}`} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            fontSize: '0.7rem', 
                            height: '20px',
                            '& .MuiChip-label': { px: 1 } 
                          }} 
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Run">
                      <IconButton 
                        size="small" 
                        color="success"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRunFlow(flow.id, flow.name || flow.bindId || 'Untitled Flow');
                        }}
                        sx={{ mr: 0.5 }}
                      >
                        <PlayArrowIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(flow.id);
                        }}
                        sx={{ mr: 0.5 }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Duplicate">
                      <IconButton 
                        size="small" 
                        color="default"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSuccessMessage(`Duplicating flow: ${flow.name || 'Untitled Flow'}`);
                          console.log('Duplicating flow:', flow.id);
                        }}
                        sx={{ mr: 0.5 }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(flow.id);
                        }}
                        color="primary"
                        sx={{ mr: 0.5 }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(flow.id);
                        }}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Flows; 