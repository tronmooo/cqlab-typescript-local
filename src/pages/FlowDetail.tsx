import React, { useState, useEffect, useRef } from 'react';
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
    background: '#4CAF50',
    color: '#ffffff',
    borderRadius: '8px',
    minWidth: '150px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '2px solid #2E7D32',
    cursor: 'move'
  }}>
    <Handle type="source" position={Position.Bottom} />
    <div style={{ fontSize: '1.2rem', marginBottom: '5px' }}>▶️</div>
    <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Start</div>
    {data.description && (
      <div style={{ 
        fontSize: '0.8rem',
        marginTop: '5px',
        opacity: 0.8,
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '4px',
        borderRadius: '4px'
      }}>
        {data.description}
      </div>
    )}
  </div>
);

const EndNode = ({ data }: NodeProps) => (
  <div style={{ 
    padding: '15px',
    background: '#F44336',
    color: '#ffffff',
    borderRadius: '8px',
    minWidth: '150px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '2px solid #C62828',
    cursor: 'move'
  }}>
    <Handle type="target" position={Position.Top} />
    <div style={{ fontSize: '1.2rem', marginBottom: '5px' }}>⏹️</div>
    <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>End</div>
    {data.description && (
      <div style={{ 
        fontSize: '0.8rem',
        marginTop: '5px',
        opacity: 0.8,
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '4px',
        borderRadius: '4px'
      }}>
        {data.description}
      </div>
    )}
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
    <div 
      style={{ 
        padding: '15px',
        background: '#2196F3',
        color: '#ffffff',
        borderRadius: '8px',
        minWidth: '200px',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '2px solid #1565C0',
        cursor: 'move'
      }}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} id="true" />
      <Handle type="source" position={Position.Right} id="false" />
      
      <div style={{ 
        fontSize: '0.9rem',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ffffff',
        marginBottom: '5px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: '4px',
        borderRadius: '4px'
      }}>
        True/False
      </div>

      <div 
        style={{ 
          background: isEditingLabel ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
          borderRadius: '6px',
          padding: '8px',
          cursor: isEditingLabel ? 'text' : 'move',
          transition: 'background-color 0.2s',
          minHeight: '50px'
        }}
        onDoubleClick={(e) => handleDoubleClick(e, 'label')}
      >
        {isEditingLabel ? (
          <textarea
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={() => {
              setIsEditingLabel(false);
              updateNodeData();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                setIsEditingLabel(false);
                updateNodeData();
              }
            }}
            autoFocus
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.9rem',
              resize: 'none',
              outline: 'none',
              minHeight: '40px',
              fontFamily: 'inherit'
            }}
            placeholder="Double-click to edit condition..."
          />
        ) : (
          <div style={{ 
            fontSize: '0.9rem',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            color: '#ffffff'
          }}>
            {label || 'Double-click to edit condition...'}
          </div>
        )}
      </div>

      <div 
        style={{ 
          background: isEditingDescription ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
          borderRadius: '6px',
          padding: '8px',
          cursor: isEditingDescription ? 'text' : 'move',
          transition: 'background-color 0.2s',
          minHeight: '40px'
        }}
        onDoubleClick={(e) => handleDoubleClick(e, 'description')}
      >
        {isEditingDescription ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => {
              setIsEditingDescription(false);
              updateNodeData();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                setIsEditingDescription(false);
                updateNodeData();
              }
            }}
            autoFocus
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.8rem',
              resize: 'none',
              outline: 'none',
              minHeight: '30px',
              fontFamily: 'inherit'
            }}
            placeholder="Double-click to add description..."
          />
        ) : (
          <div style={{ 
            fontSize: '0.8rem',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            color: '#ffffff',
            opacity: 0.8
          }}>
            {description || 'Double-click to add description...'}
          </div>
        )}
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        fontSize: '0.8rem',
        marginTop: '5px',
        color: '#ffffff',
        background: 'rgba(255, 215, 0, 0.2)',
        padding: '5px 10px',
        borderRadius: '4px'
      }}>
        <span>True</span>
        <span>False</span>
      </div>
    </div>
  );
};

