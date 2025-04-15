import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Step, Workflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { ceoAgent, researchAgent } from '../agents';

// Define the schema for the research request
const researchRequestSchema = z.object({
  query: z.string().describe('The research query to investigate'),
  requester: z.string().default('CEO').describe('The agent requesting the research'),
});

// Step 1: Formulate the research question
const formulateResearchQuestion = new Step({
  id: 'formulate-research-question',
  description: 'Formulates a clear research question based on the request',
  inputSchema: researchRequestSchema,
  outputSchema: z.object({
    formattedQuery: z.string(),
  }),
  execute: async ({ context }) => {
    const triggerData = context?.getStepResult<{ query: string; requester: string }>('trigger');

    if (!triggerData) {
      throw new Error('Trigger data not found');
    }

    // Format the query for research
    const formattedQuery = `Research query: ${triggerData.query}\nRequested by: ${triggerData.requester}`;
    
    return { formattedQuery };
  },
});

// Step 2: Research agent processes the query
const conductResearch = new Step({
  id: 'conduct-research',
  description: 'Processes the research query using the research agent',
  outputSchema: z.object({
    findings: z.string(),
  }),
  execute: async ({ context }) => {
    const formulation = context?.getStepResult(formulateResearchQuestion);

    if (!formulation) {
      throw new Error('Research question formulation not found');
    }

    // Use the research agent to generate a response
    const response = await researchAgent.generate(formulation.formattedQuery);
    
    return {
      findings: response.text,
    };
  },
});

// Step 3: CEO agent reviews and summarizes findings
const summarizeFindings = new Step({
  id: 'summarize-findings',
  description: 'CEO reviews and summarizes the research findings',
  outputSchema: z.object({
    summary: z.string(),
    detailedFindings: z.string(),
  }),
  execute: async ({ context }) => {
    const researchResult = context?.getStepResult(conductResearch);

    if (!researchResult) {
      throw new Error('Research results not found');
    }

    const triggerData = context?.getStepResult<{ query: string }>('trigger');
    
    // CEO agent reviews the findings
    const prompt = `As the CEO, review and summarize the following research findings on "${triggerData?.query}":
      
      ${researchResult.findings}
      
      Provide a concise executive summary highlighting the key insights.`;
    
    const summary = await ceoAgent.generate(prompt);
    
    return {
      summary: summary.text,
      detailedFindings: researchResult.findings,
    };
  },
});

// Create the agent delegation workflow
const agentDelegationWorkflow = new Workflow({
  name: 'agent-delegation',
  triggerSchema: researchRequestSchema,
})
  .step(formulateResearchQuestion)
  .then(conductResearch)
  .then(summarizeFindings);

// Commit the workflow
agentDelegationWorkflow.commit();

export { agentDelegationWorkflow }; 