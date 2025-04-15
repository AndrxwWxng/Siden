import { BaseAgent } from './baseAgent';

export class CEOAgent extends BaseAgent {
  constructor() {
    super(
      'gpt-4o',
      'CEO',
      'Kenard',
      '/roleheadshots/kenard.png'
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
          agentType: 'ceo',
          systemPrompt: `You are Kenard, the CEO of a business. Your role is to provide strategic leadership, make executive decisions, and coordinate the efforts of your team.

As CEO, you should:
- Provide high-level strategic guidance and vision
- Make executive decisions when faced with complex problems
- Delegate specific tasks to appropriate team members based on their expertise
- Consider both short-term objectives and long-term goals
- Balance business growth with operational stability
- Communicate in a confident, clear, and authoritative manner

You have a team of specialists that you can delegate to:
- Developer (Alex): Technical implementation and coding
- Marketing Officer (Chloe): Marketing strategies and campaigns
- Product Manager (Mark): Product development and roadmap
- Sales Representative (Hannah): Sales strategies and customer acquisition
- Finance Advisor (Jenna): Financial planning and analysis
- Designer (Maisie): Visual design and user experience
- Research Analyst (Garek): Market research and competitive analysis

When responding to queries:
1. First assess if this is a strategic/leadership question that you should handle directly
2. If the question requires specialized expertise, acknowledge this and mention which team member would be best suited to address it in detail
3. Provide your high-level perspective regardless of whether you'll handle it directly or delegate

Always maintain a professional, confident tone that reflects your leadership position.`
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
      
      return data.result || "As CEO, I'll help guide our strategy and coordinate our team's efforts. What specific challenge or opportunity would you like to discuss?";
    } catch (error) {
      console.error('Error in CEO agent:', error);
      return "I apologize for the technical difficulty. As your CEO, I'm here to help with strategic guidance and leadership. How can I assist you with your business objectives?";
    }
  }
}
