'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  MessageSquare, Users, Wrench, LineChart, 
  Settings, PlusCircle, Send, Paperclip,
  MoreHorizontal, ArrowLeft, Search
} from 'lucide-react';
import Logo from '@/components/Logo';

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
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: {
        id: 'user',
        name: 'You',
        role: 'CEO',
        avatar: '👨‍💼'
      },
      content: newMessage,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    // Determine which agent should respond based on message content
    let respondingAgent = determineRespondingAgent(newMessage);
    
    // Show typing indicator
    setTypingAgent(respondingAgent);
    
    // Simulate agent response after a delay
    setTimeout(() => {
      const agentResponse: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: mockAgents.find(a => a.id === respondingAgent) 
          ? {
              id: respondingAgent,
              name: mockAgents.find(a => a.id === respondingAgent)?.name || 'Agent',
              role: mockAgents.find(a => a.id === respondingAgent)?.role || 'Assistant',
              avatar: mockAgents.find(a => a.id === respondingAgent)?.avatar || '🤖'
            }
          : {
              id: 'marketing',
              name: 'Marketing Officer',
              role: 'Marketing',
              avatar: '📊'
            },
        content: generateAgentResponse(newMessage, respondingAgent),
        timestamp: new Date().toISOString(),
        status: 'sent'
      };
      
      setTypingAgent(null);
      setMessages(prev => [...prev, agentResponse]);
      
      // Sometimes have another agent chime in
      if (Math.random() > 0.6) {
        const secondaryAgent = activeAgents.find(a => a !== respondingAgent) || 'product';
        
        setTimeout(() => {
          setTypingAgent(secondaryAgent);
          
          setTimeout(() => {
            const followUpResponse: Message = {
              id: `msg-${Date.now() + 2}`,
              sender: {
                id: secondaryAgent,
                name: mockAgents.find(a => a.id === `agent-${secondaryAgent.substring(0, 1)}`)?.name || 'Agent',
                role: mockAgents.find(a => a.id === `agent-${secondaryAgent.substring(0, 1)}`)?.role || 'Assistant',
                avatar: getAgentAvatar(secondaryAgent)
              },
              content: generateFollowUpResponse(newMessage, secondaryAgent),
              timestamp: new Date().toISOString(),
              status: 'sent'
            };
            
            setTypingAgent(null);
            setMessages(prev => [...prev, followUpResponse]);
          }, 2000 + Math.random() * 2000);
        }, 1000 + Math.random() * 2000);
      }
    }, 1500 + Math.random() * 1000);
  };
  
  // Helper function to determine which agent should respond
  const determineRespondingAgent = (message: string): string => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('market') || lowerMsg.includes('campaign') || lowerMsg.includes('audience')) {
      return 'agent-1'; // Marketing
    } else if (lowerMsg.includes('product') || lowerMsg.includes('feature') || lowerMsg.includes('roadmap')) {
      return 'agent-2'; // Product
    } else if (lowerMsg.includes('code') || lowerMsg.includes('develop') || lowerMsg.includes('bug')) {
      return 'agent-3'; // Developer
    } else if (lowerMsg.includes('sales') || lowerMsg.includes('client') || lowerMsg.includes('lead')) {
      return 'agent-4'; // Sales
    } else {
      // Default to marketing or random between active agents
      return `agent-${Math.ceil(Math.random() * 4)}`;
    }
  };
  
  // Helper function to generate agent avatar
  const getAgentAvatar = (agentId: string): string => {
    switch (agentId) {
      case 'agent-1':
      case 'marketing':
        return '📊';
      case 'agent-2':
      case 'product':
        return '🔍';
      case 'agent-3':
      case 'developer':
        return '👩‍💻';
      case 'agent-4':
      case 'sales':
        return '📈';
      default:
        return '🤖';
    }
  };
  
  // Helper function to generate agent response based on message
  const generateAgentResponse = (message: string, agentId: string): string => {
    const lowerMsg = message.toLowerCase();
    
    if (agentId === 'agent-1') { // Marketing
      if (lowerMsg.includes('campaign')) {
        return "I've analyzed recent campaign performance and recommend focusing on social media and email for the next product launch. Our engagement metrics show a 32% higher conversion rate when we combine these channels with targeted content.";
      } else if (lowerMsg.includes('audience')) {
        return "Based on our market research, our primary audience is tech-forward professionals aged 25-45. They're primarily concerned with efficiency and collaboration features. Shall I prepare a detailed audience segmentation report?";
      } else {
        return "That's a great marketing consideration. I'll create a strategy document outlining key messages, channels, and metrics for this initiative. Would you like me to prioritize any specific aspect?";
      }
    } else if (agentId === 'agent-2') { // Product
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
    if (agentId === 'agent-1' || agentId === 'marketing') {
      return "I'd like to add a marketing perspective here. We could leverage this opportunity for content creation and thought leadership, which would support both our brand positioning and lead generation efforts.";
    } else if (agentId === 'agent-2' || agentId === 'product') {
      return "Building on that point, our product analytics show that users who engage with these features have 40% higher retention. We should highlight this in our messaging and product development priorities.";
    } else if (agentId === 'agent-3' || agentId === 'developer') {
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
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-[#2e2e2e]">
              <div className="flex items-center">
                <h2 className="text-lg font-medium">Team Communication</h2>
                <div className="flex items-center ml-4">
                  <span className="text-xs text-[#A3A3A3] mr-2">Active:</span>
                  <div className="flex -space-x-2">
                    {activeAgents.map(agent => (
                      <div 
                        key={agent}
                        className="w-6 h-6 rounded-full bg-[#252525] flex items-center justify-center border border-[#121212] cursor-pointer"
                        onClick={() => toggleAgentInfo(agent)}
                      >
                        <span>{getAgentAvatar(agent)}</span>
                      </div>
                    ))}
                    <div className="w-6 h-6 rounded-full bg-[#252525] flex items-center justify-center border border-[#121212]">
                      <span>👨‍💼</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-[#A3A3A3] hover:text-white rounded-md hover:bg-[#252525] transition-colors">
                  <Search size={18} />
                </button>
                <button className="p-2 text-[#A3A3A3] hover:text-white rounded-md hover:bg-[#252525] transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>
            
            {/* Agent info panel */}
            {showAgentInfo && (
              <div className="p-4 border-b border-[#2e2e2e] bg-[#1a1a1a]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center text-xl">
                    {getAgentAvatar(showAgentInfo)}
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {showAgentInfo === 'agent-1' || showAgentInfo === 'marketing' ? 'Marketing Officer' : 
                       showAgentInfo === 'agent-2' || showAgentInfo === 'product' ? 'Product Manager' :
                       showAgentInfo === 'agent-3' || showAgentInfo === 'developer' ? 'Developer' : 'Sales Representative'}
                    </h3>
                    <p className="text-sm text-[#A3A3A3] mb-2">
                      {showAgentInfo === 'agent-1' || showAgentInfo === 'marketing' ? 'Specialized in marketing strategy and campaign optimization' : 
                       showAgentInfo === 'agent-2' || showAgentInfo === 'product' ? 'Focused on product strategy and user experience' :
                       showAgentInfo === 'agent-3' || showAgentInfo === 'developer' ? 'Expert in full-stack development and system architecture' : 'Skilled in sales strategy and client relationships'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-[#252525] text-[#A3A3A3]">
                        {showAgentInfo === 'agent-1' || showAgentInfo === 'marketing' ? 'Analytics' : 
                         showAgentInfo === 'agent-2' || showAgentInfo === 'product' ? 'User Research' :
                         showAgentInfo === 'agent-3' || showAgentInfo === 'developer' ? 'JavaScript' : 'Lead Generation'}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-[#252525] text-[#A3A3A3]">
                        {showAgentInfo === 'agent-1' || showAgentInfo === 'marketing' ? 'Content Strategy' : 
                         showAgentInfo === 'agent-2' || showAgentInfo === 'product' ? 'Roadmapping' :
                         showAgentInfo === 'agent-3' || showAgentInfo === 'developer' ? 'API Design' : 'Negotiation'}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-[#252525] text-[#A3A3A3]">
                        {showAgentInfo === 'agent-1' || showAgentInfo === 'marketing' ? 'SEO' : 
                         showAgentInfo === 'agent-2' || showAgentInfo === 'product' ? 'A/B Testing' :
                         showAgentInfo === 'agent-3' || showAgentInfo === 'developer' ? 'Database' : 'Relationship Management'}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowAgentInfo(null)}
                    className="ml-auto p-1 text-[#A3A3A3] hover:text-white"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                        flex-shrink-0 w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center cursor-pointer
                        ${message.sender.id !== 'user' ? 'hover:bg-[#333]' : ''}
                      `}
                      onClick={() => message.sender.id !== 'user' ? toggleAgentInfo(message.sender.id) : null}
                    >
                      <span>{message.sender.avatar}</span>
                    </div>
                    <div>
                      <div className={`
                        p-3 rounded-lg
                        ${message.sender.id === 'user' 
                          ? 'bg-[#6366F1] text-white' 
                          : 'bg-[#252525] text-white'}
                      `}>
                        <div className="text-sm">{message.content}</div>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-[#A3A3A3]">
                          {message.sender.name} • {formatTime(message.timestamp)}
                        </span>
                        {message.status === 'sent' && message.sender.id === 'user' && (
                          <span className="text-xs text-[#A3A3A3]">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {typingAgent && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center">
                      <span>{getAgentAvatar(typingAgent)}</span>
                    </div>
                    <div>
                      <div className="p-3 rounded-lg bg-[#252525] text-white">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                        </div>
                      </div>
                      <div className="mt-1">
                        <span className="text-xs text-[#A3A3A3]">
                          {typingAgent === 'agent-1' ? 'Marketing Officer' : 
                           typingAgent === 'agent-2' ? 'Product Manager' :
                           typingAgent === 'agent-3' ? 'Developer' : 
                           typingAgent === 'agent-4' ? 'Sales Representative' : 'Agent'} is typing...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-[#2e2e2e]">
              <div className="flex items-center gap-2">
                <button className="p-2 text-[#A3A3A3] hover:text-[#6366F1] transition-colors">
                  <Paperclip size={18} />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Message your team..."
                  className="flex-1 bg-[#252525] border border-[#2e2e2e] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#6366F1]"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`p-2 rounded-md ${
                    newMessage.trim() 
                      ? 'bg-[#6366F1] text-white hover:bg-[#4F46E5]' 
                      : 'bg-[#252525] text-[#A3A3A3]'
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
          <div className="p-6">
            <h2 className="text-xl font-medium mb-6">Manage Your Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockAgents.map(agent => (
                <div key={agent.id} className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-md p-5 hover:border-[#3e3e3e] transition-all">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-md bg-[#252525] flex items-center justify-center text-2xl mr-4">
                      {agent.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white">{agent.name}</h3>
                        <span className={`
                          px-2 py-0.5 text-xs rounded-md border
                          ${agent.status === 'active' 
                            ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'}
                        `}>
                          {agent.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#A3A3A3] mb-4">{agent.role}</p>
                      
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-[#252525] hover:bg-[#333] text-sm rounded-md transition-colors flex-1">
                          Configure
                        </button>
                        <button className="px-3 py-1.5 border border-[#2e2e2e] hover:border-[#6366F1] text-sm rounded-md transition-colors flex-1">
                          Manage Access
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="bg-[#1a1a1a] border border-dashed border-[#2e2e2e] rounded-md p-5 flex items-center justify-center hover:border-[#6366F1] transition-colors">
                <button className="flex items-center gap-2 text-[#A3A3A3] hover:text-[#6366F1] transition-colors">
                  <PlusCircle size={18} />
                  <span>Add New Agent</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 'tools':
        return (
          <div className="p-6">
            <h2 className="text-xl font-medium mb-6">Tool Integration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTools.map(tool => (
                <div 
                  key={tool.id}
                  className={`bg-[#1a1a1a] border ${
                    tool.connected 
                      ? 'border-green-500/30' 
                      : 'border-[#2e2e2e] hover:border-[#3e3e3e]'
                  } rounded-md p-5 transition-all`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-md bg-[#252525] flex items-center justify-center text-xl mr-3">
                      {tool.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white">{tool.name}</h3>
                        {tool.connected && (
                          <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-md border border-green-500/30">
                            Connected
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#A3A3A3] mb-4">{tool.description}</p>
                      
                      <div>
                        {tool.connected ? (
                          <button className="w-full px-3 py-1.5 border border-[#2e2e2e] hover:border-[#6366F1] text-sm rounded-md transition-colors">
                            Configure
                          </button>
                        ) : (
                          <button className="w-full px-3 py-1.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm rounded-md transition-colors">
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
          <div className="p-6">
            <h2 className="text-xl font-medium mb-6">Work Reports</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-md p-4 hover:border-[#3e3e3e] transition-all">
                  <h3 className="text-sm text-[#A3A3A3]">Tasks Completed</h3>
                  <div className="text-2xl font-bold mt-2">24</div>
                  <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                    <span>↑</span> 12% from last week
                  </div>
                </div>
                <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-md p-4 hover:border-[#3e3e3e] transition-all">
                  <h3 className="text-sm text-[#A3A3A3]">Tasks In Progress</h3>
                  <div className="text-2xl font-bold mt-2">8</div>
                  <div className="text-xs text-[#A3A3A3] mt-1">3 due today</div>
                </div>
                <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-md p-4 hover:border-[#3e3e3e] transition-all">
                  <h3 className="text-sm text-[#A3A3A3]">Agent Activity</h3>
                  <div className="text-2xl font-bold mt-2">86%</div>
                  <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                    <span>↑</span> 5% from last week
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-md p-5 hover:border-[#3e3e3e] transition-all">
                <h3 className="font-medium mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {mockActivities.map(activity => (
                    <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-[#2e2e2e] last:border-0 last:pb-0">
                      <div className="w-9 h-9 rounded-md bg-[#252525] flex items-center justify-center flex-shrink-0 text-lg">
                        {activity.agentAvatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white">{activity.description}</div>
                        <div className="text-xs text-[#A3A3A3] mt-1">
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
          <div className="p-6">
            <h2 className="text-xl font-medium mb-6">Project Settings</h2>
            <div className="space-y-6">
              <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-md p-5 hover:border-[#3e3e3e] transition-all">
                <h3 className="font-medium mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-[#AAAAAA]">Project Name</label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#252525] border border-[#2e2e2e] rounded-md focus:outline-none focus:border-[#6366F1]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-[#AAAAAA]">Project Description</label>
                    <textarea
                      rows={3}
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-[#252525] border border-[#2e2e2e] rounded-md focus:outline-none focus:border-[#6366F1]"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-md p-5 hover:border-[#3e3e3e] transition-all">
                <h3 className="font-medium mb-4">Notification Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-[#AAAAAA]">Email Notifications</label>
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
                      <span className={`block h-5 w-5 rounded-md bg-[#6366F1] absolute left-0 transition-transform transform ${emailNotifications ? 'translate-x-5' : 'translate-x-0'}`}></span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-[#AAAAAA]">Daily Summary</label>
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
                      <span className={`block h-5 w-5 rounded-md bg-[#6366F1] absolute left-0 transition-transform transform ${dailySummary ? 'translate-x-5' : 'translate-x-0'}`}></span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-[#AAAAAA]">Agent Activity Alerts</label>
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
                      <span className={`block h-5 w-5 rounded-md ${activityAlerts ? 'bg-[#6366F1]' : 'bg-[#2e2e2e]'} absolute left-0 transition-transform transform ${activityAlerts ? 'translate-x-5' : 'translate-x-0'}`}></span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <button className="px-4 py-2 border border-[#2e2e2e] hover:border-[#6366F1] rounded-md transition-colors">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-md transition-colors">
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
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      <header className="border-b border-[#2e2e2e] bg-[#0E0E0E]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo />
              <span className="text-[#A3A3A3]">|</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.history.back()}
                  className="text-[#A3A3A3] hover:text-white transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
                <h1 className="text-lg font-medium">Marketing Campaign Builder</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-[#A3A3A3] hover:text-white transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-[64px] md:w-[220px] border-r border-[#2e2e2e] bg-[#0E0E0E] flex flex-col">
          <nav className="p-3 flex-1">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('communication')}
                  className={`
                    w-full flex items-center gap-3 p-2 rounded-md transition-colors
                    ${activeTab === 'communication' 
                      ? 'bg-[#252525] text-white' 
                      : 'text-[#A3A3A3] hover:bg-[#1a1a1a] hover:text-white'}
                  `}
                >
                  <MessageSquare size={20} />
                  <span className="hidden md:inline">Communication</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('agents')}
                  className={`
                    w-full flex items-center gap-3 p-2 rounded-md transition-colors
                    ${activeTab === 'agents' 
                      ? 'bg-[#252525] text-white' 
                      : 'text-[#A3A3A3] hover:bg-[#1a1a1a] hover:text-white'}
                  `}
                >
                  <Users size={20} />
                  <span className="hidden md:inline">Team Members</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('tools')}
                  className={`
                    w-full flex items-center gap-3 p-2 rounded-md transition-colors
                    ${activeTab === 'tools' 
                      ? 'bg-[#252525] text-white' 
                      : 'text-[#A3A3A3] hover:bg-[#1a1a1a] hover:text-white'}
                  `}
                >
                  <Wrench size={20} />
                  <span className="hidden md:inline">Tools & Integration</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`
                    w-full flex items-center gap-3 p-2 rounded-md transition-colors
                    ${activeTab === 'reports' 
                      ? 'bg-[#252525] text-white' 
                      : 'text-[#A3A3A3] hover:bg-[#1a1a1a] hover:text-white'}
                  `}
                >
                  <LineChart size={20} />
                  <span className="hidden md:inline">Reports</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`
                    w-full flex items-center gap-3 p-2 rounded-md transition-colors
                    ${activeTab === 'settings' 
                      ? 'bg-[#252525] text-white' 
                      : 'text-[#A3A3A3] hover:bg-[#1a1a1a] hover:text-white'}
                  `}
                >
                  <Settings size={20} />
                  <span className="hidden md:inline">Settings</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 overflow-auto">
          {renderTabContent()}
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
      avatar: '👨‍💼'
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
      avatar: '📊'
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
      avatar: '👨‍💼'
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
      avatar: '📊'
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
      avatar: '🔍'
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
      avatar: '👨‍💼'
    },
    content: 'These are great insights. Let\'s focus on creating a compelling story around solving these pain points. Can you draft an initial campaign strategy with timeline and budget?',
    timestamp: '2023-06-15T09:45:00Z',
    status: 'read'
  }
];

const mockAgents = [
  {
    id: 'agent-1',
    name: 'Marketing Officer',
    role: 'Marketing Specialist',
    avatar: '📊',
    status: 'active'
  },
  {
    id: 'agent-2',
    name: 'Product Manager',
    role: 'Product Strategy',
    avatar: '🔍',
    status: 'active'
  },
  {
    id: 'agent-3',
    name: 'Developer',
    role: 'Full-stack Engineer',
    avatar: '👩‍💻',
    status: 'idle'
  },
  {
    id: 'agent-4',
    name: 'Sales Representative',
    role: 'Sales & Business Development',
    avatar: '📈',
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
    agentAvatar: '📊',
    description: 'Completed market research for new product campaign',
    timestamp: '2023-06-15T14:30:00Z'
  },
  {
    id: 'activity-2',
    agentName: 'Developer',
    agentAvatar: '👩‍💻',
    description: 'Created API integration with marketing analytics platform',
    timestamp: '2023-06-15T13:15:00Z'
  },
  {
    id: 'activity-3',
    agentName: 'Product Manager',
    agentAvatar: '🔍',
    description: 'Updated product roadmap with new feature prioritization',
    timestamp: '2023-06-15T11:45:00Z'
  },
  {
    id: 'activity-4',
    agentName: 'Sales Representative',
    agentAvatar: '📈',
    description: 'Generated list of 50 qualified leads for new product',
    timestamp: '2023-06-15T10:20:00Z'
  }
]; 