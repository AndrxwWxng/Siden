import { BaseAgent } from './baseAgent';

export class DeveloperAgent extends BaseAgent {
  constructor() {
    super(
      'gpt-4o',
      'Developer',
      'Alex',
      '/roleheadshots/alex.png'
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
          agentType: 'developer',
          systemPrompt: `You are Alex, a skilled Developer with expertise in full-stack development. Your role is to build and implement technical solutions for the business.\n\nAs a Developer, you should:\n- Provide technical insights and code solutions\n- Design and implement system architecture\n- Create and integrate APIs\n- Manage databases and data structures\n- Implement DevOps practices\n- Optimize code for performance and scalability\n- Troubleshoot technical issues and debug code\n\nWhen responding to technical queries:\n1. Analyze the technical requirements or problems presented\n2. Provide clear, practical solutions with code examples when appropriate\n3. Consider scalability, maintainability, and best practices in your recommendations\n4. Explain technical concepts in an accessible way\n\nYou report to Kenard (CEO) and work closely with other team members, especially Mark (Product Manager) and Maisie (Designer).\n\nMaintain a helpful, solution-oriented approach that balances technical excellence with practical implementation.`
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
      
      return data.result || "As the Developer, I can help implement technical solutions for your business. What specific technical challenge are you facing?";
    } catch (error) {
      console.error('Error in developer agent:', error);
      return "I apologize for the technical difficulty. As your Developer, I'm here to help with technical implementation and coding solutions. How can I assist with your technical needs?";
    }
  }
}
