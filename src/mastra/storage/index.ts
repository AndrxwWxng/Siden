import { PgVector } from '@mastra/pg';
import { openai } from '@ai-sdk/openai';
import { createVectorQueryTool } from '@mastra/rag';
import { mastra } from '@/mastra';
import { z } from 'zod';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Get database connection from environment variable
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  throw new Error('DATABASE_URL environment variable is not set');
}

// Initialize PgVector with the database connection string from environment
export const pgVector = new PgVector(DATABASE_URL);

// Initialize the vector indices if they don't exist
export async function initializeVectorStore() {
  try {
    // Check if indices exist before creating them to avoid errors
    async function doesIndexExist(indexName: string): Promise<boolean> {
      try {
        // Check if we can query the index
        await pgVector.query({
          indexName,
          queryVector: new Array(1536).fill(0),
          topK: 1
        });
        return true; // If query succeeds, index exists
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        // If error contains specific text about relation not existing, index doesn't exist
        return !errorMsg.includes('does not exist') && !errorMsg.includes('relation');
      }
    }

    // Create knowledge_base index if it doesn't exist
    const knowledgeBaseExists = await doesIndexExist('knowledge_base');
    if (!knowledgeBaseExists) {
      try {
        await pgVector.createIndex({
          indexName: 'knowledge_base',
          dimension: 1536, // Dimensions for text-embedding-3-small
        });
        console.log('Created knowledge_base index');
      } catch (error) {
        if (error instanceof Error && error.message.includes('duplicate key')) {
          console.log('Knowledge base index already exists, skipping creation');
        } else {
          console.error('Error creating knowledge_base index:', error);
        }
      }
    } else {
      console.log('Knowledge base index already exists, skipping creation');
    }
    
    // Create papers index if it doesn't exist
    const papersExists = await doesIndexExist('papers');
    if (!papersExists) {
      try {
        await pgVector.createIndex({
          indexName: 'papers',
          dimension: 1536, // Dimensions for text-embedding-3-small
        });
        console.log('Created papers index');
        
        // Seed the papers index with some initial data
        await seedPapersIndex();
      } catch (error) {
        if (error instanceof Error && error.message.includes('duplicate key')) {
          console.log('Papers index already exists, skipping creation');
        } else {
          console.error('Error creating papers index:', error);
        }
      }
    } else {
      console.log('Papers index already exists, skipping creation');
    }
  } catch (error) {
    console.error('Error initializing vector store:', error);
  }
}

// Seed the papers index with some initial content
async function seedPapersIndex() {
  try {
    // Check if there's already data in the index before seeding
    const existingData = await pgVector.query({
      indexName: 'papers',
      queryVector: new Array(1536).fill(0),
      topK: 1
    });
    
    if (existingData && existingData.length > 0) {
      console.log('Papers index already has data, skipping seeding');
      return;
    }
    
    const placeholderVector = new Array(1536).fill(0); // Placeholder embedding
    
    await pgVector.upsert({
      indexName: 'papers',
      vectors: [
        placeholderVector,
        placeholderVector,
        placeholderVector
      ],
      metadata: [
        {
          content: 'AI research has shown significant advancements in machine learning models, particularly in natural language processing and computer vision. Recent trends include multi-modal learning and more efficient training methods.',
          title: 'Trends in AI Research',
          author: 'Research Team',
          year: 2023
        },
        {
          content: 'Artificial General Intelligence remains a long-term goal in AI research. Current limitations include reasoning abilities, common sense understanding, and true autonomous learning. Hybrid approaches combining neural networks with symbolic reasoning show promise.',
          title: 'The Road to AGI',
          author: 'AI Research Institute',
          year: 2023
        },
        {
          content: 'The field of AI ethics addresses issues of bias, fairness, transparency, and accountability in AI systems. Recent publications emphasize the importance of responsible AI development and deployment practices.',
          title: 'Ethics in AI',
          author: 'Ethics Research Group',
          year: 2023
        }
      ]
    });
    
    console.log('Seeded papers index with initial data');
  } catch (error) {
    console.error('Error seeding papers index:', error);
  }
}

// Call initialization on startup
initializeVectorStore().catch(console.error);

// Restore the original vector query tools with the fixed dependencies
// Create a vector query tool for general knowledge search
export const vectorQueryTool = createVectorQueryTool({
  vectorStoreName: 'pgVector',
  indexName: 'knowledge_base', // This will be the table name in PostgreSQL
  model: openai.embedding('text-embedding-3-small'),
});

// Create a vector query tool specifically for papers (research)
export const papersVectorQueryTool = createVectorQueryTool({
  vectorStoreName: 'pgVector',
  indexName: 'papers', // This will be the table name in PostgreSQL
  model: openai.embedding('text-embedding-3-small'),
});

// Create a vector document chunker tool for storing new knowledge
export const documentChunkerTool = {
  id: 'document-chunker',
  description: 'Process and store document content in vector database for future retrieval',
  async execute(params: { content: string; metadata?: Record<string, unknown>; indexName?: string }) {
    try {
      // Generate embedding using OpenAI
      const embeddingModel = openai.embedding('text-embedding-3-small');
      const embeddingResponse = await embeddingModel.doEmbed({ 
        values: [params.content]
      });
      const embedding = embeddingResponse.embeddings[0];
      
      // Store in PgVector (use specified index or default to knowledge_base)
      const indexName = params.indexName || 'knowledge_base';
      
      await pgVector.upsert({
        indexName,
        vectors: [embedding],
        metadata: [{
          content: params.content,
          ...(params.metadata || {})
        }]
      });
      
      return { success: true };
    } catch (error) {
      console.error(`Error storing document in ${params.indexName || 'knowledge_base'} vector database:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },
}; 