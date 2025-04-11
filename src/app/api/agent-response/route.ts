import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Simple response generator function
function generateResponse(message: string, agentType: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (agentType === 'marketing') {
    if (lowerMessage.includes('marketing plan') || lowerMessage.includes('strategy')) {
      return "Based on your request about marketing plans, I recommend starting with clearly defining your target audience and objectives. A comprehensive marketing plan should include content strategy, channel selection, budget allocation, and KPIs to measure success. I'd be happy to help you develop specific strategies for your business goals. Could you share more details about your target market and timeline?";
    } else if (lowerMessage.includes('social media') || lowerMessage.includes('digital')) {
      return "For your digital marketing needs, I recommend a multi-channel approach that includes social media, content marketing, and SEO. Each platform requires a tailored strategy - Facebook for community building, Instagram for visual storytelling, LinkedIn for B2B connections, and Twitter for real-time engagement. Would you like me to elaborate on any specific channel?";
    } else {
      return "As your Marketing Officer, I'd be happy to help with your marketing needs. To provide the most relevant advice, could you share more details about your specific goals, target audience, and any marketing challenges you're currently facing?";
    }
  } else if (agentType === 'product') {
    if (lowerMessage.includes('product') || lowerMessage.includes('strategy')) {
      return "Looking at your product needs, I recommend starting with clearly defining your user personas and the problems you're solving. A solid product strategy should include feature prioritization, success metrics, and a phased roadmap. I'd be happy to help you develop a more detailed plan. Could you share more about your target users and business objectives?";
    } else if (lowerMessage.includes('feature') || lowerMessage.includes('roadmap')) {
      return "For effective feature prioritization, I recommend using frameworks like RICE (Reach, Impact, Confidence, Effort) or the Kano model. This helps ensure you're building features that deliver the most value to users while aligning with business goals. Would you like me to help you prioritize specific features or develop a product roadmap?";
    } else {
      return "As your Product Manager, I'm here to help with your product strategy. To provide targeted advice, could you tell me more about your product, target users, and the specific challenges you're trying to address?";
    }
  } else {
    return "I've analyzed your request and would be happy to provide more specific guidance. Could you share more details about what you're looking to accomplish?";
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message, agentType } = await req.json();
    
    console.log(`Generating ${agentType} response for: "${message}"`);
    
    // Generate a response based on the message and agent type
    const response = generateResponse(message, agentType);
    
    return NextResponse.json({ 
      success: true, 
      result: response
    });
  } catch (error) {
    console.error('Error generating response:', error);
    
    let errorMessage = 'An error occurred while processing your request.';
    let fallbackResponse = "I'm here to help. Could you provide more details about what you need assistance with?";
    
    if (error instanceof Error) {
      errorMessage = error.message;
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
