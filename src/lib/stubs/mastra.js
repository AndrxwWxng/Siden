// Client-side stub for Mastra
// This stub provides a simplified mock implementation for client components

const mockMastra = {
  getAgent: (agentId) => ({
    generate: async (message) => ({
      text: `This is a stub response from ${agentId}. The actual Mastra functionality is only available on the server.`,
      object: null
    })
  }),
  
  // Add other methods that might be called from client components
  // with stub implementations
};

export default mockMastra; 