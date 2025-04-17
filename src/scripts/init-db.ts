import { pgVector } from '../mastra/storage';
import { Client } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function initializeDatabase() {
  console.log('Initializing database...');
  
  // Get database connection string from env
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }
  
  try {
    // Connect to PostgreSQL to run schema.sql
    const client = new Client({ connectionString });
    await client.connect();
    console.log('Connected to PostgreSQL database');
    
    // Read schema.sql file
    const schemaPath = join(process.cwd(), 'src', 'db', 'schema.sql');
    const schemaSql = readFileSync(schemaPath, 'utf8');
    
    // Execute schema SQL
    console.log('Executing schema.sql...');
    await client.query(schemaSql);
    console.log('Schema created successfully');
    
    // Close the client connection
    await client.end();
    
    // Initialize vector database
    console.log('Initializing vector database...');
    
    try {
      // Create the knowledge_base index if it doesn't exist
      await pgVector.createIndex({
        indexName: 'knowledge_base',
        dimension: 1536, // Dimensions for text-embedding-3-small
        overwrite: false // Don't overwrite if it exists
      });
      
      console.log('Successfully created knowledge_base index');
    } catch (error) {
      // If index already exists, just log and continue
      console.log('Knowledge base index setup: ', error instanceof Error ? error.message : String(error));
    }
    
    try {
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
      console.log('Initial data insertion: ', error instanceof Error ? error.message : String(error));
    }
    
    console.log('Database initialization completed successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

// Execute initialization
initializeDatabase()
  .then((success) => {
    if (success) {
      console.log('Database initialization complete');
    } else {
      console.log('Database initialization completed with warnings');
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }); 