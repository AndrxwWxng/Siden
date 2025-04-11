import { BaseAgent } from './baseAgent';
import { OPENAI_MODEL } from './config';

export class DeveloperAgent extends BaseAgent {
  constructor() {
    super(
      OPENAI_MODEL,
      'Full-stack Engineer',
      'Developer',
      '👩‍💻'
    );
  }

  async generateResponse(message: string): Promise<string> {
    if (!this.sandbox) {
      await this.init();
    }

    try {
      const execution = await this.sandbox?.runCode(`
        const systemPrompt = \`You are a Full-stack Engineer with expertise in:
        - Frontend and backend development
        - System architecture
        - API design and integration
        - Database management
        - DevOps practices
        - Code optimization
        
        Provide technical insights, code suggestions, and architectural recommendations.\`;
        
        const userMessage = \`${message}\`;
        
        // Here you would implement the actual call to your chosen LLM
        console.log("As your Developer, I'll analyze this from a technical perspective...");
      `);

      return execution?.text || 'I apologize, but I cannot generate a technical response at the moment.';
    } catch (error) {
      console.error('Error in developer agent:', error);
      return 'I apologize, but I encountered an error while processing your technical request.';
    }
  }
}
