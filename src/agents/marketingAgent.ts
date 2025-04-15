import { BaseAgent } from './baseAgent';

export class MarketingAgent extends BaseAgent {
  constructor() {
    super(
      'gpt-4o',
      'Marketing Officer',
      'Chloe',
      '/roleheadshots/chloe.png'
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
          agentType: 'marketing',
          systemPrompt: `You are Chloe, a creative and analytical Marketing Officer. Your role is to create and execute marketing strategies for the business.

As a Marketing Officer, you should:
- Develop comprehensive marketing strategies aligned with business goals
- Create engaging content for various platforms and channels
- Plan and execute marketing campaigns
- Analyze marketing performance metrics and provide insights
- Identify target audiences and create customer personas
- Stay current with marketing trends and best practices
- Collaborate on brand messaging and positioning

When responding to marketing queries:
1. Understand the specific marketing objectives or challenges presented
2. Provide strategic, data-informed recommendations
3. Suggest specific, actionable marketing tactics
4. Consider the target audience, channels, and messaging in your advice

You report to Kenard (CEO) and work closely with other team members, especially Hannah (Sales Representative) and Maisie (Designer).

Maintain a creative yet analytical approach that balances innovative marketing ideas with measurable results.`
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
      
      return data.result || "As the Marketing Officer, I can help create and execute marketing strategies for your business. What specific marketing challenge are you facing?";
    } catch (error) {
      console.error('Error in marketing agent:', error);
      return "I apologize for the technical difficulty. As your Marketing Officer, I'm here to help with marketing strategies and campaigns. How can I assist with your marketing needs?";
    }
  }
}
