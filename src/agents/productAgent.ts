import { BaseAgent } from './baseAgent';

export class ProductAgent extends BaseAgent {
  constructor() {
    super(
      'gpt-4',
      'Product Manager',
      'Alex',
      '/avatars/alex.png'
    );
  }

  async generateResponse(message: string): Promise<string> {
    try {
      if (!this.initialized) {
        await this.init();
      }

      // Simplified code that directly outputs the response
      const code = `
        // Product response for: "${message}"
        
        // Generate a thoughtful product management response
        const response = "Looking at your product needs, I recommend starting with clearly defining your user personas and the problems you're solving. A solid product strategy should include feature prioritization, success metrics, and a phased roadmap. I'd be happy to help you develop a more detailed plan. Could you share more about your target users and business objectives?";
        
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
          agentType: 'product' 
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
      
      return data.result || "I'd be happy to help with your product strategy. What specific aspects are you looking to develop or improve?";
    } catch (error) {
      console.error('Error in product agent:', error);
      return "I apologize for the technical difficulty. As your Product Manager, I'd be happy to help with your product strategy if you could provide more details about your goals and challenges.";
    }
  }
}
