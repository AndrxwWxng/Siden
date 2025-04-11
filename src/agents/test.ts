import { Sandbox } from '@e2b/code-interpreter';

// This is a direct test of the E2B sandbox functionality
// It bypasses our API route and tests the E2B API directly
// This is useful for debugging sandbox issues

const API_KEY = 'key here';

async function testSandbox() {
  console.log('Starting sandbox test...');
  console.log('Using API Key:', API_KEY);

  try {
    // Create a sandbox instance
    const sandbox = await Sandbox.create({ apiKey: API_KEY });

    // Run a simple test
    const execution = await sandbox.runCode('console.log("hello world")');
    console.log('Basic test output:', execution.logs);

    // List files in the sandbox
    const files = await sandbox.files.list('/');
    console.log('Files in sandbox:', files);

    // No need to explicitly close the sandbox
    // The SDK will handle cleanup
  } catch (error) {
    console.error('Sandbox test failed:', error);
  }
}

// Run the test
testSandbox();