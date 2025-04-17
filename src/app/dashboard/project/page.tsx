'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  MessageSquare, Users, Wrench, LineChart, 
  Settings, PlusCircle, Send, Paperclip,
  MoreHorizontal, Search, ChevronLeft, ChevronRight,
  Folder
} from 'lucide-react';
import Logo from '@/components/Logo';
// Import the client-side Mastra client instead of server-side
import mastraClient, { MastraAgentId } from '@/lib/mastraClient';
import { ProjectService } from '@/services/projectService';
import { Project } from '@/components/dashboard/types';

// Use the client-side Mastra implementation
const mastra = mastraClient;

// Type definitions
type TabType = 'communication' | 'agents' | 'tools' | 'reports' | 'settings';

// Type definition for Mastra agent IDs - must match what the API expects
type MastraAgentId = 'weatherAgent' | 'ceoAgent' | 'marketingAgent' | 'developerAgent' | 
                     'salesAgent' | 'productAgent' | 'financeAgent' | 'designAgent' | 'researchAgent';

// Message and sender interfaces
interface Sender {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface Message {
  id: string;
  sender: Sender;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'typing';
}

export default function ProjectDetail() {
  const searchParams = useSearchParams();
  const projectId = searchParams?.get('id') || 'unknown';
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<TabType>('communication');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [typingAgent, setTypingAgent] = useState<string | null>(null);
  const [activeAgents, setActiveAgents] = useState<string[]>(['marketing', 'product']);
  const [showAgentInfo, setShowAgentInfo] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>('Marketing Campaign Builder');
  const [projectDescription, setProjectDescription] = useState<string>('AI-powered tool to create and optimize marketing campaigns');
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [dailySummary, setDailySummary] = useState<boolean>(true);
  const [activityAlerts, setActivityAlerts] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [autonomousCommunication, setAutonomousCommunication] = useState<boolean>(true);
  const [knowledgeSharing, setKnowledgeSharing] = useState<boolean>(true);
  const [ceoApprovalMode, setCeoApprovalMode] = useState<boolean>(true);
  const [connectedTools, setConnectedTools] = useState<string[]>([]);
  
  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      if (projectId === 'unknown') return;
      
      setIsLoading(true);
      try {
        const project = await ProjectService.getProjectById(projectId);
        if (project) {
          setProject(project);
          setProjectName(project.name);
          setProjectDescription(project.description);
          
          // Set active agents based on project data
          if (project.agentIds && project.agentIds.length > 0) {
            setActiveAgents(project.agentIds);
          }
        }
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProject();
  }, [projectId]);

  // Load connected tools from project data
  useEffect(() => {
    if (project && project.integrations && project.integrations.services) {
      const toolIds = project.integrations.services.map(service => service.id);
      setConnectedTools(toolIds);
    }
  }, [project]);

  // Function to navigate to chat page
  const navigateToChat = () => {
    router.push(`/dashboard/project/chat?id=${projectId}`);
  };
  
  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: {
        id: 'user',
        name: 'You',
        role: 'CEO',
        avatar: '/roleheadshots/kenard.png'
      },
      content: newMessage,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    // Determine which agent should respond based on message content
    const respondingAgentId = determineRespondingAgent(newMessage);
    console.log('Selected agent:', respondingAgentId); // Debug log
    
    // Show typing indicator
    setTypingAgent(respondingAgentId);
    
    try {
      // Get the agent from Mastra
      const mastraAgentId = `${respondingAgentId}Agent` as MastraAgentId; // Convert to Mastra format (e.g., 'marketing' -> 'marketingAgent')
      const mastraAgent = mastra.getAgent(mastraAgentId);
      
      if (!mastraAgent) {
        throw new Error(`Failed to initialize ${respondingAgentId} agent`);
      }

      // Generate response using Mastra
      const response = await mastraAgent.generate(newMessage);
      if (!response || !response.text) {
        throw new Error(`No response from ${respondingAgentId} agent`);
      }

      // Create agent profile from known information
      const agentProfile = getAgentProfile(respondingAgentId);
      const agentResponse: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: {
          id: respondingAgentId,
          name: agentProfile.name,
          role: agentProfile.role,
          avatar: agentProfile.avatar
        },
        content: response.text,
        timestamp: new Date().toISOString(),
        status: 'sent'
      };
      
      setTypingAgent(null);
      setMessages(prev => [...prev, agentResponse]);
      
