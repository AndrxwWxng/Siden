import { NextRequest, NextResponse } from 'next/server';
import { Sandbox } from '@e2b/code-interpreter';

const E2B_API_KEY = 'key here';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { code, agentType } = await req.json();
    
    console.log(`Executing code for ${agentType} agent:`, code);
    
    const sandbox = await Sandbox.create({ apiKey: E2B_API_KEY });
    
    // Execute the code and capture the logs
    const execution = await sandbox.runCode(code);
    
    console.log("Execution logs:", execution.logs);
    console.log("Execution result:", execution.text);
    
    // Extract response from logs if there's no direct text result
    let result = execution.text || '';
    
    // If no result from execution text, try to extract from logs
    if (!result || result.trim() === '') {
      // Look for console.log outputs in the logs
      const logs = execution.logs.stdout || [];
      if (logs.length > 0) {
        // Get the last few log entries which likely contain our response
        const lastLogs = logs.slice(-3); // Take up to last 3 logs
        result = lastLogs.join('\n').trim();
      }
    }
    
    // If still no result, provide a fallback based on agent type
    if (!result || result.trim() === '') {
      if (agentType === 'marketing') {
        result = "Based on your request, I'd recommend starting with a clear definition of your target audience and goals. A successful marketing plan should include content strategy, channel selection, budget allocation, and KPIs to measure success. Would you like me to elaborate on any specific aspect of marketing planning?";
      } else if (agentType === 'product') {
        result = "For your product strategy, I'd suggest focusing on user needs, market analysis, and competitive positioning. A good product plan includes feature prioritization, roadmap development, and success metrics. What specific product challenges are you facing?";
      } else {
        result = "I've analyzed your request and would be happy to provide more specific guidance. Could you share more details about what you're looking to accomplish?";
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      result: result,
      logs: execution.logs
    });
  } catch (error) {
    console.error('Error executing code:', error);
    
    // Return a helpful error message with fallback responses
    let errorMessage = 'An error occurred while processing your request.';
    let fallbackResponse = '';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    // Determine agent type from request if possible
    let agentType = 'unknown';
    try {
      const body = await req.json();
      agentType = body.agentType || 'unknown';
    } catch (e) {
      // Ignore parsing errors
    }
    
    // Provide fallback responses based on agent type
    if (agentType === 'marketing') {
      fallbackResponse = "I'd be happy to help with your marketing plan. Could you share more details about your target audience, goals, and timeline?";
    } else if (agentType === 'product') {
      fallbackResponse = "I can assist with your product strategy. What specific aspects are you looking to develop or improve?";
    } else {
      fallbackResponse = "I'm here to help. Could you provide more details about what you need assistance with?";
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        fallbackResponse: fallbackResponse
      }, 
      { status: 500 }
    );
  }
}
