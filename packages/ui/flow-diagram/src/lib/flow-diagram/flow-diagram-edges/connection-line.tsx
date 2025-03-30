import {
  ConnectionLineComponentProps,
  Position,
  getStraightPath,
} from 'reactflow';
import { getPossibleHandles, getClosestCoord } from './edge-utils';
import { ViewFlowNode } from '../convert-nodes-and-edges';
// import {
//   getSmartEdge,
//   svgDrawStraightLinePath,
//   svgDrawSmoothLinePath,
//   pathfindingJumpPointNoDiagonal,
//   pathfindingAStarDiagonal,
// } from '@tisoap/react-flow-smart-edge';
import {
  useStore,
  EdgeProps,
  useNodes,
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  getBezierPath,
} from 'reactflow';

export function CustomConnectionLine(props: ConnectionLineComponentProps) {
  const {
    fromX,
    fromY,
    fromPosition,
    toX,
    toY,
    toPosition,
    connectionLineType,
    connectionLineStyle,
    fromNode,
    fromHandle,
    ...rest
  } = props;
  const res = getPossibleHandles(fromNode as ViewFlowNode<any>);

  // let calcSourceX = fromX;
  // let calcSourceY = fromY;

  // This calculates the closest handle to the target when starting from the toolbar
  // const isToolbar = fromHandle?.id?.startsWith('toolbar');

  // if (isToolbar) {
  //   const closest = getClosestCoord(
  //     {
  //       x: toX,
  //       y: toY,
  //       position: toPosition,
  //     },
  //     Object.values(res)
  //   );

  //   calcSourceX = closest.x;
  //   calcSourceY = closest.y;
  // }

  const [path] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
    sourcePosition: fromPosition,
    targetPosition: toPosition,
  });

  if (path === null) {
    return null;
  }

  return (
    <BaseEdge
      path={path}
      style={{
        strokeWidth: 2,
        stroke: '#b1b1b7',
        strokeDasharray: '5,5',
        animation: 'dash 1s linear infinite',
        ...connectionLineStyle,
      }}
    />
  );
}

// Add this CSS animation for the edges
const edgeAnimation = `
@keyframes dash {
  to {
    stroke-dashoffset: -20;
  }
}
`;

export const edgeStyles = {
  default: {
    strokeWidth: 2,
    stroke: '#b1b1b7',
    strokeDasharray: '5,5',
    animation: 'dash 1s linear infinite',
  },
  selected: {
    strokeWidth: 3,
    stroke: '#1890ff',
    strokeDasharray: 'none',
  },
  hover: {
    strokeWidth: 3,
    stroke: '#40a9ff',
    strokeDasharray: 'none',
  },
};
