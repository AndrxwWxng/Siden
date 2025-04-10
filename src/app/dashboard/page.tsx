'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import Logo from '@/components/Logo';
import { PlusCircle, Settings, Users, ChevronRight, Briefcase, ArrowRight, Database } from 'lucide-react';

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
    lastActive: '2 hours ago'
  },
  {
    id: 'p2',
    name: 'E-commerce Analytics Dashboard',
    description: 'Real-time analytics and insights for online stores',
    agents: 3,
    status: 'active',
    lastActive: '1 day ago'
  }
];

export default function Dashboard() {
  const router = useRouter();
  const [selectedView, setSelectedView] = useState<'projects' | 'new-project' | 'select-agents' | 'configure'>('projects');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [companyInfo, setCompanyInfo] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['ceo', 'dev', 'marketing']);
  
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
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Your Workforce</h1>
              <button 
                onClick={startNewProject}
                className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-md transition-colors"
              >
                <PlusCircle size={18} />
                Create New Project
              </button>
            </div>
            
            {mockProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockProjects.map(project => (
                  <div 
                    key={project.id} 
                    className="p-6 bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg hover:border-[#6366F1] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-medium">{project.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-[#A3A3A3] mb-4">{project.description}</p>
                    
                    <div className="flex items-center text-sm text-[#A3A3A3] mb-5">
                      <span className="flex items-center mr-4">
                        <Users size={14} className="mr-1" />
                        {project.agents} agents
                      </span>
                      <span>Last active: {project.lastActive}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => router.push(`/dashboard/project?id=${project.id}`)}
                        className="px-3 py-1.5 bg-[#252525] hover:bg-[#333] text-sm rounded transition-colors"
                      >
                        View Project
                      </button>
                      <button className="px-3 py-1.5 bg-transparent border border-[#2e2e2e] hover:border-[#6366F1] text-sm rounded transition-colors">
                        <Settings size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-xl font-medium mb-2">No projects yet</h3>
                <p className="text-[#A3A3A3] mb-6">Create your first project to get started</p>
                <button 
                  onClick={startNewProject}
                  className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-md transition-colors"
                >
                  Create Your First Project
                </button>
              </div>
            )}
          </div>
        );
        
      case 'new-project':
        return (
          <div className="max-w-2xl mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Create Your Agent Workforce</h1>
              <p className="text-[#A3A3A3]">Let's set up your AI team to help with your business</p>
            </div>
            
            <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">1. What are you building?</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., Marketing Campaign Builder"
                  className="w-full px-3 py-2 bg-[#252525] border border-[#2e2e2e] rounded-md focus:outline-none focus:border-[#6366F1]"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Project Description</label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Briefly describe what you're building and its purpose"
                  rows={3}
                  className="w-full px-3 py-2 bg-[#252525] border border-[#2e2e2e] rounded-md focus:outline-none focus:border-[#6366F1]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Company Information (Optional)</label>
                <textarea
                  value={companyInfo}
                  onChange={(e) => setCompanyInfo(e.target.value)}
                  placeholder="Tell us about your company, market, and goals (helps agents understand context)"
                  rows={4}
                  className="w-full px-3 py-2 bg-[#252525] border border-[#2e2e2e] rounded-md focus:outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedView('projects')}
                className="px-4 py-2 border border-[#2e2e2e] hover:border-[#6366F1] rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={proceedToAgentSelection}
                disabled={!projectName.trim()}
                className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                  projectName.trim() 
                    ? 'bg-[#6366F1] hover:bg-[#4F46E5] text-white' 
                    : 'bg-[#252525] text-[#A3A3A3] cursor-not-allowed'
                }`}
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        );
        
      case 'select-agents':
        return (
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Select Your Team Members</h1>
              <p className="text-[#A3A3A3]">Choose which agents you want on your team</p>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Available Roles</h2>
                <span className="text-sm text-[#A3A3A3]">{selectedAgents.length} selected</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {agentRoles.map(role => (
                  <div 
                    key={role.id}
                    onClick={() => toggleAgentSelection(role.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedAgents.includes(role.id)
                        ? 'border-[#6366F1] bg-[#6366F1]/10'
                        : 'border-[#2e2e2e] bg-[#1a1a1a] hover:border-[#3e3e3e]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{role.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{role.name}</h3>
                          {role.recommended && (
                            <span className="text-xs bg-[#6366F1]/20 text-[#6366F1] px-2 py-0.5 rounded-full">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#A3A3A3] mt-1">{role.description}</p>
                        
                        <div className="mt-3">
                          <h4 className="text-xs font-medium mb-1">Capabilities:</h4>
                          <ul className="text-xs text-[#A3A3A3]">
                            {role.capabilities.map((capability, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <span className="w-1 h-1 bg-[#6366F1] rounded-full"></span>
                                {capability}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setSelectedView('new-project')}
                className="px-4 py-2 border border-[#2e2e2e] hover:border-[#6366F1] rounded-md transition-colors flex items-center gap-2"
              >
                <ChevronRight className="rotate-180" size={16} /> Back
              </button>
              <button
                onClick={proceedToConfiguration}
                disabled={selectedAgents.length === 0}
                className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                  selectedAgents.length > 0 
                    ? 'bg-[#6366F1] hover:bg-[#4F46E5] text-white' 
                    : 'bg-[#252525] text-[#A3A3A3] cursor-not-allowed'
                }`}
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        );
        
      case 'configure':
        return (
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Configure Your Team</h1>
              <p className="text-[#A3A3A3]">Set up integrations and finalize your agent team</p>
            </div>
            
            <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-6 mb-8">
              <h2 className="text-lg font-medium mb-4">Connect Tools & Resources</h2>
              
              <div className="space-y-4">
                <div className="p-3 border border-[#2e2e2e] rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#252525] rounded-full flex items-center justify-center">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">Google Workspace</h3>
                      <p className="text-xs text-[#A3A3A3]">Connect Docs, Sheets, and Gmail</p>
                    </div>
                  </div>
                  <button className="text-[#6366F1] text-sm hover:underline">Connect</button>
                </div>
                
                <div className="p-3 border border-[#2e2e2e] rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#252525] rounded-full flex items-center justify-center">
                      <Database size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">Database Access</h3>
                      <p className="text-xs text-[#A3A3A3]">Connect to SQL databases</p>
                    </div>
                  </div>
                  <button className="text-[#6366F1] text-sm hover:underline">Connect</button>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <button className="text-sm text-[#A3A3A3] hover:text-white transition-colors">
                  Skip for now
                </button>
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-6 mb-8">
              <h2 className="text-lg font-medium mb-4">Review Your Team</h2>
              
              <div className="space-y-3">
                {selectedAgents.map(agentId => {
                  const agent = agentRoles.find(role => role.id === agentId);
                  if (!agent) return null;
                  
                  return (
                    <div key={agent.id} className="flex items-center gap-3">
                      <div className="text-xl">{agent.icon}</div>
                      <div>
                        <h3 className="font-medium">{agent.name}</h3>
                        <p className="text-xs text-[#A3A3A3]">{agent.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setSelectedView('select-agents')}
                className="px-4 py-2 border border-[#2e2e2e] hover:border-[#6366F1] rounded-md transition-colors flex items-center gap-2"
              >
                <ChevronRight className="rotate-180" size={16} /> Back
              </button>
              <button
                onClick={createProject}
                className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-md transition-colors flex items-center gap-2"
              >
                Launch Team <ArrowRight size={16} />
              </button>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      <header className="border-b border-[#2e2e2e] bg-[#0E0E0E]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-4">
              <button className="text-[#A3A3A3] hover:text-white transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-8">
        {renderContent()}
      </main>
      
      <footer className="border-t border-[#2e2e2e] py-4">
        <div className="container mx-auto px-4 text-center text-sm text-[#A3A3A3]">
          &copy; {new Date().getFullYear()} Siden. All rights reserved.
        </div>
      </footer>
    </div>
  );
} 