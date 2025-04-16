"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useChat, Message } from "@ai-sdk/react";
import Image from "next/image";
import { detectAndDelegate } from "./agent-delegator";
import MessageFormatter from "@/components/MessageFormatter";
import { XIcon, MenuIcon, RefreshCcwIcon, AlertCircleIcon, SendIcon } from "lucide-react";
import React from "react";
import MultimodalUpload from "@/components/MultimodalUpload";

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
  const [showSidebar, setShowSidebar] = useState(true);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const [attachedFiles, setAttachedFiles] = useState<{ data: File, type: string, preview?: string }[]>([]);
  
  const { messages, input, handleInputChange, handleSubmit: originalHandleSubmit, append, setMessages } = useChat({
    api: agentEndpoints[selectedAgent],
  });
  
  // Helper to reset messages
  const resetMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setAttachedFiles([]);
  }, [setMessages]);

  // Get the selected agent data
  const selectedAgentData = useMemo(() => {
    return agentRoles.find(role => role.id === selectedAgent) || agentRoles[0];
  }, [selectedAgent]);
  
  // Handle file selection
  const handleFileSelect = (files: { data: File, type: string, preview?: string }[]) => {
    setAttachedFiles(files);
  };
  
  // Process files to the format expected by the API
  const processFilesForMessage = async () => {
    const contentParts = [];
    
    // Add text content if it exists
    if (input.trim()) {
      contentParts.push({ type: 'text', text: input });
    }
    
    // Process each file
    for (const file of attachedFiles) {
      try {
        const fileData = await readFileAsDataURL(file.data);
        const base64Data = fileData.split(',')[1]; // Remove the data URL prefix
        
        if (file.type === 'image') {
          contentParts.push({
            type: 'image',
            data: base64Data,
            mimeType: file.data.type
          });
        } else if (file.data.type === 'application/pdf') {
          contentParts.push({
            type: 'file',
            data: base64Data,
            mimeType: 'application/pdf'
          });
        } else {
          // Other file types as text if possible
          try {
            const textContent = await readFileAsText(file.data);
            contentParts.push({
              type: 'text',
              text: `File contents of ${file.data.name}:\n${textContent}`
            });
          } catch (error) {
            console.error('Error reading file as text:', error);
            contentParts.push({
              type: 'text',
              text: `[File attached: ${file.data.name}, but content could not be read]`
            });
          }
        }
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }
    
    return contentParts;
  };
  
  // Helper function to read file as data URL
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
  // Helper function to read file as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };
  
  // Custom submit handler to intercept delegation requests and handle files
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!input.trim() && attachedFiles.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      let userContent: string | any[] = input;
      
      // If we have attached files, process them
      if (attachedFiles.length > 0) {
        userContent = await processFilesForMessage();
        
        // For UI display purposes only - actual content is handled differently
        const fileNames = attachedFiles.map(f => f.data.name).join(', ');
        
        // Visual-only representation for the UI - need to use 'as any' to bypass type checking
        append({ role: "user", content: userContent as any });
      } else {
        // Text-only message
        append({ role: "user", content: input });
      }
      
      // Keep a copy for delegation
      const userInput = input;
      
      // Clear input and files
      handleInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
      setAttachedFiles([]);
      
      // First check if we need to delegate this to another agent (only for text-only messages)
      if (selectedAgent === 'ceo' && (!attachedFiles.length || typeof userContent === 'string')) {
        try {
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
        }
      }
      
      // If we didn't delegate or delegation failed, use the original API
      // We need to manually call the API with our processed content
      try {
        const response = await fetch(agentEndpoints[selectedAgent], {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              ...messages.slice(0, -1), // All previous messages except the last one we just added
              { role: "user", content: userContent }
            ]
          }),
        });
        
        if (!response.ok) {
          const errorText = await response.text().catch(() => 'No error details available');
          console.error(`API request failed: ${response.status}`, errorText);
          throw new Error(`API request failed: ${response.status}. ${response.status === 500 ? 'Server error' : errorText}`);
        }
        
        // Handle streaming response
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Response body is null');
        }
        
        let responseContent = '';
        
        // Read the streamed response
        const read = async () => {
          const { done, value } = await reader.read();
          
          if (done) {
            append({ role: "assistant", content: responseContent });
            setIsProcessing(false);
            return;
          }
          
          // Decode and process chunk
          const chunk = new TextDecoder().decode(value);
          try {
            // Process SSE format
            const lines = chunk.split('\n').filter(line => line.trim() !== '');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(5);
                if (data === '[DONE]') continue;
                
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.choices?.[0]?.delta?.content) {
                    responseContent += parsed.choices[0].delta.content;
                  }
                } catch (e) {
                  console.error('Error parsing JSON from stream:', e);
                }
              }
            }
          } catch (e) {
            console.error('Error processing stream chunk:', e);
          }
          
          // Continue reading
          await read();
        };
        
        await read();
        
      } catch (err) {
        console.error("Error in chat:", err);
        setError(`An error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setIsProcessing(false);
        
        // Add fallback message if appropriate
        if (err instanceof Error && err.message.includes('500')) {
          append({ 
            role: "assistant", 
            content: "I'm having trouble connecting to my backend services. This might be due to high traffic or a temporary issue. Please try again in a moment." 
          });
        }
      }
      
    } catch (err) {
      console.error("Error in chat:", err);
      setError("An error occurred while processing your message.");
      setIsProcessing(false);
    }
  }, [input, selectedAgent, originalHandleSubmit, append, handleInputChange, messages, attachedFiles]);
  
  // Clear messages when changing agents
  useEffect(() => {
    setMessages([]);
    setError(null);
  }, [selectedAgent, setMessages]);
  
  console.log(messages);
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className={`
        md:w-72 p-5 border-r border-zinc-200 dark:border-zinc-800 
        ${showSidebar ? 'block' : 'hidden'} md:block 
        bg-white dark:bg-zinc-900 overflow-y-auto scrollbar-modern
      `}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">Agents</h2>
          <button
            onClick={() => setShowSidebar(false)}
            className="md:hidden p-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-2">
          {agentRoles.map((agent) => (
            <button
              key={agent.id}
              className={`
                w-full text-left px-4 py-3 rounded-lg focus-ring
                ${
                  selectedAgent === agent.id
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 font-medium'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }
              `}
              onClick={() => setSelectedAgent(agent.id)}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white overflow-hidden">
                  {agent.icon ? 
                    <Image src={agent.icon} alt={agent.name} width={32} height={32} className="w-full h-full object-cover" /> :
                    agent.name.charAt(0)
                  }
                </div>
                <div className="ml-3">
                  <div className="font-medium">{agent.name}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {agent.description.slice(0, 32)}...
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
        <div className="border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between bg-white dark:bg-zinc-900">
          <div className="flex items-center">
            <button
              onClick={() => setShowSidebar(true)}
              className="md:hidden mr-3 p-2 rounded-md text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mr-2 overflow-hidden">
                {selectedAgentData.icon ? 
                  <Image src={selectedAgentData.icon} alt={selectedAgentData.name} width={32} height={32} className="w-full h-full object-cover" /> :
                  selectedAgentData.name.charAt(0)
                }
              </div>
              <div>
                <h1 className="text-lg font-semibold m-0 text-zinc-800 dark:text-zinc-100">
                  {selectedAgentData.name}
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 m-0">
                  {selectedAgentData.description}
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={resetMessages}
            className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 p-2 rounded-md focus-ring"
          >
            <RefreshCcwIcon className="h-5 w-5" />
          </button>
        </div>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 scrollbar-modern space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl mb-4 overflow-hidden">
                {selectedAgentData.icon ? 
                  <Image src={selectedAgentData.icon} alt={selectedAgentData.name} width={64} height={64} className="w-full h-full object-cover" /> :
                  selectedAgentData.name.charAt(0)
                }
              </div>
              <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-2">
                Chat with {selectedAgentData.name}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
                {selectedAgentData.description}
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                    max-w-[85%] px-4 py-3 rounded-2xl shadow-sm
                    ${
                      message.role === "user"
                        ? "bg-blue-500 text-white rounded-tr-none"
                        : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none"
                    }
                  `}
                >
                  <MessageFormatter content={message.content} />
                </div>
              </div>
            ))
          )}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-zinc-800 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Processing...</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex justify-center">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg max-w-[85%]">
                <div className="flex items-center mb-1">
                  <AlertCircleIcon className="h-4 w-4 mr-2" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-sm m-0">{error}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
            {/* Display attached files preview */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-2">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="text-xs text-zinc-500">
                    {file.data.name}
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border-0 rounded-lg focus-ring text-zinc-800 dark:text-zinc-200 placeholder-zinc-500 dark:placeholder-zinc-400"
                />
                <div className="absolute left-2 bottom-1">
                  <MultimodalUpload onFileSelect={handleFileSelect} />
                </div>
              </div>
              <button
                type="submit"
                disabled={isProcessing || (!input.trim() && attachedFiles.length === 0)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg focus-ring flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SendIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
