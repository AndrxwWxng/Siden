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
import { PostgresStore } from "@mastra/pg";
 
const storage = new PostgresStore({
  connectionString: process.env.DATABASE_URL!,
});

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
  storage
});
