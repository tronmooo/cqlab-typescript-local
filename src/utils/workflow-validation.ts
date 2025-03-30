import { Workflow, WorkflowValidationResult } from '../types/workflow';

export function validateWorkflow(workflow: Workflow): WorkflowValidationResult {
  const result: WorkflowValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Basic structure validation
  if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
    result.errors.push('Workflow must have a nodes array');
    result.isValid = false;
  }

  if (!workflow.edges || !Array.isArray(workflow.edges)) {
    result.errors.push('Workflow must have an edges array');
    result.isValid = false;
  }

  // Node validation
  const nodeIds = new Set<string>();
  const startNodes = workflow.nodes.filter(node => node.type === 'start');
  const endNodes = workflow.nodes.filter(node => node.type === 'end');

  if (startNodes.length !== 1) {
    result.errors.push('Workflow must have exactly one start node');
    result.isValid = false;
  }

  if (endNodes.length !== 1) {
    result.errors.push('Workflow must have exactly one end node');
    result.isValid = false;
  }

  // Clinical-specific validation
  if (workflow.type === 'clinical') {
    // Check for required clinical nodes
    const hasPatientCheck = workflow.nodes.some(node => 
      node.type === 'condition' && 
      node.data.condition?.includes('patient.')
    );

    if (!hasPatientCheck) {
      result.warnings.push('Clinical workflow should include patient-specific conditions');
    }

    // Check for appropriate action nodes
    const hasClinicalAction = workflow.nodes.some(node => 
      node.type === 'action' && 
      (node.data.action?.includes('recommend') || 
       node.data.action?.includes('schedule') ||
       node.data.action?.includes('adjust'))
    );

    if (!hasClinicalAction) {
      result.warnings.push('Clinical workflow should include clinical actions (recommendations, scheduling, or adjustments)');
    }

    // Check for follow-up actions
    const hasFollowup = workflow.nodes.some(node => 
      node.type === 'action' && 
      node.data.action?.includes('schedule')
    );

    if (!hasFollowup) {
      result.warnings.push('Clinical workflow should include follow-up scheduling');
    }

    // Enhanced clinical validation
    const clinicalValidations = validateClinicalWorkflow(workflow);
    result.errors.push(...clinicalValidations.errors);
    result.warnings.push(...clinicalValidations.warnings);
    result.isValid = result.isValid && clinicalValidations.isValid;
  }

  workflow.nodes.forEach(node => {
    // Check for duplicate node IDs
    if (nodeIds.has(node.id)) {
      result.errors.push(`Duplicate node ID found: ${node.id}`);
      result.isValid = false;
    }
    nodeIds.add(node.id);

    // Validate node data
    if (!node.data || !node.data.label) {
      result.errors.push(`Node ${node.id} must have a label`);
      result.isValid = false;
    }

    // Validate condition nodes
    if (node.type === 'condition') {
      if (!node.data.condition) {
        result.errors.push(`Condition node ${node.id} must have a condition`);
        result.isValid = false;
      } else {
        // Validate condition syntax
        try {
          // Basic syntax check for conditions
          if (!node.data.condition.match(/^[a-zA-Z0-9_.\s>=<+!()&&||]+$/)) {
            result.errors.push(`Invalid condition syntax in node ${node.id}`);
            result.isValid = false;
          }
        } catch (error) {
          result.errors.push(`Invalid condition in node ${node.id}`);
          result.isValid = false;
        }
      }
    }

    // Validate action nodes
    if (node.type === 'action') {
      if (!node.data.action) {
        result.errors.push(`Action node ${node.id} must have an action`);
        result.isValid = false;
      } else {
        // Validate action naming convention
        if (!node.data.action.match(/^[a-z][a-zA-Z0-9]*$/)) {
          result.warnings.push(`Action name in node ${node.id} should follow camelCase convention`);
        }
      }
    }
  });

  // Edge validation
  const edgeIds = new Set<string>();
  workflow.edges.forEach(edge => {
    // Check for duplicate edge IDs
    if (edgeIds.has(edge.id)) {
      result.errors.push(`Duplicate edge ID found: ${edge.id}`);
      result.isValid = false;
    }
    edgeIds.add(edge.id);

    // Validate source and target nodes exist
    if (!nodeIds.has(edge.source)) {
      result.errors.push(`Edge ${edge.id} references non-existent source node: ${edge.source}`);
      result.isValid = false;
    }

    if (!nodeIds.has(edge.target)) {
      result.errors.push(`Edge ${edge.id} references non-existent target node: ${edge.target}`);
      result.isValid = false;
    }
  });

  // Check for disconnected nodes
  const connectedNodes = new Set<string>();
  workflow.edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });

  workflow.nodes.forEach(node => {
    if (!connectedNodes.has(node.id)) {
      result.warnings.push(`Node ${node.id} is not connected to any other node`);
    }
  });

  // Check for cycles
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function hasCycle(nodeId: string): boolean {
    if (recursionStack.has(nodeId)) {
      return true;
    }

    if (visited.has(nodeId)) {
      return false;
    }

    visited.add(nodeId);
    recursionStack.add(nodeId);

    const outgoingEdges = workflow.edges.filter(edge => edge.source === nodeId);
    for (const edge of outgoingEdges) {
      if (hasCycle(edge.target)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  if (hasCycle(startNodes[0].id)) {
    result.errors.push('Workflow contains cycles');
    result.isValid = false;
  }

  // Check for proper flow structure
  const conditionNodes = workflow.nodes.filter(node => node.type === 'condition');
  const actionNodes = workflow.nodes.filter(node => node.type === 'action');

  if (conditionNodes.length > 0 && actionNodes.length === 0) {
    result.warnings.push('Workflow has conditions but no corresponding actions');
  }

  return result;
}

function validateClinicalWorkflow(workflow: Workflow): WorkflowValidationResult {
  const result: WorkflowValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Check for critical clinical conditions
  const criticalConditions = [
    'vitalSigns',
    'allergies',
    'medications',
    'labResults'
  ];

  const hasCriticalConditions = criticalConditions.some(condition =>
    workflow.nodes.some(node =>
      node.type === 'condition' &&
      node.data.condition?.toLowerCase().includes(condition)
    )
  );

  if (!hasCriticalConditions) {
    result.warnings.push('Clinical workflow should include checks for critical patient data (vitals, allergies, medications, lab results)');
  }

  // Check for medication safety
  const medicationNodes = workflow.nodes.filter(node =>
    node.type === 'action' &&
    node.data.action?.toLowerCase().includes('medication')
  );

  if (medicationNodes.length > 0) {
    const hasMedicationSafety = workflow.nodes.some(node =>
      node.type === 'condition' &&
      (node.data.condition?.toLowerCase().includes('allergy') ||
       node.data.condition?.toLowerCase().includes('interaction') ||
       node.data.condition?.toLowerCase().includes('contraindication'))
    );

    if (!hasMedicationSafety) {
      result.warnings.push('Medication-related actions should include safety checks (allergies, interactions, contraindications)');
    }
  }

  // Check for clinical guidelines compliance
  const guidelineKeywords = [
    'guideline',
    'protocol',
    'standard',
    'recommendation'
  ];

  const hasGuidelineReference = workflow.nodes.some(node =>
    node.data.label?.toLowerCase().includes('guideline') ||
    node.data.description?.toLowerCase().includes('guideline')
  );

  if (!hasGuidelineReference) {
    result.warnings.push('Clinical workflow should reference clinical guidelines or protocols');
  }

  // Check for patient safety measures
  const safetyKeywords = [
    'alert',
    'warning',
    'caution',
    'emergency',
    'critical'
  ];

  const hasSafetyMeasures = workflow.nodes.some(node =>
    safetyKeywords.some(keyword =>
      node.data.label?.toLowerCase().includes(keyword) ||
      node.data.description?.toLowerCase().includes(keyword)
    )
  );

  if (!hasSafetyMeasures) {
    result.warnings.push('Clinical workflow should include patient safety measures and alerts');
  }

  // Check for appropriate clinical documentation
  const documentationKeywords = [
    'document',
    'record',
    'note',
    'chart'
  ];

  const hasDocumentation = workflow.nodes.some(node =>
    node.type === 'action' &&
    documentationKeywords.some(keyword =>
      node.data.action?.toLowerCase().includes(keyword)
    )
  );

  if (!hasDocumentation) {
    result.warnings.push('Clinical workflow should include documentation actions');
  }

  // Check for clinical decision support
  const decisionSupportKeywords = [
    'calculate',
    'assess',
    'evaluate',
    'score'
  ];

  const hasDecisionSupport = workflow.nodes.some(node =>
    node.type === 'action' &&
    decisionSupportKeywords.some(keyword =>
      node.data.action?.toLowerCase().includes(keyword)
    )
  );

  if (!hasDecisionSupport) {
    result.warnings.push('Clinical workflow should include clinical decision support features');
  }

  return result;
} 