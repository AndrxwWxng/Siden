import * as dotenv from 'dotenv';
import path from 'path';

const rootDir = path.resolve(__dirname, '../..');
const envPath = path.join(rootDir, '.env');
const envLocalPath = path.join(rootDir, '.env.local');

// Load environment variables from both files
dotenv.config({ path: envPath });
dotenv.config({ path: envLocalPath });

console.log('E2B_API_KEY:', process.env.E2B_API_KEY);
console.log('ENV Path:', envPath);
console.log('ENV Local Path:', envLocalPath);
