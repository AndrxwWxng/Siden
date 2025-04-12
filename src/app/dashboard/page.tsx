'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { 
  PlusCircle, Settings, Users, ChevronRight, Briefcase, ArrowRight, 
  Database, Bell, Search, Grid, Heart, Filter, Home, MessageSquare,
  BarChart3, Calendar, HelpCircle, ChevronLeft, User, Bot, Paperclip, Send,
  FileText, Code, BookOpen
} from 'lucide-react';

// Agent role definitions with capabilities
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

// Mock projects for demonstration
const mockProjects = [
  {
    id: 'p1',
    name: 'Marketing Campaign Builder',
    description: 'AI-powered tool to create and optimize marketing campaigns',
    agents: 4,
    status: 'active',
    lastActive: '2 hours ago',
    progress: 72,
    tags: ['marketing', 'automation']
  },
  {
    id: 'p2',
    name: 'E-commerce Analytics Dashboard',
    description: 'Real-time analytics and insights for online stores',
    agents: 3,
    status: 'active',
    lastActive: '1 day ago',
    progress: 45,
    tags: ['analytics', 'e-commerce']
  }
];

// Import our new components
import {
  Sidebar,
  ProjectsHeader,
  ProjectSearch,
  ProjectCard,
  NewProjectCard,
  EmptyProjectState,
  FilterType
} from '@/components/dashboard';

// Define the Tool type
interface Tool {
  name: string;
  icon: React.ReactNode;
}

