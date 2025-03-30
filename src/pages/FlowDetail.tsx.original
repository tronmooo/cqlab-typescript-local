import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button,
  Paper,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton as MuiIconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Menu,
  ListItemIcon,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CodeIcon from '@mui/icons-material/Code';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReactFlow, { 
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
  addEdge,
  Panel,
  NodeTypes,
  EdgeTypes,
  Handle,
  Position,
  ReactFlowProps,
  NodeProps,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { mockPatients } from './MockData';
import dagre from 'dagre';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoIcon from '@mui/icons-material/Info';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import SimpleJsonEditor from '../components/flow/SimpleJsonEditor';
import { validateFlowJson } from '../components/flow/JsonValidator';
import { useSnackbar } from 'notistack';
import { flowNodeTypes, flowEdgeTypes } from '../components/flow/FlowNodes';

// Node Types
const NODE_TYPES = {
  CORE: {
    START: 'start',
    END: 'end',
    SUB_FLOW: 'subFlow',
    NARRATIVE: 'narrative',
  },
  FLOW_CONTROL: {
    TRUE_FALSE: 'trueFalse',
    BRANCH: 'branch',
    LOGIC_TREE: 'logicTree',
  },
  FLOW_INPUT: {
    CUSTOM_FORM: 'customForm',
    FORM_FIELD: 'formField',
  },
  FLOW_OUTPUT: {
    EMIT_DATA: 'emitData',
    TAKE_ACTION: 'takeAction',
  },
} as const;

// Node Categories with enhanced descriptions
const NODE_CATEGORIES = [
  {
    title: 'Core',
    description: 'Essential nodes for flow structure',
    nodes: [
      { 
        type: NODE_TYPES.CORE.START, 
        label: 'Start', 
        description: 'Start node of the flow',
        color: '#4CAF50',
        icon: '▶️'
      },
      { 
        type: NODE_TYPES.CORE.END, 
        label: 'End', 
        description: 'End node of the flow',
        color: '#F44336',
        icon: '⏹️'
      },
      { 
        type: NODE_TYPES.CORE.SUB_FLOW, 
        label: 'Sub-Flow', 
        description: 'Embedded flow component for modular design',
        color: '#2196F3',
        icon: '🔄'
      },
      { 
        type: NODE_TYPES.CORE.NARRATIVE, 
        label: 'Narrative', 
        description: 'Documentation and context for flow understanding',
        color: '#9E9E9E',
        icon: '📝'
      },
    ],
  },
  {
    title: 'Flow Control',
    description: 'Nodes for flow decision making',
    nodes: [
      { 
        type: NODE_TYPES.FLOW_CONTROL.TRUE_FALSE, 
        label: 'True/False', 
        description: 'Binary decision point with true/false paths',
        color: '#2196F3',
        icon: '⚖️'
      },
      { 
        type: NODE_TYPES.FLOW_CONTROL.BRANCH, 
        label: 'Branch', 
        description: 'Multiple path decision with custom branches',
        color: '#FF9800',
        icon: '🌳'
      },
      { 
        type: NODE_TYPES.FLOW_CONTROL.LOGIC_TREE, 
        label: 'Logic Tree', 
        description: 'Complex logic evaluation with AND/OR conditions',
        color: '#9C27B0',
        icon: '🔍'
      },
    ],
  },
  {
    title: 'Flow Input',
    description: 'Nodes for data collection',
    nodes: [
      { 
        type: NODE_TYPES.FLOW_INPUT.CUSTOM_FORM, 
        label: 'Custom Form', 
        description: 'Complex form input for detailed data collection',
        color: '#00BCD4',
        icon: '📋'
      },
      { 
        type: NODE_TYPES.FLOW_INPUT.FORM_FIELD, 
        label: 'Form Field', 
        description: 'Simple input field for basic data entry',
        color: '#4CAF50',
        icon: '✏️'
      },
    ],
  },
  {
    title: 'Flow Output',
    description: 'Nodes for flow results and actions',
    nodes: [
      { 
        type: NODE_TYPES.FLOW_OUTPUT.EMIT_DATA, 
        label: 'Emit Data', 
        description: 'Return data and recommendations to caller',
        color: '#FF5722',
        icon: '📤'
      },
      { 
        type: NODE_TYPES.FLOW_OUTPUT.TAKE_ACTION, 
        label: 'Take Action', 
        description: 'Trigger specific actions like orders or alerts',
        color: '#E91E63',
        icon: '⚡'
      },
    ],
  },
];

// Custom Node Components
const StartNode = ({ data }: NodeProps) => (
  <div style={{ 
    padding: '15px',
    background: 'white',
    color: '#333',
    borderRadius: '2px',
    width: '200px',
    height: '90px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    border: '1px solid #e0e0e0',
    cursor: 'move',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <Handle 
      type="source" 
      position={Position.Right} 
      style={{ 
        width: '10px', 
        height: '10px', 
        background: '#888',
        border: '2px solid white',
        right: '-6px',
      }} 
    />
    <div style={{ 
      fontSize: '0.9rem', 
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    }}>
      <span style={{ 
        color: '#f44336', 
        fontSize: '1.2rem', 
        marginRight: '5px' 
      }}>⚡</span>
      <span>{data.label || 'On Event'}</span>
    </div>
    <div style={{ 
      fontSize: '0.8rem',
      marginTop: '5px',
      color: '#666',
      maxWidth: '180px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'center'
    }}>
      {data.description || 'Starting point'}
    </div>
  </div>
);

const EndNode = ({ data }: NodeProps) => (
  <div style={{ 
    padding: '15px',
    background: 'white',
    color: '#333',
    borderRadius: '2px',
    width: '200px',
    height: '90px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    border: '1px solid #e0e0e0',
    cursor: 'move',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <Handle 
      type="target" 
      position={Position.Left} 
      style={{ 
        width: '10px', 
        height: '10px', 
        background: '#888',
        border: '2px solid white',
        left: '-6px',
      }} 
    />
    <div style={{ 
      fontSize: '0.9rem', 
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    }}>
      <span style={{ 
        color: '#4caf50', 
        fontSize: '1.2rem', 
        marginRight: '5px' 
      }}>✓</span>
      <span>{data.label || 'End'}</span>
    </div>
    <div style={{ 
      fontSize: '0.8rem',
      marginTop: '5px',
      color: '#666',
      maxWidth: '180px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'center'
    }}>
      {data.description || 'Completion point'}
    </div>
  </div>
);

const TrueFalseNode = ({ data, id }: NodeProps) => {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [label, setLabel] = useState(data.label || '');
  const [description, setDescription] = useState(data.description || '');

  const handleDoubleClick = (e: React.MouseEvent, field: 'label' | 'description') => {
    e.stopPropagation();
    if (field === 'label') {
      setIsEditingLabel(true);
    } else {
      setIsEditingDescription(true);
    }
  };

  const updateNodeData = () => {
    const event = new CustomEvent('nodeUpdate', {
      detail: { id, data: { label, description } }
    });
    window.dispatchEvent(event);
  };

  return (
    <div style={{ 
      padding: '15px',
      background: 'white',
      color: '#333',
      borderRadius: '2px',
      width: '200px',
      minHeight: '90px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      border: '1px solid #e0e0e0',
      cursor: 'move',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ 
          width: '10px', 
          height: '10px', 
          background: '#888',
          border: '2px solid white',
          left: '-6px',
        }} 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="true" 
        style={{ 
          width: '10px', 
          height: '10px', 
          background: '#4CAF50',
          border: '2px solid white',
          right: '-6px',
          top: '30%',
        }}
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="false" 
        style={{ 
          width: '10px', 
          height: '10px', 
          background: '#F44336',
          border: '2px solid white',
          right: '-6px',
          top: '70%',
        }}
      />
      
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        gap: '6px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px'
        }}>
          <span style={{ 
            color: '#2196F3', 
            fontSize: '1rem'
          }}>⚖️</span>
        </div>
        <span style={{ 
          fontSize: '0.9rem', 
          fontWeight: 'bold',
        }}>
          {isEditingLabel ? (
            <textarea
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={() => {
                setIsEditingLabel(false);
                updateNodeData();
              }}
              autoFocus
              style={{
                background: 'rgba(0, 0, 0, 0.05)',
                borderRadius: '4px',
                padding: '4px',
                border: 'none',
                resize: 'none',
                fontSize: '0.9rem',
                color: '#333',
                width: '140px',
                minHeight: '24px',
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              onDoubleClick={(e) => handleDoubleClick(e, 'label')}
              style={{ cursor: 'pointer' }}
            >
              {label || 'Is condition?'}
            </span>
          )}
        </span>
      </div>

      {isEditingDescription ? (
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => {
            setIsEditingDescription(false);
            updateNodeData();
          }}
          autoFocus
          style={{
            background: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '4px',
            padding: '4px',
            border: 'none',
            resize: 'none',
            fontSize: '0.8rem',
            color: '#333',
            minHeight: '40px',
            width: '100%',
          }}
          onClick={(e) => e.stopPropagation()}
          placeholder="Add a description..."
        />
      ) : (
        <div
          style={{ 
            fontSize: '0.8rem',
            color: '#666',
            cursor: 'pointer',
          }}
          onDoubleClick={(e) => handleDoubleClick(e, 'description')}
        >
          {description || 'Double-click to add description'}
        </div>
      )}

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        fontSize: '0.7rem',
        marginTop: '10px'
      }}>
        <div style={{ 
          position: 'absolute',
          top: '20%',
          right: '8px',
          color: '#4CAF50',
          fontWeight: 'bold',
          fontSize: '0.7rem',
        }}>true</div>
        <div style={{ 
          position: 'absolute',
          top: '60%',
          right: '8px',
          color: '#F44336',
          fontWeight: 'bold',
          fontSize: '0.7rem',
        }}>false</div>
      </div>
    </div>
  );
};

// Add BranchNode that matches the style in the image
const BranchNode = ({ data }: NodeProps) => (
  <div style={{ 
    padding: '15px',
    background: 'white',
    color: '#333',
    borderRadius: '2px',
    width: '200px',
    minHeight: '90px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    border: '1px solid #e0e0e0',
    cursor: 'move',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
  }}>
    <Handle 
      type="target" 
      position={Position.Left} 
      style={{ 
        width: '10px', 
        height: '10px', 
        background: '#888',
        border: '2px solid white',
        left: '-6px',
      }} 
    />
    
    {/* Add multiple output handles for branch options */}
    <Handle 
      type="source" 
      id="branch1" 
      position={Position.Right} 
      style={{ 
        width: '10px', 
        height: '10px', 
        background: '#888',
        border: '2px solid white',
        right: '-6px',
        top: '30%',
      }} 
    />
    <Handle 
      type="source" 
      id="branch2" 
      position={Position.Right} 
      style={{ 
        width: '10px', 
        height: '10px', 
        background: '#888',
        border: '2px solid white',
        right: '-6px',
        top: '70%',
      }} 
    />
    
    <div style={{ 
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
      gap: '6px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        backgroundColor: '#f0f0f0',
        borderRadius: '4px'
      }}>
        <span style={{ 
          color: '#FF9800', 
          fontSize: '1rem'
        }}>⑂</span>
      </div>
      <span style={{ 
        fontSize: '0.9rem', 
        fontWeight: 'bold',
      }}>
        {data.label || 'Branch Node'}
      </span>
    </div>
    
    <div style={{ 
      fontSize: '0.8rem',
      color: '#666',
    }}>
      {data.description || 'Decision point with multiple paths'}
    </div>
    
    {data.branches && (
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        marginTop: '10px'
      }}>
        {data.branches.map((branch: string, index: number) => (
          <div
            key={index}
            style={{
              fontSize: '0.75rem',
              position: 'absolute',
              right: '8px',
              top: `${25 + (index * 40)}%`,
              color: '#666',
            }}
          >
            {branch}
          </div>
        ))}
      </div>
    )}
  </div>
);

