/**
 * Validates a JSON string and checks if it has the required flow structure
 * @param jsonString The JSON string to validate
 * @returns An error message if there's a problem, null if valid
 */
export function validateFlowJson(jsonString: string): string | null {
  try {
    // First check if it's valid JSON
    const parsedFlow = JSON.parse(jsonString);
    
    // Check if the flow has the minimum required structure
    if (!parsedFlow.nodes || !Array.isArray(parsedFlow.nodes)) {
      return 'Invalid flow format: "nodes" property must be an array';
    }
    
    if (!parsedFlow.edges || !Array.isArray(parsedFlow.edges)) {
      return 'Invalid flow format: "edges" property must be an array';
    }
    
    // For non-empty nodes arrays, validate each node
    if (parsedFlow.nodes.length > 0) {
      // Check that nodes have required properties
      for (const node of parsedFlow.nodes) {
        if (!node.id) {
          return 'Invalid node: missing required "id" property';
        }
        
        if (!node.type) {
          return `Invalid node ${node.id}: missing required "type" property`;
        }
        
        if (!node.position || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
          return `Invalid node ${node.id}: missing or invalid "position" property`;
        }
      }
    }
    
    // For non-empty edges arrays, validate each edge
    if (parsedFlow.edges.length > 0) {
      // Check that edges have required properties
      for (const edge of parsedFlow.edges) {
        if (!edge.id) {
          return 'Invalid edge: missing required "id" property';
        }
        
        if (!edge.source) {
          return `Invalid edge ${edge.id}: missing required "source" property`;
        }
        
        if (!edge.target) {
          return `Invalid edge ${edge.id}: missing required "target" property`;
        }
      }
    }
    
    return null; // Valid JSON with flow structure
  } catch (error) {
    // JSON parsing error
    return 'Invalid JSON syntax';
  }
} 