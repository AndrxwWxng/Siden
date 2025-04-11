import { BaseAgent } from './baseAgent';

export class MarketingAgent extends BaseAgent {
  constructor() {
    super(
      'gpt-4',
      'Marketing Officer',
      'Sophia',
      '/avatars/sophia.png'
    );
  }

  async generateResponse(message: string): Promise<string> {
    try {
      if (!this.initialized) {
        await this.init();
      }

      // Simplified code that directly outputs the response
      const code = `
        // Marketing response for: "${message}"
        
        // Generate a thoughtful marketing response
        const response = "Based on your request about marketing plans, I recommend starting with clearly defining your target audience and objectives. A comprehensive marketing plan should include content strategy, channel selection, budget allocation, and KPIs to measure success. I'd be happy to help you develop specific strategies for your business goals. Could you share more details about your target market and timeline?";
        
        // Output the response directly
        console.log(response);
      `;
      
      // Call our Next.js API route
      const response = await fetch('/api/code-execution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code, 
          agentType: 'marketing' 
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.warn(`Error from API: ${data.error}`);
        if (data.fallbackResponse) {
          return data.fallbackResponse;
        }
        throw new Error(data.error);
      }
      
      return data.result || "I'd be happy to help with your marketing plan. Could you share more details about your target audience, goals, and timeline?";
    } catch (error) {
      console.error('Error in marketing agent:', error);
      return "I apologize for the technical difficulty. As your Marketing Officer, I'd be happy to help with your marketing plan if you could provide more details about what you're looking to achieve.";
    }
  }
}
