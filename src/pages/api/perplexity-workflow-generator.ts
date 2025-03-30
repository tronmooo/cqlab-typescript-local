import type { NextApiRequest, NextApiResponse } from 'next';
import { workflowTemplates, WorkflowTemplate } from '../../../data/workflow-templates';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, type } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // For now, we'll use a mock workflow based on the prompt
    const promptLower = prompt.toLowerCase();
    let workflow;

    // Try to match with existing templates
    const matchingTemplate = workflowTemplates.find((template: WorkflowTemplate) => {
      const templateName = template.name.toLowerCase();
      const templateDesc = template.description.toLowerCase();
      return promptLower.includes(templateName) || promptLower.includes(templateDesc);
    });

    if (matchingTemplate) {
      workflow = {
        ...matchingTemplate.template,
        id: `workflow-${Date.now()}`,
        name: matchingTemplate.name,
        description: matchingTemplate.description,
        type: matchingTemplate.type,
        metadata: {
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          version: '1.0.0',
          author: 'System',
          status: 'Draft' as const
        }
      };
    } else {
      // Generate a basic workflow if no template matches
      workflow = {
        id: `workflow-${Date.now()}`,
        name: 'Generated Workflow',
        description: prompt,
        type: type || 'clinical',
        nodes: [
          {
            id: 'start',
            type: 'start',
            data: { label: 'Start' }
          },
          {
            id: 'action',
            type: 'action',
            data: {
              label: 'Process',
              action: 'process',
              parameters: {}
            }
          },
          {
            id: 'end',
            type: 'end',
            data: { label: 'End' }
          }
        ],
        edges: [
          { id: 'e1', source: 'start', target: 'action' },
          { id: 'e2', source: 'action', target: 'end' }
        ],
        metadata: {
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          version: '1.0.0',
          author: 'System',
          status: 'Draft' as const
        }
      };
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