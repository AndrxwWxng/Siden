import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

/**
 * A simple web search tool that fetches search results from the web
 * This uses the Serper API which requires an API key, but provides high-quality search results
 */
export const webSearchTool = createTool({
  id: 'web-search',
  description: 'Search the web for information about any topic',
  inputSchema: z.object({
    query: z.string().describe('The search query'),
    numResults: z.number().optional().default(5).describe('Number of results to return'),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        title: z.string(),
        link: z.string(),
        snippet: z.string(),
        position: z.number(),
      })
    ),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    try {
      const { query, numResults } = context;
      
      // For demonstration, we're using a simple direct fetch approach
      // In production, you would use a proper search API like Serper, SerpAPI, etc.
      
      // URL encode the query
      const encodedQuery = encodeURIComponent(query);
      const apiKey = process.env.SERPER_API_KEY;
      
      if (!apiKey) {
        return {
          results: [],
          error: "SERPER_API_KEY environment variable is not set. Please set it to use the web search functionality."
        };
      }
      
      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q: query,
          num: numResults
        })
      });
      
      if (!response.ok) {
        throw new Error(`Search request failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Format the results
      const organicResults = data.organic || [];
      const formattedResults = organicResults.map((result: any, index: number) => ({
        title: result.title || 'No title',
        link: result.link || '#',
        snippet: result.snippet || 'No description available',
        position: index + 1,
      })).slice(0, numResults);
      
      return {
        results: formattedResults
      };
    } catch (error) {
      console.error('Web search error:', error);
      
      // Return a fallback response with the error
      return {
        results: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred during web search'
      };
    }
  }
});

/**
 * A fallback web search tool that uses a simple scraping approach if the API-based search is unavailable
 */
export const fallbackWebSearchTool = createTool({
  id: 'fallback-web-search',
  description: 'Search the web using a simple scraping approach (fallback)',
  inputSchema: z.object({
    query: z.string().describe('The search query'),
    numResults: z.number().optional().default(3).describe('Number of results to return'),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        title: z.string(),
        link: z.string(),
        snippet: z.string(),
        position: z.number(),
      })
    ),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    try {
      const { query, numResults = 3 } = context;
      
      // This is a simple implementation - not reliable for production
      // It fetches HTML from a search page and extracts some information
      // In production, use a proper search API instead
      
      const encodedQuery = encodeURIComponent(query);
      const searchUrl = `https://duckduckgo.com/html/?q=${encodedQuery}`;
      
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Search request failed: ${response.statusText}`);
      }
      
      const html = await response.text();
      
      // Extract results from HTML - this is very brittle and just for demonstration
      // In a real app, use a proper search API or HTML parser
      const results: Array<{title: string, link: string, snippet: string, position: number}> = [];
      
      // Very basic parsing - not reliable
      const linkRegex = /<a class="result__a" href="([^"]+)"[^>]*>(.*?)<\/a>/g;
      const snippetRegex = /<a class="result__snippet"[^>]*>(.*?)<\/a>/g;
      
      let linkMatch;
      let snippetMatch;
      let position = 1;
      
      const links: string[] = [];
      const titles: string[] = [];
      const snippets: string[] = [];
      
      // Extract links and titles
      while ((linkMatch = linkRegex.exec(html)) !== null && links.length < numResults) {
        const link = linkMatch[1].trim();
        const title = linkMatch[2].replace(/<[^>]*>/g, '').trim();
        links.push(link);
        titles.push(title);
      }
      
      // Extract snippets
      while ((snippetMatch = snippetRegex.exec(html)) !== null && snippets.length < numResults) {
        const snippet = snippetMatch[1].replace(/<[^>]*>/g, '').trim();
        snippets.push(snippet);
      }
      
      // Create result objects
      for (let i = 0; i < Math.min(links.length, snippets.length, numResults); i++) {
        results.push({
          title: titles[i] || 'No title',
          link: links[i] || '#',
          snippet: snippets[i] || 'No description available',
          position: i + 1,
        });
      }
      
      return {
        results: results.length > 0 ? results : [
          {
            title: 'Search results unavailable',
            link: '#',
            snippet: `Couldn't retrieve results for "${query}". Try a different search or use a different tool.`,
            position: 1,
          }
        ]
      };
    } catch (error) {
      console.error('Fallback web search error:', error);
      
      // Return a fallback response with the error
      return {
        results: [
          {
            title: 'Search failed',
            link: '#',
            snippet: `The search for "${context.query}" failed. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            position: 1,
          }
        ],
        error: error instanceof Error ? error.message : 'Unknown error occurred during web search'
      };
    }
  }
});