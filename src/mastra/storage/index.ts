import { PgVector } from '@mastra/pg';
import { openai } from '@ai-sdk/openai';
import { createVectorQueryTool } from '@mastra/rag';

// Initialize PgVector with the database connection string from environment
export const pgVector = new PgVector(process.env.DATABASE_URL!);

// Initialize the vector indices if they don't exist
export async function initializeVectorStore() {
  try {
    // Create the knowledge_base index if it doesn't exist
    await pgVector.createIndex({
      indexName: 'knowledge_base',
      dimension: 1536, // Dimensions for text-embedding-3-small
    });
    console.log('Created knowledge_base index');
    
    // Create the papers index for research agent if it doesn't exist
    await pgVector.createIndex({
      indexName: 'papers',
      dimension: 1536, // Dimensions for text-embedding-3-small
    });
    console.log('Created papers index');
    
    // Seed the papers index with some initial data
    try {
      await seedPapersIndex();
    } catch (error) {
      console.error('Error seeding papers index:', error);
    }
  } catch (error) {
    console.error('Error initializing vector store:', error);
  }
}

// Seed the papers index with some initial content
async function seedPapersIndex() {
  try {
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