import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

/**
 * Helper function to clean and format HTML content
 */
function extractReadableContent(html: string): string {
  // Remove scripts
  let cleanedHtml = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove styles
  cleanedHtml = cleanedHtml.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove comments
  cleanedHtml = cleanedHtml.replace(/<!--[\s\S]*?-->/g, '');
  
  // Extract key content sections
  const mainContent = extractSection(cleanedHtml, 'main') || 
                      extractSection(cleanedHtml, 'article') || 
                      extractSection(cleanedHtml, 'div[role="main"]') ||
                      extractSection(cleanedHtml, 'body');
  
  // Get the text content
  let text = '';
  if (mainContent) {
    // Remove HTML tags but keep line breaks
    text = mainContent
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<li>/gi, '- ')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  } else {
    // Full page fallback
    text = cleanedHtml
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<li>/gi, '- ')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }
  
  // Consolidate whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  // Add paragraph breaks for readability
  text = text.replace(/\. /g, '.\n');
  
  return text;
}

/**
 * Extract a specific section from HTML using basic pattern matching
 */
function extractSection(html: string, selector: string): string | null {
  let pattern;
  
  if (selector === 'body') {
    pattern = /<body[^>]*>([\s\S]*?)<\/body>/i;
  } else if (selector === 'main') {
    pattern = /<main[^>]*>([\s\S]*?)<\/main>/i;
  } else if (selector === 'article') {
    pattern = /<article[^>]*>([\s\S]*?)<\/article>/i;
  } else if (selector.includes('[role="main"]')) {
    pattern = /<div[^>]*role=["']main["'][^>]*>([\s\S]*?)<\/div>/i;
  } else {
    // Default pattern for other selectors
    const tagName = selector.replace(/\[.*\]/, '');
    pattern = new RegExp(`<${tagName}[^>]*>([\s\S]*?)<\/${tagName}>`, 'i');
  }
  
  const match = html.match(pattern);
  return match ? match[1] : null;
}

/**
 * Extract and clean meta description and title
 */
function extractMetadata(html: string): { title: string; description: string } {
  const titleMatch = /<title>(.*?)<\/title>/i.exec(html);
  const metaDescMatch = /<meta\s+name=["']description["']\s+content=["'](.*?)["']/i.exec(html);
  
  return {
    title: titleMatch ? titleMatch[1].trim() : 'Unknown Title',
    description: metaDescMatch ? metaDescMatch[1].trim() : ''
  };
}

/**
 * Extract structured content from HTML
 */
function extractStructuredContent(html: string): { 
  title: string; 
  description: string; 
  headings: string[]; 
  paragraphs: string[];
  mainText: string;
} {
  const { title, description } = extractMetadata(html);
  
  // Extract headings
  const headings = [];
  const headingPattern = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi;
  let headingMatch;
  
  while ((headingMatch = headingPattern.exec(html)) !== null) {
    const headingText = headingMatch[1].replace(/<[^>]*>/g, '').trim();
    if (headingText) {
      headings.push(headingText);
    }
  }
  
  // Extract paragraphs
  const paragraphs = [];
  const paragraphPattern = /<p[^>]*>(.*?)<\/p>/gi;
  let paragraphMatch;
  
  while ((paragraphMatch = paragraphPattern.exec(html)) !== null) {
    const paragraphText = paragraphMatch[1].replace(/<[^>]*>/g, '').trim();
    if (paragraphText) {
      paragraphs.push(paragraphText);
    }
  }
  
  // Get the main text content
  const mainText = extractReadableContent(html);
  
  return {
    title,
    description,
    headings,
    paragraphs,
    mainText
  };
}

/**
 * A web browser tool that allows agents to navigate websites and extract information
 * This uses standard fetch API with custom headers to mimic browser behavior
 */
export const webBrowserTool = createTool({
  id: 'web-browser',
  description: 'Browse websites and extract information',
  inputSchema: z.object({
    url: z.string().describe('The URL to navigate to'),
    action: z.enum(['visit', 'extract']).describe('The action to perform'),
    selector: z.string().optional().describe('CSS selector for extraction'),
    extractType: z.enum(['text', 'html', 'links', 'images', 'structured']).optional().describe('Type of data to extract'),
    userAgent: z.string().optional().describe('Custom User-Agent header'),
    followRedirects: z.boolean().optional().default(true).describe('Whether to follow redirects'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    url: z.string().optional(),
    content: z.string().optional(),
    structuredContent: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      headings: z.array(z.string()).optional(),
      paragraphs: z.array(z.string()).optional(),
      mainText: z.string().optional(),
    }).optional(),
    extractedData: z.any().optional(),
    title: z.string().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    try {
      const { 
        url, 
        action, 
        selector, 
        extractType = 'structured',
        userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        followRedirects = true
      } = context;
      
      // Configure fetch options
      const fetchOptions: RequestInit = {
        headers: {
          'User-Agent': userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
        redirect: followRedirects ? 'follow' as RequestRedirect : 'manual' as RequestRedirect,
      };
      
      // Fetch the content
      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText} (${response.status})`);
      }
      
      const finalUrl = response.url; // Capture final URL after redirects
      const html = await response.text();
      
      // Extract title and basic metadata
      const { title, description } = extractMetadata(html);
      
      // If action is just visit, return structured content
      if (action === 'visit') {
        const structured = extractStructuredContent(html);
        
        return {
          success: true,
          url: finalUrl,
          title: structured.title,
          content: structured.mainText.substring(0, 5000), // Return first 5000 chars of readable content
          structuredContent: {
            title: structured.title,
            description: description,
            headings: structured.headings.slice(0, 10), // First 10 headings
            paragraphs: structured.paragraphs.slice(0, 10), // First 10 paragraphs
            mainText: structured.mainText.substring(0, 5000), // First 5000 chars of the main text
          }
        };
      }
      
      // For extraction action
      if (action === 'extract') {
        let extractedData = null;
        
        switch (extractType) {
          case 'structured':
            const structured = extractStructuredContent(html);
            return {
              success: true,
              url: finalUrl,
              title: structured.title,
              structuredContent: {
                title: structured.title,
                description: description,
                headings: structured.headings,
                paragraphs: structured.paragraphs,
                mainText: structured.mainText
              }
            };
            
          case 'text':
            if (selector) {
              // Basic text extraction with regex (simplified)
              const regex = new RegExp(`<${selector}[^>]*>(.*?)<\/${selector}>`, 'i');
              const match = regex.exec(html);
              if (match && match[1]) {
                // Remove HTML tags from extracted content
                extractedData = match[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
              }
            } else {
              // Extract all text using our improved function
              extractedData = extractReadableContent(html);
            }
            break;
            
          case 'html':
            if (selector) {
              const regex = new RegExp(`<${selector}[^>]*>(.*?)<\/${selector}>`, 'i');
              const match = regex.exec(html);
              if (match && match[1]) {
                extractedData = match[1].trim();
              }
            } else {
              // Return cleaned HTML
              extractedData = html
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
            }
            break;
            
          case 'links':
            // Extract links from the page
            const links = [];
            const linkPattern = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi;
            let linkMatch;
            let searchHtml = html;
            
            // If a selector is provided, first try to extract that section
            if (selector) {
              const sectionRegex = new RegExp(`<${selector}[^>]*>(.*?)<\/${selector}>`, 'i');
              const sectionMatch = sectionRegex.exec(html);
              if (sectionMatch && sectionMatch[1]) {
                searchHtml = sectionMatch[1];
              }
            }
            
            while ((linkMatch = linkPattern.exec(searchHtml)) !== null) {
              const href = linkMatch[1];
              const text = linkMatch[2].replace(/<[^>]*>/g, '').trim();
              
              // Skip empty, javascript: or # links
              if (!text || !href || href.startsWith('javascript:') || href === '#') {
                continue;
              }
              
              // Convert relative URLs to absolute
              let absoluteUrl = href;
              if (href.startsWith('/')) {
                const urlObj = new URL(finalUrl);
                absoluteUrl = `${urlObj.protocol}//${urlObj.host}${href}`;
              } else if (!href.startsWith('http')) {
                // Handle other relative paths
                const urlObj = new URL(finalUrl);
                const basePath = urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('/') + 1);
                absoluteUrl = `${urlObj.protocol}//${urlObj.host}${basePath}${href}`;
              }
              
              links.push({
                text,
                href: absoluteUrl
              });
            }
            extractedData = links;
            break;
            
          case 'images':
            // Extract images from the page
            const images = [];
            const imgPattern = /<img\s+[^>]*?src="([^"]*)"[^>]*?(?:alt="([^"]*)")?[^>]*?>/gi;
            let imgMatch;
            let imgSearchHtml = html;
            
            // If a selector is provided, first try to extract that section
            if (selector) {
              const sectionRegex = new RegExp(`<${selector}[^>]*>(.*?)<\/${selector}>`, 'i');
              const sectionMatch = sectionRegex.exec(html);
              if (sectionMatch && sectionMatch[1]) {
                imgSearchHtml = sectionMatch[1];
              }
            }
            
            while ((imgMatch = imgPattern.exec(imgSearchHtml)) !== null) {
              const src = imgMatch[1];
              const alt = imgMatch[2] || '';
              
              // Skip data URIs and empty sources
              if (!src || src.startsWith('data:')) {
                continue;
              }
              
              // Convert relative URLs to absolute
              let absoluteSrc = src;
              if (src.startsWith('/')) {
                const urlObj = new URL(finalUrl);
                absoluteSrc = `${urlObj.protocol}//${urlObj.host}${src}`;
              } else if (!src.startsWith('http')) {
                // Handle other relative paths
                const urlObj = new URL(finalUrl);
                const basePath = urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('/') + 1);
                absoluteSrc = `${urlObj.protocol}//${urlObj.host}${basePath}${src}`;
              }
              
              images.push({
                alt,
                src: absoluteSrc
              });
            }
            extractedData = images;
            break;
        }
        
        return {
          success: true,
          url: finalUrl,
          title,
          extractedData
        };
      }
      
      // Fallback response with structured content
      const structured = extractStructuredContent(html);
      return {
        success: true,
        url: finalUrl,
        title: structured.title,
        content: structured.mainText.substring(0, 2000), // Return first 2000 chars of readable content
        structuredContent: {
          title: structured.title,
          description: description,
          headings: structured.headings.slice(0, 5), // First 5 headings
          paragraphs: structured.paragraphs.slice(0, 5), // First 5 paragraphs
          mainText: structured.mainText.substring(0, 2000) // First 2000 chars of the main text
        }
      };
    } catch (error) {
      console.error('Web browser tool error:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred during web browsing'
      };
    }
  }
});

