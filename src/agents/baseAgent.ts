import { Sandbox } from '@e2b/code-interpreter';

const E2B_API_KEY = 'key here';

export class BaseAgent {
  protected sandbox: Sandbox | null = null;
  protected model: string;
  protected role: string;
  protected name: string;
  protected avatar: string;
  protected initialized: boolean = false;

  constructor(model: string, role: string, name: string, avatar: string) {
    this.model = model;
    this.role = role;
    this.name = name;
    this.avatar = avatar;
  }

  async init() {
    // Mark as initialized - we don't actually create a sandbox here anymore
    this.initialized = true;
  }

  async generateResponse(message: string): Promise<string> {
    if (!this.initialized) {
      await this.init();
    }

    try {
      // Call our simplified API route instead of E2B
      const response = await fetch('/api/agent-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          agentType: this.role.toLowerCase() 
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.warn(`Error from API: ${data.error}`);
        // Use the fallback response if provided
        if (data.fallbackResponse) {
          return data.fallbackResponse;
        }
        throw new Error(data.error);
      }
      
      return data.result || `As your ${this.role}, I'd be happy to help. Could you provide more details about what you need?`;
    } catch (error) {
      console.error(`Error in ${this.role} agent:`, error);
      // Provide a generic fallback response if all else fails
      return `I apologize, but I encountered an issue while processing your request. As your ${this.role}, I'd be happy to help if you could provide more details or try again.`;
    }
  }

  getProfile() {
    return {
      name: this.name,
      role: this.role,
      avatar: this.avatar
    };
  }
}
