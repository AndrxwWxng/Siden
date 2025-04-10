'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { 
  PlusCircle, Settings, Users, ChevronRight, Briefcase, ArrowRight, 
  Database, Bell, Search, Grid, Heart, Filter, Home, MessageSquare,
  BarChart3, Calendar, HelpCircle
} from 'lucide-react';

// Agent role definitions with capabilities
const agentRoles = [
  {
    id: 'ceo',
    name: 'CEO',
    icon: '👨‍💼',
    description: 'Manages team and provides strategic direction',
    capabilities: ['Team coordination', 'Strategic planning', 'Decision making'],
    recommended: true
  },
  {
    id: 'dev',
    name: 'Developer',
    icon: '👩‍💻',
    description: 'Writes code and builds features',
    capabilities: ['Full-stack development', 'Code optimization', 'Technical architecture'],
    recommended: true
  },
  {
    id: 'marketing',
    name: 'Marketing Officer',
    icon: '📊',
    description: 'Handles promotion and user acquisition',
    capabilities: ['Campaign creation', 'Content strategy', 'Performance analysis'],
    recommended: true
  },
  {
    id: 'product',
    name: 'Product Manager',
    icon: '🔍',
    description: 'Defines product roadmap and features',
    capabilities: ['User research', 'Feature prioritization', 'Product strategy'],
    recommended: true
  },
  {
    id: 'sales',
    name: 'Sales Representative',
    icon: '📈',
    description: 'Converts leads into customers',
    capabilities: ['Lead qualification', 'Demos and pitches', 'Relationship building'],
    recommended: false
  },
  {
    id: 'finance',
    name: 'Finance Advisor',
    icon: '💰',
    description: 'Manages budgets and financial strategy',
    capabilities: ['Budget planning', 'Financial analysis', 'Investment strategy'],
    recommended: false
  },
  {
    id: 'design',
    name: 'Designer',
    icon: '🎨',
    description: 'Creates visuals and user experiences',
    capabilities: ['UI/UX design', 'Brand identity', 'Visual systems'],
    recommended: false
  },
  {
    id: 'research',
    name: 'Research Analyst',
    icon: '🔬',
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

export default function Dashboard() {
  const router = useRouter();
  const [selectedView, setSelectedView] = useState<'projects' | 'new-project' | 'select-agents' | 'configure'>('projects');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [companyInfo, setCompanyInfo] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['ceo', 'dev', 'marketing']);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [agentName, setAgentName] = useState("");
  const [agentPersonality, setAgentPersonality] = useState("");
  const [isEditingAgent, setIsEditingAgent] = useState(false);
  
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
          <div className="max-w-7xl mx-auto px-4 w-full pt-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-1">Your Projects</h1>
                <p className="text-[#A3A3A3]">Manage and track your agent workforces</p>
              </div>
              <button 
                onClick={startNewProject}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-md transition-colors shadow-md hover:shadow-lg"
              >
                <PlusCircle size={18} />
                Create New Project
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[#A3A3A3]" />
                </div>
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="block w-full pl-10 pr-3 py-2.5 bg-[#1E1E1E] border border-[#2e2e2e] rounded-md focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1]"
                />
              </div>
              
              <div className="flex items-center border border-[#2e2e2e] rounded-md overflow-hidden">
                <button 
                  onClick={() => setSelectedFilter('all')}
                  className={`px-4 py-2.5 ${selectedFilter === 'all' ? 'bg-[#252525] text-white' : 'bg-transparent text-[#A3A3A3] hover:text-white'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setSelectedFilter('active')}
                  className={`px-4 py-2.5 ${selectedFilter === 'active' ? 'bg-[#252525] text-white' : 'bg-transparent text-[#A3A3A3] hover:text-white'}`}
                >
                  Active
                </button>
                <button 
                  onClick={() => setSelectedFilter('archived')}
                  className={`px-4 py-2.5 ${selectedFilter === 'archived' ? 'bg-[#252525] text-white' : 'bg-transparent text-[#A3A3A3] hover:text-white'}`}
                >
                  Archived
                </button>
              </div>
              
              <button className="p-2.5 rounded-md border border-[#2e2e2e] hover:border-[#3e3e3e] transition-colors">
                <Filter size={20} className="text-[#A3A3A3]" />
              </button>
              
              <button className="p-2.5 rounded-md border border-[#2e2e2e] hover:border-[#3e3e3e] transition-colors">
                <Grid size={20} className="text-[#A3A3A3]" />
              </button>
            </div>
            
            {mockProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockProjects.map(project => (
                  <div 
                    key={project.id} 
                    className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-medium">{project.name}</h3>
                        <span className={`px-2.5 py-1 text-xs rounded-full flex items-center ${
                          project.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${project.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                          {project.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-[#A3A3A3] mb-4 line-clamp-2">{project.description}</p>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-[#A3A3A3]">Progress</span>
                          <span className="text-white">{project.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#252525] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#6366F1] rounded-full"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-[#A3A3A3] mb-4">
                        <span className="flex items-center mr-4">
                          <Users size={14} className="mr-1" />
                          {project.agents} agents
                        </span>
                        <span className="flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A3A3A3] mr-1.5"></span>
                          Last active: {project.lastActive}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-5">
                        {project.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-[#252525] rounded-md text-[#A3A3A3]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t border-[#2e2e2e] px-6 py-3 flex justify-between">
                      <button 
                        onClick={() => router.push(`/dashboard/project?id=${project.id}`)}
                        className="text-[#6366F1] hover:text-[#4F46E5] text-sm font-medium transition-colors flex items-center"
                      >
                        View Project
                        <ChevronRight size={16} className="ml-1" />
                      </button>
                      <div className="flex items-center gap-3">
                        <button className="text-[#A3A3A3] hover:text-white transition-colors">
                          <Heart size={16} />
                        </button>
                        <button className="text-[#A3A3A3] hover:text-white transition-colors">
                          <Settings size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div 
                  onClick={startNewProject}
                  className="border-2 border-dashed border-[#2e2e2e] rounded-lg flex flex-col items-center justify-center p-8 cursor-pointer hover:border-[#6366F1] transition-colors h-full min-h-[340px]"
                >
                  <div className="w-16 h-16 rounded-full bg-[#252525] flex items-center justify-center mb-4">
                    <PlusCircle size={32} className="text-[#6366F1]" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Create New Project</h3>
                  <p className="text-sm text-[#A3A3A3] text-center max-w-xs">
                    Add a new project and configure your agent workforce
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 px-4 border border-[#2e2e2e] rounded-xl bg-[#1a1a1a]">
                <div className="w-20 h-20 rounded-full bg-[#252525] flex items-center justify-center mx-auto mb-6">
                  <PlusCircle size={40} className="text-[#6366F1]" />
                </div>
                <h3 className="text-2xl font-medium mb-2">No projects yet</h3>
                <p className="text-[#A3A3A3] mb-8 max-w-md mx-auto">
                  Create your first project and start building with your AI team members today.
                </p>
                <button 
                  onClick={startNewProject}
                  className="px-6 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-md transition-colors shadow-md inline-flex items-center gap-2"
                >
                  <PlusCircle size={18} />
                  Create Your First Project
                </button>
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
            
            <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl overflow-hidden mb-8 shadow-sm">
              <div className="px-6 py-4 border-b border-[#2e2e2e] flex items-center">
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
                    className="w-full px-4 py-3 bg-[#252525] border border-[#2e2e2e] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Project Description</label>
                  <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Briefly describe what you're building and its purpose"
                    rows={3}
                    className="w-full px-4 py-3 bg-[#252525] border border-[#2e2e2e] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
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
                    className="w-full px-4 py-3 bg-[#252525] border border-[#2e2e2e] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-6 mb-8 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center text-white mr-3">
                  2
                </div>
                <h2 className="text-lg font-medium">Starting Templates</h2>
              </div>
              
              <p className="text-sm text-[#A3A3A3] mb-5">
                Start with a template or build your project from scratch.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-[#2e2e2e] hover:border-[#6366F1] rounded-lg p-4 cursor-pointer transition-colors flex flex-col items-center text-center group">
                  <div className="w-12 h-12 bg-[#252525] group-hover:bg-[#6366F1]/10 rounded-full flex items-center justify-center mb-3 transition-colors">
                    <BarChart3 size={24} className="text-[#6366F1]" />
                  </div>
                  <h3 className="font-medium mb-1">Analytics Dashboard</h3>
                  <p className="text-xs text-[#A3A3A3]">Track and visualize your business metrics</p>
                </div>
                
                <div className="border border-[#2e2e2e] hover:border-[#6366F1] rounded-lg p-4 cursor-pointer transition-colors flex flex-col items-center text-center group">
                  <div className="w-12 h-12 bg-[#252525] group-hover:bg-[#6366F1]/10 rounded-full flex items-center justify-center mb-3 transition-colors">
                    <MessageSquare size={24} className="text-[#6366F1]" />
                  </div>
                  <h3 className="font-medium mb-1">Customer Service</h3>
                  <p className="text-xs text-[#A3A3A3]">Automate customer support and inquiries</p>
                </div>
                
                <div className="border border-[#2e2e2e] hover:border-[#6366F1] rounded-lg p-4 cursor-pointer transition-colors flex flex-col items-center text-center group">
                  <div className="w-12 h-12 bg-[#252525] group-hover:bg-[#6366F1]/10 rounded-full flex items-center justify-center mb-3 transition-colors">
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
                className="px-5 py-2.5 border border-[#2e2e2e] hover:border-[#6366F1] rounded-md transition-colors flex items-center gap-2"
              >
                <ChevronRight className="rotate-180" size={18} /> Back to Projects
              </button>
              <button
                onClick={proceedToAgentSelection}
                disabled={!projectName.trim()}
                className={`px-5 py-2.5 rounded-md transition-colors flex items-center gap-2 ${
                  projectName.trim() 
                    ? 'bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-md hover:shadow-lg' 
                    : 'bg-[#252525] text-[#A3A3A3] cursor-not-allowed'
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
                        isSelected ? 'bg-[#161921] border-[#6366F1]' : 'bg-transparent hover:bg-[#161921] border-[#1E2028]'
                      } border rounded-xl p-6 cursor-pointer transition-all`}
                    >
                      <div className="flex items-center">
                        <div className="relative mr-5">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                            isSelected ? 'bg-[#6366F1]/10 text-[#6366F1]' : 'bg-[#1E2028] text-white'
                          }`}>
                            {role.icon}
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
                              <span key={index} className="text-xs px-2 py-0.5 bg-[#1E2028] text-[#A3A3A3] rounded-full">
                                {capability}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="ml-4 w-6">
                          <div className={`w-5 h-5 rounded-full ${
                            isSelected 
                              ? 'bg-[#6366F1] ring-2 ring-[#6366F1]/30'
                              : 'border-2 border-[#1E2028]'
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
                        <div className="mt-4 pt-3 border-t border-[#1E2028] flex">
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
              
              <div className="sticky bottom-0 pt-4 bg-[#0F1116] border-t border-[#1E2028]">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#1E2028] flex items-center justify-center text-lg mr-3">
                      <Users size={20} className="text-[#6366F1]" />
                    </div>
                    <div>
                      <div className="font-medium">{selectedAgents.length} agents selected</div>
                      <div className="text-sm text-[#A3A3A3]">
                        {selectedAgents.length === 0 
                          ? 'Select at least one agent to continue' 
                          : 'Your team is ready'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <button 
                      onClick={() => {
                        // Simulate auto selection
                        setSelectedAgents(['ceo', 'dev', 'marketing', 'research']);
                      }}
                      className="px-4 py-2 mr-3 text-[#E6E8EB] border border-[#1E2028] rounded-md hover:bg-[#1E2028] transition-colors"
                    >
                      Auto-select
                    </button>
                    <button
                      onClick={proceedToConfiguration}
                      disabled={selectedAgents.length === 0}
                      className={`px-5 py-2 rounded-md transition-colors ${
                        selectedAgents.length > 0 
                          ? 'bg-[#6366F1] hover:bg-[#5254CC] text-white' 
                          : 'bg-[#1E2028] text-[#8A8F98] cursor-not-allowed'
                      }`}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Agent profile modal - cleaner, Claude-inspired design */}
            {selectedProfile && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-[#0F1116] border border-[#1E2028] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
                  <div className="sticky top-0 bg-[#0F1116] border-b border-[#1E2028] px-6 py-4 flex items-center justify-between z-10">
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
                        <div className="flex items-center mb-8">
                          <div className="w-16 h-16 rounded-full bg-[#1E2028] flex items-center justify-center text-3xl mr-5">
                            {agent.icon}
                          </div>
                          <div>
                            {isEditingAgent ? (
                              <input
                                type="text"
                                value={agentName}
                                onChange={(e) => setAgentName(e.target.value)}
                                className="w-full mb-1 px-3 py-2 bg-[#1E2028] border border-[#2E303B] rounded-md focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
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
                                className="w-full px-4 py-3 bg-[#1E2028] border border-[#2E303B] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
                              />
                            </div>
                            
                            <div className="mb-6">
                              <label className="block text-sm font-medium mb-3">Agent Capabilities</label>
                              <div className="space-y-2.5">
                                {agent.capabilities.map((capability, index) => (
                                  <div key={index} className="flex items-center">
                                    <input 
                                      type="checkbox" 
                                      id={`cap-${index}`} 
                                      defaultChecked
                                      className="w-4 h-4 mr-2 accent-[#6366F1]"
                                    />
                                    <label htmlFor={`cap-${index}`} className="text-sm">{capability}</label>
                                  </div>
                                ))}
                                <div className="flex items-center">
                                  <input 
                                    type="checkbox" 
                                    id="cap-new" 
                                    className="w-4 h-4 mr-2 accent-[#6366F1]"
                                  />
                                  <label htmlFor="cap-new" className="text-sm text-[#8A8F98]">Add custom capability...</label>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mb-6">
                              <label className="block text-sm font-medium mb-3">Access Permissions</label>
                              <div className="space-y-2.5">
                                <div className="flex items-center justify-between p-3 bg-[#1E2028] rounded-lg">
                                  <div>
                                    <p className="font-medium">Web Browsing</p>
                                    <p className="text-xs text-[#8A8F98]">Allow agent to search the internet</p>
                                  </div>
                                  <div className="relative inline-block w-12 h-6">
                                    <input type="checkbox" className="opacity-0 w-0 h-0" defaultChecked />
                                    <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-[#6366F1] rounded-full"></span>
                                    <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform translate-x-6"></span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 bg-[#1E2028] rounded-lg">
                                  <div>
                                    <p className="font-medium">Project Files</p>
                                    <p className="text-xs text-[#8A8F98]">Access to project documents</p>
                                  </div>
                                  <div className="relative inline-block w-12 h-6">
                                    <input type="checkbox" className="opacity-0 w-0 h-0" defaultChecked />
                                    <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-[#6366F1] rounded-full"></span>
                                    <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform translate-x-6"></span>
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
                                {getAgentTools(agent.id).map((tool, index) => (
                                  <div key={index} className="flex items-center gap-2.5 p-2.5 bg-[#1E2028] rounded-md">
                                    <div className="w-6 h-6 bg-[#2E303B] rounded-md flex items-center justify-center text-xs">
                                      {tool.icon}
                                    </div>
                                    <span className="text-sm">{tool.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                        
                        <div className="pt-4 border-t border-[#1E2028] flex justify-end">
                          {isEditingAgent ? (
                            <>
                              <button
                                onClick={() => setIsEditingAgent(false)}
                                className="px-4 py-2 border border-[#1E2028] hover:border-[#6366F1] rounded-md transition-colors text-sm mr-3"
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
                                className="px-4 py-2 border border-[#1E2028] hover:border-[#6366F1] rounded-md transition-colors text-sm mr-3"
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
                <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl overflow-hidden mb-8">
                  <div className="px-6 py-4 border-b border-[#2e2e2e] flex items-center justify-between">
                    <h2 className="text-lg font-medium flex items-center">
                      <Briefcase size={18} className="mr-2 text-[#6366F1]" />
                      Connect Tools & Resources
                    </h2>
                    <button className="text-xs px-3 py-1.5 rounded-md bg-[#252525] text-[#A3A3A3] hover:text-white transition-colors">
                      Skip All
                    </button>
                  </div>
                  
                  <div className="divide-y divide-[#2e2e2e]">
                    <div className="px-6 py-5 hover:bg-[#1E1E1E] transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-[#252525] rounded-lg flex items-center justify-center mr-4">
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
                    
                    <div className="px-6 py-5 hover:bg-[#1E1E1E] transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-[#252525] rounded-lg flex items-center justify-center mr-4">
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
                    
                    <div className="px-6 py-5 hover:bg-[#1E1E1E] transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-[#252525] rounded-lg flex items-center justify-center mr-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21.1739 0H2.82609C1.26957 0 0 1.26957 0 2.82609V21.1739C0 22.7304 1.26957 24 2.82609 24H21.1739C22.7304 24 24 22.7304 24 21.1739V2.82609C24 1.26957 22.7304 0 21.1739 0Z" fill="#0A66C2"/>
                              <path d="M7.42941 20.0001H3.71941V9.0401H7.42941V20.0001ZM5.57241 7.4881C4.24541 7.4881 3.17041 6.3921 3.17041 5.0641C3.17041 4.4356 3.42155 3.8328 3.86863 3.38572C4.31571 2.93865 4.91852 2.6875 5.54691 2.6875C6.17529 2.6875 6.77811 2.93865 7.22519 3.38572C7.67227 3.8328 7.92341 4.4356 7.92341 5.0641C7.92341 6.3921 6.8484 7.4881 5.57241 7.4881ZM20.0294 20.0001H16.3274V14.8571C16.3274 13.3841 16.2994 11.4691 14.2634 11.4691C12.1994 11.4691 11.8874 13.0951 11.8874 14.7741V20.0001H8.18841V9.0401H11.7374V10.5591H11.7894C12.2674 9.6771 13.4094 8.7431 15.1104 8.7431C18.8634 8.7431 20.0324 11.3711 20.0324 14.7741V20.0001H20.0294Z" fill="white"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-white mb-1">GitHub</h3>
                            <p className="text-sm text-[#A3A3A3]">Allow agents to access and manage repositories</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 rounded-md border border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-colors">
                          Connect
                        </button>
                      </div>
                    </div>
                    
                    <div className="px-6 py-5 hover:bg-[#1E1E1E] transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-[#252525] rounded-lg flex items-center justify-center mr-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21.1739 0H2.82609C1.26957 0 0 1.26957 0 2.82609V21.1739C0 22.7304 1.26957 24 2.82609 24H21.1739C22.7304 24 24 22.7304 24 21.1739V2.82609C24 1.26957 22.7304 0 21.1739 0Z" fill="#0A66C2"/>
                              <path d="M7.42941 20.0001H3.71941V9.0401H7.42941V20.0001ZM5.57241 7.4881C4.24541 7.4881 3.17041 6.3921 3.17041 5.0641C3.17041 4.4356 3.42155 3.8328 3.86863 3.38572C4.31571 2.93865 4.91852 2.6875 5.54691 2.6875C6.17529 2.6875 6.77811 2.93865 7.22519 3.38572C7.67227 3.8328 7.92341 4.4356 7.92341 5.0641C7.92341 6.3921 6.8484 7.4881 5.57241 7.4881ZM20.0294 20.0001H16.3274V14.8571C16.3274 13.3841 16.2994 11.4691 14.2634 11.4691C12.1994 11.4691 11.8874 13.0951 11.8874 14.7741V20.0001H8.18841V9.0401H11.7374V10.5591H11.7894C12.2674 9.6771 13.4094 8.7431 15.1104 8.7431C18.8634 8.7431 20.0324 11.3711 20.0324 14.7741V20.0001H20.0294Z" fill="white"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-white mb-1">LinkedIn</h3>
                            <p className="text-sm text-[#A3A3A3]">Allow agents to research and gather market data</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 rounded-md border border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-colors">
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#2e2e2e]">
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
                          <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-[#333] rounded-full"></span>
                          <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></span>
                        </div>
                      </div>
                      <p className="text-sm text-[#A3A3A3]">Allow agents to work without human approval (not recommended)</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl overflow-hidden sticky top-6">
                  <div className="px-6 py-4 border-b border-[#2e2e2e]">
                    <h2 className="text-lg font-medium flex items-center">
                      <Users size={18} className="mr-2 text-[#6366F1]" />
                      Your Team
                    </h2>
                  </div>
                  
                  <div className="divide-y divide-[#2e2e2e]">
                    {selectedAgents.map(agentId => {
                      const agent = agentRoles.find(role => role.id === agentId);
                      if (!agent) return null;
                      
                      return (
                        <div key={agent.id} className="px-6 py-4 hover:bg-[#1E1E1E] transition-colors">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-[#252525] flex items-center justify-center text-xl mr-3">
                              {agent.icon}
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
                  
                  <div className="p-6 bg-[#1E1E1E]">
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
                className="px-5 py-2.5 border border-[#2e2e2e] hover:border-[#6366F1] rounded-md transition-colors flex items-center gap-2"
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
    }
  };
  
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
  
  // Helper function to get agent tools
  const getAgentTools = (agentId: string) => {
    const commonTools = [
      { name: 'Web Search', icon: '🔍' },
      { name: 'Document Analysis', icon: '📄' },
    ];
    
    const agentSpecificTools: {[key: string]: Array<{name: string, icon: string}>} = {
      'ceo': [
        { name: 'Data Visualization', icon: '📊' },
        { name: 'Decision Support', icon: '🧠' },
        { name: 'Strategy Planning', icon: '🎯' },
      ],
      'dev': [
        { name: 'Code Generation', icon: '💻' },
        { name: 'API Integration', icon: '🔄' },
        { name: 'Debugging Assistant', icon: '🐞' },
        { name: 'Code Review', icon: '✅' },
      ],
      'marketing': [
        { name: 'Ad Creation', icon: '📣' },
        { name: 'Social Media', icon: '📱' },
        { name: 'Analytics', icon: '📈' },
        { name: 'Email Marketing', icon: '✉️' },
      ],
      'product': [
        { name: 'Roadmap Builder', icon: '🗺️' },
        { name: 'User Research', icon: '👥' },
        { name: 'Feature Planning', icon: '📝' },
      ],
      'sales': [
        { name: 'CRM Integration', icon: '🤝' },
        { name: 'Email Composer', icon: '📧' },
        { name: 'Proposal Builder', icon: '📑' },
      ],
      'finance': [
        { name: 'Financial Modeling', icon: '💰' },
        { name: 'Budget Analysis', icon: '💵' },
        { name: 'Forecast Tools', icon: '📊' },
      ],
      'design': [
        { name: 'Design Systems', icon: '🎨' },
        { name: 'Mockup Creation', icon: '🖼️' },
        { name: 'Asset Library', icon: '🗂️' },
      ],
      'research': [
        { name: 'Data Analysis', icon: '📊' },
        { name: 'Survey Tools', icon: '📋' },
        { name: 'Research Library', icon: '📚' },
      ],
    };
    
    return [...commonTools, ...(agentSpecificTools[agentId] || [])];
  };
  
  return (
    <div className="flex min-h-screen bg-[#0F1116] text-white">
      {/* Simplified sidebar */}
      <div className="w-[260px] border-r border-[#1E2028] bg-[#0F1116] flex flex-col">
        <div className="h-16 flex items-center px-4 border-b border-[#1E2028]">
          <Logo />
        </div>
        
        <div className="flex-1 py-6 overflow-auto">
          <div className="px-3 mb-5">
            <button 
              onClick={startNewProject}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6366F1] hover:bg-[#5254CC] rounded-[8px] transition-colors text-sm font-medium"
            >
              <PlusCircle size={16} />
              New Project
            </button>
          </div>
          
          <div className="space-y-1 px-3">
            <div className="text-xs font-medium text-[#8A8F98] px-3 py-2">
              PROJECTS
            </div>
            {mockProjects.map(project => (
              <button 
                key={project.id}
                onClick={() => router.push(`/dashboard/project?id=${project.id}`)}
                className="w-full flex items-center rounded-md px-3 py-2 text-[#E6E8EB] hover:bg-[#1E2028] transition-colors text-sm"
              >
                <div className="mr-3 w-6 h-6 bg-[#1E2028] rounded-md flex items-center justify-center flex-shrink-0">
                  {project.name.charAt(0)}
                </div>
                <span className="truncate">{project.name}</span>
              </button>
            ))}
            
            <button 
              onClick={startNewProject}
              className="w-full flex items-center rounded-md px-3 py-2 text-[#8A8F98] hover:bg-[#1E2028] transition-colors text-sm"
            >
              <PlusCircle size={16} className="mr-3" />
              <span>New Project</span>
            </button>
          </div>
        </div>
        
        <div className="border-t border-[#1E2028] p-3">
          <div className="rounded-md hover:bg-[#1E2028] transition-colors p-2 cursor-pointer relative group">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-medium mr-3">
                  KB
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Kendall Booker</p>
                  <p className="text-xs text-[#A3A3A3]">Professional plan</p>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#A3A3A3] group-hover:text-white transition-colors">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {/* Dropdown menu - hidden by default, shown on hover/click */}
            <div className="absolute bottom-full left-0 mb-2 w-64 bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg shadow-lg hidden group-hover:block z-10">
              <div className="p-4">
                <p className="text-sm text-[#A3A3A3] mb-2">kendallbooker3@gmail.com</p>
                <div className="flex items-center p-2 bg-[#252525] rounded-md mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-medium mr-3">
                    KB
                  </div>
                  <div>
                    <p className="text-sm font-medium">Personal</p>
                    <p className="text-xs text-[#A3A3A3] flex items-center">
                      Pro plan
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-[#2e2e2e]">
                <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#252525] transition-colors">
                  Settings
                </button>
                <div className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-[#252525] transition-colors">
                  <span>View all plans</span>
                  <span className="text-xs bg-[#6366F1] text-white px-2 py-0.5 rounded">New</span>
                </div>
                <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#252525] transition-colors flex items-center justify-between">
                  <span>Language</span>
                  <div className="flex items-center">
                    <span className="text-xs bg-[#252525] text-[#A3A3A3] px-2 py-0.5 rounded mr-2">BETA</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#A3A3A3]">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </div>
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#252525] transition-colors">
                  Get help
                </button>
              </div>
              
              <div className="border-t border-[#2e2e2e]">
                <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#252525] transition-colors flex items-center justify-between">
                  <span>Learn more</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#A3A3A3]">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#252525] transition-colors flex items-center justify-between">
                  <span>Download Claude for Mac</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#A3A3A3]">
                    <path d="M15 10L20 15M20 15L15 20M20 15H8C6.93913 15 5.92172 14.5786 5.17157 13.8284C4.42143 13.0783 4 12.0609 4 11C4 9.93913 4.42143 8.92172 5.17157 8.17157C5.92172 7.42143 6.93913 7 8 7H9" />
                  </svg>
                </button>
              </div>
              
              <div className="border-t border-[#2e2e2e]">
                <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#252525] transition-colors">
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header for inner pages */}
        {selectedView !== 'projects' && (
          <div className="h-16 border-b border-[#1E2028] flex items-center px-6">
            <button
              onClick={() => {
                if (selectedView === 'new-project') {
                  setSelectedView('projects');
                } else if (selectedView === 'select-agents') {
                  setSelectedView('new-project');
                } else if (selectedView === 'configure') {
                  setSelectedView('select-agents');
                }
              }}
              className="flex items-center mr-4 text-[#8A8F98] hover:text-white transition-colors"
            >
              <ChevronRight className="rotate-180" size={20} />
            </button>
            <h1 className="text-lg font-medium">
              {selectedView === 'new-project' && 'Create Project'}
              {selectedView === 'select-agents' && 'Select Agent Roles'}
              {selectedView === 'configure' && 'Configure Team'}
            </h1>
          </div>
        )}
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-6 h-full">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 