const BranchNode = ({ data }: NodeProps) => (
  <div style={{ 
    padding: '15px',
    background: '#FF9800',
    color: '#ffffff',
    borderRadius: '8px',
    minWidth: '200px',
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '2px solid #E65100',
    cursor: 'move'
  }}>
    <Handle type="target" position={Position.Top} />
    {data.branches?.map((branch: string, index: number) => (
      <Handle key={index} type="source" position={Position.Bottom} id={branch} />
    ))}
    
    <div style={{ 
      fontSize: '0.9rem',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#ffffff',
      marginBottom: '5px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: '4px',
      borderRadius: '4px'
    }}>
      Branch
    </div>

    <div style={{ 
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '6px',
      padding: '8px',
      minHeight: '50px',
      fontSize: '0.9rem',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
      color: '#ffffff'
    }}>
      {data.label || 'Branch node'}
    </div>

    {data.description && (
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '6px',
        padding: '8px',
        minHeight: '40px',
        fontSize: '0.8rem',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
        color: '#ffffff',
        opacity: 0.8
      }}>
        {data.description}
      </div>
    )}

    {data.branches && (
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: '4px',
        marginTop: '5px'
      }}>
        {data.branches.map((branch: string, index: number) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 215, 0, 0.2)',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              color: '#ffffff'
            }}
          >
            {branch}
          </div>
        ))}
      </div>
    )}
  </div>
);

const LogicTreeNode = ({ data }: NodeProps) => (
  <div style={{ 
    padding: '15px',
    background: '#9C27B0',
    color: '#ffffff',
    borderRadius: '8px',
    minWidth: '200px',
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '2px solid #6A1B9A',
    cursor: 'move'
  }}>
    <Handle type="target" position={Position.Top} />
    <Handle type="source" position={Position.Bottom} id="true" />
    <Handle type="source" position={Position.Right} id="false" />
    
    <div style={{ 
      fontSize: '0.9rem',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#ffffff',
      marginBottom: '5px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: '4px',
      borderRadius: '4px'
    }}>
      Logic Tree
    </div>

    <div style={{ 
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '6px',
      padding: '8px',
      minHeight: '50px',
      fontSize: '0.9rem',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
      color: '#ffffff'
    }}>
      {data.label || 'Logic tree node'}
    </div>

    {data.description && (
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '6px',
        padding: '8px',
        minHeight: '40px',
        fontSize: '0.8rem',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
        color: '#ffffff',
        opacity: 0.8
      }}>
        {data.description}
      </div>
    )}

    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      fontSize: '0.8rem',
      marginTop: '5px',
      color: '#ffffff',
      background: 'rgba(255, 215, 0, 0.2)',
      padding: '5px 10px',
      borderRadius: '4px'
    }}>
      <span>True</span>
      <span>False</span>
    </div>
  </div>
);

