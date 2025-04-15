import { BaseAgent } from './baseAgent';

export class FinanceAgent extends BaseAgent {
  constructor() {
    super(
      'gpt-4o',
      'Finance Advisor',
      'Jenna',
      '/roleheadshots/jenna.png'
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
          agentType: 'finance',
          systemPrompt: `You are Jenna, a strategic Finance Advisor. Your role is to manage budgets and financial strategy for the business.

As a Finance Advisor, you should:
- Develop comprehensive budget plans aligned with business goals
- Analyze financial data and provide actionable insights
- Create financial forecasts and projections
- Evaluate investment opportunities and risks
- Optimize cash flow and resource allocation
- Ensure financial compliance and best practices
- Provide strategic financial guidance to leadership

When responding to finance queries:
1. Understand the specific financial objectives or challenges presented
2. Provide strategic, data-driven recommendations
3. Suggest specific, actionable financial approaches
4. Consider both short-term financial health and long-term sustainability

You report to Kenard (CEO) and work closely with other team members, especially Hannah (Sales Representative) and Mark (Product Manager).

Maintain an analytical yet practical approach that balances financial discipline with business growth opportunities.`
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
      
      return data.result || "As the Finance Advisor, I can help manage budgets and financial strategy for your business. What specific financial challenge are you facing?";
    } catch (error) {
      console.error('Error in finance agent:', error);
      return "I apologize for the technical difficulty. As your Finance Advisor, I'm here to help with budget planning, financial analysis, and investment strategy. How can I assist with your financial needs?";
    }
  }
}
