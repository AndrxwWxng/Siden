"use client";

import { useState, useCallback, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import Image from "next/image";
import { detectAndDelegate } from "./agent-delegator";

const agentRoles = [
  {
    id: 'ceo',
    name: 'CEO',
    icon: '/roleheadshots/kenard.png',
    description: 'Leads the overall strategy and vision',
    capabilities: ['Strategic planning', 'Team leadership', 'Decision making'],
    recommended: true
  },
  {
    id: 'dev',
    name: 'Developer',
    icon: '/roleheadshots/alex.png',
    description: 'Builds and implements technical solutions',
    capabilities: ['Full-stack development', 'Code architecture', 'API integration'],
    recommended: true
  },
  {
    id: 'marketing',
    name: 'Marketing Officer',
    icon: '/roleheadshots/chloe.png',
    description: 'Creates and executes marketing strategies',
    capabilities: ['Content creation', 'Campaign planning', 'Analytics'],
    recommended: true
  },
  {
    id: 'product',
    name: 'Product Manager',
    icon: '/roleheadshots/mark.png',
    description: 'Defines product vision and roadmap',
    capabilities: ['Feature prioritization', 'User research', 'Roadmap planning'],
    recommended: false
  },
  {
    id: 'sales',
    name: 'Sales Representative',
    icon: '/roleheadshots/hannah.png',
    description: 'Converts leads into customers',
    capabilities: ['Lead qualification', 'Demos and pitches', 'Relationship building'],
    recommended: false
  },
  {
    id: 'finance',
    name: 'Finance Advisor',
    icon: '/roleheadshots/jenna.png',
    description: 'Manages budgets and financial strategy',
    capabilities: ['Budget planning', 'Financial analysis', 'Investment strategy'],
    recommended: false
  },
  {
    id: 'design',
    name: 'Designer',
    icon: '/roleheadshots/maisie.png',
    description: 'Creates visuals and user experiences',
    capabilities: ['UI/UX design', 'Brand identity', 'Visual systems'],
    recommended: false
  },
  {
    id: 'research',
    name: 'Research Analyst',
    icon: '/roleheadshots/garek.png',
    description: 'Gathers and analyzes market data',
    capabilities: ['Competitive analysis', 'Market trends', 'User insights'],
    recommended: false
  }
];

const agentEndpoints: Record<string, string> = {
  ceo: "/api/chat", // CEO agent is the default
  dev: "/api/chat/developer",
  marketing: "/api/chat/marketing",
  product: "/api/chat/product",
  sales: "/api/chat/sales",
  finance: "/api/chat/finance",
  design: "/api/chat/design",
  research: "/api/chat/research",
};

// Map from role IDs to agent IDs
const roleToAgentId: Record<string, string> = {
  ceo: 'ceoAgent',
  dev: 'developerAgent',
  marketing: 'marketingAgent',
  product: 'productAgent',
  sales: 'salesAgent',
  finance: 'financeAgent',
  design: 'designAgent',
  research: 'researchAgent',
};

export default function Chat() {
  const [selectedAgent, setSelectedAgent] = useState("ceo");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { messages, input, handleInputChange, handleSubmit: originalHandleSubmit, append, setMessages } = useChat({
    api: agentEndpoints[selectedAgent],
  });
  
  // Custom submit handler to intercept delegation requests
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message immediately
    append({ role: "user", content: input });
    const userInput = input;
    handleInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    
    // First check if we need to delegate this to another agent
    if (selectedAgent === 'ceo') {
      try {
        setIsProcessing(true);
        setError(null);
        
        const delegationResponse = await detectAndDelegate(userInput);
        
        if (delegationResponse) {
          // If delegation was successful, add the delegated response
          append({ role: "assistant", content: delegationResponse.result });
          setIsProcessing(false);
          return;
        }
      } catch (err) {
        console.error("Delegation error:", err);
        setError("An error occurred when delegating to other agents. Falling back to direct response.");
      } finally {
        setIsProcessing(false);
      }
    }
    
    // If we didn't delegate or delegation failed, use the original API
    originalHandleSubmit(e);
  }, [input, selectedAgent, originalHandleSubmit, append, handleInputChange]);
  
  // Clear messages when changing agents
  useEffect(() => {
    setMessages([]);
    setError(null);
  }, [selectedAgent, setMessages]);
  
  return (
    <div className="flex flex-col md:flex-row h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Agent Selection Sidebar */}
      <div className="w-full md:w-64 p-4 border-r dark:border-zinc-800 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Select an Agent</h2>
        <div className="space-y-2">
          {agentRoles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedAgent(role.id)}
              className={`flex items-center w-full p-2 rounded-md transition ${
                selectedAgent === role.id
                  ? "bg-blue-100 dark:bg-blue-900"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {/* Add an image if available */}
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 mr-2 overflow-hidden">
                {role.icon && <Image src={role.icon} alt={role.name} width={32} height={32} className="rounded-full" />}
              </div>
              <span>{role.name}</span>
              {role.recommended && (
                <span className="ml-auto text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-0.5 rounded">
                  Recommended
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 p-3 rounded-lg max-w-3xl ${
                message.role === "user"
                  ? "ml-auto bg-blue-100 dark:bg-blue-900"
                  : "bg-zinc-100 dark:bg-zinc-800"
              }`}
            >
              <div className="font-medium mb-1">
                {message.role === "user" ? "You" : agentRoles.find(role => role.id === selectedAgent)?.name || "Assistant"}
              </div>
              <div className="whitespace-pre-wrap">
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return <div key={`${message.id}-${i}`}>{part.text}</div>;
                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          ))}
          
          {/* Show processing indicator */}
          {isProcessing && (
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg max-w-3xl">
              <div className="font-medium mb-1">
                {selectedAgent === 'ceo' ? 'CEO' : agentRoles.find(role => role.id === selectedAgent)?.name}
              </div>
              <div className="flex items-center space-x-2">
                <div className="animate-pulse bg-blue-500 h-2 w-2 rounded-full"></div>
                <div className="animate-pulse bg-blue-500 h-2 w-2 rounded-full" style={{ animationDelay: '0.2s' }}></div>
                <div className="animate-pulse bg-blue-500 h-2 w-2 rounded-full" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-sm text-gray-500">Working with team...</span>
              </div>
            </div>
          )}
          
          {/* Show error message if there is one */}
          {error && (
            <div className="text-red-500 text-sm p-2 mb-2 bg-red-50 dark:bg-red-900/20 rounded">
              {error}
            </div>
          )}
        </div>
        
        {/* Input Form */}
        <div className="p-4 border-t dark:border-zinc-800">
          <form onSubmit={handleSubmit} className="flex">
            <input
              className="flex-1 p-2 mr-2 border dark:border-zinc-700 rounded-md dark:bg-zinc-800 disabled:opacity-50"
              value={input}
              placeholder={`Ask ${agentRoles.find(role => role.id === selectedAgent)?.name || "the assistant"} something...`}
              onChange={handleInputChange}
              disabled={isProcessing}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isProcessing}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}