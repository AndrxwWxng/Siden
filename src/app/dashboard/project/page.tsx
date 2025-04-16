'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  MessageSquare, Users, Wrench, LineChart, 
  Settings, PlusCircle, Send, Paperclip,
  MoreHorizontal, Search, ChevronLeft, ChevronRight,
  Folder
} from 'lucide-react';
import Logo from '@/components/Logo';
import { AgentFactory } from '@/agents/agentFactory';

// Tab interfaces
type TabType = 'communication' | 'agents' | 'tools' | 'reports' | 'settings';

export default function ProjectDetail() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id') || 'unknown';
  
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
    const respondingAgent = determineRespondingAgent(newMessage);
    console.log('Selected agent:', respondingAgent); // Debug log
    
    // Show typing indicator
    setTypingAgent(respondingAgent);
    
    try {
      const agent = await AgentFactory.getAgent(respondingAgent);
      if (!agent) {
        throw new Error(`Failed to initialize ${respondingAgent} agent`);
      }

      const response = await agent.generateResponse(newMessage);
      if (!response) {
        throw new Error(`No response from ${respondingAgent} agent`);
      }

      const agentProfile = agent.getProfile();
      const agentResponse: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: {
          id: respondingAgent,
          name: agentProfile.name,
          role: agentProfile.role,
          avatar: agentProfile.avatar
        },
        content: response,
        timestamp: new Date().toISOString(),
        status: 'sent'
      };
      
      setTypingAgent(null);
      setMessages(prev => [...prev, agentResponse]);
      
      // Sometimes have another agent chime in
      if (Math.random() > 0.6) {
        const secondaryAgent = activeAgents.find(a => a !== respondingAgent) || 'product';
        
        setTypingAgent(secondaryAgent);
        const secondAgent = await AgentFactory.getAgent(secondaryAgent);
        if (!secondAgent) {
          throw new Error(`Failed to initialize ${secondaryAgent} agent`);
        }

        const followUpResponse = await secondAgent.generateResponse(newMessage);
        if (!followUpResponse) {
          throw new Error(`No response from ${secondaryAgent} agent`);
        }

        const secondAgentProfile = secondAgent.getProfile();
        const followUpMessage: Message = {
          id: `msg-${Date.now() + 2}`,
          sender: {
            id: secondaryAgent,
            name: secondAgentProfile.name,
            role: secondAgentProfile.role,
            avatar: secondAgentProfile.avatar
          },
          content: followUpResponse,
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
  
  // Helper function to generate agent avatar
  const getAgentAvatar = (agentId: string): string => {
    switch (agentId) {
      case 'marketing':
        return '/roleheadshots/chloe.png';
      case 'product':
        return '/roleheadshots/mark.png';
      case 'developer':
        return '/roleheadshots/alex.png';
      case 'sales':
        return '/roleheadshots/hannah.png';
      default:
        return '/roleheadshots/kenard.png';
    }
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
            <h2 className="text-xl font-medium mb-6">Manage Your Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockAgents.map(agent => (
                <div key={agent.id} className="bg-[#343131] border border-[#313131] rounded-md p-5 hover:border-[#444] transition-all">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#252525] flex items-center justify-center overflow-hidden mr-4">
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
                      <p className="text-sm text-[#94A3B8] mb-4">{agent.role}</p>
                      
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-[#252525] hover:bg-[#333] text-sm rounded-md transition-colors flex-1">
                          Configure
                        </button>
                        <button className="px-3 py-1.5 border border-[#313131] hover:border-[#6366F1] text-sm rounded-md transition-colors flex-1">
                          Manage Access
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="bg-[#343131] border border-dashed border-[#313131] rounded-md p-5 flex items-center justify-center hover:border-[#6366F1] transition-colors">
                <button className="flex items-center gap-2 text-[#94A3B8] hover:text-[#6366F1] transition-colors">
                  <PlusCircle size={18} />
                  <span>Add New Agent</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 'tools':
        return (
          <div className="bg-[#252525] rounded-xl border border-[#313131] p-6">
            <h2 className="text-xl font-medium mb-6">Tool Integration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTools.map(tool => (
                <div 
                  key={tool.id}
                  className={`bg-[#343131] border ${
                    tool.connected 
                      ? 'border-[#38BDF8]/30' 
                      : 'border-[#313131] hover:border-[#444]'
                  } rounded-md p-5 transition-all`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center overflow-hidden mr-3">
                      <img 
                        src={tool.icon} 
                        alt={tool.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white">{tool.name}</h3>
                        {tool.connected && (
                          <span className="text-xs bg-[#1E293B] text-[#38BDF8] px-2 py-0.5 rounded-md border border-[#38BDF8]/30">
                            Connected
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#94A3B8] mb-4">{tool.description}</p>
                      
                      <div>
                        {tool.connected ? (
                          <button className="w-full px-3 py-1.5 border border-[#313131] hover:border-[#6366F1] text-sm rounded-md transition-colors">
                            Configure
                          </button>
                        ) : (
                          <button className="w-full px-3 py-1.5 bg-[#6366F1] hover:bg-[#5254CC] text-white text-sm rounded-md transition-colors">
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

// Types
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
  status: 'sent' | 'delivered' | 'read';
}

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