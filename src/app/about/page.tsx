"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">About the AI Agent System</h1>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">System Architecture</h2>
        <p className="mb-4">
          This system demonstrates a multi-agent orchestration using Mastra.ai. It connects a Next.js frontend 
          with a stateful backend of specialized AI agents that maintain context over time.
        </p>
        
        <div className="bg-zinc-100 dark:bg-zinc-800 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-medium mb-4">Architecture Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium mb-2">Frontend (Next.js)</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Modern React components and UI</li>
                <li>API routes for agent communication</li>
                <li>Chat interface with agent selection</li>
                <li>Streaming responses for better UX</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Backend (Mastra Orchestration)</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Multiple specialized agents (CEO, Marketing, Developer, etc.)</li>
                <li>Tool integrations (email, web research, database)</li>
                <li>Vector memory with Postgres+pgvector</li>
                <li>Chain of command for complex tasks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Agent System Diagram</h2>
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg border border-zinc-200 dark:border-zinc-700">
          <div className="mb-6">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg text-center mb-4">
              <h4 className="font-bold">CEO Agent (Kenard)</h4>
              <p className="text-sm">Orchestrates other agents and makes strategic decisions</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg text-center text-sm">
                <h5 className="font-medium">Marketing</h5>
                <p className="text-xs">Chloe</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg text-center text-sm">
                <h5 className="font-medium">Developer</h5>
                <p className="text-xs">Alex</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg text-center text-sm">
                <h5 className="font-medium">Sales</h5>
                <p className="text-xs">Hannah</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg text-center text-sm">
                <h5 className="font-medium">Finance</h5>
                <p className="text-xs">Jenna</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-lg text-center text-sm">
                <h5 className="font-medium">Product</h5>
                <p className="text-xs">Mark</p>
              </div>
              <div className="bg-pink-100 dark:bg-pink-900 p-3 rounded-lg text-center text-sm">
                <h5 className="font-medium">Design</h5>
                <p className="text-xs">Maisie</p>
              </div>
              <div className="bg-teal-100 dark:bg-teal-900 p-3 rounded-lg text-center text-sm">
                <h5 className="font-medium">Research</h5>
                <p className="text-xs">Garek</p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg text-center text-sm">
                <h5 className="font-medium">Weather</h5>
                <p className="text-xs">Utility</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-100 dark:bg-zinc-700 p-3 rounded-lg text-center">
              <h4 className="font-medium">Tool Integrations</h4>
              <ul className="text-xs text-left list-disc pl-4 mt-2">
                <li>Email Tool</li>
                <li>Web Research Tool</li>
                <li>Database Tool</li>
                <li>Vector Memory Tool</li>
              </ul>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-700 p-3 rounded-lg text-center">
              <h4 className="font-medium">Vector Database</h4>
              <p className="text-xs mt-2">Postgres with pgvector extension for semantic memory</p>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-700 p-3 rounded-lg text-center">
              <h4 className="font-medium">LLM Provider</h4>
              <p className="text-xs mt-2">OpenAI GPT-4o Mini powering all agents</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <ol className="list-decimal pl-6 space-y-4">
          <li>
            <strong>User Submits a Query:</strong> The user selects an agent and sends a message through the chat interface.
          </li>
          <li>
            <strong>API Routes Direct Traffic:</strong> Next.js API routes forward the request to the appropriate agent.
          </li>
          <li>
            <strong>Agent Processing:</strong> The agent uses its tools and context to formulate a response.
          </li>
          <li>
            <strong>Memory Storage:</strong> Interactions are stored in the vector database for future context.
          </li>
          <li>
            <strong>Streaming Response:</strong> The response is streamed back to the user in real-time.
          </li>
        </ol>
      </div>
      
      <div className="flex justify-center mt-8">
        <Link 
          href="/chat" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Try It Out
        </Link>
      </div>
    </div>
  );
} 