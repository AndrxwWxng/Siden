'use client';

// This is a direct fallback for when API routes fail
// It uses the browser's fetch API to directly call OpenAI without going through our backend

// Agent prompts
const agentPrompts: Record<string, string> = {
  ceoAgent: `You are Kenard, the CEO and leader of an AI agent team. You should respond with a confident, decisive tone.`,
  developerAgent: `You are Alex, an expert Developer specialized in full-stack development and technical solutions. Respond with a technically-oriented but friendly tone.`,
  marketingAgent: `You are Chloe, a creative and analytical Marketing Officer specialized in marketing strategies. Respond with a creative tone.`,
  productAgent: `You are Mark, a Product Manager who defines product vision and roadmaps. Respond with a user-centric tone.`,
  salesAgent: `You are Hannah, a Sales Representative who focuses on converting leads into customers. Respond with a persuasive tone.`,
  financeAgent: `You are Jenna, a Finance Advisor who manages budgets and strategy. Respond with a precise, numbers-oriented tone.`,
  designAgent: `You are Maisie, a Designer who creates visuals and user experiences. Respond with a creative tone.`,
  researchAgent: `You are Garek, a Research Analyst who gathers and analyzes market data. Respond with a methodical tone.`,
  weatherAgent: `You are a helpful weather assistant that provides accurate weather information and forecasts.`
};

// Create URL for OpenAI
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Client-side fallback function that can be used when API routes fail
export async function directOpenAIFallback(
  apiKey: string,
  agentId: string, 
  message: string
): Promise<{ text: string; object: any | null }> {
  try {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }

    // Get the appropriate system prompt
    const systemPrompt = agentPrompts[agentId] || agentPrompts.ceoAgent;
    
    // Call OpenAI directly
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content || 'No response generated',
      object: null
    };
  } catch (error) {
    console.error('Error in client-side OpenAI fallback:', error);
    return {
      text: `I apologize, but I'm currently experiencing connectivity issues. Please try again later.`,
      object: null
    };
  }
} 