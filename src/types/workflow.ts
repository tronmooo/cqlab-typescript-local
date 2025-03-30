export interface Node {
  id: string;
  type: 'start' | 'end' | 'condition' | 'action';
  data: {
    label: string;
    condition?: string;
    action?: string;
  };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  type: 'clinical' | 'data' | 'integration';
  template: {
    nodes: Node[];
    edges: Edge[];
  };
}

export interface WorkflowValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface WorkflowMetadata {
  created: string;
  updated: string;
  version: string;
  author: string;
  status: 'Draft' | 'Active' | 'Archived';
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  type: 'clinical' | 'data' | 'integration';
  nodes: Node[];
  edges: Edge[];
  metadata: WorkflowMetadata;
} 