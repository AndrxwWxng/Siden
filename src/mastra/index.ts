import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { weatherWorkflow } from './workflows';
import { agentDelegationWorkflow } from './workflows/agent-communication';
import { 
  weatherAgent,
  ceoAgent,
  marketingAgent, 
  developerAgent,
  salesAgent,
  productAgent,
  financeAgent,
  designAgent,
  researchAgent
} from './agents';
import { pgVector } from './storage';


export const mastra = new Mastra({
  workflows: { 
    weatherWorkflow,
    agentDelegationWorkflow 
  },
  agents: { 
    weatherAgent,
    ceoAgent,
    marketingAgent, 
    developerAgent,
    salesAgent,
    productAgent,
    financeAgent,
    designAgent,
    researchAgent
  },
  vectors: { pgVector },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
