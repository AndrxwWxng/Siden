// Local development script for Vercel Functions
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create api directory if it doesn't exist
const apiDir = path.join(__dirname, 'api');
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

console.log('Preparing Vercel development environment...');

// Setup environment for Vercel Functions
process.env.VERCEL = 'development';
process.env.SKIP_DB_INIT = 'true';

console.log('Vercel development environment prepared');
console.log('You can now use the API endpoints:');
console.log('- /api/mastra-generate');
console.log('- /api/chat-agent'); 