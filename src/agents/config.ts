// In your config.js file
import { Sandbox } from '@e2b/code-interpreter';

// Load environment variables from .env files
// dotenv.config({ path: '.env' });
// dotenv.config({ path: '.env.local' });

export const OPENAI_MODEL = 'gpt-4-turbo-preview';
export const ANTHROPIC_MODEL = 'claude-3-opus-20240229';
export const MISTRAL_MODEL = 'mistral-large-latest';

// Initialize E2B sandbox
export const initE2BSandbox = async () => {
  const apiKey = 'key here'; // Your API key
  if (!apiKey) {
    throw new Error('E2B_API_KEY is not set');
  }
  // Create sandbox with API key
  const sandbox = await Sandbox.create({ apiKey });
  return sandbox;
};