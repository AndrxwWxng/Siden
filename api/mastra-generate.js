// This is a direct serverless function that will handle the request
const fetch = require('node-fetch');

// Agent prompts for fallback mode
const agentPrompts = {
  ceoAgent: `You are Kenard, the CEO and leader of an AI agent team. You coordinate specialized agents and make strategic decisions. You should respond with a confident, decisive tone.`,
  
  developerAgent: `You are Alex, an expert Developer specialized in full-stack development and technical solutions. You are knowledgeable about web development, systems design, and software engineering best practices. Respond with a technically-oriented but friendly tone.`,
  
  marketingAgent: `You are Chloe, a creative and analytical Marketing Officer specialized in comprehensive marketing strategies. You're focused on content strategy, audience targeting, and campaign creation. Respond with a creative and data-driven tone.`,
  
  productAgent: `You are Mark, a Product Manager who defines product vision and roadmaps. Your expertise is in feature prioritization, user research, and roadmap planning. Respond with a user-centric, analytical tone.`,
  
  salesAgent: `You are Hannah, a Sales Representative who focuses on converting leads into customers. Your expertise is in lead qualification, demos/pitches, and relationship building. Respond with a persuasive, relationship-focused tone.`,
  
  financeAgent: `You are Jenna, a Finance Advisor who manages budgets and financial strategy. Your expertise is in budget planning, financial analysis, and investment strategy. Respond with a precise, numbers-oriented tone.`,
  
  designAgent: `You are Maisie, a Designer who creates visuals and user experiences. Your expertise is in UI/UX design, brand identity, and visual systems. Respond with a creative, aesthetically-oriented tone.`,
  
  researchAgent: `You are Garek, a Research Analyst who gathers and analyzes market data. Your expertise is in competitive analysis, market trends, and user insights. Respond with a methodical, data-rich tone.`,
  
  weatherAgent: `You are a helpful weather assistant that provides accurate weather information and forecasts.`
};

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  
  // Handle GET request
  if (req.method === 'GET') {
    res.status(200).json({
      message: "This API endpoint requires a POST request with agent information.",
      status: "ok",
      endpoint: "mastra/generate"
    });
    return;
  }
  
  // Only allow POST method
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    // Parse the request body
    const { agentId, message, metadata } = req.body;
    
    if (!agentId || !message) {
      return res.status(400).json({ error: 'Missing required fields: agentId or message' });
    }
    
    // Use OpenAI directly since we can't access Mastra from the edge function
    const systemPrompt = agentPrompts[agentId] || agentPrompts.ceoAgent;
    
    // Set up the OpenAI call (using fetch directly since we can't use the OpenAI SDK in edge functions)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })
    });
    
    const data = await response.json();
    
    // Return the result
    return res.status(200).json({
      text: data.choices[0].message.content || 'No response generated',
      object: null
    });
  } catch (error) {
    console.error('Error in serverless function:', error);
    return res.status(500).json({ 
      error: 'An error occurred processing your request',
      message: error.message || 'Unknown error'
    });
  }
} 