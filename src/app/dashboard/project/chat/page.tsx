'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useChat, Message } from "@ai-sdk/react";
import Image from "next/image";
import { useSearchParams, useRouter } from 'next/navigation';
import { MessageSquare, Users, RefreshCcwIcon, AlertCircleIcon, SendIcon, ChevronRight, MenuIcon } from "lucide-react";
import Logo from '@/components/Logo';
import MessageFormatter from '@/components/MessageFormatter';

// Import the delegator functionality
import { detectAndDelegateMessage } from "./agent-delegator";

// Define types for multimodal content
interface TextContent {
  type: 'text';
  text: string;
}

interface ImageContent {
  type: 'image';
  data: string;
  mimeType: string;
}

interface FileContent {
  type: 'file';
  data: string;
  mimeType: string;
  name?: string;
}

type ContentPart = TextContent | ImageContent | FileContent;

// Extend the Message type to support content arrays
interface ExtendedMessage extends Omit<Message, 'content'> {
  content: string | ContentPart[];
}

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

export default function ProjectChatPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams?.get('id') || 'unknown';
  const router = useRouter();
  
  const [selectedAgent, setSelectedAgent] = useState("ceo");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableAgents, setAvailableAgents] = useState<typeof agentRoles>([]);
  
  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      if (projectId === 'unknown') {
        setIsLoading(false);
        return;
      }
      
      try {
        const projectData = await fetch(`/api/projects/${projectId}`).then(r => r.json());
        if (projectData) {
          setProject(projectData);
          
          // Filter agent roles based on project.agents
          if (projectData.agentIds && Array.isArray(projectData.agentIds)) {
            const filteredAgents = agentRoles.filter(agent => 
              projectData.agentIds.includes(agent.id)
            );
            
            // Always include CEO
            if (!filteredAgents.some(a => a.id === 'ceo')) {
              const ceoAgent = agentRoles.find(a => a.id === 'ceo');
              if (ceoAgent) {
                filteredAgents.unshift(ceoAgent);
              }
            }
            
            setAvailableAgents(filteredAgents);
            
            // If no agents selected, default to showing all
            if (filteredAgents.length === 0) {
              setAvailableAgents(agentRoles);
            }
          } else {
            // Default to all agents if project doesn't specify
            setAvailableAgents(agentRoles);
          }
        }
      } catch (error) {
        console.error('Error loading project:', error);
        setAvailableAgents(agentRoles); // Fallback to all agents
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProject();
  }, [projectId]);
  
  const { messages, input, handleInputChange, handleSubmit: originalHandleSubmit, append, setMessages } = useChat({
    api: agentEndpoints[selectedAgent],
  });
  
  // Helper to reset messages
  const resetMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, [setMessages]);

  // Get the selected agent data
  const selectedAgentData = useMemo(() => {
    return agentRoles.find(role => role.id === selectedAgent) || agentRoles[0];
  }, [selectedAgent]);
  
  // Create a synthetic event for handleInputChange
  const setInputValue = (value: string) => {
    // Create a synthetic event object that mimics what handleInputChange expects
    const syntheticEvent = {
      target: { value } as HTMLInputElement
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
  };
  
  // Override handle submit to use our custom delegation logic
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Prepare user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: input,
      };
      
      // Add user message to chat
      append(userMessage);
      
      // Clear input
      setInputValue('');
      
      // Get available agent IDs for context in responses
      const availableAgentIds = availableAgents.map(agent => agent.id);
      
      // Delegate to appropriate agent with context about available agents
      const response = await detectAndDelegateMessage(input, selectedAgent, availableAgentIds);
      
      // Add AI response to chat
      append({
        id: Date.now() + 1000 + '',
        role: 'assistant',
        content: response.text,
      });
      
    } catch (error) {
      console.error('Error handling message:', error);
      setError('An error occurred while processing your message. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Clear messages when changing agents
  useEffect(() => {
    setMessages([]);
    setError(null);
  }, [selectedAgent, setMessages]);
  
  // Helper to format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex min-h-screen bg-[#151515] text-white">
      {/* Sidebar for agent selection */}
      <div className={`
        fixed h-full border-r border-[#313131] bg-[#1B1A19] 
        ${sidebarCollapsed ? 'w-[60px]' : 'w-[280px]'}
        transition-all duration-200
      `}>
        <div className="h-16 flex items-center justify-center border-b border-[#313131]">
          <div className="text-sm font-medium">
            {!sidebarCollapsed && 'Team Members'}
          </div>
        </div>
        
        <div className="flex-1 pt-6 pb-5 flex flex-col overflow-auto">
          <div className={`space-y-1 ${sidebarCollapsed ? 'px-2' : 'px-3'}`}>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-t-2 border-[#6366F1] rounded-full animate-spin"></div>
              </div>
            ) : (
              availableAgents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.id)}
                  className={`flex items-center rounded-md transition-colors text-sm ${
                    sidebarCollapsed 
                      ? 'w-10 h-10 justify-center py-0' 
                      : 'w-full px-3 py-2.5'
                  } ${selectedAgent === agent.id ? 'bg-[#252525] text-white' : 'text-[#E6E8EB] hover:bg-[#252525]'}`}
                  title={sidebarCollapsed ? agent.name : undefined}
                >
                  <div className={`w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center overflow-hidden ${sidebarCollapsed ? '' : 'mr-3'}`}>
                    <Image 
                      src={agent.icon} 
                      alt={agent.name}
                      width={32} 
                      height={32} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {!sidebarCollapsed && (
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate">{agent.name}</div>
                      <div className="text-xs text-[#94A3B8] truncate">
                        {agent.description}
                      </div>
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
        
        {/* Collapse button */}
        <div className="border-t border-[#313131] flex justify-center p-4">
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#94A3B8] hover:text-white hover:bg-[#252525] transition-colors"
          >
            <ChevronRight size={16} className={`transform transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </div>
      
      {/* Main content area */}
      <div 
        className="flex-1 flex flex-col"
        style={{ 
          marginLeft: sidebarCollapsed ? '60px' : '280px',
          transition: 'margin-left 200ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Chat header */}
        <div className="border-b border-[#313131] bg-[#343131] p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mr-2 overflow-hidden">
              <Image 
                src={selectedAgentData.icon} 
                alt={selectedAgentData.name} 
                width={32} 
                height={32} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">
                {selectedAgentData.name}
              </h1>
              <p className="text-xs text-[#94A3B8]">
                {selectedAgentData.description}
              </p>
            </div>
          </div>
          <button 
            onClick={resetMessages}
            className="text-[#94A3B8] hover:text-white p-2 rounded-md"
          >
            <RefreshCcwIcon className="h-5 w-5" />
          </button>
        </div>
        
        {/* Chat messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#252525]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl mb-4 overflow-hidden">
                <Image 
                  src={selectedAgentData.icon} 
                  alt={selectedAgentData.name} 
                  width={64} 
                  height={64} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Chat with {selectedAgentData.name}
              </h2>
              <p className="text-[#94A3B8] max-w-md">
                {selectedAgentData.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {selectedAgentData.capabilities.map((capability, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 text-xs rounded-full bg-[#343131] text-[#94A3B8]"
                  >
                    {capability}
                  </span>
                ))}
              </div>
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
                    max-w-[85%] px-4 py-3 rounded-2xl
                    ${
                      message.role === "user"
                        ? "bg-[#6366F1] text-white rounded-tr-none"
                        : "bg-[#343131] text-white rounded-tl-none"
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
              <div className="bg-[#343131] px-4 py-3 rounded-2xl rounded-tl-none flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#6366F1] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-[#6366F1] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-[#6366F1] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-[#94A3B8]">Processing...</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex justify-center">
              <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg max-w-[85%]">
                <div className="flex items-center mb-1">
                  <AlertCircleIcon className="h-4 w-4 mr-2" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Chat input */}
        <div className="p-4 border-t border-[#313131] bg-[#343131]">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-[#252525] border border-[#313131] rounded-lg text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1]"
              />
              <button
                type="submit"
                disabled={isProcessing || !input.trim()}
                className={`p-3 rounded-lg flex items-center justify-center ${
                  isProcessing || !input.trim()
                    ? 'bg-[#313131] text-[#94A3B8]'
                    : 'bg-[#6366F1] text-white hover:bg-[#5254CC]'
                } transition-colors`}
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