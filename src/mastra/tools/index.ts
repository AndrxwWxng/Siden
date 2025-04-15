import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

interface GeocodingResponse {
  results: {
    latitude: number;
    longitude: number;
    name: string;
  }[];
}
interface WeatherResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
    weather_code: number;
  };
}

export const weatherTool = createTool({
  id: 'get-weather',
  description: 'Get current weather for a location',
  inputSchema: z.object({
    location: z.string().describe('City name'),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    feelsLike: z.number(),
    humidity: z.number(),
    windSpeed: z.number(),
    windGust: z.number(),
    conditions: z.string(),
    location: z.string(),
  }),
  execute: async ({ context }) => {
    return await getWeather(context.location);
  },
});

const getWeather = async (location: string) => {
  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
  const geocodingResponse = await fetch(geocodingUrl);
  const geocodingData = (await geocodingResponse.json()) as GeocodingResponse;

  if (!geocodingData.results?.[0]) {
    throw new Error(`Location '${location}' not found`);
  }

  const { latitude, longitude, name } = geocodingData.results[0];

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,weather_code`;

  const response = await fetch(weatherUrl);
  const data = (await response.json()) as WeatherResponse;

  return {
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windGust: data.current.wind_gusts_10m,
    conditions: getWeatherCondition(data.current.weather_code),
    location: name,
  };
};

function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return conditions[code] || 'Unknown';
}

// Email tool using Resend API
export const emailTool = createTool({
  id: 'send-email',
  description: 'Send an email to a recipient',
  inputSchema: z.object({
    to: z.string().describe('Email recipient'),
    subject: z.string().describe('Email subject'),
    body: z.string().describe('Email body content'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    messageId: z.string().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    try {
      // This assumes you have configured Resend API in your environment
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev', // Change to your verified sender
          to: context.to,
          subject: context.subject,
          html: context.body,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          messageId: data.id,
        };
      } else {
        return {
          success: false,
          error: data.message || 'Unknown error',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});

// Web research tool
export const webResearchTool = createTool({
  id: 'web-research',
  description: 'Research information from the web',
  inputSchema: z.object({
    query: z.string().describe('Search query'),
    maxResults: z.number().default(5).describe('Maximum number of results to return'),
  }),
  outputSchema: z.object({
    results: z.array(z.object({
      title: z.string(),
      snippet: z.string(),
      url: z.string(),
    })),
  }),
  execute: async ({ context }) => {
    try {
      // This is a simplified implementation. In a real application,
      // you might want to use a proper search API like Google or Bing
      const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(context.query)}&format=json`);
      const data = await response.json();
      
      // Parsing DuckDuckGo response - this is simplified and may need adjustment
      const results = data.RelatedTopics?.slice(0, context.maxResults).map((topic: { Text?: string; FirstURL?: string }) => ({
        title: topic.Text?.split(' - ')[0] || 'No title',
        snippet: topic.Text || 'No description',
        url: topic.FirstURL || '#',
      })) || [];
      
      return { results };
    } catch (_error) {
      // Return empty results on error
      return { results: [] };
    }
  },
});

// Database tool for vector storage
export const databaseTool = createTool({
  id: 'database-query',
  description: 'Query the database for information',
  inputSchema: z.object({
    query: z.string().describe('Semantic search query'),
    collection: z.string().default('knowledge_base').describe('Vector collection to search'),
    limit: z.number().default(5).describe('Maximum number of results'),
  }),
  outputSchema: z.object({
    results: z.array(z.object({
      content: z.string(),
      metadata: z.record(z.string(), z.any()).optional(),
      score: z.number().optional(),
    })),
  }),
  execute: async ({ context }) => {
    // This is a placeholder. In a real implementation,
    // you would connect to your Supabase/PostgreSQL database with pgvector
    // and perform a vector similarity search
    
    // Simulate a database response
    return {
      results: [
        {
          content: `Sample result for query: "${context.query}"`,
          metadata: { source: 'simulated' },
          score: 0.92,
        }
      ],
    };
  },
});
