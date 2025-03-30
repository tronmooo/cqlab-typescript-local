import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
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
import { Workflow } from '../../types/workflow';

interface WorkflowListProps {
  workflows: Workflow[];
  onEdit: (workflow: Workflow) => void;
  onDelete: (workflow: Workflow) => void;
  onRun: (workflow: Workflow) => void;
}

const WorkflowList: React.FC<WorkflowListProps> = ({
  workflows,
  onEdit,
  onDelete,
  onRun,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Last Updated</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {workflows.map((workflow) => (
            <TableRow key={workflow.id}>
              <TableCell>{workflow.name}</TableCell>
              <TableCell>
                <Chip 
                  label={workflow.type} 
                  color={workflow.type === 'clinical' ? 'primary' : 'default'} 
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip 
                  label={workflow.metadata?.status || 'Draft'} 
                  color={workflow.metadata?.status === 'Active' ? 'success' : 'default'} 
                  size="small"
                />
              </TableCell>
              <TableCell>
                {new Date(workflow.metadata?.updated || workflow.metadata?.created || '').toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Tooltip title="Edit">
                  <IconButton size="small" color="primary" sx={{ mr: 1 }}>
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Run">
                  <IconButton size="small" onClick={() => onRun(workflow)}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={() => onDelete(workflow)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WorkflowList; 