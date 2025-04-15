import { pgVector } from '../mastra/storage';

async function initializeDatabase() {
  console.log('Initializing vector database...');
  
  try {
    // Create the knowledge_base index
    await pgVector.createIndex({
      indexName: 'knowledge_base',
      dimension: 1536, // Dimensions for text-embedding-3-small
    });
    
    console.log('Successfully created knowledge_base index');
    
    // Insert some initial data (optional)
    const placeholderVector = new Array(1536).fill(0); // Placeholder embedding
    
    await pgVector.upsert({
      indexName: 'knowledge_base',
      vectors: [
        placeholderVector,
        placeholderVector,
        placeholderVector
      ],
      metadata: [
        {
          content: 'This company specializes in AI-powered business solutions and digital transformation.',
          source: 'company-info',
          category: 'general'
        },
        {
          content: 'Our marketing strategy focuses on content-driven lead generation and personalized customer journeys.',
          source: 'marketing-strategy',
          category: 'marketing'
        },
        {
          content: 'We use React and Next.js for frontend development, with Node.js and PostgreSQL for backend services.',
          source: 'tech-stack',
          category: 'development'
        }
      ]
    });
    
    console.log('Successfully inserted initial data');
    
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Execute initialization
initializeDatabase()
  .then(() => {
    console.log('Database initialization complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }); 