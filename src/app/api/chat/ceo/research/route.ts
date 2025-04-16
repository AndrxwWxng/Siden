import { mastra } from "@/mastra";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { query } = await req.json();
  
  try {
    // Get the agents
    const ceoAgent = mastra.getAgent("ceoAgent");
    const researchAgent = mastra.getAgent("researchAgent");
    
    // Step 1: CEO formulates the research request
    const ceoPrompt = `I need to research the following topic: "${query}". 
    Please formulate a clear, detailed research request that would help gather comprehensive information about this topic.`;
    
    const ceoResponse = await ceoAgent.generate(ceoPrompt);
    const researchRequest = ceoResponse.text;
    
    // Step 2: Research agent conducts the research
    const researchResponse = await researchAgent.generate(researchRequest);
    const researchFindings = researchResponse.text;
    
    // Step 3: CEO reviews and summarizes the findings
    const summaryPrompt = `As the CEO, I've received the following research findings about "${query}":
    
    ${researchFindings}
    
    Please review these findings and provide a concise executive summary highlighting the key insights.`;
    
    const summaryResponse = await ceoAgent.generate(summaryPrompt);
    
    return Response.json({
      summary: summaryResponse.text,
      detailedFindings: researchFindings,
      originalRequest: researchRequest
    });
  } catch (error) {
    console.error("Research request failed:", error);
    return Response.json({ 
      error: "An error occurred while processing the research request" 
    }, { status: 500 });
  }
} 