const EmitDataNode = ({ data }: NodeProps) => (
  <div style={{ 
    padding: '15px',
    background: '#FF5722',
    color: '#ffffff',
    borderRadius: '8px',
    minWidth: '200px',
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '2px solid #BF360C',
    cursor: 'move'
  }}>
    <Handle type="target" position={Position.Top} />
    
    <div style={{ 
      fontSize: '0.9rem',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#ffffff',
      marginBottom: '5px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: '4px',
      borderRadius: '4px'
    }}>
      Emit Data
    </div>

    <div style={{ 
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '6px',
      padding: '8px',
      minHeight: '50px',
      fontSize: '0.9rem',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
      color: '#ffffff'
    }}>
      {data.label || 'Emit data node'}
    </div>

    {data.description && (
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '6px',
        padding: '8px',
        minHeight: '40px',
        fontSize: '0.8rem',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
        color: '#ffffff',
        opacity: 0.8
      }}>
        {data.description}
      </div>
    )}
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

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction: 'TB' | 'LR' = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Increase node dimensions for more space
  const nodeWidth = 250;
  const nodeHeight = 120;
  const isHorizontal = direction === 'LR';

  // Configure graph layout with more spacing
  dagreGraph.setGraph({ 
    rankdir: direction,
    nodesep: 100, // Increase horizontal spacing between nodes
    ranksep: 150, // Increase vertical spacing between nodes
    marginx: 50,  // Add margin to the left and right
    marginy: 50,  // Add margin to the top and bottom
    acyclicer: 'greedy', // Prevent cycles in the graph
    ranker: 'network-simplex' // Use network simplex for better layout
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    // Adjust node position with more spacing
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  // Update edge styles for better visibility
  edges.forEach(edge => {
    edge.style = {
      ...edge.style,
      strokeWidth: 2,
      stroke: '#b1b1b7',
      strokeDasharray: '5,5',
      animation: 'flow 20s linear infinite',
    };
  });

  return { nodes, edges };
};

// Add this CSS animation for the edges
const edgeAnimation = `
@keyframes flow {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -1000;
  }
}
`;

// Add type for resize event
interface ResizeEvent {
  size: {
    width: number;
    height: number;
  };
}

const FlowDetail: React.FC = () => {
  // Use location to get query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isNewFlow = queryParams.get('new') === 'true' || queryParams.get('blank') === 'true';
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showNodeEditPanel, setShowNodeEditPanel] = useState(false);
  const [selectedNodeForEdit, setSelectedNodeForEdit] = useState<Node | null>(null);
  const [flowName, setFlowName] = useState('');
  const [flowDescription, setFlowDescription] = useState('');
  const [undoStack, setUndoStack] = useState<Array<{ nodes: Node[]; edges: Edge[] }>>([]);
  const [redoStack, setRedoStack] = useState<Array<{ nodes: Node[]; edges: Edge[] }>>([]);
  const [flowTags, setFlowTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newBranch, setNewBranch] = useState('');
  const [nodeCriteria, setNodeCriteria] = useState<Record<string, any>>({});
  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    currentStep: 0,
    steps: [],
    patientData: {},
    outputData: {}
  });
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [emittedData, setEmittedData] = useState<any>(null);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number | null;
    mouseY: number | null;
    nodeId: string | null;
  }>({
    mouseX: null,
    mouseY: null,
    nodeId: null,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [leftPaneWidth, setLeftPaneWidth] = useState(200);
  const [rightPaneWidth, setRightPaneWidth] = useState(300);
  const { enqueueSnackbar } = useSnackbar();

  const nodeTypes: NodeTypes = {
    [NODE_TYPES.CORE.START]: StartNode,
    [NODE_TYPES.CORE.END]: EndNode,
    [NODE_TYPES.FLOW_CONTROL.TRUE_FALSE]: TrueFalseNode,
    [NODE_TYPES.FLOW_CONTROL.BRANCH]: BranchNode,
    [NODE_TYPES.FLOW_CONTROL.LOGIC_TREE]: LogicTreeNode,
    [NODE_TYPES.FLOW_OUTPUT.EMIT_DATA]: EmitDataNode,
  } as const;

  useEffect(() => {
    // If this is a new flow, initialize with empty state
    if (isNewFlow) {
      setIsLoading(false);
      setIsError(false);
      // If it's a new flow and JSON editor is empty, initialize with an empty structure
      const emptyFlow = {
        nodes: [],
        edges: [],
        metadata: {
          name: flowName || 'New Flow',
          description: flowDescription || 'Flow created manually',
          tags: flowTags || [],
        },
      };
      setJsonEditorValue(JSON.stringify(emptyFlow, null, 2));
      return;
    }

    const loadFlow = async () => {
      try {
        // Simulate loading data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Breast Cancer Screening Flow nodes
        const sampleNodes: Node[] = [
          {
            id: '1',
            type: 'start',
            data: { label: 'Start' },
            position: { x: 250, y: 25 },
          },
          {
            id: '2',
            type: 'trueFalse',
            data: { 
              label: 'Is Female',
              description: 'Check if patient is female'
            },
            position: { x: 250, y: 125 },
          },
          {
            id: '3',
            type: 'trueFalse',
            data: { 
              label: 'Is over 45 years old',
              description: 'Check if patient age is over 45'
            },
            position: { x: 250, y: 225 },
          },
          {
            id: '4',
            type: 'trueFalse',
            data: { 
              label: 'Has had Breast Cancer Screening in the last 2 years',
              description: 'Check screening history'
            },
            position: { x: 250, y: 325 },
          },
          {
            id: '5',
            type: NODE_TYPES.FLOW_OUTPUT.EMIT_DATA,
            data: { 
              label: 'Schedule Breast Cancer Screening',
              description: 'Schedule screening appointment'
            },
            position: { x: 250, y: 425 },
          },
          {
            id: '6',
            type: NODE_TYPES.FLOW_OUTPUT.EMIT_DATA,
            data: { 
              label: 'Recommend Breast Cancer Screening',
              description: 'Recommend screening to patient'
            },
            position: { x: 450, y: 325 },
          },
          {
            id: '7',
            type: 'end',
            data: { label: 'End' },
            position: { x: 250, y: 525 },
          }
        ];

        const sampleEdges: Edge[] = [
          { id: 'e1-2', source: '1', target: '2', animated: true },
          { id: 'e2-3', source: '2', target: '3', label: 'True' },
          { id: 'e3-4', source: '3', target: '4', label: 'True' },
          { id: 'e4-5', source: '4', target: '5', label: 'True' },
          { id: 'e4-6', source: '4', target: '6', label: 'False' },
          { id: 'e5-7', source: '5', target: '7' },
          { id: 'e6-7', source: '6', target: '7' },
          // False paths to End
          { id: 'e2-7', source: '2', target: '7', label: 'False' },
          { id: 'e3-7', source: '3', target: '7', label: 'False' }
        ];

        setNodes(sampleNodes);
        setEdges(sampleEdges);
        setFlowName('Breast Cancer Screening Flow');
        setFlowDescription('Workflow to determine breast cancer screening recommendations based on patient characteristics');
        setFlowTags(['clinical', 'screening', 'breast cancer']);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading flow:', error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    loadFlow();
  }, [id, isNewFlow]);

  useEffect(() => {
    const handleNodeUpdate = (event: CustomEvent) => {
      const { id, data } = event.detail;
      setNodes((nds: any[]) =>
        nds.map((node: any) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                ...data,
              },
            };
          }
          return node;
        })
      );
    };

    window.addEventListener('nodeUpdate', handleNodeUpdate as EventListener);
    return () => {
      window.removeEventListener('nodeUpdate', handleNodeUpdate as EventListener);
    };
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSave = () => {
    setUndoStack([...undoStack, { nodes, edges }]);
    setRedoStack([]);
    console.log('Saving flow:', { 
      nodes, 
      edges, 
      name: flowName, 
      description: flowDescription,
      tags: flowTags,
      criteria: nodeCriteria,
    });
    setShowSaveDialog(false);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack([...redoStack, { nodes, edges }]);
      setNodes(previousState.nodes);
      setEdges(previousState.edges);
      setUndoStack(undoStack.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setUndoStack([...undoStack, { nodes, edges }]);
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setRedoStack(redoStack.slice(0, -1));
    }
  };

  const onConnect = (params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !flowTags.includes(newTag.trim())) {
      setFlowTags([...flowTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFlowTags(flowTags.filter(tag => tag !== tagToRemove));
  };

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    event.stopPropagation();
    setSelectedNodeForEdit(node);
    setShowNodeEditPanel(true);
  };

  const handleNodeEdit = (nodeId: string, updates: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updates,
            },
          };
        }
        return node;
      })
    );
  };

  const handleNodeContextMenu = (event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      nodeId: node.id,
    });
  };

  const handleContextMenuClose = () => {
    setContextMenu({
      mouseX: null,
      mouseY: null,
      nodeId: null,
    });
  };

  const handleDeleteNode = () => {
    if (contextMenu.nodeId) {
      setNodes((nds) => nds.filter((node) => node.id !== contextMenu.nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== contextMenu.nodeId && edge.target !== contextMenu.nodeId));
      handleContextMenuClose();
    }
  };

  const renderNodeEditPanel = () => {
    if (!selectedNodeForEdit) return null;

    return (
      <Paper
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 300,
          p: 2,
          overflowY: 'auto',
          borderLeft: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          zIndex: 1000,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Edit Node</Typography>
          <Box>
            <IconButton 
              onClick={() => {
                setNodes((nds) => nds.filter((node) => node.id !== selectedNodeForEdit.id));
                setEdges((eds) => eds.filter((edge) => edge.source !== selectedNodeForEdit.id && edge.target !== selectedNodeForEdit.id));
                setShowNodeEditPanel(false);
                setSelectedNodeForEdit(null);
              }} 
              color="error" 
              size="small"
              sx={{ mr: 1 }}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={() => setShowNodeEditPanel(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Node Label"
            value={selectedNodeForEdit.data.label || ''}
            onChange={(e) => {
              const newData = { ...selectedNodeForEdit.data, label: e.target.value };
              handleNodeEdit(selectedNodeForEdit.id, newData);
              setSelectedNodeForEdit({ ...selectedNodeForEdit, data: newData });
            }}
            variant="outlined"
            multiline
            rows={2}
          />

          <TextField
            fullWidth
            label="Description"
            value={selectedNodeForEdit.data.description || ''}
            onChange={(e) => {
              const newData = { ...selectedNodeForEdit.data, description: e.target.value };
              handleNodeEdit(selectedNodeForEdit.id, newData);
              setSelectedNodeForEdit({ ...selectedNodeForEdit, data: newData });
            }}
            variant="outlined"
            multiline
            rows={3}
          />

          {selectedNodeForEdit.type === 'trueFalse' && (
            <>
              <Divider />
              <Typography variant="subtitle1" gutterBottom>True/False Conditions</Typography>
              
              <TextField
                fullWidth
                label="True Condition"
                value={selectedNodeForEdit.data.trueCondition || ''}
                onChange={(e) => {
                  const newData = { ...selectedNodeForEdit.data, trueCondition: e.target.value };
                  handleNodeEdit(selectedNodeForEdit.id, newData);
                  setSelectedNodeForEdit({ ...selectedNodeForEdit, data: newData });
                }}
                variant="outlined"
                placeholder="e.g., Patient is female"
                multiline
                rows={2}
              />

              <TextField
                fullWidth
                label="False Condition"
                value={selectedNodeForEdit.data.falseCondition || ''}
                onChange={(e) => {
                  const newData = { ...selectedNodeForEdit.data, falseCondition: e.target.value };
                  handleNodeEdit(selectedNodeForEdit.id, newData);
                  setSelectedNodeForEdit({ ...selectedNodeForEdit, data: newData });
                }}
                variant="outlined"
                placeholder="e.g., Patient is not female"
                multiline
                rows={2}
              />

              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="True Label"
                  value={selectedNodeForEdit.data.trueLabel || 'Yes'}
                  onChange={(e) => {
                    const newData = { ...selectedNodeForEdit.data, trueLabel: e.target.value };
                    handleNodeEdit(selectedNodeForEdit.id, newData);
                    setSelectedNodeForEdit({ ...selectedNodeForEdit, data: newData });
                  }}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="False Label"
                  value={selectedNodeForEdit.data.falseLabel || 'No'}
                  onChange={(e) => {
                    const newData = { ...selectedNodeForEdit.data, falseLabel: e.target.value };
                    handleNodeEdit(selectedNodeForEdit.id, newData);
                    setSelectedNodeForEdit({ ...selectedNodeForEdit, data: newData });
                  }}
                  variant="outlined"
                />
              </Box>
            </>
          )}

          {selectedNodeForEdit.type === 'branch' && (
            <>
              <Divider />
              <Typography variant="subtitle1" gutterBottom>Branch Options</Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="New Branch"
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    if (newBranch.trim()) {
                      const branches = [...(selectedNodeForEdit.data.branches || []), newBranch.trim()];
                      const newData = { ...selectedNodeForEdit.data, branches };
                      handleNodeEdit(selectedNodeForEdit.id, newData);
                      setSelectedNodeForEdit({ ...selectedNodeForEdit, data: newData });
                      setNewBranch('');
                    }
                  }}
                >
                  Add
                </Button>
              </Box>

              <Box sx={{ mt: 1 }}>
                {(selectedNodeForEdit.data.branches || []).map((branch: string, index: number) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography sx={{ flex: 1 }}>{branch}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const branches = [...(selectedNodeForEdit.data.branches || [])];
                        branches.splice(index, 1);
                        const newData = { ...selectedNodeForEdit.data, branches };
                        handleNodeEdit(selectedNodeForEdit.id, newData);
                        setSelectedNodeForEdit({ ...selectedNodeForEdit, data: newData });
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Paper>
    );
  };

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const reactFlowBounds = document.querySelector('.react-flow')?.getBoundingClientRect();
    if (!reactFlowBounds) return;

    const type = event.dataTransfer.getData('application/reactflow');
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { 
        label: '',
        description: ''
      },
    };

    setNodes((nds) => nds.concat(newNode));
    
    // Show the edit panel immediately for all nodes
    setSelectedNodeForEdit(newNode);
    setShowNodeEditPanel(true);
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  // Update the patient selection handler with proper type handling
  const handlePatientSelect = (patient: PatientData | null): void => {
    if (patient) {
      setSelectedPatient({
        id: patient.id,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        lastVisit: patient.lastVisit,
        dob: patient.dob,
        mrn: patient.mrn,
        conditions: [...patient.conditions],
        medications: [...patient.medications]
      });
    } else {
      setSelectedPatient(null);
    }
  };

  // Update the getWorkflowSteps function to include all possible paths including end nodes
  const getWorkflowSteps = (nodes: Node[], edges: Edge[]) => {
    const startNode = nodes.find(node => node.type === 'start');
    if (!startNode) return [];

    // Create a graph representation for easier traversal
    const graph: Record<string, { node: Node, outEdges: Array<{edge: Edge, target: Node}> }> = {};
    
    // Build the graph
    nodes.forEach(node => {
      const outgoingEdges = edges.filter(edge => edge.source === node.id);
      const targets = outgoingEdges
        .map(edge => ({ 
          edge, 
          target: nodes.find(n => n.id === edge.target) 
        }))
        .filter((item): item is {edge: Edge, target: Node} => item.target !== undefined);
      
      graph[node.id] = { node, outEdges: targets };
    });

    // Get all nodes in a breadth-first traversal
    const allNodes: Array<{
      id: string;
      node: Node;
      type: string;
      label: string;
      nextSteps: Array<{ id: string; label: string; condition?: boolean }>;
    }> = [];
    
    // Helper function to process a node and its edges
    const processNode = (nodeId: string, visited = new Set<string>()) => {
      if (visited.has(nodeId)) return;
      
      visited.add(nodeId);
      const { node, outEdges } = graph[nodeId];
      
      // Process node
      const nextSteps = outEdges.map(({ edge, target }) => {
        // Determine if this edge has a condition (for true/false nodes)
        let condition: boolean | undefined = undefined;
        if (edge.data && 'condition' in edge.data) {
          condition = edge.data.condition === 'true';
        }
        
        return {
          id: target.id,
          label: target.data?.label || '',
          condition
        };
      });
      
      // Add node to our list
      allNodes.push({
        id: node.id,
        node,
        type: node.type || '',
        label: node.data?.label || '',
        nextSteps
      });
      
      // Process all outgoing edges
      outEdges.forEach(({ target }) => {
        processNode(target.id, visited);
      });
    };
    
    // Start traversal from the start node
    processNode(startNode.id);
    
    return allNodes;
  };

  // Update the handleWorkflowStep function to follow correct paths based on conditions
  const handleWorkflowStep = (nodeId: string, result: boolean) => {
    const currentStepIndex = workflowState.currentStep;
    const workflowSteps = getWorkflowSteps(nodes, edges);
    
    // Only proceed if this is the current step
    if (workflowSteps[currentStepIndex]?.id === nodeId) {
      const currentNode = workflowSteps[currentStepIndex];
      let nextStepIndex = -1;
      
      // Find the next step based on the result for true/false nodes
      if (currentNode.type === 'trueFalse') {
        // Find the edge that matches our condition (true/false)
        const nextNodeId = currentNode.nextSteps.find(step => step.condition === result)?.id;
        
        // If we found a matching edge, find that node's index
        if (nextNodeId) {
          nextStepIndex = workflowSteps.findIndex(step => step.id === nextNodeId);
        }
      } else {
        // For other nodes, just take the first next step if any
        if (currentNode.nextSteps.length > 0) {
          nextStepIndex = workflowSteps.findIndex(step => step.id === currentNode.nextSteps[0].id);
        }
      }
      
      // Update workflow state
      setWorkflowState(prev => ({
        ...prev,
        currentStep: nextStepIndex !== -1 ? nextStepIndex : prev.currentStep + 1,
        steps: [
          ...prev.steps,
          {
            id: nodeId,
            condition: currentNode.label,
            result,
            data: {
              timestamp: new Date().toISOString(),
              nodeType: currentNode.type
            }
          }
        ],
        outputData: {
          ...prev.outputData,
          [nodeId]: result
        }
      }));
    }
  };

  // Add new function to reset workflow
  const resetWorkflow = () => {
    setWorkflowState({
      currentStep: 0,
      steps: [],
      patientData: {},
      outputData: {}
    });
  };

  // Update the renderDataTab function to show all available steps
  const renderDataTab = () => {
    const workflowSteps = getWorkflowSteps(nodes, edges);
    const endNodes = nodes.filter(node => node.type === 'end');
    
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Patient Data</Typography>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            select
            label="Select Patient"
            value={selectedPatient?.id || ''}
            onChange={(e) => {
              const patient = mockPatients.find(p => p.id === e.target.value);
              handlePatientSelect(patient || null);
            }}
            variant="outlined"
          >
            {mockPatients.map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.name} ({patient.id})
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {selectedPatient && (
          <>
            <Box sx={{ 
              bgcolor: 'background.default',
              p: 2,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              mb: 2
            }}>
              <Typography variant="subtitle2" gutterBottom>Patient Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">Age</Typography>
                  <Typography variant="body2">{selectedPatient.age}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">Gender</Typography>
                  <Typography variant="body2">{selectedPatient.gender}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" display="block">Last Visit</Typography>
                  <Typography variant="body2">{selectedPatient.lastVisit}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" display="block">Conditions</Typography>
                  <Typography variant="body2">
                    {selectedPatient.conditions.length > 0 
                      ? selectedPatient.conditions.join(', ') 
                      : 'None'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" display="block">Medications</Typography>
                  <Typography variant="body2">
                    {selectedPatient.medications.length > 0 
                      ? selectedPatient.medications.join(', ') 
                      : 'None'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">Workflow Steps</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={resetWorkflow}
                    startIcon={<RefreshIcon />}
                  >
                    Reset
                  </Button>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {workflowSteps.map((step, index) => {
                  const isCurrentStep = workflowState.currentStep === index;
                  const isCompleted = workflowState.steps.some(s => s.id === step.id);
                  const stepResult = workflowState.steps.find(s => s.id === step.id)?.result;
                  const isActive = isCurrentStep || isCompleted;
                  
                  // Skip steps that aren't part of the current path
                  if (!isCurrentStep && !isCompleted && index > workflowState.currentStep) {
                    // Show only steps that would follow from our current decisions
                    const lastCompletedStep = workflowState.steps[workflowState.steps.length - 1];
                    if (lastCompletedStep) {
                      // If we're at a trueFalse node, check if this next step matches our path
                      const lastStepNode = workflowSteps.find(s => s.id === lastCompletedStep.id);
                      if (lastStepNode && lastStepNode.type === 'trueFalse') {
                        // Check if this step is not in our path based on the result
                        const isInPath = lastStepNode.nextSteps.some(
                          next => next.id === step.id && next.condition === lastCompletedStep.result
                        );
                        if (!isInPath) {
                          // If it's an end node, we still want to show it
                          if (step.type !== 'end') {
                            return null;
                          }
                        }
                      }
                    }
                  }

                  return (
                    <Box
                      key={step.id}
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: isCurrentStep ? 'primary.main' : 'divider',
                        borderRadius: 1,
                        bgcolor: isCurrentStep ? 'action.selected' : 'background.paper',
                        opacity: isActive ? 1 : 0.7,
                        position: 'relative',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {/* Step Header */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            color: isCurrentStep ? 'primary.main' : 'text.primary',
                            fontWeight: isCurrentStep ? 600 : 400
                          }}
                        >
                          Step {index + 1}: {step.label}
                        </Typography>
                        {isCompleted && (
                          <Chip 
                            label={stepResult ? "Yes" : "No"} 
                            size="small" 
                            color={stepResult ? "success" : "error"}
                            sx={{ ml: 'auto' }}
                          />
                        )}
                      </Box>

                      {/* Step Description */}
                      {step.node.data?.description && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ mb: 2 }}
                        >
                          {step.node.data.description}
                        </Typography>
                      )}

                      {/* Step Actions */}
                      {isCurrentStep && (
                        <>
                          {step.type === 'trueFalse' && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                variant="outlined"
                                onClick={() => handleWorkflowStep(step.id, true)}
                                color="success"
                                fullWidth
                              >
                                Yes
                              </Button>
                              <Button
                                variant="outlined"
                                onClick={() => handleWorkflowStep(step.id, false)}
                                color="error"
                                fullWidth
                              >
                                No
                              </Button>
                            </Box>
                          )}

                          {step.type === 'emitData' && (
                            <Button
                              variant="contained"
                              onClick={() => handleWorkflowStep(step.id, true)}
                              fullWidth
                              color="primary"
                            >
                              {step.label}
                            </Button>
                          )}

                          {step.type === 'end' && (
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handleWorkflowStep(step.id, true)}
                              fullWidth
                            >
                              Complete Workflow
                            </Button>
                          )}
                        </>
                      )}

                      {/* Step Status */}
                      {isCompleted && (
                        <Box 
                          sx={{ 
                            mt: 1, 
                            pt: 1, 
                            borderTop: '1px dashed',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Completed
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            • {new Date(workflowState.steps.find(s => s.id === step.id)?.data?.timestamp || '').toLocaleTimeString()}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  );
                })}
                
                {/* Show end nodes if not already in the steps */}
                {endNodes.length > 0 && workflowState.currentStep >= workflowSteps.length && (
                  endNodes
                    .filter(endNode => !workflowSteps.some(step => step.id === endNode.id))
                    .map((endNode, i) => (
                      <Box
                        key={`end-${i}`}
                        sx={{
                          p: 2,
                          border: '1px solid',
                          borderColor: 'primary.main',
                          borderRadius: 1,
                          bgcolor: 'action.selected',
                          position: 'relative',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                          Final Step: {endNode.data?.label || 'End'}
                        </Typography>
                        {endNode.data?.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {endNode.data.description}
                          </Typography>
                        )}
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleWorkflowStep(endNode.id, true)}
                          fullWidth
                        >
                          Complete Workflow
                        </Button>
                      </Box>
                    ))
                )}
              </Box>
            </Box>
          </>
        )}
      </Box>
    );
  };

  const renderNodePalette = () => (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ px: 1, py: 1 }}>
        Nodes
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {NODE_CATEGORIES.map((category) => (
          <Box key={category.title}>
            <Typography variant="caption" color="text.secondary" sx={{ px: 1, py: 0.5 }}>
              {category.title}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
              {category.nodes.map((node) => (
                <div
                  key={node.type}
                  draggable
                  onDragStart={(e) => onDragStart(e, node.type)}
                  style={{
                    padding: '8px',
                    cursor: 'grab',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    minHeight: '32px',
                    backgroundColor: '#ffffff',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                    e.currentTarget.style.borderColor = '#bdbdbd';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#e0e0e0';
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{node.icon}</span>
                  <span style={{ 
                    color: node.color, 
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flex: 1
                  }}>
                    {node.label}
                  </span>
                </div>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );

  // Add this new function to get the current flow state
  const getCurrentFlowState = () => {
    return {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          ...node.data,
          criteria: nodeCriteria[node.id] || {}
        }
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: edge.animated
      })),
      metadata: {
        name: flowName,
        description: flowDescription,
        tags: flowTags,
        lastModified: new Date().toISOString()
      }
    };
  };

  // Add a function to update the flow from JSON
  const [jsonEditorValue, setJsonEditorValue] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    // Skip if this is a brand new flow and we haven't made changes yet
    if (isNewFlow && nodes.length === 0 && edges.length === 0) {
      // Don't update the empty template that was already set
      return;
    }
    
    try {
      // Create JSON representation of the flow
      const flowJson = {
        nodes,
        edges,
        metadata: {
          name: flowName,
          description: flowDescription,
          tags: flowTags,
        },
      };
      
      // Update the JSON editor value
      setJsonEditorValue(JSON.stringify(flowJson, null, 2));
      
      // Clear any previous errors when flow state changes
      if (jsonError) {
        setJsonError(null);
      }
    } catch (err) {
      console.error('Error updating JSON editor:', err);
    }
  }, [nodes, edges, flowName, flowDescription, flowTags, jsonError, isNewFlow]);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setJsonEditorValue(newValue);
    
    // Validate JSON as user types
    const validationError = validateFlowJson(newValue);
    setJsonError(validationError);
  };

  const applyJsonChanges = (updatedJsonString: string) => {
    try {
      // Clear previous errors
      setJsonError(null);
      
      // Parse the updated JSON
      const updatedJson = JSON.parse(updatedJsonString);
      
      // Extract nodes and edges
      const updatedNodes = updatedJson.nodes || [];
      const updatedEdges = updatedJson.edges || [];
      
      // Extract metadata
      const updatedName = updatedJson.metadata?.name || '';
      const updatedDescription = updatedJson.metadata?.description || '';
      const updatedTags = updatedJson.metadata?.tags || [];
      
      // Update the flow state
      setNodes(updatedNodes);
      setEdges(updatedEdges);
      setFlowName(updatedName);
      setFlowDescription(updatedDescription);
      setFlowTags(updatedTags);
      
      // Save the current state to the undo stack and clear redo stack
      const newFlowState = { 
        nodes: updatedNodes, 
        edges: updatedEdges, 
        metadata: { 
          name: updatedName, 
          description: updatedDescription, 
          tags: updatedTags 
        } 
      };
      
      // Add to undo stack and clear redo stack
      setUndoStack([...undoStack, newFlowState]);
      setRedoStack([]);
      
      enqueueSnackbar('Flow updated successfully from JSON', { 
        variant: 'success',
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
      });
    } catch (err) {
      console.error('Error updating from JSON:', err);
      setJsonError(err instanceof Error ? err.message : 'Failed to parse or apply JSON');
    }
  };

  const onLayout = () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      'TB'
    );
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  };

  const handleRunFlow = async () => {
    setIsRunning(true);
    try {
      // Simulate flow execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Add your flow execution logic here
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveFlow = (): void => {
    // Add your save logic here
    console.log('Saving flow...');
  };

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
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            draggable={true}
            snapToGrid={true}
            snapGrid={[15, 15]}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              style: { 
                stroke: '#b1b1b7',
                strokeWidth: 2,
                strokeDasharray: '5,5',
              },
            }}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            minZoom={0.2}
            maxZoom={1.5}
            nodesDraggable={true}
            nodesConnectable={true}
            elementsSelectable={true}
            selectNodesOnDrag={true}
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

export default FlowDetail;