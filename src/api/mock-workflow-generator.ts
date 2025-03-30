import { NextApiRequest, NextApiResponse } from 'next';

// Define workflow types and interfaces
interface WorkflowNode {
  id: string;
  type: 'start' | 'end' | 'condition' | 'action' | 'decision';
  data: {
    label: string;
    condition?: string;
    action?: string;
    parameters?: Record<string, any>;
    options?: string[];
  };
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

interface Workflow {
  name: string;
  description: string;
  version: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  metadata: {
    author: string;
    created: string;
    lastModified: string;
    tags: string[];
  };
}

// Mock workflow templates for testing
const mockWorkflows: Record<string, Workflow> = {
  diabetes: {
    name: "Diabetes Screening Workflow",
    description: "A comprehensive workflow for diabetes screening and management",
    version: "1.0.0",
    nodes: [
      {
        id: "start",
        type: "start",
        data: { label: "Start" }
      },
      {
        id: "check_age",
        type: "condition",
        data: {
          label: "Check Patient Age",
          condition: "patient.age >= 45"
        }
      },
      {
        id: "check_hba1c",
        type: "condition",
        data: {
          label: "Check HbA1c",
          condition: "patient.hba1c >= 5.7"
        }
      },
      {
        id: "check_risk_factors",
        type: "action",
        data: {
          label: "Assess Risk Factors",
          action: "assessRiskFactors",
          parameters: {
            factors: ["family_history", "obesity", "sedentary_lifestyle"]
          }
        }
      },
      {
        id: "recommend_screening",
        type: "action",
        data: {
          label: "Recommend Screening",
          action: "recommendScreening",
          parameters: {
            type: "diabetes",
            frequency: "annual"
          }
        }
      },
      {
        id: "end",
        type: "end",
        data: { label: "End" }
      }
    ],
    edges: [
      { id: "e1", source: "start", target: "check_age" },
      { id: "e2", source: "check_age", target: "check_hba1c" },
      { id: "e3", source: "check_hba1c", target: "check_risk_factors" },
      { id: "e4", source: "check_risk_factors", target: "recommend_screening" },
      { id: "e5", source: "recommend_screening", target: "end" }
    ],
    metadata: {
      author: "System",
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      tags: ["diabetes", "screening", "preventive_care"]
    }
  },
  hypertension: {
    name: "Hypertension Management Workflow",
    description: "A workflow for managing hypertension cases with risk assessment",
    version: "1.0.0",
    nodes: [
      {
        id: "start",
        type: "start",
        data: { label: "Start" }
      },
      {
        id: "check_bp",
        type: "condition",
        data: {
          label: "Check Blood Pressure",
          condition: "patient.systolic >= 130 || patient.diastolic >= 80"
        }
      },
      {
        id: "assess_risk",
        type: "action",
        data: {
          label: "Assess Risk Factors",
          action: "assessRiskFactors",
          parameters: {
            factors: ["age", "smoking", "obesity", "diabetes", "family_history"]
          }
        }
      },
      {
        id: "determine_severity",
        type: "decision",
        data: {
          label: "Determine Severity",
          options: ["mild", "moderate", "severe"]
        }
      },
      {
        id: "recommend_treatment",
        type: "action",
        data: {
          label: "Recommend Treatment",
          action: "recommendTreatment",
          parameters: {
            type: "hypertension",
            severity: "moderate"
          }
        }
      },
      {
        id: "schedule_followup",
        type: "action",
        data: {
          label: "Schedule Follow-up",
          action: "scheduleFollowup",
          parameters: {
            interval: "2_weeks"
          }
        }
      },
      {
        id: "end",
        type: "end",
        data: { label: "End" }
      }
    ],
    edges: [
      { id: "e1", source: "start", target: "check_bp" },
      { id: "e2", source: "check_bp", target: "assess_risk" },
      { id: "e3", source: "assess_risk", target: "determine_severity" },
      { id: "e4", source: "determine_severity", target: "recommend_treatment" },
      { id: "e5", source: "recommend_treatment", target: "schedule_followup" },
      { id: "e6", source: "schedule_followup", target: "end" }
    ],
    metadata: {
      author: "System",
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      tags: ["hypertension", "cardiovascular", "chronic_disease"]
    }
  },
  asthma: {
    name: "Asthma Management Workflow",
    description: "A workflow for managing asthma cases and exacerbations",
    version: "1.0.0",
    nodes: [
      {
        id: "start",
        type: "start",
        data: { label: "Start" }
      },
      {
        id: "check_symptoms",
        type: "action",
        data: {
          label: "Assess Symptoms",
          action: "assessSymptoms",
          parameters: {
            symptoms: ["wheezing", "shortness_of_breath", "cough", "chest_tightness"]
          }
        }
      },
      {
        id: "check_peak_flow",
        type: "condition",
        data: {
          label: "Check Peak Flow",
          condition: "patient.peakFlow < 80"
        }
      },
      {
        id: "assess_severity",
        type: "decision",
        data: {
          label: "Assess Severity",
          options: ["mild", "moderate", "severe"]
        }
      },
      {
        id: "recommend_treatment",
        type: "action",
        data: {
          label: "Recommend Treatment",
          action: "recommendTreatment",
          parameters: {
            type: "asthma",
            severity: "moderate"
          }
        }
      },
      {
        id: "end",
        type: "end",
        data: { label: "End" }
      }
    ],
    edges: [
      { id: "e1", source: "start", target: "check_symptoms" },
      { id: "e2", source: "check_symptoms", target: "check_peak_flow" },
      { id: "e3", source: "check_peak_flow", target: "assess_severity" },
      { id: "e4", source: "assess_severity", target: "recommend_treatment" },
      { id: "e5", source: "recommend_treatment", target: "end" }
    ],
    metadata: {
      author: "System",
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      tags: ["asthma", "respiratory", "chronic_disease"]
    }
  }
};

// Workflow validation function
function validateWorkflow(workflow: Workflow): string[] {
  const errors: string[] = [];

  // Check required fields
  if (!workflow.name) errors.push("Workflow name is required");
  if (!workflow.description) errors.push("Workflow description is required");
  if (!workflow.version) errors.push("Workflow version is required");
  if (!workflow.nodes || workflow.nodes.length === 0) errors.push("Workflow must have at least one node");
  if (!workflow.edges || workflow.edges.length === 0) errors.push("Workflow must have at least one edge");

  // Validate nodes
  const nodeIds = new Set(workflow.nodes.map(node => node.id));
  if (nodeIds.size !== workflow.nodes.length) {
    errors.push("Duplicate node IDs found");
  }

  // Validate edges
  workflow.edges.forEach(edge => {
    if (!nodeIds.has(edge.source)) {
      errors.push(`Edge source "${edge.source}" does not exist`);
    }
    if (!nodeIds.has(edge.target)) {
      errors.push(`Edge target "${edge.target}" does not exist`);
    }
  });

  // Check for start and end nodes
  const hasStart = workflow.nodes.some(node => node.type === 'start');
  const hasEnd = workflow.nodes.some(node => node.type === 'end');
  if (!hasStart) errors.push("Workflow must have a start node");
  if (!hasEnd) errors.push("Workflow must have an end node");

  return errors;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple keyword-based workflow selection
    let workflow: Workflow;
    const promptLower = prompt.toLowerCase();

    if (promptLower.includes('diabetes')) {
      workflow = mockWorkflows.diabetes;
    } else if (promptLower.includes('hypertension') || promptLower.includes('blood pressure')) {
      workflow = mockWorkflows.hypertension;
    } else if (promptLower.includes('asthma')) {
      workflow = mockWorkflows.asthma;
    } else {
      // Generate a generic workflow based on the prompt
      workflow = {
        name: "Generated Workflow",
        description: prompt,
        version: "1.0.0",
        nodes: [
          {
            id: "start",
            type: "start",
            data: { label: "Start" }
          },
          {
            id: "action",
            type: "action",
            data: {
              label: "Process",
              action: "process",
              parameters: {}
            }
          },
          {
            id: "end",
            type: "end",
            data: { label: "End" }
          }
        ],
        edges: [
          { id: "e1", source: "start", target: "action" },
          { id: "e2", source: "action", target: "end" }
        ],
        metadata: {
          author: "System",
          created: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          tags: ["generated"]
        }
      };
    }

    // Validate the workflow
    const validationErrors = validateWorkflow(workflow);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Invalid workflow structure',
        details: validationErrors
      });
    }

    return res.status(200).json({ workflow });
  } catch (error) {
    console.error('Error generating workflow:', error);
    return res.status(500).json({ 
      error: 'Failed to generate workflow',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 