      // Sometimes have another agent chime in
      if (Math.random() > 0.6) {
        const secondaryAgentId = activeAgents.find(a => a !== respondingAgentId) || 'product';
        
        setTypingAgent(secondaryAgentId);
        
        // Get the secondary agent from Mastra
        const secondaryMastraAgentId = `${secondaryAgentId}Agent` as MastraAgentId;
        const secondaryMastraAgent = mastra.getAgent(secondaryMastraAgentId);
        
        if (!secondaryMastraAgent) {
          throw new Error(`Failed to initialize ${secondaryAgentId} agent`);
        }

        // Generate follow-up response
        const followUpResponse = await secondaryMastraAgent.generate(newMessage);
        if (!followUpResponse || !followUpResponse.text) {
          throw new Error(`No response from ${secondaryAgentId} agent`);
        }

        // Create agent profile
        const secondaryAgentProfile = getAgentProfile(secondaryAgentId);
        const followUpMessage: Message = {
          id: `msg-${Date.now() + 2}`,
          sender: {
            id: secondaryAgentId,
            name: secondaryAgentProfile.name,
            role: secondaryAgentProfile.role,
            avatar: secondaryAgentProfile.avatar
          },
          content: followUpResponse.text,
          timestamp: new Date().toISOString(),
          status: 'sent'
        };
        
        setTypingAgent(null);
        setMessages(prev => [...prev, followUpMessage]);
      }
    } catch (error) {
      console.error('Error generating agent response:', error);
      setTypingAgent(null);
      
      // Add error message to chat
      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: {
          id: 'system',
          name: 'System',
          role: 'Error',
          avatar: '⚠️'
        },
        content: `I apologize, but I encountered an error while processing your request. Please try again later. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString(),
        status: 'sent'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };
  
  // Helper function to determine which agent should respond
  const determineRespondingAgent = (message: string): string => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('market') || lowerMsg.includes('campaign') || lowerMsg.includes('brand') || lowerMsg.includes('audience')) {
      return 'marketing';
    }
    
    if (lowerMsg.includes('product') || lowerMsg.includes('feature') || lowerMsg.includes('roadmap') || lowerMsg.includes('user')) {
      return 'product';
    }
    
    if (lowerMsg.includes('code') || lowerMsg.includes('develop') || lowerMsg.includes('bug') || lowerMsg.includes('technical')) {
      return 'developer';
    }
    
    if (lowerMsg.includes('sales') || lowerMsg.includes('client') || lowerMsg.includes('lead') || lowerMsg.includes('deal')) {
      return 'sales';
    }
    
    // Default to marketing if no specific keywords match
    return 'marketing';
  };
  
  // Helper function to generate agent profile information
  const getAgentProfile = (agentId: string): {
    name: string;
    role: string;
    avatar: string;
  } => {
    switch (agentId) {
      case 'marketing':
        return {
          name: 'Chloe',
          role: 'Marketing Officer',
          avatar: '/roleheadshots/chloe.png'
        };
      case 'product':
        return {
          name: 'Mark',
          role: 'Product Manager',
          avatar: '/roleheadshots/mark.png'
        };
      case 'developer':
        return {
          name: 'Alex',
          role: 'Developer',
          avatar: '/roleheadshots/alex.png'
        };
      case 'sales':
        return {
          name: 'Hannah',
          role: 'Sales Representative',
          avatar: '/roleheadshots/hannah.png'
        };
      case 'finance':
        return {
          name: 'Jenna',
          role: 'Finance Advisor',
          avatar: '/roleheadshots/jenna.png'
        };
      case 'design':
        return {
          name: 'Maisie',
          role: 'Designer',
          avatar: '/roleheadshots/maisie.png'
        };
      case 'research':
        return {
          name: 'Garek',
          role: 'Research Analyst',
          avatar: '/roleheadshots/garek.png'
        };
      case 'ceo':
      default:
        return {
          name: 'Kenard',
          role: 'CEO',
          avatar: '/roleheadshots/kenard.png'
        };
    }
  };
  
  // Helper function to generate agent avatar (for compatibility)
  const getAgentAvatar = (agentId: string): string => {
    return getAgentProfile(agentId).avatar;
  };
  
  // Helper function to generate agent response based on message
  const generateAgentResponse = (message: string, agentId: string): string => {
    const lowerMsg = message.toLowerCase();
    
    if (agentId === 'marketing') { 
      if (lowerMsg.includes('campaign')) {
        return "I've analyzed recent campaign performance and recommend focusing on social media and email for the next product launch. Our engagement metrics show a 32% higher conversion rate when we combine these channels with targeted content.";
      } else if (lowerMsg.includes('audience')) {
        return "Based on our market research, our primary audience is tech-forward professionals aged 25-45. They're primarily concerned with efficiency and collaboration features. Shall I prepare a detailed audience segmentation report?";
      } else {
        return "That's a great marketing consideration. I'll create a strategy document outlining key messages, channels, and metrics for this initiative. Would you like me to prioritize any specific aspect?";
      }
    } else if (agentId === 'product') { 
      if (lowerMsg.includes('feature')) {
        return "I've reviewed the feature request against our product roadmap. We could prioritize this for the next sprint, though it would require us to reschedule the dashboard improvements. The development effort is estimated at 2-3 weeks.";
      } else if (lowerMsg.includes('roadmap')) {
        return "Our current roadmap has us releasing the collaboration suite in Q3, followed by API enhancements in Q4. Given customer feedback, I recommend we accelerate the mobile improvements. Would you like to see the updated timeline?";
      } else {
        return "From a product perspective, we should focus on solving the core user pain points first. Our research indicates that users are struggling with the current workflow. I've drafted some solutions we could implement quickly.";
      }
    } else {
      // Generic responses
      return `I'll analyze this request in detail. Based on initial assessment, we should be able to provide a comprehensive solution that aligns with our business objectives and creates significant value for our target users.`;
    }
  };
  
  // Helper function to generate follow-up responses
  const generateFollowUpResponse = (message: string, agentId: string): string => {
    if (agentId === 'marketing') {
      return "I'd like to add a marketing perspective here. We could leverage this opportunity for content creation and thought leadership, which would support both our brand positioning and lead generation efforts.";
    } else if (agentId === 'product') {
      return "Building on that point, our product analytics show that users who engage with these features have 40% higher retention. We should highlight this in our messaging and product development priorities.";
    } else if (agentId === 'developer') {
      return "From a technical standpoint, we can implement this efficiently by leveraging our existing architecture. I estimate 1-2 weeks of development time with minimal impact on other initiatives.";
    } else {
      return "I agree with this approach and would recommend we move forward with it. The ROI potential is substantial based on our preliminary analysis.";
    }
  };
  
  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'communication':
        return (
          <div className="flex flex-col h-full bg-[#252525] rounded-xl overflow-hidden border border-[#313131]">
            <div className="flex items-center justify-between p-4 border-b border-[#313131] bg-[#343131]">
              <div className="flex items-center">
                <h2 className="text-lg font-medium">Team Communication</h2>
                <div className="flex items-center ml-4">
                  <span className="text-xs text-[#94A3B8] mr-2">Active:</span>
                  <div className="flex -space-x-2">
                    {activeAgents.map(agent => (
                      <div 
                        key={agent}
                        className="w-6 h-6 rounded-full overflow-hidden bg-[#252525] flex items-center justify-center border border-[#343131] cursor-pointer"
                        onClick={() => toggleAgentInfo(agent)}
                      >
                        <img 
                          src={getAgentAvatar(agent)} 
                          alt={agent}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    ))}
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-[#252525] flex items-center justify-center border border-[#343131]">
                      <img 
                        src="/roleheadshots/kenard.png" 
                        alt="You"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={navigateToChat}
                  className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-md hover:bg-[#5254CC] transition-colors"
                >
                  <MessageSquare size={16} />
                  <span>Open Full Chat</span>
                </button>
                <button className="p-2 text-[#94A3B8] hover:text-white rounded-md hover:bg-[#252525] transition-colors">
                  <Search size={18} />
                </button>
                <button className="p-2 text-[#94A3B8] hover:text-white rounded-md hover:bg-[#252525] transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>
            
            {/* Agent info panel */}
            {showAgentInfo && (
              <div className="p-4 border-b border-[#313131] bg-[#343131]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center text-xl overflow-hidden">
                    <img 
                      src={getAgentAvatar(showAgentInfo)} 
                      alt={showAgentInfo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {showAgentInfo === 'marketing' ? 'Marketing Officer' : 
                       showAgentInfo === 'product' ? 'Product Manager' :
                       showAgentInfo === 'developer' ? 'Developer' : 'Sales Representative'}
                    </h3>
                    <p className="text-sm text-[#94A3B8] mb-2">
                      {showAgentInfo === 'marketing' ? 'Specialized in marketing strategy and campaign optimization' : 
                       showAgentInfo === 'product' ? 'Focused on product strategy and user experience' :
                       showAgentInfo === 'developer' ? 'Expert in full-stack development and system architecture' : 'Skilled in sales strategy and client relationships'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-[#252525] text-[#94A3B8]">
                        {showAgentInfo === 'marketing' ? 'Analytics' : 
                         showAgentInfo === 'product' ? 'User Research' :
                         showAgentInfo === 'developer' ? 'JavaScript' : 'Lead Generation'}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-[#252525] text-[#94A3B8]">
                        {showAgentInfo === 'marketing' ? 'Content Strategy' : 
                         showAgentInfo === 'product' ? 'Roadmapping' :
                         showAgentInfo === 'developer' ? 'API Design' : 'Negotiation'}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-[#252525] text-[#94A3B8]">
                        {showAgentInfo === 'marketing' ? 'SEO' : 
                         showAgentInfo === 'product' ? 'A/B Testing' :
                         showAgentInfo === 'developer' ? 'Database' : 'Relationship Management'}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowAgentInfo(null)}
                    className="ml-auto p-1 text-[#94A3B8] hover:text-white"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#252525]">
              {messages.map(message => (
                <div 
                  key={message.id}
                  className={`flex ${message.sender.id === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[70%] flex gap-3 
                    ${message.sender.id === 'user' ? 'flex-row-reverse' : 'flex-row'}
                  `}>
                    <div 
                      className={`
                        flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-[#343131] flex items-center justify-center cursor-pointer
                        ${message.sender.id !== 'user' ? 'hover:bg-[#3e3e3e]' : ''}
                      `}
                      onClick={() => message.sender.id !== 'user' ? toggleAgentInfo(message.sender.id) : null}
                    >
                      <img 
                        src={message.sender.avatar} 
                        alt={message.sender.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className={`
                        p-3 rounded-lg
                        ${message.sender.id === 'user' 
                          ? 'bg-[#6366F1] text-white' 
                          : 'bg-[#343131] text-white'}
                      `}>
                        <div className="text-sm">{message.content}</div>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-[#94A3B8]">
                          {message.sender.name} • {formatTime(message.timestamp)}
                        </span>
                        {message.status === 'sent' && message.sender.id === 'user' && (
                          <span className="text-xs text-[#94A3B8]">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {typingAgent && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#343131] flex items-center justify-center">
                      <img 
                        src={getAgentAvatar(typingAgent)} 
                        alt={typingAgent}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="p-3 rounded-lg bg-[#343131] text-white">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-[#6366F1] animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 rounded-full bg-[#6366F1] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 rounded-full bg-[#6366F1] animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                        </div>
                      </div>
                      <div className="mt-1">
                        <span className="text-xs text-[#94A3B8]">
                          {typingAgent === 'marketing' ? 'Marketing Officer' : 
                           typingAgent === 'product' ? 'Product Manager' :
                           typingAgent === 'developer' ? 'Developer' : 
                           typingAgent === 'sales' ? 'Sales Representative' : 'Agent'} is typing...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-[#313131] bg-[#343131]">
              <div className="flex items-center gap-2">
                <button className="p-2 text-[#94A3B8] hover:text-[#6366F1] transition-colors">
                  <Paperclip size={18} />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Message your team..."
                  className="flex-1 bg-[#252525] border border-[#313131] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#6366F1]"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`p-2 rounded-md ${
                    newMessage.trim() 
                      ? 'bg-[#6366F1] text-white hover:bg-[#5254CC]' 
                      : 'bg-[#343131] text-[#94A3B8]'
                  } transition-colors`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        );
      case 'agents':
        return (
          <div className="bg-[#252525] rounded-xl border border-[#313131] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium">Configure Your Team</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-[#343131] hover:bg-[#252525] text-sm rounded-md transition-colors flex items-center gap-2">
                  <Settings size={14} />
                  <span>Team Settings</span>
                </button>
                <button className="px-4 py-2 bg-[#6366F1] hover:bg-[#5254CC] text-white text-sm rounded-md transition-colors flex items-center gap-2">
                  <PlusCircle size={14} />
                  <span>Add Agent</span>
                </button>
              </div>
            </div>
            
            {/* Agent roles and personality types */}
            <div className="mb-8">
              <div className="bg-[#343131] border border-[#313131] rounded-md p-5 mb-6">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Users size={16} className="text-[#6366F1]" />
                  <span>Active Team Members</span>
                </h3>
                <p className="text-sm text-[#94A3B8] mb-4">Configure which AI team members are active in your project and customize their roles.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockAgents.map(agent => (
                    <div key={agent.id} className="bg-[#252525] border border-[#313131] rounded-md p-4 hover:border-[#444] transition-all">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#343131] flex items-center justify-center overflow-hidden mr-4">
                          <img 
                            src={agent.avatar} 
                            alt={agent.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-white">{agent.name}</h3>
                            <span className={`
                              px-2 py-0.5 text-xs rounded-md border
                              ${agent.status === 'active' 
                                ? 'bg-[#1E293B] text-[#38BDF8] border-[#38BDF8]/30' 
                                : 'bg-[#1E293B] text-yellow-400 border-yellow-500/30'}
                            `}>
                              {agent.status}
                            </span>
                          </div>
                          <p className="text-sm text-[#94A3B8] mb-3">{agent.role}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {agent.id === 'marketing' && (
                              <>
                                <span className="px-2 py-1 text-xs rounded-full bg-[#343131] text-[#94A3B8]">Content Strategy</span>
                                <span className="px-2 py-1 text-xs rounded-full bg-[#343131] text-[#94A3B8]">SEO</span>
                                <span className="px-2 py-1 text-xs rounded-full bg-[#343131] text-[#94A3B8]">Analytics</span>
                              </>
                            )}
                            {agent.id === 'product' && (
                              <>
                                <span className="px-2 py-1 text-xs rounded-full bg-[#343131] text-[#94A3B8]">Roadmapping</span>
                                <span className="px-2 py-1 text-xs rounded-full bg-[#343131] text-[#94A3B8]">User Research</span>
                                <span className="px-2 py-1 text-xs rounded-full bg-[#343131] text-[#94A3B8]">Strategy</span>
                              </>
                            )}
                            {agent.id === 'developer' && (
                              <>
                                <span className="px-2 py-1 text-xs rounded-full bg-[#343131] text-[#94A3B8]">JavaScript</span>
                                <span className="px-2 py-1 text-xs rounded-full bg-[#343131] text-[#94A3B8]">Python</span>
                                <span className="px-2 py-1 text-xs rounded-full bg-[#343131] text-[#94A3B8]">React</span>
                              </>
                            )}
                            {agent.id === 'sales' && (
                              <>
                                <span className="px-2 py-1 text-xs rounded-full bg-[#343131] text-[#94A3B8]">Relationship Management</span>
                                <span className="px-2 py-1 text-xs rounded-full bg-[#343131] text-[#94A3B8]">Negotiation</span>
                                <span className="px-2 py-1 text-xs rounded-full bg-[#343131] text-[#94A3B8]">Lead Generation</span>
                              </>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <button className="px-3 py-1.5 bg-[#343131] hover:bg-[#252525] text-sm rounded-md transition-colors flex-1 flex items-center justify-center gap-1">
                              <Settings size={12} />
                              <span>Configure</span>
                            </button>
                            <button className="px-3 py-1.5 border border-[#313131] hover:border-[#6366F1] text-sm rounded-md transition-colors flex-1 flex items-center justify-center gap-1">
                              <Wrench size={12} />
                              <span>Tools</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-[#343131] border border-[#313131] rounded-md p-5">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <PlusCircle size={16} className="text-[#6366F1]" />
                  <span>Available Roles</span>
                </h3>
                <p className="text-sm text-[#94A3B8] mb-4">Add more specialized agents to your team based on your project needs.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#252525] border border-[#313131] rounded-md p-4 hover:border-[#444] transition-all">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#343131] flex items-center justify-center overflow-hidden mr-3">
                        <img 
                          src="/roleheadshots/jenna.png" 
                          alt="Finance Advisor"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">Finance Advisor</h4>
                        <p className="text-xs text-[#94A3B8]">Budget & financial planning</p>
                      </div>
                    </div>
                    <button className="w-full px-3 py-1.5 border border-dashed border-[#313131] hover:border-[#6366F1] text-sm rounded-md transition-colors flex items-center justify-center gap-1">
                      <PlusCircle size={14} />
                      <span>Add to Team</span>
                    </button>
                  </div>
                  
                  <div className="bg-[#252525] border border-[#313131] rounded-md p-4 hover:border-[#444] transition-all">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#343131] flex items-center justify-center overflow-hidden mr-3">
                        <img 
                          src="/roleheadshots/maisie.png" 
                          alt="Designer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">Designer</h4>
                        <p className="text-xs text-[#94A3B8]">UI/UX & visual design</p>
                      </div>
                    </div>
                    <button className="w-full px-3 py-1.5 border border-dashed border-[#313131] hover:border-[#6366F1] text-sm rounded-md transition-colors flex items-center justify-center gap-1">
                      <PlusCircle size={14} />
                      <span>Add to Team</span>
                    </button>
                  </div>
                  
                  <div className="bg-[#252525] border border-[#313131] rounded-md p-4 hover:border-[#444] transition-all">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#343131] flex items-center justify-center overflow-hidden mr-3">
                        <img 
                          src="/roleheadshots/garek.png" 
                          alt="Research Analyst"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">Research Analyst</h4>
                        <p className="text-xs text-[#94A3B8]">Data analysis & insights</p>
                      </div>
                    </div>
                    <button className="w-full px-3 py-1.5 border border-dashed border-[#313131] hover:border-[#6366F1] text-sm rounded-md transition-colors flex items-center justify-center gap-1">
                      <PlusCircle size={14} />
                      <span>Add to Team</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Team behavior settings */}
            <div className="bg-[#343131] border border-[#313131] rounded-md p-5">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Settings size={16} className="text-[#6366F1]" />
                <span>Team Behavior</span>
              </h3>
              <p className="text-sm text-[#94A3B8] mb-4">Configure how your team of agents works together.</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-[#252525]">
                  <div>
                    <h4 className="text-sm font-medium">Autonomous Communication</h4>
                    <p className="text-xs text-[#94A3B8] mt-1">Allow agents to communicate without your input</p>
                  </div>
                  <div 
                    className="relative inline-block w-10 h-5 rounded-md bg-[#252525] cursor-pointer"
                    onClick={() => setAutonomousCommunication(!autonomousCommunication)}
                  >
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={autonomousCommunication}
                      onChange={() => setAutonomousCommunication(!autonomousCommunication)}
                    />
                    <span className="block h-5 w-5 rounded-md bg-[#6366F1] absolute left-0 transition-transform transform translate-x-5"></span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-[#252525]">
                  <div>
                    <h4 className="text-sm font-medium">Knowledge Sharing</h4>
                    <p className="text-xs text-[#94A3B8] mt-1">Share context and information between agents</p>
                  </div>
                  <div 
                    className="relative inline-block w-10 h-5 rounded-md bg-[#252525] cursor-pointer"
                    onClick={() => setKnowledgeSharing(!knowledgeSharing)}
                  >
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={knowledgeSharing}
                      onChange={() => setKnowledgeSharing(!knowledgeSharing)}
                    />
                    <span className="block h-5 w-5 rounded-md bg-[#6366F1] absolute left-0 transition-transform transform translate-x-5"></span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-[#252525]">
                  <div>
                    <h4 className="text-sm font-medium">CEO Approval Mode</h4>
                    <p className="text-xs text-[#94A3B8] mt-1">Require your approval for major decisions</p>
                  </div>
                  <div 
                    className="relative inline-block w-10 h-5 rounded-md bg-[#252525] cursor-pointer"
                    onClick={() => setCeoApprovalMode(!ceoApprovalMode)}
                  >
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={ceoApprovalMode}
                      onChange={() => setCeoApprovalMode(!ceoApprovalMode)}
                    />
                    <span className="block h-5 w-5 rounded-md bg-[#6366F1] absolute left-0 transition-transform transform translate-x-5"></span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="text-sm font-medium">Team Personality</h4>
                    <p className="text-xs text-[#94A3B8] mt-1">Overall team interaction style</p>
                  </div>
                  <select className="bg-[#252525] border border-[#313131] rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-[#6366F1]">
                    <option>Professional</option>
                    <option>Creative</option>
                    <option>Analytical</option>
                    <option>Collaborative</option>
                  </select>
                </div>
              </div>
              
              {/* Add this at the end of the "space-y-4" div */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={saveTeamSettings}
                  className="px-4 py-2 bg-[#6366F1] hover:bg-[#5254CC] text-white rounded transition-colors flex items-center gap-2"
                >
                  <Settings size={14} />
                  <span>Save Settings</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 'tools':
        return (
          <div className="bg-[#252525] rounded-xl border border-[#313131] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium">Connect Tools & Resources</h2>
              <button className="px-4 py-2 bg-[#6366F1] hover:bg-[#5254CC] text-white text-sm rounded-md transition-colors flex items-center gap-2">
                <PlusCircle size={14} />
                <span>Add New Tool</span>
              </button>
            </div>
            
            {/* Tool categories */}
            <div className="flex border-b border-[#313131] mb-6">
              <button className="px-4 py-2 border-b-2 border-[#6366F1] text-white">All Tools</button>
              <button className="px-4 py-2 text-[#94A3B8] hover:text-white">Communication</button>
              <button className="px-4 py-2 text-[#94A3B8] hover:text-white">Data & Analytics</button>
              <button className="px-4 py-2 text-[#94A3B8] hover:text-white">Productivity</button>
              <button className="px-4 py-2 text-[#94A3B8] hover:text-white">Development</button>
            </div>
            
            {/* Connected tools */}
            <div className="mb-8">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <span className="text-[#38BDF8] text-xl">•</span>
                <span>Connected Tools</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockTools.filter(t => t.connected).map(tool => (
                  <div 
                    key={tool.id}
                    className="bg-[#343131] border border-[#38BDF8]/30 rounded-md p-5 relative overflow-hidden transition-all group"
                  >
                    <div className="absolute right-0 top-0 bg-[#38BDF8]/10 w-16 h-16 rounded-bl-[56px] flex items-center justify-center p-3">
                      <div className="text-[#38BDF8] text-xs font-medium ml-3 mt-3">ACTIVE</div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-md bg-[#252525] flex items-center justify-center overflow-hidden mr-3 text-lg">
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-white">{tool.name}</h3>
                        </div>
                        <p className="text-sm text-[#94A3B8] mb-4">{tool.description}</p>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <div className="px-2 py-1 text-xs rounded-full bg-[#252525] text-[#38BDF8]">
                            Connected
                          </div>
                          <div className="text-xs text-[#94A3B8]">
                            Last used: 2 hours ago
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 border border-[#313131] hover:border-[#6366F1] text-sm rounded-md transition-colors flex-1 flex items-center justify-center gap-1">
                            <Settings size={12} />
                            <span>Configure</span>
                          </button>
                          <button 
                            onClick={() => disconnectTool(tool.id)}
                            className="px-3 py-1.5 bg-[#252525] hover:bg-[#202020] text-sm rounded-md transition-colors flex items-center justify-center gap-1 w-9 group-hover:text-[#EF4444]"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Available tools */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <span className="text-[#94A3B8] text-xl">•</span>
                <span>Available Tools</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockTools.filter(t => !t.connected).map(tool => (
                  <div 
                    key={tool.id}
                    className="bg-[#343131] border border-[#313131] hover:border-[#444] rounded-md p-5 transition-all"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-md bg-[#252525] flex items-center justify-center overflow-hidden mr-3 text-lg">
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-white">{tool.name}</h3>
                        </div>
                        <p className="text-sm text-[#94A3B8] mb-4">{tool.description}</p>
                        
                        <div className="space-y-1 mb-4">
                          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            <span>Easy setup</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            <span>Works with all agents</span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => connectTool(tool.id)}
                          className="w-full px-3 py-1.5 bg-[#6366F1] hover:bg-[#5254CC] text-white text-sm rounded-md transition-colors"
                        >
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="bg-[#343131] border border-dashed border-[#313131] rounded-md p-5 hover:border-[#6366F1] transition-colors flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center mb-3">
                    <PlusCircle size={20} className="text-[#6366F1]" />
                  </div>
                  <h3 className="font-medium mb-1">Custom Integration</h3>
                  <p className="text-sm text-[#94A3B8] mb-3">Connect a custom API endpoint</p>
                  <button className="px-4 py-1.5 border border-[#313131] hover:border-[#6366F1] text-sm rounded-md transition-colors">
                    Create Integration
                  </button>
                </div>
              </div>
            </div>
            
            {/* Advanced settings */}
            <div className="mt-8 bg-[#343131] border border-[#313131] rounded-md p-5">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Settings size={16} className="text-[#6366F1]" />
                <span>Advanced Settings</span>
              </h3>
              <p className="text-sm text-[#94A3B8] mb-4">Configure advanced options for tool integrations.</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-[#252525]">
                  <div>
                    <h4 className="text-sm font-medium">Tool Usage Logging</h4>
                    <p className="text-xs text-[#94A3B8] mt-1">Log all tool usage for auditing</p>
                  </div>
                  <div 
                    className="relative inline-block w-10 h-5 rounded-md bg-[#252525] cursor-pointer"
                  >
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={true}
                    />
                    <span className="block h-5 w-5 rounded-md bg-[#6366F1] absolute left-0 transition-transform transform translate-x-5"></span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-[#252525]">
                  <div>
                    <h4 className="text-sm font-medium">Approval for External Actions</h4>
                    <p className="text-xs text-[#94A3B8] mt-1">Require approval before taking external actions</p>
                  </div>
                  <div 
                    className="relative inline-block w-10 h-5 rounded-md bg-[#252525] cursor-pointer"
                  >
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={true}
                    />
                    <span className="block h-5 w-5 rounded-md bg-[#6366F1] absolute left-0 transition-transform transform translate-x-5"></span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-[#252525]">
                  <div>
                    <h4 className="text-sm font-medium">Sandbox Mode</h4>
                    <p className="text-xs text-[#94A3B8] mt-1">Run tools in isolated environment</p>
                  </div>
                  <div 
                    className="relative inline-block w-10 h-5 rounded-md bg-[#252525] cursor-pointer"
                  >
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={false}
                    />
                    <span className="block h-5 w-5 rounded-md bg-[#313131] absolute left-0 transition-transform transform translate-x-0"></span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="text-sm font-medium">Rate Limiting</h4>
                    <p className="text-xs text-[#94A3B8] mt-1">Maximum API calls per minute</p>
                  </div>
                  <select className="bg-[#252525] border border-[#313131] rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-[#6366F1]">
                    <option>10 calls/min</option>
                    <option>30 calls/min</option>
                    <option>60 calls/min</option>
                    <option>Unlimited</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="bg-[#252525] rounded-xl border border-[#313131] p-6">
            <h2 className="text-xl font-medium mb-6">Work Reports</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#343131] border border-[#313131] rounded-md p-4 hover:border-[#444] transition-all">
                  <h3 className="text-sm text-[#94A3B8]">Tasks Completed</h3>
                  <div className="text-2xl font-bold mt-2">24</div>
                  <div className="text-xs text-[#38BDF8] mt-1 flex items-center gap-1">
                    <span>↑</span> 12% from last week
                  </div>
                </div>
                <div className="bg-[#343131] border border-[#313131] rounded-md p-4 hover:border-[#444] transition-all">
                  <h3 className="text-sm text-[#94A3B8]">Tasks In Progress</h3>
                  <div className="text-2xl font-bold mt-2">8</div>
                  <div className="text-xs text-[#94A3B8] mt-1">3 due today</div>
                </div>
                <div className="bg-[#343131] border border-[#313131] rounded-md p-4 hover:border-[#444] transition-all">
                  <h3 className="text-sm text-[#94A3B8]">Agent Activity</h3>
                  <div className="text-2xl font-bold mt-2">86%</div>
                  <div className="text-xs text-[#38BDF8] mt-1 flex items-center gap-1">
                    <span>↑</span> 5% from last week
                  </div>
                </div>
              </div>
              
              <div className="bg-[#343131] border border-[#313131] rounded-md p-5 hover:border-[#444] transition-all">
                <h3 className="font-medium mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {mockActivities.map(activity => (
                    <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-[#313131] last:border-0 last:pb-0">
                      <div className="w-9 h-9 rounded-full bg-[#252525] flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img 
                          src={activity.agentAvatar} 
                          alt={activity.agentName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white">{activity.description}</div>
                        <div className="text-xs text-[#94A3B8] mt-1">
                          <span className="font-medium">{activity.agentName}</span> • {formatTime(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-[#252525] rounded-xl border border-[#313131] p-6">
            <h2 className="text-xl font-medium mb-6">Project Settings</h2>
            <div className="space-y-6">
              <div className="bg-[#343131] border border-[#313131] rounded-md p-5 hover:border-[#444] transition-all">
                <h3 className="font-medium mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-[#94A3B8]">Project Name</label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#252525] border border-[#313131] rounded-md focus:outline-none focus:border-[#6366F1]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-[#94A3B8]">Project Description</label>
                    <textarea
                      rows={3}
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-[#252525] border border-[#313131] rounded-md focus:outline-none focus:border-[#6366F1]"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-[#343131] border border-[#313131] rounded-md p-5 hover:border-[#444] transition-all">
                <h3 className="font-medium mb-4">Notification Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-[#94A3B8]">Email Notifications</label>
                    <div 
                      className="relative inline-block w-10 h-5 rounded-md bg-[#252525] cursor-pointer"
                      onClick={() => setEmailNotifications(!emailNotifications)}
                    >
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={emailNotifications}
                        onChange={() => setEmailNotifications(!emailNotifications)}
                      />
                      <span className={`block h-5 w-5 rounded-md ${emailNotifications ? 'bg-[#6366F1]' : 'bg-[#313131]'} absolute left-0 transition-transform transform ${emailNotifications ? 'translate-x-5' : 'translate-x-0'}`}></span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-[#94A3B8]">Daily Summary</label>
                    <div 
                      className="relative inline-block w-10 h-5 rounded-md bg-[#252525] cursor-pointer"
                      onClick={() => setDailySummary(!dailySummary)}
                    >
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={dailySummary}
                        onChange={() => setDailySummary(!dailySummary)}
                      />
                      <span className={`block h-5 w-5 rounded-md ${dailySummary ? 'bg-[#6366F1]' : 'bg-[#313131]'} absolute left-0 transition-transform transform ${dailySummary ? 'translate-x-5' : 'translate-x-0'}`}></span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-[#94A3B8]">Agent Activity Alerts</label>
                    <div 
                      className="relative inline-block w-10 h-5 rounded-md bg-[#252525] cursor-pointer"
                      onClick={() => setActivityAlerts(!activityAlerts)}
                    >
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={activityAlerts}
                        onChange={() => setActivityAlerts(!activityAlerts)}
                      />
                      <span className={`block h-5 w-5 rounded-md ${activityAlerts ? 'bg-[#6366F1]' : 'bg-[#313131]'} absolute left-0 transition-transform transform ${activityAlerts ? 'translate-x-5' : 'translate-x-0'}`}></span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <button className="px-4 py-2 border border-[#313131] hover:border-[#6366F1] rounded-md transition-colors">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-[#6366F1] hover:bg-[#5254CC] text-white rounded-md transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Helper to format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Toggle agent information panel
  const toggleAgentInfo = (agentId: string) => {
    if (showAgentInfo === agentId) {
      setShowAgentInfo(null);
    } else {
      setShowAgentInfo(agentId);
    }
  };
  
  // Add this function along with other functions 
  const saveTeamSettings = async () => {
    if (!projectId || projectId === 'unknown') return;
    
    try {
      // Create the settings object with all team behavior settings
      const teamSettings = {
        autonomousCommunication,
        knowledgeSharing,
        ceoApprovalMode
      };
      
      // Call the ProjectService to update project
      const success = await ProjectService.updateProject(projectId, {
        // Save the team settings in the project data
        // This will be stored in the database as JSON
        teamSettings
      });
      
      if (success) {
        // You can show a success notification here if needed
        console.log('Team settings saved successfully');
      } else {
        console.error('Failed to save team settings');
      }
    } catch (error) {
      console.error('Error saving team settings:', error);
    }
  };
  
  // Add this function to handle adding an agent to the team
  const addAgentToTeam = async (agentId: string) => {
    if (!projectId || projectId === 'unknown') return;
    
    try {
      // Make sure we don't add duplicate agents
      if (activeAgents.includes(agentId)) {
        console.log('Agent already in team');
        return;
      }
      
      // Add the agent to the active agents list
      const newActiveAgents = [...activeAgents, agentId];
      setActiveAgents(newActiveAgents);
      
      // Save to the database
      const success = await ProjectService.updateProject(projectId, {
        agents: newActiveAgents
      });
      
      if (!success) {
        // Revert the state change if the save fails
        setActiveAgents(activeAgents);
        console.error('Failed to add agent to team');
      }
    } catch (error) {
      console.error('Error adding agent to team:', error);
    }
  };
  
  // Add this function to handle removing an agent from the team
  const removeAgentFromTeam = async (agentId: string) => {
    if (!projectId || projectId === 'unknown') return;
    
    try {
      // Remove the agent from the active agents list
      const newActiveAgents = activeAgents.filter(id => id !== agentId);
      setActiveAgents(newActiveAgents);
      
      // Save to the database
      const success = await ProjectService.updateProject(projectId, {
        agents: newActiveAgents
      });
      
      if (!success) {
        // Revert the state change if the save fails
        setActiveAgents(activeAgents);
        console.error('Failed to remove agent from team');
      }
    } catch (error) {
      console.error('Error removing agent from team:', error);
    }
  };
  
  // Function to connect a tool
  const connectTool = async (toolId: string) => {
    if (!projectId || projectId === 'unknown') return;
    
    try {
      // Find the tool details
      const tool = mockTools.find(t => t.id === toolId);
      if (!tool) return;
      
      // Add to connected tools state
      const newConnectedTools = [...connectedTools, toolId];
      setConnectedTools(newConnectedTools);
      
      // Update the tool in mock data (this would be removed in a real implementation)
      const toolIndex = mockTools.findIndex(t => t.id === toolId);
      if (toolIndex !== -1) {
        mockTools[toolIndex].connected = true;
      }
      
      // Get current project integrations
      const currentIntegrations = project?.integrations || { connected: false, services: [] };
      
      // Create updated integrations object
      const updatedIntegrations = {
        connected: true,
        services: [
          ...currentIntegrations.services,
          {
            id: tool.id,
            name: tool.name,
            description: tool.description,
            connectedAt: new Date().toISOString()
          }
        ]
      };
      
      // Save to database
      const success = await ProjectService.updateProjectIntegrations(projectId, updatedIntegrations);
      
      if (!success) {
        // Revert state changes on failure
        setConnectedTools(connectedTools);
        console.error('Failed to connect tool');
      }
    } catch (error) {
      console.error('Error connecting tool:', error);
    }
  };
  
  // Function to disconnect a tool
  const disconnectTool = async (toolId: string) => {
    if (!projectId || projectId === 'unknown') return;
    
    try {
      // Remove from connected tools state
      const newConnectedTools = connectedTools.filter(id => id !== toolId);
      setConnectedTools(newConnectedTools);
      
      // Update the tool in mock data (this would be removed in a real implementation)
      const toolIndex = mockTools.findIndex(t => t.id === toolId);
      if (toolIndex !== -1) {
        mockTools[toolIndex].connected = false;
      }
      
      // Get current project integrations
      const currentIntegrations = project?.integrations || { connected: false, services: [] };
      
      // Create updated integrations object
      const updatedIntegrations = {
        connected: newConnectedTools.length > 0,
        services: currentIntegrations.services.filter(service => service.id !== toolId)
      };
      
      // Save to database
      const success = await ProjectService.updateProjectIntegrations(projectId, updatedIntegrations);
      
      if (!success) {
        // Revert state changes on failure
        setConnectedTools(connectedTools);
        console.error('Failed to disconnect tool');
      }
    } catch (error) {
      console.error('Error disconnecting tool:', error);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-[#151515] text-white">
      {/* Sidebar */}
      <div 
        className={`fixed h-full border-r border-[#313131] bg-[#1B1A19] flex flex-col overflow-hidden ${sidebarCollapsed ? 'w-[60px]' : 'w-[280px]'}`}
        style={{ transition: 'width 200ms cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        <div className="h-16 flex items-center justify-center border-b border-[#313131]">
          {sidebarCollapsed ? (
            <Logo size="sm" />
          ) : (
            <Logo size="md" />
          )}
        </div>
        
        <div className="flex-1 pt-6 pb-5 flex flex-col overflow-hidden">
          <div className={`px-4 mb-8 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
            {sidebarCollapsed ? (
              <button 
                className="w-8 h-8 flex items-center justify-center bg-[#6366F1] hover:bg-[#5254CC] rounded-md transition-colors"
                title="Back to Projects"
                onClick={() => window.history.back()}
              >
                <Folder size={16} />
              </button>
            ) : (
              <button 
                onClick={() => window.history.back()}
                className="w-full flex items-center justify-center px-4 py-3 bg-[#6366F1] hover:bg-[#5254CC] rounded-lg transition-colors text-sm font-medium"
              >
                Back to Projects
              </button>
            )}
          </div>
          
          <div className="mb-auto overflow-hidden">
            <div className={`py-2 flex items-center justify-between mb-2 ${sidebarCollapsed ? 'px-0 justify-center' : 'px-5'}`}>
              {!sidebarCollapsed && (
                <h3 className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">Navigation</h3>
              )}
            </div>
            
            <div className={`space-y-1.5 mt-1 ${sidebarCollapsed ? 'px-2' : 'px-3'} overflow-y-auto overflow-x-hidden`}>
              <button 
                onClick={() => setActiveTab('communication')}
                className={`flex items-center rounded-md transition-colors text-sm group ${
                  sidebarCollapsed 
                    ? 'w-10 h-10 justify-center px-0 py-0' 
                    : 'w-full px-3 py-2.5'
                } ${activeTab === 'communication' ? 'bg-[#252525] text-white' : 'text-[#E6E8EB] hover:bg-[#252525]'}`}
              >
                <div className={`w-6 h-6 bg-[#252525] rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-[#313131] ${sidebarCollapsed ? '' : 'mr-3'}`}>
                  <MessageSquare size={14} className="text-[#94A3B8]" />
                </div>
                <span className={`truncate transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Communication</span>
              </button>
                            
              <button 
                onClick={() => setActiveTab('agents')}
                className={`flex items-center rounded-md transition-colors text-sm group ${
                  sidebarCollapsed 
                    ? 'w-10 h-10 justify-center px-0 py-0' 
                    : 'w-full px-3 py-2.5'
                } ${activeTab === 'agents' ? 'bg-[#252525] text-white' : 'text-[#E6E8EB] hover:bg-[#252525]'}`}
              >
                <div className={`w-6 h-6 bg-[#252525] rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-[#313131] ${sidebarCollapsed ? '' : 'mr-3'}`}>
                  <Users size={14} className="text-[#94A3B8]" />
                </div>
                <span className={`truncate transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Team Members</span>
              </button>
                            
              <button 
                onClick={() => setActiveTab('tools')}
                className={`flex items-center rounded-md transition-colors text-sm group ${
                  sidebarCollapsed 
                    ? 'w-10 h-10 justify-center px-0 py-0' 
                    : 'w-full px-3 py-2.5'
                } ${activeTab === 'tools' ? 'bg-[#252525] text-white' : 'text-[#E6E8EB] hover:bg-[#252525]'}`}
              >
                <div className={`w-6 h-6 bg-[#252525] rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-[#313131] ${sidebarCollapsed ? '' : 'mr-3'}`}>
                  <Wrench size={14} className="text-[#94A3B8]" />
                </div>
                <span className={`truncate transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Tools & Integration</span>
              </button>
                            
              <button 
                onClick={() => setActiveTab('reports')}
                className={`flex items-center rounded-md transition-colors text-sm group ${
                  sidebarCollapsed 
                    ? 'w-10 h-10 justify-center px-0 py-0' 
                    : 'w-full px-3 py-2.5'
                } ${activeTab === 'reports' ? 'bg-[#252525] text-white' : 'text-[#E6E8EB] hover:bg-[#252525]'}`}
              >
                <div className={`w-6 h-6 bg-[#252525] rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-[#313131] ${sidebarCollapsed ? '' : 'mr-3'}`}>
                  <LineChart size={14} className="text-[#94A3B8]" />
                </div>
                <span className={`truncate transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Reports</span>
              </button>
                            
              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex items-center rounded-md transition-colors text-sm group ${
                  sidebarCollapsed 
                    ? 'w-10 h-10 justify-center px-0 py-0' 
                    : 'w-full px-3 py-2.5'
                } ${activeTab === 'settings' ? 'bg-[#252525] text-white' : 'text-[#E6E8EB] hover:bg-[#252525]'}`}
              >
                <div className={`w-6 h-6 bg-[#252525] rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-[#313131] ${sidebarCollapsed ? '' : 'mr-3'}`}>
                  <Settings size={14} className="text-[#94A3B8]" />
                </div>
                <span className={`truncate transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Settings</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Toggle button at the bottom above user profile */}
        <div className="border-t border-[#313131]">
        <div className="py-3 px-3 flex justify-center items-center border-b border-[#313131]">

          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
            className="w-9 h-9  rounded-full flex items-center justify-center text-[#94A3B8] hover:text-white transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        </div>
        <div className={`py-3 ${sidebarCollapsed ? 'px-1 flex justify-center' : 'px-3'}`}>
          <div className="relative">
            <div className={`rounded-lg hover:bg-[#202020] transition-colors p-2 cursor-pointer`}>
              {sidebarCollapsed ? (
                <div className="flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-[#6366F1] text-white flex items-center justify-center">
                    <span className="text-sm font-medium">KB</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-[#6366F1] text-white flex items-center justify-center mr-3">
                      <span className="text-sm font-medium">KB</span>
                    </div>
                    <div className="flex-col flex">
                      <span className="text-sm font-medium text-white leading-tight">Kendall Booker</span>
                      <span className="text-xs text-[#94A3B8] leading-tight mt-[2px]">Professional plan</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div 
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ 
          marginLeft: sidebarCollapsed ? '60px' : '280px',
          transition: 'margin-left 200ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Header */}
        <div className="h-16 border-b border-[#313131] flex items-center px-6 bg-[#202020]">
          <h1 className="text-lg font-medium flex items-center gap-2">
            <span className="text-[#6366F1]">{projectName}</span>
            {activeTab === 'communication' && <span className="text-[#94A3B8]">• Team Communication</span>}
            {activeTab === 'agents' && <span className="text-[#94A3B8]">• Team Members</span>}
            {activeTab === 'tools' && <span className="text-[#94A3B8]">• Tools & Integration</span>}
            {activeTab === 'reports' && <span className="text-[#94A3B8]">• Reports</span>}
            {activeTab === 'settings' && <span className="text-[#94A3B8]">• Settings</span>}
          </h1>
        </div>
        
        <div className="flex-1 overflow-auto bg-[#202020]">
          <div className="max-w-6xl mx-auto p-6 h-full">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

// Types for activity feed
interface Activity {
  id: string;
  agentName: string;
  agentAvatar: string;
  description: string;
  timestamp: string;
}

// Mock Data
const mockMessages: Message[] = [
  {
    id: 'msg-1',
    sender: {
      id: 'user',
      name: 'You',
      role: 'CEO',
      avatar: '/roleheadshots/kenard.png'
    },
    content: 'I need to prepare a marketing campaign for our new product launch next month. Let\'s brainstorm some ideas.',
    timestamp: '2023-06-15T09:30:00Z',
    status: 'read'
  },
  {
    id: 'msg-2',
    sender: {
      id: 'marketing',
      name: 'Marketing Officer',
      role: 'Marketing',
      avatar: '/roleheadshots/chloe.png'
    },
    content: 'I can help with that! Let me gather some data about the target audience and competitive landscape. What\'s the primary value proposition for this new product?',
    timestamp: '2023-06-15T09:32:00Z',
    status: 'read'
  },
  {
    id: 'msg-3',
    sender: {
      id: 'user',
      name: 'You',
      role: 'CEO',
      avatar: '/roleheadshots/kenard.png'
    },
    content: 'It\'s a productivity tool that helps remote teams collaborate more effectively. The main selling points are real-time collaboration, AI-powered suggestions, and seamless integration with existing tools.',
    timestamp: '2023-06-15T09:35:00Z',
    status: 'read'
  },
  {
    id: 'msg-4',
    sender: {
      id: 'marketing',
      name: 'Marketing Officer',
      role: 'Marketing',
      avatar: '/roleheadshots/chloe.png'
    },
    content: 'Great! Based on those features, I think we should target remote-first companies and focus on how our product solves common pain points in distributed team collaboration.\n\nI recommend a multi-channel approach with content marketing, targeted social media ads, and possibly a webinar showcasing the real-time collaboration aspects.',
    timestamp: '2023-06-15T09:40:00Z',
    status: 'read'
  },
  {
    id: 'msg-5',
    sender: {
      id: 'product',
      name: 'Product Manager',
      role: 'Product',
      avatar: '/roleheadshots/mark.png'
    },
    content: 'I\'ve been analyzing user research data, and the biggest pain points for remote teams are communication delays and context switching between multiple tools. We should emphasize how our product addresses these specific issues.',
    timestamp: '2023-06-15T09:42:00Z',
    status: 'read'
  },
  {
    id: 'msg-6',
    sender: {
      id: 'user',
      name: 'You',
      role: 'CEO',
      avatar: '/roleheadshots/kenard.png'
    },
    content: 'These are great insights. Let\'s focus on creating a compelling story around solving these pain points. Can you draft an initial campaign strategy with timeline and budget?',
    timestamp: '2023-06-15T09:45:00Z',
    status: 'read'
  }
];

const mockAgents = [
  {
    id: 'marketing',
    name: 'Marketing Officer',
    role: 'Marketing Specialist',
    avatar: '/roleheadshots/chloe.png',
    status: 'active'
  },
  {
    id: 'product',
    name: 'Product Manager',
    role: 'Product Strategy',
    avatar: '/roleheadshots/mark.png',
    status: 'active'
  },
  {
    id: 'developer',
    name: 'Developer',
    role: 'Full-stack Engineer',
    avatar: '/roleheadshots/alex.png',
    status: 'idle'
  },
  {
    id: 'sales',
    name: 'Sales Representative',
    role: 'Sales & Business Development',
    avatar: '/roleheadshots/hannah.png',
    status: 'active'
  }
];

const mockTools = [
  {
    id: 'tool-1',
    name: 'Google Sheets',
    icon: '📊',
    description: 'Access and analyze spreadsheet data',
    connected: true
  },
  {
    id: 'tool-2',
    name: 'Gmail',
    icon: '📧',
    description: 'Send and receive emails',
    connected: true
  },
  {
    id: 'tool-3',
    name: 'GitHub',
    icon: '📂',
    description: 'Access code repositories',
    connected: false
  },
  {
    id: 'tool-4',
    name: 'Slack',
    icon: '💬',
    description: 'Team communication',
    connected: false
  },
  {
    id: 'tool-5',
    name: 'HubSpot',
    icon: '🔄',
    description: 'CRM and marketing automation',
    connected: false
  },
  {
    id: 'tool-6',
    name: 'SQL Database',
    icon: '🗄️',
    description: 'Access company database',
    connected: true
  }
];

const mockActivities = [
  {
    id: 'activity-1',
    agentName: 'Marketing Officer',
    agentAvatar: '/roleheadshots/chloe.png',
    description: 'Completed market research for new product campaign',
    timestamp: '2023-06-15T14:30:00Z'
  },
  {
    id: 'activity-2',
    agentName: 'Developer',
    agentAvatar: '/roleheadshots/alex.png',
    description: 'Created API integration with marketing analytics platform',
    timestamp: '2023-06-15T13:15:00Z'
  },
  {
    id: 'activity-3',
    agentName: 'Product Manager',
    agentAvatar: '/roleheadshots/mark.png',
    description: 'Updated product roadmap with new feature prioritization',
    timestamp: '2023-06-15T11:45:00Z'
  },
  {
    id: 'activity-4',
    agentName: 'Sales Representative',
    agentAvatar: '/roleheadshots/hannah.png',
    description: 'Generated list of 50 qualified leads for new product',
    timestamp: '2023-06-15T10:20:00Z'
  }
]; 