const Dashboard = () => {
  const router = useRouter();
  const [selectedView, setSelectedView] = useState<'projects' | 'new-project' | 'select-agents' | 'configure' | 'chat'>('projects');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [companyInfo, setCompanyInfo] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['ceo', 'dev', 'marketing']);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [agentName, setAgentName] = useState("");
  const [agentPersonality, setAgentPersonality] = useState("");
  const [isEditingAgent, setIsEditingAgent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [agentCapabilities, setAgentCapabilities] = useState<Record<string, boolean>>({});
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    webBrowsing: true,
    projectFiles: true
  });
  
  const toggleAgentSelection = (agentId: string) => {
    if (selectedAgents.includes(agentId)) {
      setSelectedAgents(selectedAgents.filter(id => id !== agentId));
    } else {
      setSelectedAgents([...selectedAgents, agentId]);
    }
  };
  
  const startNewProject = () => {
    setSelectedView('new-project');
    setProjectName('');
    setProjectDescription('');
    setCompanyInfo('');
    setSelectedAgents(['ceo', 'dev', 'marketing']);
  };
  
  const proceedToAgentSelection = () => {
    setSelectedView('select-agents');
  };
  
  const proceedToConfiguration = () => {
    setSelectedView('configure');
  };
  
  const createProject = () => {
    // In a real app, this would create the project and redirect
    setSelectedView('projects');
  };
  
  // Render different views based on the current step
  const renderContent = () => {
    switch (selectedView) {
      case 'projects':
  return (
          <div className="max-w-6xl mx-auto px-8 w-full pt-12">
            <div className="mb-16">
              <ProjectsHeader onCreateProject={startNewProject} />
              
              <ProjectSearch 
                onSearch={setSearchTerm}
                onFilterChange={(filter) => setSelectedFilter(filter as FilterType)}
                selectedFilter={selectedFilter as FilterType}
              />
            </div>
            
            {mockProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProjects.map(project => (
                  <ProjectCard 
                    key={project.id}
                    {...project}
                    onViewProject={(id) => router.push(`/dashboard/project?id=${id}`)}
                  />
                ))}
                
                <NewProjectCard onClick={startNewProject} />
              </div>
            ) : (
              <div className="flex justify-center items-center h-[calc(100vh-300px)]">
                <EmptyProjectState onCreateProject={startNewProject} />
              </div>
            )}
          </div>
        );
        
      case 'new-project':
        return (
          <div className="max-w-3xl mx-auto px-4 w-full pt-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
              <p className="text-[#A3A3A3]">
                Set up your project details so your AI team can understand what you're building.
              </p>
            </div>
            
            <div className="bg-[#2E2E2E] border border-[#444] rounded-xl overflow-hidden mb-8 shadow-sm">
              <div className="px-6 py-4 border-b border-[#444] flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#6366F1] flex items-center justify-center text-white mr-3">
                  1
                </div>
                <h2 className="text-lg font-medium">Project Details</h2>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Name</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g., Marketing Campaign Builder"
                    className="w-full px-4 py-3 bg-[#202020] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Project Description</label>
                  <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Briefly describe what you're building and its purpose"
                    rows={3}
                    className="w-full px-4 py-3 bg-[#202020] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
                  />
          </div>
          
          <div>
                  <label className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium">Company Information</span>
                    <span className="text-[#A3A3A3]">Optional</span>
                  </label>
                  <textarea
                    value={companyInfo}
                    onChange={(e) => setCompanyInfo(e.target.value)}
                    placeholder="Tell us about your company, market, and goals (helps agents understand context)"
                    rows={4}
                    className="w-full px-4 py-3 bg-[#202020] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-[#2E2E2E] border border-[#444] rounded-xl p-6 mb-8 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-[#444] flex items-center justify-center text-white mr-3">
                  2
                </div>
                <h2 className="text-lg font-medium">Starting Templates</h2>
              </div>
              
              <p className="text-sm text-[#A3A3A3] mb-5">
                Start with a template or build your project from scratch.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-[#444] hover:border-[#6366F1] rounded-lg p-4 cursor-pointer transition-colors flex flex-col items-center text-center group">
                  <div className="w-12 h-12 bg-[#202020] group-hover:bg-[#6366F1]/10 rounded-full flex items-center justify-center mb-3 transition-colors">
                    <BarChart3 size={24} className="text-[#6366F1]" />
                  </div>
                  <h3 className="font-medium mb-1">Analytics Dashboard</h3>
                  <p className="text-xs text-[#A3A3A3]">Track and visualize your business metrics</p>
                </div>
                
                <div className="border border-[#444] hover:border-[#6366F1] rounded-lg p-4 cursor-pointer transition-colors flex flex-col items-center text-center group">
                  <div className="w-12 h-12 bg-[#202020] group-hover:bg-[#6366F1]/10 rounded-full flex items-center justify-center mb-3 transition-colors">
                    <MessageSquare size={24} className="text-[#6366F1]" />
                  </div>
                  <h3 className="font-medium mb-1">Customer Service</h3>
                  <p className="text-xs text-[#A3A3A3]">Automate customer support and inquiries</p>
                </div>
                
                <div className="border border-[#444] hover:border-[#6366F1] rounded-lg p-4 cursor-pointer transition-colors flex flex-col items-center text-center group">
                  <div className="w-12 h-12 bg-[#202020] group-hover:bg-[#6366F1]/10 rounded-full flex items-center justify-center mb-3 transition-colors">
                    <Calendar size={24} className="text-[#6366F1]" />
                  </div>
                  <h3 className="font-medium mb-1">Content Calendar</h3>
                  <p className="text-xs text-[#A3A3A3]">Plan and create content for marketing</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-center">
                <button className="text-sm text-[#6366F1] hover:text-[#4F46E5] transition-colors">
                  Browse all templates →
            </button>
          </div>
        </div>
        
            <div className="flex justify-between items-center">
              <button
                onClick={() => setSelectedView('projects')}
                className="px-5 py-2.5 border border-[#444] hover:border-[#6366F1] rounded-md transition-colors flex items-center gap-2"
              >
                <ChevronRight className="rotate-180" size={18} /> Back to Projects
              </button>
              <button
                onClick={proceedToAgentSelection}
                disabled={!projectName.trim()}
                className={`px-5 py-2.5 rounded-md transition-colors flex items-center gap-2 ${
                  projectName.trim() 
                    ? 'bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-md hover:shadow-lg' 
                    : 'bg-[#2E2E2E] text-[#A3A3A3] cursor-not-allowed'
                }`}
              >
                Continue <ChevronRight size={18} />
              </button>
            </div>
          </div>
        );
        
      case 'select-agents':
        return (
          <>
            <div className="max-w-3xl mx-auto pt-8">
              <div className="mb-10">
                <h1 className="text-3xl font-medium mb-3">Select Agent Roles</h1>
                <p className="text-[#A3A3A3] text-lg">
                  Choose which AI agents you'd like on your team
                </p>
              </div>
              
              <div className="mb-8 flex justify-between items-center">
                <div className="text-sm text-[#A3A3A3]">
                  {selectedAgents.length} selected
                </div>
                {selectedAgents.length > 0 && (
                  <button 
                    onClick={() => setSelectedAgents([])} 
                    className="text-[#6366F1] text-sm hover:text-[#4F46E5] transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              {/* Agent roles list - clean, minimal design */}
              <div className="space-y-3 mb-16">
                {agentRoles.map(role => {
                  const isSelected = selectedAgents.includes(role.id);
                  
                  return (
                    <div 
                      key={role.id}
                      onClick={() => toggleAgentSelection(role.id)}
                      className={`${
                        isSelected ? 'bg-[#2E2E2E] border-[#6366F1]' : 'bg-transparent hover:bg-[#2E2E2E] border-[#444]'
                      } border rounded-xl p-6 cursor-pointer transition-all`}
                    >
            <div className="flex items-center">
                        <div className="relative mr-5">
                          <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center ${
                            isSelected ? 'ring-2 ring-[#6366F1]' : 'ring-1 ring-[#444]'
                          }`}>
                            <img 
                              src={role.icon} 
                              alt={role.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-lg">{role.name}</h3>
                            {role.recommended && (
                              <span className="text-xs bg-[#6366F1]/10 text-[#6366F1] px-2 py-0.5 rounded-full border border-[#6366F1]/20">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-[#A3A3A3] text-sm mb-2">{role.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {role.capabilities.map((capability, index) => (
                              <span key={index} className="text-xs px-2 py-0.5 bg-[#202020] text-[#A3A3A3] rounded-full">
                                {capability}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="ml-4 w-6">
                          <div className={`w-5 h-5 rounded-full ${
                            isSelected 
                              ? 'bg-[#6366F1] ring-2 ring-[#6366F1]/30'
                              : 'border-2 border-[#444]'
                          } flex items-center justify-center`}>
                            {isSelected && (
                              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* View details / customize buttons */}
                      {isSelected && (
                        <div className="mt-4 pt-3 border-t border-[#444] flex">
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setSelectedProfile(role.id);
                              setAgentName(role.name);
                              setAgentPersonality("");
                              setIsEditingAgent(false);
                            }} 
                            className="text-sm text-[#6366F1] hover:text-[#4F46E5] flex items-center mr-4"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                              <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path>
                              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            View details
                          </button>
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setSelectedProfile(role.id);
                              setAgentName(role.name);
                              setAgentPersonality("Friendly, professional, and efficient");
                              setIsEditingAgent(true);
                            }} 
                            className="text-sm text-[#A3A3A3] hover:text-white flex items-center"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                              <path d="M12 20h9"></path>
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                            Customize
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={() => setSelectedView('new-project')}
                  className="flex items-center gap-2 py-2 px-4 rounded-md hover:bg-[#2E2E2E] transition-colors"
                >
                  <ChevronLeft size={16} />
                  <span>Back</span>
                </button>
                
                <button
                  onClick={() => setSelectedView('chat')}
                  disabled={selectedAgents.length === 0}
                  className={`flex items-center gap-2 py-2 px-4 rounded-md ${
                    selectedAgents.length === 0
                      ? 'bg-[#2E2E2E] text-[#999999] cursor-not-allowed'
                      : 'bg-[#6366F1] hover:bg-[#4F46E5] text-white cursor-pointer'
                  } transition-colors`}
                >
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
            
            {/* Agent profile modal - cleaner, Claude-inspired design */}
            {selectedProfile && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-[#202020] border border-[#444] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
                  <div className="sticky top-0 bg-[#202020] border-b border-[#444] px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-medium">
                      {isEditingAgent ? 'Customize Agent' : 'Agent Details'}
                    </h2>
                    <button 
                      onClick={() => setSelectedProfile(null)}
                      className="text-[#8A8F98] hover:text-white transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6L18 18"></path>
                      </svg>
            </button>
          </div>
          
                  {(() => {
                    const agent = agentRoles.find(role => role.id === selectedProfile);
                    if (!agent) return null;
                    
                    return (
                      <div className="px-6 py-6">
                        <div className="flex items-start mb-8">
                          <div className="w-16 h-16 rounded-lg bg-[#2E2E2E] flex items-center justify-center text-3xl mr-5 overflow-hidden">
                            <img 
                              src={agent.icon} 
                              alt={agent.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col justify-start">
                            {isEditingAgent ? (
                              <input
                                type="text"
                                value={agentName}
                                onChange={(e) => setAgentName(e.target.value)}
                                className="w-full mb-1 px-3 py-2 bg-[#2E2E2E] border border-[#444] rounded-md focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
                              />
                            ) : (
                              <h3 className="text-2xl font-medium mb-1">{agent.name}</h3>
                            )}
                            <p className="text-[#8A8F98]">AI Agent Role</p>
                          </div>
                        </div>
                        
                        {isEditingAgent ? (
                          <>
                            <div className="mb-6">
                              <label className="block text-sm font-medium mb-2">Personality Traits</label>
                              <textarea
                                value={agentPersonality}
                                onChange={(e) => setAgentPersonality(e.target.value)}
                                placeholder="Describe the agent's personality traits (e.g., friendly, professional, technical)"
                                rows={3}
                                className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
                              />
                            </div>
                            
                            <div className="mb-6">
                              <label className="block text-sm font-medium mb-3">Agent Capabilities</label>
                              <div className="space-y-2.5">
                                {agent.capabilities.map((capability, index) => {
                                  const checkboxId = `cap-${selectedProfile}-${index}`;
                                  // Initialize capability state if needed
                                  const capabilityKey = `${selectedProfile}-${capability}`;
                                  if (agentCapabilities[capabilityKey] === undefined) {
                                    // Use a state update function to avoid race conditions
                                    setAgentCapabilities(prev => ({
                                      ...prev,
                                      [capabilityKey]: true // Default to checked
                                    }));
                                  }
                                  
                                  return (
                                  <div key={index} className="flex items-center">
                                    <div className="relative flex items-center group">
                                      <input 
                                        type="checkbox" 
                                        id={checkboxId} 
                                        checked={agentCapabilities[capabilityKey] !== false}
                                        className="sr-only"
                                        onChange={(e) => {
                                          setAgentCapabilities(prev => ({
                                            ...prev,
                                            [capabilityKey]: e.target.checked
                                          }));
                                        }}
                                      />
                                      <label htmlFor={checkboxId} className="flex items-center cursor-pointer select-none">
                                        <div 
                                          className={`w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer transition-colors ${
                                            agentCapabilities[capabilityKey] !== false 
                                              ? 'bg-[#6366F1] border-[#6366F1]' 
                                              : 'bg-transparent border-[#444]'
                                          }`}
                                        >
                                          <svg 
                                            className={`w-3 h-3 text-white transition-opacity ${
                                              agentCapabilities[capabilityKey] !== false ? 'opacity-100' : 'opacity-0'
                                            }`} 
                                            viewBox="0 0 10 8" 
                                            fill="none" 
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                        </div>
                                        <span className="ml-2 text-sm">{capability}</span>
                                      </label>
                                    </div>
                                  </div>
                                  );
                                })}
                                <div className="flex items-center">
                                  <div className="relative flex items-center flex-1">
                                    <div className="flex items-center w-full">
                                      <div className="w-5 h-5 border-2 border-[#444] rounded flex items-center justify-center mr-2 flex-shrink-0">
                                        <svg className="w-3 h-3 text-white opacity-0" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                      </div>
                                      <input 
                                        type="text" 
                                        placeholder="Add custom capability..."
                                        className="w-full bg-transparent text-sm text-[#8A8F98] focus:text-white placeholder-[#8A8F98] focus:outline-none cursor-pointer focus:cursor-text"
                                        onKeyPress={(e) => {
                                          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                            const newCapability = e.currentTarget.value.trim();
                                            
                                            // Add the capability to the agent's capabilities
                                            agent.capabilities.push(newCapability);
                                            
                                            // Initialize the capability state
                                            const capabilityKey = `${selectedProfile}-${newCapability}`;
                                            setAgentCapabilities(prev => ({
                                              ...prev,
                                              [capabilityKey]: true
                                            }));
                                            
                                            // Clear the input
                                            e.currentTarget.value = '';
                                          }
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mb-6">
                              <label className="block text-sm font-medium mb-3">Access Permissions</label>
                              <div className="space-y-2.5">
                                <div className="flex items-center justify-between p-3 bg-[#2E2E2E] rounded-lg">
                                  <div>
                                    <p className="font-medium">Web Browsing</p>
                                    <p className="text-xs text-[#8A8F98]">Allow agent to search the internet</p>
                                  </div>
                                  <div className="relative inline-block w-12 h-6">
                                    <input 
                                      type="checkbox" 
                                      id="webBrowsing" 
                                      className="opacity-0 w-0 h-0 absolute" 
                                      checked={permissions.webBrowsing}
                                      onChange={(e) => {
                                        setPermissions(prev => ({
                                          ...prev,
                                          webBrowsing: e.target.checked
                                        }));
                                      }}
                                    />
                                    <label 
                                      htmlFor="webBrowsing"
                                      className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-md transition-colors ${
                                        permissions.webBrowsing ? 'bg-[#6366F1]' : 'bg-[#444]'
                                      }`}
                                    >
                                      <span 
                                        className={`absolute w-4 h-4 bg-white rounded transition-transform duration-200 ${
                                          permissions.webBrowsing ? 'right-1' : 'left-1'
                                        } top-1`}
                                      />
                                    </label>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 bg-[#2E2E2E] rounded-lg">
                                  <div>
                                    <p className="font-medium">Project Files</p>
                                    <p className="text-xs text-[#8A8F98]">Access to project documents</p>
                                  </div>
                                  <div className="relative inline-block w-12 h-6">
                                    <input 
                                      type="checkbox" 
                                      id="projectFiles" 
                                      className="opacity-0 w-0 h-0 absolute" 
                                      checked={permissions.projectFiles}
                                      onChange={(e) => {
                                        setPermissions(prev => ({
                                          ...prev,
                                          projectFiles: e.target.checked
                                        }));
                                      }}
                                    />
                                    <label 
                                      htmlFor="projectFiles"
                                      className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-md transition-colors ${
                                        permissions.projectFiles ? 'bg-[#6366F1]' : 'bg-[#444]'
                                      }`}
                                    >
                                      <span 
                                        className={`absolute w-4 h-4 bg-white rounded transition-transform duration-200 ${
                                          permissions.projectFiles ? 'right-1' : 'left-1'
                                        } top-1`}
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="mb-6">
                              <h4 className="text-sm uppercase text-[#8A8F98] tracking-wider mb-3">About</h4>
                              <p className="text-[#E6E8EB] leading-relaxed">{agent.description}</p>
                            </div>
                            
                            <div className="mb-6">
                              <h4 className="text-sm uppercase text-[#8A8F98] tracking-wider mb-3">Core Capabilities</h4>
                              <ul className="space-y-3">
                                {agent.capabilities.map((capability, index) => (
                                  <li key={index} className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 mt-1.5 rounded-full flex-shrink-0 bg-[#6366F1]"></span>
                                    <div>
                                      <h5 className="font-medium">{capability}</h5>
                                      <p className="text-sm text-[#A3A3A3]">
                                        {getCapabilityDescription(capability)}
                                      </p>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="mb-6">
                              <h4 className="text-sm uppercase text-[#8A8F98] tracking-wider mb-3">Integrated Tools</h4>
                              <div className="grid grid-cols-2 gap-2.5">
                                {getToolsForAgent(agent.id).map((tool, index) => (
                                  <div key={index} className="flex items-center gap-2.5 p-2.5 bg-[#2E2E2E] rounded-md">
                                    <div className="w-6 h-6 bg-[#202020] rounded-md flex items-center justify-center">
                                      {tool.icon}
                                    </div>
                                    <span className="text-sm">{tool.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                        
                        <div className="pt-4 border-t border-[#444] flex justify-end">
                          {isEditingAgent ? (
                            <>
                              <button
                                onClick={() => setIsEditingAgent(false)}
                                className="px-4 py-2 border border-[#444] hover:border-[#6366F1] rounded-md transition-colors text-sm mr-3"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  // Here you would save the customizations in a real app
                                  setIsEditingAgent(false);
                                }}
                                className="px-4 py-2 bg-[#6366F1] hover:bg-[#5254CC] text-white rounded-md transition-colors text-sm"
                              >
                                Save Changes
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  if (!selectedAgents.includes(agent.id)) {
                                    toggleAgentSelection(agent.id);
                                  }
                                  setSelectedProfile(null);
                                }}
                                className="px-4 py-2 border border-[#444] hover:border-[#6366F1] rounded-md transition-colors text-sm mr-3"
                              >
                                Close
                              </button>
                              <button
                                onClick={() => {
                                  setAgentName(agent.name);
                                  setAgentPersonality("Friendly, professional, and efficient");
                                  setIsEditingAgent(true);
                                }}
                                className="px-4 py-2 bg-[#6366F1] hover:bg-[#5254CC] text-white rounded-md transition-colors text-sm"
                              >
                                Customize Agent
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </>
        );
        
      case 'configure':
        return (
          <div className="max-w-5xl mx-auto px-4 w-full pt-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Configure Your Team</h1>
              <p className="text-[#A3A3A3] max-w-2xl">
                Connect tools and resources that your AI team can use to help accomplish your goals.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="md:col-span-2">
                <div className="bg-[#2E2E2E] border border-[#444] rounded-xl overflow-hidden mb-8">
                  <div className="px-6 py-4 border-b border-[#444] flex items-center justify-between">
                    <h2 className="text-lg font-medium flex items-center">
                      <Briefcase size={18} className="mr-2 text-[#6366F1]" />
                      Connect Tools & Resources
                    </h2>
                    <button className="text-xs px-3 py-1.5 rounded-md bg-[#202020] text-[#A3A3A3] hover:text-white transition-colors">
                      Skip All
                    </button>
                  </div>
                  
                  <div className="divide-y divide-[#444]">
                    <div className="px-6 py-5 hover:bg-[#202020] transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-[#202020] rounded-lg flex items-center justify-center mr-4">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" fill="#EA4335" />
                              <path d="M0 8a8 8 0 1 0 16 0A8 8 0 0 0 0 8m8 5.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11" fill="#34A853" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-white mb-1">Google Workspace</h3>
                            <p className="text-sm text-[#A3A3A3]">Allow agents to access your Docs, Sheets, and Gmail</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 rounded-md border border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-colors">
                          Connect
                        </button>
                      </div>
                    </div>
                    
                    <div className="px-6 py-5 hover:bg-[#202020] transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-[#202020] rounded-lg flex items-center justify-center mr-4">
                            <Database size={24} className="text-[#38BDF8]" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white mb-1">Database Access</h3>
                            <p className="text-sm text-[#A3A3A3]">Allow agents to query your databases securely</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 rounded-md border border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-colors">
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#2E2E2E] border border-[#444] rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#444]">
                    <h2 className="text-lg font-medium flex items-center">
                      <Settings size={18} className="mr-2 text-[#6366F1]" />
                      Advanced Settings
                    </h2>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-medium">Knowledge Access</label>
                        <div className="relative inline-block w-12 h-6 mr-2">
                          <input type="checkbox" className="opacity-0 w-0 h-0" defaultChecked />
                          <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-[#6366F1] rounded-full"></span>
                          <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform translate-x-6"></span>
                        </div>
                      </div>
                      <p className="text-sm text-[#A3A3A3]">Allow agents to access internet for research</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-medium">Memory Persistence</label>
                        <div className="relative inline-block w-12 h-6 mr-2">
                          <input type="checkbox" className="opacity-0 w-0 h-0" defaultChecked />
                          <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-[#6366F1] rounded-full"></span>
                          <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform translate-x-6"></span>
                        </div>
                      </div>
                      <p className="text-sm text-[#A3A3A3]">Allow agents to remember past conversations and decisions</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-medium">Autonomous Mode</label>
                        <div className="relative inline-block w-12 h-6 mr-2">
                          <input type="checkbox" className="opacity-0 w-0 h-0" />
                          <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-[#444] rounded-full"></span>
                          <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></span>
                        </div>
                      </div>
                      <p className="text-sm text-[#A3A3A3]">Allow agents to work without human approval (not recommended)</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-[#2E2E2E] border border-[#444] rounded-xl overflow-hidden sticky top-6">
                  <div className="px-6 py-4 border-b border-[#444]">
                    <h2 className="text-lg font-medium flex items-center">
                      <Users size={18} className="mr-2 text-[#6366F1]" />
                      Your Team
                    </h2>
                  </div>
                  
                  <div className="divide-y divide-[#444]">
                    {selectedAgents.map(agentId => {
                      const agent = agentRoles.find(role => role.id === agentId);
                      if (!agent) return null;
                      
                      return (
                        <div key={agent.id} className="px-6 py-4 hover:bg-[#202020] transition-colors">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-[#202020] flex items-center justify-center text-xl mr-3">
                              <img 
                                src={agent.icon} 
                                alt={agent.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-white mb-0.5">{agent.name}</h3>
                              <p className="text-xs text-[#A3A3A3] truncate">{agent.description}</p>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAgentSelection(agent.id);
                              }}
                              className="ml-2 text-[#A3A3A3] hover:text-white"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="p-6 bg-[#202020]">
                    <button
                      onClick={() => setSelectedView('select-agents')}
                      className="w-full px-4 py-2.5 border border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white rounded-md transition-colors text-sm font-medium"
                    >
                      Edit Team
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <button
                onClick={() => setSelectedView('select-agents')}
                className="px-5 py-2.5 border border-[#444] hover:border-[#6366F1] rounded-md transition-colors flex items-center gap-2"
              >
                <ChevronRight className="rotate-180" size={18} /> Back to Team Selection
              </button>
              <button
                onClick={createProject}
                className="px-5 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-md transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                Launch Team <ArrowRight size={18} />
              </button>
            </div>
          </div>
        );
      case 'chat':
        return (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-3 border-b border-[#444] bg-[#202020]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedView('projects')}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#2E2E2E] transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {selectedAgents.map((agentId, index) => {
                      const agent = agentRoles.find(role => role.id === agentId);
                      if (!agent) return null;
                      if (index > 2) return null;
                      
                      return (
                        <div key={agent.id} className="w-8 h-8 rounded-full bg-[#2E2E2E] flex items-center justify-center ring-2 ring-[#202020]">
                          <img 
                            src={agent.icon} 
                            alt={agent.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      );
                    })}
                    
                    {selectedAgents.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-[#2E2E2E] flex items-center justify-center text-xs ring-2 ring-[#202020]">
                        +{selectedAgents.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="font-medium">{projectName}</span>
                </div>
              </div>
              
              <div>
                <button
                  onClick={() => {}} 
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#2E2E2E] transition-colors"
                >
                  <Settings size={18} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-[#202020] p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-[#2E2E2E] rounded-xl p-4 shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#202020] flex items-center justify-center text-xs flex-shrink-0">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-white">Hey team, I need help with our quarterly marketing strategy. What are the key areas we should focus on for Q3?</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#2E2E2E] rounded-xl p-4 shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-xs flex-shrink-0">
                      <Bot size={16} />
                    </div>
                    <div>
                      <p className="text-white">Based on your Q2 results and market trends, I recommend focusing on three key areas for Q3:</p>
                      <ol className="list-decimal list-inside mt-2 space-y-2 pl-1 text-white">
                        <li>Social media content optimization - Your engagement decreased by 12% in Q2</li>
                        <li>Email sequence refinement - Conversion rates are below industry average</li> 
                        <li>Partnership opportunities - There are 5 potential partners aligned with your brand</li>
                      </ol>
                      <p className="mt-2 text-white">Would you like me to develop a detailed strategy for any of these areas?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-[#444] bg-[#202020]">
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full bg-[#2E2E2E] border border-[#444] rounded-xl py-3 px-4 pr-24 focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1]"
                  />
                  <div className="absolute right-2 top-2 flex items-center gap-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#202020] transition-colors text-[#A3A3A3] hover:text-white">
                      <Paperclip size={18} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#6366F1] hover:bg-[#4F46E5] transition-colors text-white">
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };
  
  // Filter projects based on search and filter
  const filteredProjects = mockProjects.filter(project => {
    // Filter by status
    if (selectedFilter !== 'all' && project.status !== selectedFilter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Helper function to get capability descriptions
  const getCapabilityDescription = (capability: string) => {
    const descriptions: {[key: string]: string} = {
      'Team coordination': 'Organizes work across different team members and tracks progress',
      'Strategic planning': 'Develops long-term plans aligned with business goals',
      'Decision making': 'Analyzes options and makes recommendations based on data',
      'Full-stack development': 'Writes and optimizes code for both frontend and backend systems',
      'Code optimization': 'Improves existing code for better performance and reliability',
      'Technical architecture': 'Designs system structures and component relationships',
      'Campaign creation': 'Develops marketing campaigns across multiple channels',
      'Content strategy': 'Plans and organizes content to achieve marketing goals',
      'Performance analysis': 'Measures and optimizes campaign effectiveness',
      'User research': 'Gathers and analyzes user feedback and behavior',
      'Feature prioritization': 'Determines which features to build based on business impact',
      'Product strategy': 'Develops long-term product vision and roadmap',
      'Lead qualification': 'Identifies and evaluates potential customers',
      'Demos and pitches': 'Creates compelling presentations of products and services',
      'Relationship building': 'Develops and maintains customer relationships',
      'Budget planning': 'Creates and manages financial plans and allocations',
      'Financial analysis': 'Examines financial data to provide business insights',
      'Investment strategy': 'Develops plans for allocating financial resources',
      'UI/UX design': 'Creates intuitive and appealing user interfaces',
      'Brand identity': 'Develops consistent visual and messaging elements',
      'Visual systems': 'Creates cohesive design systems and component libraries',
      'Competitive analysis': 'Researches and evaluates competitor strategies',
      'Market trends': 'Identifies and analyzes industry and market patterns',
      'User insights': 'Gathers and interprets data about user behaviors and preferences',
    };
    
    return descriptions[capability] || 'Specialized capability for this agent role';
  };
  
  const commonTools = [
    { name: 'Chat', icon: <MessageSquare size={16} className="text-[#94A3B8]" /> },
    { name: 'Document Analysis', icon: <FileText size={16} className="text-[#94A3B8]" /> },
  ];
  
  const contentCreatorTools = [
    ...commonTools,
    { name: 'Content Generation', icon: <BookOpen size={16} className="text-[#94A3B8]" /> },
  ];

  const developerTools = [
    ...commonTools,
    { name: 'Code Interpreter', icon: <Code size={16} className="text-[#94A3B8]" /> },
  ];
  
  const getToolsForAgent = (agentId: string) => {
    const agentSpecificTools: Record<string, Tool[]> = {
      'content-creator': contentCreatorTools,
      'developer': developerTools,
    };
    
    return [...commonTools, ...(agentSpecificTools[agentId] || [])];
  };

  return (
    <div className="flex min-h-screen bg-[#151515] text-white">
      {/* Sidebar */}
      <Sidebar 
        projects={mockProjects} 
        selectedProject={null} 
        onNewProject={startNewProject}
        onCollapse={setSidebarCollapsed}
      />
      
      {/* Main content */}
      <main 
        className="flex-1 flex flex-col transition-all duration-200"
        style={{ marginLeft: sidebarCollapsed ? '60px' : '280px' }}
      >
        <div className="h-16 border-b border-[#313131] flex items-center px-6 bg-[#202020]">
        </div>
        
        <div className="flex-1 overflow-auto bg-[#202020] p-6">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard; 