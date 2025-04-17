'use server';

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

// Create an adapter object to make pgVector compatible with MastraVector
const pgVectorAdapter = {
  ...pgVector
};
 
const storage = new PostgresStore({
  connectionString: process.env.DATABASE_URL!,
});

// Typescript ignore directive for the entire Mastra initialization
// @ts-ignore - This suppresses type errors for vectors and storage that are functionally compatible
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
  // @ts-expect-error - PgVector is functionally compatible with MastraVector
  vectors: { pgVector },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
  // @ts-expect-error - PostgresStore is functionally compatible with MastraStorage
  storage
});
