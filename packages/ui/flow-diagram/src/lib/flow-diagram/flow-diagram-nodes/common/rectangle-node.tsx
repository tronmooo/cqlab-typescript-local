import { ReactNode, useContext, memo } from 'react';
import { NodeResizeControl, useStore, Handle, Position } from 'reactflow';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {
  DefinitionNodeTypeEnum,
  IFlowDefinitionNode,
  isBooleanNode,
} from '@cqlab/cqflow-core';

// import { useFlowStore } from '../../../../../../apps/cqflow-frontend/src/flow-designer/flow-store';
import { ValidationEnum } from '../../convert-nodes-and-edges';
import { NextPicker } from './next-picker';
import { TrueFalsePicker } from './true-false-picker';
import { MultiChoicePicker } from './multi-choice-picker';
import { getNodeColor, getNodeColorLight } from '../../colors';
import { FlowDiagramContext } from '../../flow-diagram-context';
import { handleStyle } from './handle-style';
import { FlowNodeData } from '../../convert-nodes-and-edges';

interface FooterHandle {
  id: string;
  label: string;
}

export function ResizeIcon() {
  return (
    <svg
      className="resize-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="rgba(100,100,100, 0.5)"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ position: 'absolute', right: '-6px', bottom: '-6px' }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="16 20 20 20 20 16" />
      <line x1="14" y1="14" x2="20" y2="20" />
      <polyline points="8 4 4 4 4 8" />
      <line x1="4" y1="4" x2="10" y2="10" />
    </svg>
  );
}

const controlStyle = {
  background: 'transparent',
  border: 'none',
};

enum PickerType {
  Unary = 'Unary',
  Binary = 'Binary',
  Multi = 'Multi',
}

interface RectangleDiagramNodeProps {
  data: FlowNodeData<any>;
  isConnectable?: boolean;
  selected?: boolean;
  style?: any;
}

function RectangleDiagramNode({
  data,
  isConnectable = true,
  selected = false,
  style,
}: RectangleDiagramNodeProps) {
  const { node, validationStatus } = data;
  const color = getNodeColor(node.nodeType);
  const isInvalid = validationStatus === 'INVALID';

  return (
    <Paper
      elevation={selected ? 4 : 1}
      sx={{
        position: 'relative',
        padding: 2,
        minWidth: 200,
        minHeight: 60,
        border: `2px solid ${selected ? color : isInvalid ? '#ff4d4f' : '#e0e0e0'}`,
        borderRadius: 2,
        backgroundColor: 'white',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 3,
          borderColor: color,
          transform: 'translateY(-1px)',
        },
        ...style,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: color,
          fontWeight: 500,
          fontSize: '0.9rem',
        }}
      >
        {node.label}
      </Box>

      {isConnectable && (
        <>
          <Handle
            type="target"
            position={Position.Top}
            style={{
              width: 8,
              height: 8,
              background: color,
              border: '2px solid white',
              boxShadow: '0 0 0 2px #e0e0e0',
            }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            style={{
              width: 8,
              height: 8,
              background: color,
              border: '2px solid white',
              boxShadow: '0 0 0 2px #e0e0e0',
            }}
          />
        </>
      )}
    </Paper>
  );
}

export default memo(RectangleDiagramNode);
