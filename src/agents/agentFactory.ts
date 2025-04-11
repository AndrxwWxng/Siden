import { MarketingAgent } from './marketingAgent';
import { ProductAgent } from './productAgent';
import { DeveloperAgent } from './developerAgent';
import { SalesAgent } from './salesAgent';
import { BaseAgent } from './baseAgent';

export class AgentFactory {
  private static instances: { [key: string]: BaseAgent } = {};

  static async getAgent(type: string): Promise<BaseAgent> {
    const agentType = type.toLowerCase();
    
    if (!this.instances[agentType]) {
      let agent: BaseAgent;
      
      switch (agentType) {
        case 'marketing':
          agent = new MarketingAgent();
          break;
        case 'product':
          agent = new ProductAgent();
          break;
        case 'developer':
          agent = new DeveloperAgent();
          break;
        case 'sales':
          agent = new SalesAgent();
          break;
        default:
          throw new Error(`Unknown agent type: ${type}`);
      }

      // Initialize the agent before storing it
      await agent.init();
      this.instances[agentType] = agent;
    }

    // Re-initialize if needed
    try {
      await this.instances[agentType].init();
    } catch (error) {
      console.error(`Failed to re-initialize ${agentType} agent:`, error);
      // Create a new instance if re-initialization fails
      delete this.instances[agentType];
      return this.getAgent(type);
    }

    return this.instances[agentType];
  }
}
