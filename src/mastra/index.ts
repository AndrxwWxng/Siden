
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { weatherWorkflow } from './workflows';
import { weatherAgent } from './agents';
import { marketingAgent } from './agents';
import { PostgresStore } from "@mastra/pg";
 
const storage = new PostgresStore({
  connectionString: process.env.DATABASE_URL!,
});

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent,marketingAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
  storage
});
