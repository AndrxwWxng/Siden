import { pgVector } from '../mastra/storage';
import { Client } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Check if we're in a build/static environment
const isBuildEnvironment = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
const isVercelBuild = process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'production';

async function initializeDatabase() {
  console.log('Initializing database...');
  
  // Skip database initialization during build
  if (isBuildEnvironment) {
    console.log('Build environment detected, skipping actual database initialization');
    return true;
  }
  
  // Get database connection string from env
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('DATABASE_URL environment variable is not set');
    return false;
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
      try {
        await pgVector.createIndex({
          indexName: 'knowledge_base',
          dimension: 1536, // Dimensions for text-embedding-3-small
        });
        console.log('Successfully created knowledge_base index');
      } catch (error) {
        // If error is about duplicate key, the index already exists
        if (error instanceof Error && error.message.includes('duplicate key')) {
          console.log('Knowledge base index already exists, skipping creation');
        } else {
          console.error('Error creating knowledge_base index:', error);
        }
      }
      
      // Insert some initial data (optional)
      try {
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
    } catch (error) {
      console.log('Vector database initialization: ', error instanceof Error ? error.message : String(error));
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