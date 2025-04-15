import dotenv from 'dotenv';
import { Client } from 'pg';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function checkDependencies() {
  console.log('Checking required dependencies...');
  
  // Check OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY is missing from environment variables');
  } else {
    console.log('✅ OPENAI_API_KEY is set');
  }
  
  // Check database connection
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is missing from environment variables');
  } else {
    console.log('✅ DATABASE_URL is set');
    
    // Test database connection
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    
    try {
      await client.connect();
      const result = await client.query('SELECT 1');
      console.log('✅ Successfully connected to PostgreSQL database');
    } catch (error) {
      console.error('❌ Failed to connect to PostgreSQL database:', error);
    } finally {
      try {
        await client.end();
      } catch (e) {
        // Ignore errors during cleanup
      }
    }
  }
  
  // Check optional Resend API key
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY is not set. Email functionality will be limited.');
  } else {
    console.log('✅ RESEND_API_KEY is set');
  }
  
  console.log('\nRecommended steps:');
  console.log('1. Run "npm run init-db" to initialize the vector database');
  console.log('2. Run "npm run dev" to start the Next.js application');
  console.log('3. Run "npm run mastra" to start the Mastra server');
  console.log('4. Open http://localhost:3000/chat to interact with the agents');
}

checkDependencies()
  .then(() => {
    console.log('\nDependency check complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nError checking dependencies:', error);
    process.exit(1);
  }); 