// Update the ActionNode component to match the style in the image
const ActionNode = ({ data }: NodeProps) => (
  <div style={{ 
    padding: '15px',
    background: 'white',
    color: '#333',
    borderRadius: '2px',
    width: '200px',
    height: '90px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    border: '1px solid #e0e0e0',
    cursor: 'move',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }}>
    <Handle 
      type="target" 
      position={Position.Left} 
      style={{ 
        width: '10px', 
        height: '10px', 
        background: '#888',
        border: '2px solid white',
        left: '-6px',
      }} 
    />
    <Handle 
      type="source" 
      position={Position.Right} 
      style={{ 
        width: '10px', 
        height: '10px', 
        background: '#888',
        border: '2px solid white',
        right: '-6px',
      }} 
    />
    
    <div style={{ 
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
      gap: '6px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        backgroundColor: '#f0f0f0',
        borderRadius: '4px'
      }}>
        <span style={{ 
          color: '#1976D2', 
          fontSize: '1rem'
        }}>⬡</span>
      </div>
      <span style={{ 
        fontSize: '0.9rem', 
        fontWeight: 'bold',
      }}>
        {data.label || 'Action'}
      </span>
    </div>
    
    <div style={{ 
      fontSize: '0.8rem',
      color: '#666',
    }}>
      {data.description || 'Execute an action'}
    </div>
    
    {/* Add button for additional options */}
    <div style={{ 
      position: 'absolute',
      top: '10px',
      right: '10px',
      width: '20px',
      height: '20px',
      borderRadius: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      border: '1px solid #e0e0e0',
      fontSize: '12px',
      lineHeight: 1,
      color: '#888'
    }}>
      +
    </div>
  </div>
);

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
      id={`flow-tabpanel-${index}`}
      aria-labelledby={`flow-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, height: 'calc(100vh - 200px)' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Add new interfaces for workflow state
interface WorkflowStep {
  id: string;
  condition: string;
  result: boolean | null;
  data?: any;
}

interface WorkflowState {
  currentStep: number;
  steps: WorkflowStep[];
  patientData: any;
  outputData: any;
}

// Update the PatientData interface
interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  dob: string;
  mrn: string;
  conditions: string[];
  medications: string[];
}

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction: 'TB' | 'LR' = 'LR') => {
  if (!nodes.length) return { nodes, edges };

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Use LR (Left to Right) as default direction to match the reference
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  // Set dimensions and add nodes to the graph
  const nodeWidth = 220;
  const nodeHeight = 80;

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges to the graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate the layout
  dagre.layout(dagreGraph);

  // Update node positions based on the layout
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    // Set target and source positions based on the layout direction
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    // Adjust node position with increased spacing
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  // Style edges to match the reference image
  const layoutedEdges = edges.map(edge => ({
    ...edge,
    type: 'default', // Use our custom edge
    animated: false,
    style: {
      strokeWidth: 2,
      stroke: '#aaa',
    },
    markerEnd: {
      type: 'arrowclosed',
      width: 20,
      height: 20,
      color: '#aaa',
    },
  }));

  return { nodes: layoutedNodes, edges: layoutedEdges };
};

// Add this CSS animation for the edges
const edgeAnimation = `
@keyframes flow {
  0% {
        data: {
          // Add label if it's a true/false connection
          label: params.sourceHandle === 'right-true' ? 'true' : 
                 params.sourceHandle === 'right-false' ? 'false' : 
                 undefined
        }
      };

      // Add the connection
      setEdges((eds) => addEdge(customEdge, eds));

      // Get source and target nodes
      const sourceNode = nodes.find(node => node.id === params.source);
      const targetNode = nodes.find(node => node.id === params.target);

      if (sourceNode && targetNode) {
        console.log(`Connected: ${sourceNode.data.label || sourceNode.id} -> ${targetNode.data.label || targetNode.id}`);
        
        // Show success notification
        enqueueSnackbar(`Connected nodes successfully`, { 
          variant: 'success',
          autoHideDuration: 2000
        });
      }

      // Save the current state to undo stack
      setUndoStack(prev => [...prev, { nodes, edges }]);
      setRedoStack([]);
    },
    [nodes, edges, enqueueSnackbar, setUndoStack, setRedoStack]
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={3}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/flows')}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Alert severity="error">
          Error loading flow.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      bgcolor: '#f8f9fa',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <IconButton onClick={() => navigate('/flows')} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flex: 1 }}>Flow Editor</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrowIcon />}
            onClick={handleRunFlow}
            disabled={isRunning}
          >
            {isRunning ? 'Running...' : 'Run Flow'}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveFlow}
          >
            Save Flow
          </Button>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Sidebar */}
        <ResizableBox
          width={leftPaneWidth}
          height={Infinity}
          minConstraints={[150, Infinity]}
          maxConstraints={[400, Infinity]}
          onResize={(e: React.SyntheticEvent, { size }: ResizeEvent) => setLeftPaneWidth(size.width)}
          handle={<div className="react-resizable-handle react-resizable-handle-w" />}
          axis="x"
        >
          <Paper 
            elevation={0} 
            sx={{ 
              width: '100%',
              height: '100%',
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              overflow: 'auto'
            }}
          >
            {renderNodePalette()}
          </Paper>
        </ResizableBox>

        {/* Flow Editor */}
        <Box sx={{ flex: 1, position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onNodeContextMenu={handleNodeContextMenu}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              style: { 
                stroke: '#b1b1b7',
                strokeWidth: 2,
                strokeDasharray: '5,5',
              },
            }}
            connectionRadius={30}
            attributionPosition="bottom-left"
            proOptions={{ hideAttribution: true }}
            style={{
              background: '#f8f9fa',
              borderRadius: '8px',
            }}
          >
            <style>{edgeAnimation}</style>
            <Background color="#aaa" gap={16} />
            <Controls />
            <Panel position="top-right">
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={onLayout}
                  startIcon={<AutoGraphIcon />}
                >
                  Auto Layout
                </Button>
              </Box>
            </Panel>
            <Menu
              open={contextMenu.mouseY !== null}
              onClose={handleContextMenuClose}
              anchorReference="anchorPosition"
              anchorPosition={
                contextMenu.mouseY !== null && contextMenu.mouseX !== null
                  ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                  : undefined
              }
            >
              <MenuItem onClick={() => {
                if (contextMenu.nodeId) {
                  const node = nodes.find((n) => n.id === contextMenu.nodeId);
                  if (node) {
                    setSelectedNodeForEdit(node);
                    setShowNodeEditPanel(true);
                  }
                }
                handleContextMenuClose();
              }}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit Node</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleDeleteNode}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Delete Node</ListItemText>
              </MenuItem>
            </Menu>
          </ReactFlow>
          {showNodeEditPanel && renderNodeEditPanel()}
        </Box>

        {/* Right Sidebar */}
        <ResizableBox
          width={rightPaneWidth}
          height={Infinity}
          minConstraints={[250, Infinity]}
          maxConstraints={[500, Infinity]}
          onResize={(e: React.SyntheticEvent, { size }: ResizeEvent) => setRightPaneWidth(size.width)}
          handle={<div className="react-resizable-handle react-resizable-handle-e" />}
          axis="x"
        >
          <Paper 
            elevation={0} 
            sx={{ 
              width: '100%',
              height: '100%',
              borderLeft: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              overflow: 'auto'
            }}
          >
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Properties" />
              <Tab label="Data" />
              <Tab label="JSON Editor" />
            </Tabs>

            <TabPanel value={activeTab} index={0}>
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Basic Information Section */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom sx={{ 
                    color: 'primary.main',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <InfoIcon fontSize="small" />
                    Basic Information
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <TextField
                      fullWidth
                      label="Flow Name"
                      value={flowName}
                      onChange={(e) => setFlowName(e.target.value)}
                      variant="outlined"
                      sx={{ mb: 2 }}
                      placeholder="Enter a descriptive name for your flow"
                    />
                    <TextField
                      fullWidth
                      label="Description"
                      value={flowDescription}
                      onChange={(e) => setFlowDescription(e.target.value)}
                      variant="outlined"
                      multiline
                      rows={3}
                      placeholder="Describe the purpose and functionality of this flow"
                      helperText="This description will help others understand the purpose of this flow"
                    />
                  </Paper>
                </Box>

                {/* Tags Section */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom sx={{ 
                    color: 'primary.main',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <LocalOfferIcon fontSize="small" />
                    Tags
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Add New Tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        variant="outlined"
                        size="small"
                        placeholder="Enter a tag and press Enter"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleAddTag}
                        disabled={!newTag.trim()}
                        sx={{ minWidth: '100px' }}
                      >
                        Add Tag
                      </Button>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {flowTags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          onDelete={() => handleRemoveTag(tag)}
                          color="primary"
                          variant="outlined"
                          sx={{ 
                            '& .MuiChip-deleteIcon': {
                              color: 'primary.main',
                              '&:hover': {
                                color: 'error.main',
                              },
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Paper>
                </Box>

                {/* Flow Settings Section */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom sx={{ 
                    color: 'primary.main',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <SettingsIcon fontSize="small" />
                    Flow Settings
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Layout Direction</InputLabel>
                      <Select
                        value="TB"
                        label="Layout Direction"
                        onChange={(e) => onLayout()}
                      >
                        <MenuItem value="TB">Top to Bottom</MenuItem>
                        <MenuItem value="LR">Left to Right</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Node Spacing</InputLabel>
                      <Select
                        value="medium"
                        label="Node Spacing"
                        onChange={(e) => onLayout()}
                      >
                        <MenuItem value="small">Compact</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="large">Spacious</MenuItem>
                      </Select>
                    </FormControl>
                  </Paper>
                </Box>

                {/* Version Information Section */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom sx={{ 
                    color: 'primary.main',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <HistoryIcon fontSize="small" />
                    Version Information
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Created
                        </Typography>
                        <Typography variant="body2">
                          {new Date().toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Last Modified
                        </Typography>
                        <Typography variant="body2">
                          {new Date().toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Version
                        </Typography>
                        <Typography variant="body2">
                          1.0.0
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              </Box>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              {renderDataTab()}
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              <SimpleJsonEditor
                initialValue={jsonEditorValue}
                onApplyChanges={applyJsonChanges}
                error={jsonError}
              />
            </TabPanel>
          </Paper>
        </ResizableBox>
      </Box>
    </Box>
  );
};

// Define layout function to arrange nodes
const onLayout = useCallback(() => {
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    nodes,
    edges,
    'LR' // Use LR (Left to Right) for horizontal flow like in the reference image
  );
  
  setNodes([...layoutedNodes]);
  setEdges([...layoutedEdges]);
}, [nodes, edges, setNodes, setEdges]);

export default FlowDetail;