/**
 * A specialized web scraper tool that can navigate deep into websites and extract specific content
 */
export const webScraperTool = createTool({
  id: 'web-scraper',
  description: 'Navigate and extract structured content from websites',
  inputSchema: z.object({
    url: z.string().describe('The URL to fetch content from'),
    selector: z.string().optional().describe('CSS selector to extract (returns whole page if not provided)'),
    extractLinks: z.boolean().optional().default(false).describe('Whether to extract links'),
    extractImages: z.boolean().optional().default(false).describe('Whether to extract images'),
    followLinkPattern: z.string().optional().describe('Regex pattern to follow a specific link on the page'),
    extractTables: z.boolean().optional().default(false).describe('Whether to extract tables as structured data'),
    parseMainContent: z.boolean().optional().default(true).describe('Whether to parse and return the main content in a readable format'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    url: z.string().optional(),
    title: z.string().optional(),
    content: z.string().optional(),
    structuredContent: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      headings: z.array(z.string()).optional(),
      paragraphs: z.array(z.string()).optional(),
      mainText: z.string().optional(),
    }).optional(),
    links: z.array(z.object({
      text: z.string(),
      href: z.string(),
    })).optional(),
    images: z.array(z.object({
      alt: z.string(),
      src: z.string(),
    })).optional(),
    tables: z.array(z.array(z.array(z.string()))).optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    try {
      const { 
        url, 
        selector, 
        extractLinks = false, 
        extractImages = false,
        followLinkPattern,
        extractTables = false,
        parseMainContent = true
      } = context;
      
      // Fetch the content with a browser-like user agent
      let targetUrl = url;
      
      // If we need to follow a specific link pattern, first fetch the page and find the matching link
      if (followLinkPattern) {
        const initialResponse = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          }
        });
        
        if (!initialResponse.ok) {
          throw new Error(`Failed to fetch URL: ${initialResponse.statusText}`);
        }
        
        const initialHtml = await initialResponse.text();
        const linkRegex = new RegExp(`<a\\s+(?:[^>]*?\\s+)?href="([^"]*)"[^>]*>${followLinkPattern}[^<]*</a>`, 'i');
        const linkMatch = linkRegex.exec(initialHtml);
        
        if (linkMatch && linkMatch[1]) {
          let linkUrl = linkMatch[1];
          
          // Handle relative URLs
          if (linkUrl.startsWith('/')) {
            const urlObj = new URL(url);
            linkUrl = `${urlObj.protocol}//${urlObj.host}${linkUrl}`;
          } else if (!linkUrl.startsWith('http')) {
            const urlObj = new URL(url);
            const basePath = urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('/') + 1);
            linkUrl = `${urlObj.protocol}//${urlObj.host}${basePath}${linkUrl}`;
          }
          
          targetUrl = linkUrl;
        } else {
          // No matching link found
          return {
            success: false,
            error: `No link matching pattern "${followLinkPattern}" found on the page`
          };
        }
      }
      
      // Fetch the target page
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
      }
      
      const finalUrl = response.url; // Gets the final URL after any redirects
      const html = await response.text();
      
      // Extract structured content
      const structuredData = extractStructuredContent(html);
      
      // Basic parsing - for production, use a proper HTML parser
      const content = parseMainContent ? structuredData.mainText : 
                    selector ? extractSection(html, selector) || html : html;
      
      const links = [];
      const images = [];
      const tables = [];
      
      // Extract links if requested
      if (extractLinks) {
        const searchContent = selector ? extractSection(html, selector) || html : html;
        const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi;
        let match;
        
        while ((match = linkRegex.exec(searchContent)) !== null) {
          let href = match[1];
          const text = match[2].replace(/<[^>]*>/g, '').trim();
          
          // Skip empty, javascript: or # links
          if (!text || !href || href.startsWith('javascript:') || href === '#') {
            continue;
          }
          
          // Convert relative URLs to absolute
          if (href.startsWith('/')) {
            const urlObj = new URL(finalUrl);
            href = `${urlObj.protocol}//${urlObj.host}${href}`;
          } else if (!href.startsWith('http')) {
            const urlObj = new URL(finalUrl);
            const basePath = urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('/') + 1);
            href = `${urlObj.protocol}//${urlObj.host}${basePath}${href}`;
          }
          
          links.push({
            href,
            text
          });
        }
      }
      
      // Extract images if requested
      if (extractImages) {
        const searchContent = selector ? extractSection(html, selector) || html : html;
        const imgRegex = /<img\s+[^>]*?src="([^"]*)"[^>]*?(?:alt="([^"]*)")?[^>]*?>/gi;
        let match;
        
        while ((match = imgRegex.exec(searchContent)) !== null) {
          let src = match[1];
          const alt = match[2] || '';
          
          // Skip data URIs and empty sources
          if (!src || src.startsWith('data:')) {
            continue;
          }
          
          // Convert relative URLs to absolute
          if (src.startsWith('/')) {
            const urlObj = new URL(finalUrl);
            src = `${urlObj.protocol}//${urlObj.host}${src}`;
          } else if (!src.startsWith('http')) {
            const urlObj = new URL(finalUrl);
            const basePath = urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('/') + 1);
            src = `${urlObj.protocol}//${urlObj.host}${basePath}${src}`;
          }
          
          images.push({
            src,
            alt
          });
        }
      }
      
      // Extract tables if requested
      if (extractTables) {
        const searchContent = selector ? extractSection(html, selector) || html : html;
        const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
        let tableMatch;
        
        while ((tableMatch = tableRegex.exec(searchContent)) !== null) {
          const tableHtml = tableMatch[1];
          const table = [];
          
          // Extract rows
          const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
          let rowMatch;
          
          while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
            const rowHtml = rowMatch[1];
            const row = [];
            
            // Extract cells (both th and td)
            const cellRegex = /<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi;
            let cellMatch;
            
            while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
              const cellContent = cellMatch[1].replace(/<[^>]*>/g, '').trim();
              row.push(cellContent);
            }
            
            if (row.length > 0) {
              table.push(row);
            }
          }
          
          if (table.length > 0) {
            tables.push(table);
          }
        }
      }
      
      // Build the response
      const result: any = {
        success: true,
        url: finalUrl,
        title: structuredData.title,
        structuredContent: {
          title: structuredData.title,
          description: structuredData.description,
          headings: structuredData.headings,
          paragraphs: structuredData.paragraphs.slice(0, 20), // Limit to 20 paragraphs
          mainText: structuredData.mainText.substring(0, 8000) // Limit to 8000 chars
        }
      };
      
      // Only include content if it's not too long
      if (typeof content === 'string') {
        if (content.length <= 5000) {
          result.content = content;
        } else {
          result.content = content.substring(0, 5000) + '... [content truncated]';
        }
      }
      
      // Add optional data
      if (extractLinks && links.length > 0) {
        result.links = links;
      }
      
      if (extractImages && images.length > 0) {
        result.images = images;
      }
      
      if (extractTables && tables.length > 0) {
        result.tables = tables;
      }
      
      return result;
    } catch (error) {
      console.error('Web scraper error:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred during web scraping'
      };
    }
  }
}); 