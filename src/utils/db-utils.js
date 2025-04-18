import { PgVector } from '@mastra/pg';

// Check if we're in a build/static environment
const isBuildEnvironment = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
const isVercelBuild = process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'production';

// Create a dummy implementation for build/static environments
const dummyImplementation = {
  createIndex: async () => console.log('[Build] Mock createIndex called'),
  upsert: async () => console.log('[Build] Mock upsert called'),
  query: async () => [],
  delete: async () => console.log('[Build] Mock delete called'),
};

/**
 * Creates a database connection with fallback support
 * @param {string} connectionString - The database connection URL
 * @returns {Object} A PgVector instance or dummy implementation 
 */
export function createDatabaseConnection(connectionString) {
  // Skip real database connection during build
  if (isBuildEnvironment || !connectionString) {
    console.log('Using dummy database implementation');
    return dummyImplementation;
  }

  try {
    // Try to sanitize the connection string to force IPv4
    let sanitizedConnectionString = connectionString;
    
    // If it's a URL format, try to modify it to prefer IPv4
    if (connectionString.includes('@')) {
      // Try to ensure we're using IPv4 by forcing host resolution
      sanitizedConnectionString = connectionString
        .replace('?sslmode=require', '?sslmode=require&hostaddr=')
        .replace('?ssl=true', '?ssl=true&hostaddr=');
    }
    
    // Create the actual PgVector connection
    return new PgVector(sanitizedConnectionString);
  } catch (error) {
    console.error('Error creating database connection:', error);
    // Return dummy implementation as fallback
    return dummyImplementation;
  }
}

/**
 * Safe execution of database operations with error handling
 * @param {Function} operation - The database operation to perform
 * @param {any} fallbackValue - Value to return if operation fails
 * @returns {Promise<any>} Result of operation or fallback value
 */
export async function safeDbOperation(operation, fallbackValue = null) {
  // Skip during build
  if (isBuildEnvironment) {
    console.log('[Build] Skipping database operation');
    return fallbackValue;
  }
  
  try {
    return await operation();
  } catch (error) {
    console.error('Database operation failed:', error);
    return fallbackValue;
  }
} 