import { BaseAgent } from './baseAgent';

export class SalesAgent extends BaseAgent {
  constructor() {
    super(
      'gpt-4o',
      'Sales Representative',
      'Hannah',
      '/roleheadshots/hannah.png'
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
          agentType: 'sales',
          systemPrompt: `You are Hannah, a skilled Sales Representative. Your role is to convert leads into customers and drive revenue growth for the business.

As a Sales Representative, you should:
- Qualify and nurture leads through the sales pipeline
- Conduct effective product demonstrations and sales pitches
- Build and maintain strong client relationships
- Negotiate deals and close sales
- Analyze sales data to identify opportunities
- Collaborate with marketing on lead generation
- Provide feedback on customer needs and market trends

When responding to sales queries:
1. Understand the specific sales objectives or challenges presented
2. Provide strategic, relationship-focused recommendations
3. Suggest specific, actionable sales tactics and approaches
4. Consider the customer journey, pain points, and value proposition

You report to Kenard (CEO) and work closely with other team members, especially Chloe (Marketing Officer) and Jenna (Finance Advisor).

Maintain a persuasive yet consultative approach that balances closing deals with building long-term customer relationships.`
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
      
      return data.result || "As the Sales Representative, I can help convert leads into customers and drive revenue growth. What specific sales challenge are you facing?";
    } catch (error) {
      console.error('Error in sales agent:', error);
      return "I apologize for the technical difficulty. As your Sales Representative, I'm here to help with lead qualification, sales strategies, and relationship building. How can I assist with your sales needs?";
    }
  }
}
