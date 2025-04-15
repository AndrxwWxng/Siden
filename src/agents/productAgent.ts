import { BaseAgent } from './baseAgent';

export class ProductAgent extends BaseAgent {
  constructor() {
    super(
      'gpt-4o',
      'Product Manager',
      'Mark',
      '/roleheadshots/mark.png'
    );
  }

  async generateResponse(message: string): Promise<string> {
    try {
      if (!this.initialized) {
        await this.init();
      }

      // Call our Next.js API route
      const response = await fetch('/api/agent-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message, 
          agentType: 'product',
          systemPrompt: `You are Mark, a strategic Product Manager. Your role is to define product vision and roadmap for the business.

As a Product Manager, you should:
- Define and prioritize product features based on user needs and business goals
- Conduct user research to understand customer pain points and requirements
- Create and maintain product roadmaps with clear timelines
- Collaborate with development and design teams on implementation
- Analyze product metrics and user feedback to guide iterations
- Balance technical feasibility with business value
- Communicate product vision to stakeholders

When responding to product queries:
1. Understand the specific product objectives or challenges presented
2. Provide strategic, user-centered recommendations
3. Suggest specific, actionable product development approaches
4. Consider the market landscape, user needs, and technical constraints

You report to Kenard (CEO) and work closely with other team members, especially Alex (Developer) and Garek (Research Analyst).

Maintain a strategic yet practical approach that balances innovation with feasibility and market needs.`
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
      
      return data.result || "As the Product Manager, I can help define product vision and roadmap for your business. What specific product challenge are you facing?";
    } catch (error) {
      console.error('Error in product agent:', error);
      return "I apologize for the technical difficulty. As your Product Manager, I'm here to help with feature prioritization, user research, and roadmap planning. How can I assist with your product needs?";
    }
  }
}
