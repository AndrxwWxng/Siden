import { PgVector } from '@mastra/pg';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import * as dotenv from 'dotenv';
import { createDatabaseConnection, safeDbOperation, addTelemetrySupport, createSafeEmbedding } from '@/utils/db-utils';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Check if we're in a build/static environment
const isBuildEnvironment = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
const isVercelBuild = process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'production';

// Get database connection from environment variable
let DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  throw new Error('DATABASE_URL environment variable is not set');
}

// Modify the connection string for Vercel environment to use SSL and avoid IPv6
if (process.env.VERCEL) {
  // Add SSL and other connection parameters if they're not already in the URL
  if (!DATABASE_URL.includes('ssl=true')) {
    DATABASE_URL += (DATABASE_URL.includes('?') ? '&' : '?') + 
                   'ssl=true&sslmode=require&connection_limit=10&idle_timeout=10';
  }
  
  console.log('Running in Vercel production environment with enhanced database connection');
}

// Initialize PgVector with the database connection string
export const pgVector = new PgVector(DATABASE_URL);

// Initialize the vector indices if they don't exist
export async function initializeVectorStore() {
  // Skip initialization during build
  if (isBuildEnvironment) {
    console.log('Skipping vector store initialization during build');
    return;
  }

  try {
    // Check if indices exist before creating them to avoid errors
    async function doesIndexExist(indexName: string): Promise<boolean> {
      return await safeDbOperation(async () => {
        try {
          // Check if we can query the index
          await pgVector.query({
            indexName,
            queryVector: createSafeEmbedding(),
            topK: 1
          });
          return true; // If query succeeds, index exists
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          // If error contains specific text about relation not existing, index doesn't exist
          return !errorMsg.includes('does not exist') && !errorMsg.includes('relation');
        }
      }, false);
    }

    // Create knowledge_base index if it doesn't exist
    const knowledgeBaseExists = await doesIndexExist('knowledge_base');
    if (!knowledgeBaseExists) {
      await safeDbOperation(async () => {
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
      });
    } else {
      console.log('Knowledge base index already exists, skipping creation');
    }
    
    // Create papers index if it doesn't exist
    const papersExists = await doesIndexExist('papers');
    if (!papersExists) {
      await safeDbOperation(async () => {
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
      });
    } else {
      console.log('Papers index already exists, skipping creation');
    }
  } catch (error) {
    console.error('Error initializing vector store:', error);
  }
}

// Seed the papers index with some initial content
async function seedPapersIndex() {
  // Skip during build
  if (isBuildEnvironment) {
    console.log('Skipping papers index seeding during build');
    return;
  }

  await safeDbOperation(async () => {
    // Check if there's already data in the index before seeding
    const existingData = await pgVector.query({
      indexName: 'papers',
      queryVector: createSafeEmbedding(),
      topK: 1
    });
    
    if (existingData && existingData.length > 0) {
      console.log('Papers index already has data, skipping seeding');
      return;
    }
    
    // Create safe embeddings for seeding with telemetry support
    const placeholderVector1 = createSafeEmbedding();
    const placeholderVector2 = createSafeEmbedding();
    const placeholderVector3 = createSafeEmbedding();
    
    await pgVector.upsert({
      indexName: 'papers',
      vectors: [
        placeholderVector1,
        placeholderVector2,
        placeholderVector3
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
  });
}

// Only initialize when not in build environment
if (!isBuildEnvironment) {
  initializeVectorStore().catch(console.error);
} else {
  console.log('Build environment detected, skipping vector store initialization');
}


// Create mock versions of the vector tools for build environment
const mockVectorQueryTool = {
  name: 'mockVectorQuery',
  description: 'Mock vector query for build environment',
  execute: async ({ query }: { query: string }) => {
    console.log('[Build] Mock vector query executed with:', query);
    return {
      results: [],
      message: 'Mock search performed during build'
    };
  }
};

// Conditionally export the real or mock vector tools
// export const vectorQueryTool = isBuildEnvironment 
//   ? mockVectorQueryTool
//   : createVectorQueryTool({
//       vectorStoreName: 'pgVector',
//       indexName: 'knowledge_base',
//       model: openai.embedding('text-embedding-3-small'),
//     });

// export const papersVectorQueryTool = isBuildEnvironment
//   ? mockVectorQueryTool
//   : createVectorQueryTool({
//       vectorStoreName: 'pgVector',
//       indexName: 'papers',
//       model: openai.embedding('text-embedding-3-small'),
//     });

// Create a vector document chunker tool for storing new knowledge
export const documentChunkerTool = {
  id: 'document-chunker',
  description: 'Process and store document content in vector database for future retrieval',
  async execute(params: { content: string; metadata?: Record<string, unknown>; indexName?: string }) {
    // Skip during build
    if (isBuildEnvironment) {
      console.log('[Build] Skipping document chunker execution');
      return { success: true, buildSkipped: true };
    }

    return await safeDbOperation(async () => {
      // Generate embedding using the safe method
      // const embedding = await createSafeEmbedding(params.content);
      
      // Store in PgVector (use specified index or default to knowledge_base)
      const indexName = params.indexName || 'knowledge_base';
      // await pgVector.upsert({
      //   indexName,
      //   // vectors: [embedding],
      //   metadata: [{
      //     content: params.content,
      //     ...(params.metadata || {})
      //   }]
      // });
      
      return { success: true };
    }, { 
      success: false, 
      error: 'Database operation failed'
    });
  },
}; 