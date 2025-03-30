import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { FlowNodeData } from '../../convert-nodes-and-edges';
import { getNodeColor } from '../../colors';

interface CircleDiagramNodeProps {
  data: FlowNodeData<any>;
  isConnectable?: boolean;
  selected?: boolean;
  style?: any;
}

function CircleDiagramNode({
  data,
  isConnectable = true,
  selected = false,
  style,
}: CircleDiagramNodeProps) {
  const { node } = data;
  const color = getNodeColor(node.nodeType);

  return (
    <Paper
      elevation={selected ? 4 : 1}
      sx={{
        position: 'relative',
        width: 60,
        height: 60,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px solid ${selected ? color : '#e0e0e0'}`,
        backgroundColor: 'white',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 3,
          borderColor: color,
          transform: 'scale(1.05)',
        },
        ...style,
      }}
    >
      <Box
        sx={{
          color: color,
          fontWeight: 500,
          fontSize: '0.8rem',
          textAlign: 'center',
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

export default memo(CircleDiagramNode);
