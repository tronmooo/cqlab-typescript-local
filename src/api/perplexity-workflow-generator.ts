import { NextApiRequest, NextApiResponse } from 'next';

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!PERPLEXITY_API_KEY) {
      return res.status(500).json({ error: 'Perplexity API key not configured' });
    }

    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-instruct',
        messages: [
          {
            role: 'system',
            content: `You are a clinical workflow expert. Generate a CQFlow workflow JSON structure based on the user's description.
            The workflow should follow these rules:
            1. Use standard clinical terminology
            2. Include appropriate decision points and conditions
            3. Follow FHIR resource types where applicable
            4. Include proper error handling
            5. Use clear, descriptive names for nodes and actions
            6. Include appropriate documentation
            7. Follow CQFlow best practices for clinical decision support
            8. Return ONLY valid JSON, no additional text`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate workflow');
    }

    const data = await response.json();
    
    // Extract the JSON from the AI response
    const workflowJson = JSON.parse(data.choices[0].message.content);
    
    return res.status(200).json({ workflow: workflowJson });
  } catch (error) {
    console.error('Error generating workflow:', error);
    return res.status(500).json({ 
      error: 'Failed to generate workflow',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 