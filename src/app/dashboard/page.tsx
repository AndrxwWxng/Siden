'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import Image from 'next/image';
import { 
  PlusCircle, Settings, Users, ChevronRight, Briefcase, ArrowRight, 
  Database, Bell, Search, Grid, Heart, Filter, Home, MessageSquare,
  BarChart3, Calendar, HelpCircle, ChevronLeft, User, Bot, Paperclip, Send,
  FileText, Code, BookOpen, LogOut, Shield
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { ProjectService } from '@/services/projectService';
import { Project } from '@/components/dashboard/types';
import SignOutButton from '@/components/SignOutButton';
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

// Import our components
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
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
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
  
  // Advanced settings toggle states
  const [knowledgeAccess, setKnowledgeAccess] = useState(true);
  const [memoryPersistence, setMemoryPersistence] = useState(true);
  const [autonomousMode, setAutonomousMode] = useState(false);
  
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  
  // Custom Integration Modal
  const [showCustomIntegrationModal, setShowCustomIntegrationModal] = useState(false);
  const [customIntegrationName, setCustomIntegrationName] = useState('');
  const [customIntegrationEndpoint, setCustomIntegrationEndpoint] = useState('');
  const [customIntegrationAPIKey, setCustomIntegrationAPIKey] = useState('');
  const [customIntegrationDescription, setCustomIntegrationDescription] = useState('');
  const [customIntegrationAuthType, setCustomIntegrationAuthType] = useState<'api_key' | 'oauth' | 'basic'>('api_key');
  const [isAddingIntegration, setIsAddingIntegration] = useState(false);
  const [integrationAdded, setIntegrationAdded] = useState(false);
  
  // Database Connection Modal
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);
  const [databaseType, setDatabaseType] = useState<'mysql' | 'postgres' | 'mongodb'>('postgres');
  const [databaseHost, setDatabaseHost] = useState('');
  const [databasePort, setDatabasePort] = useState('');
  const [databaseName, setDatabaseName] = useState('');
  const [databaseUser, setDatabaseUser] = useState('');
  const [databasePassword, setDatabasePassword] = useState('');
  const [isConnectingDatabase, setIsConnectingDatabase] = useState(false);
  
  // Connection status for integrations
  const [connectedServices, setConnectedServices] = useState<Record<string, boolean>>({
    googleWorkspace: true,
    database: true,
    github: false,
    slack: false,
    hubspot: false
  });
  
  // Connecting state for service buttons
  const [isConnecting, setIsConnecting] = useState<Record<string, boolean>>({
    github: false,
    slack: false,
    hubspot: false,
    customIntegration: false
  });
  
  // Connection handlers
  const handleToggleConnection = (service: string) => {
    // If already connected, show configuration modal instead
    if (connectedServices[service]) {
      // Handle configuration modal (not implemented in this example)
      console.log(`Configuring ${service}`);
      return;
    }
    
    // Show connecting state
    const [isConnecting, setIsConnecting] = useState<Record<string, boolean>>({});
    setIsConnecting(prev => ({ ...prev, [service]: true }));
    
    // Simulate connection process
    setTimeout(() => {
      setConnectedServices(prev => ({ ...prev, [service]: true }));
      setIsConnecting(prev => ({ ...prev, [service]: false }));
    }, 1500);
  };

  const initiateOAuthFlow = (service: string) => {
    // Set connecting state
    setIsConnecting(prev => ({ ...prev, [service]: true }));
    
    // Define OAuth endpoints for different services
    const oauthUrls: Record<string, string> = {
      googleWorkspace: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=client_id_placeholder&redirect_uri=http://localhost:3000/auth/callback&scope=https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/gmail.send&response_type=code',
      github: 'https://github.com/login/oauth/authorize?client_id=client_id_placeholder&scope=repo,user&redirect_uri=http://localhost:3000/auth/callback',
      slack: 'https://slack.com/oauth/v2/authorize?client_id=client_id_placeholder&scope=chat:write,channels:read&redirect_uri=http://localhost:3000/auth/callback',
      hubspot: 'https://app.hubspot.com/oauth/authorize?client_id=client_id_placeholder&scope=contacts%20content&redirect_uri=http://localhost:3000/auth/callback',
    };
    
    // Open popup for OAuth flow
    const width = 600;
    const height = 700;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    
    // Create popup window with proper sizing
    const popup = window.open(
      oauthUrls[service],
      `Connect ${service}`,
      `width=${width},height=${height},left=${left},top=${top},toolbar=0,location=0,menubar=0,directories=0,scrollbars=1`
    );
    
    // Mock successful connection after timeout (in a real app, we'd listen for a message from the popup)
    setTimeout(() => {
      if (popup) popup.close();
      setConnectedServices(prev => ({ ...prev, [service]: true }));
      setIsConnecting(prev => ({ ...prev, [service]: false }));
    }, 3000);
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        setIsLoadingProjects(true);
        const { data, error } = await createClient().auth.getUser();
        
        if (error) {
          console.error('Auth error:', error.message);
          router.push('/signin');
          return;
        }
        
        if (!data.user) {
          router.push('/signin');
          return;
        }
        
        setUser(data.user);
        
        // Load projects after confirming authentication
        try {
          const userProjects = await ProjectService.getUserProjects();
          setProjects(userProjects);
        } catch (error) {
          console.error('Error loading projects:', error);
        } finally {
          setIsLoadingProjects(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/signin');
      }
    };
    
    getUser();
    
    // Set up auth state change listener
    const { data: listener } = createClient().auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/signin');
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          setUser(session.user);
          // Reload projects when auth state changes
          ProjectService.getUserProjects().then(setProjects);
        }
      }
    });
    
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router]);

  // Show loading state if user is not loaded yet
  if (!user) return (
    <div className="flex min-h-screen items-center justify-center bg-[#151515]">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
    </div>
  );

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
  
  const createProject = async () => {
    try {
      setIsCreatingProject(true);
      console.log('Starting project creation with name:', projectName);
      
      // Test the connection before creating the project
      try {
        const response = await fetch('/api/test-connection');
        const connectionTest = await response.json();
        console.log('Connection test results:', connectionTest);
        if (!connectionTest.success) {
          throw new Error('Connection test failed: ' + connectionTest.message);
        }
      } catch (connError) {
        console.error('Connection test error:', connError);
        alert('Failed to connect to the database. Please check your connection and try again.');
        setIsCreatingProject(false);
        return;
      }
      
      // Create project in Supabase with selected agents
      const newProject = await ProjectService.createProject({
        name: projectName,
        description: projectDescription,
        status: 'active',
        agents: selectedAgents // Save selected agents with the project
      });
      
      if (newProject) {
        console.log('Project created successfully:', newProject);
        
        // Add the new project to the state
        setProjects(prevProjects => [newProject, ...prevProjects]);
        
        // Redirect to the project page instead of going back to projects list
        router.push(`/dashboard/project?id=${newProject.id}`);
      } else {
        console.error('Failed to create project - no project returned');
        // Show error message to user
        alert('Failed to create project. Please try again or check the console for details.');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      // Show error message to user
      alert('An error occurred while creating the project. Please try again.');
    } finally {
      setIsCreatingProject(false);
    }
  };

  // Filter and search projects
  const filteredProjects = projects.filter(project => {
    // Apply status filter
    if (selectedFilter === 'active' && project.status !== 'active') return false;
    if (selectedFilter === 'archived' && project.status !== 'archived') return false;
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        project.name.toLowerCase().includes(search) ||
        project.description.toLowerCase().includes(search)
      );
    }
    
    return true;
  });
  
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
                onFilterChange={setSelectedFilter}
                currentFilter={selectedFilter}
              />
              
              {isLoadingProjects ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 border-t-2 border-indigo-500 border-solid rounded-full animate-spin"></div>
                </div>
              ) : filteredProjects.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                  <NewProjectCard onClick={startNewProject} />
                  
                  {filteredProjects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onClick={() => router.push(`/dashboard/project?id=${project.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyProjectState onCreateProject={startNewProject} />
              )}
            </div>
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
                    <Code size={24} className="text-[#6366F1]" />
                  </div>
                  <h3 className="font-medium mb-1">AI Developer Team</h3>
                  <p className="text-xs text-[#A3A3A3]">Code generation and project development</p>
                </div>
                
                <div className="border border-[#444] hover:border-[#6366F1] rounded-lg p-4 cursor-pointer transition-colors flex flex-col items-center text-center group">
                  <div className="w-12 h-12 bg-[#202020] group-hover:bg-[#6366F1]/10 rounded-full flex items-center justify-center mb-3 transition-colors">
                    <FileText size={24} className="text-[#6366F1]" />
                  </div>
                  <h3 className="font-medium mb-1">Content Creation</h3>
                  <p className="text-xs text-[#A3A3A3]">Generate marketing content and social media</p>
                </div>
                
                <div className="border border-[#444] hover:border-[#6366F1] rounded-lg p-4 cursor-pointer transition-colors flex flex-col items-center text-center group">
                  <div className="w-12 h-12 bg-[#202020] group-hover:bg-[#6366F1]/10 rounded-full flex items-center justify-center mb-3 transition-colors">
                    <MessageSquare size={24} className="text-[#6366F1]" />
                  </div>
                  <h3 className="font-medium mb-1">Customer Support</h3>
                  <p className="text-xs text-[#A3A3A3]">AI-powered automation for customer inquiries</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-center">
                {/* "Browse all templates" button removed */}
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
                          <div className={`w-12 h-12 rounded-md overflow-hidden flex items-center justify-center ${
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
                  onClick={() => proceedToConfiguration()}
                  disabled={selectedAgents.length === 0}
                  className={`flex items-center gap-2 py-2 px-4 rounded-md ${
                    selectedAgents.length === 0
                      ? 'bg-[#2E2E2E] text-[#999999] cursor-not-allowed'
                      : 'bg-[#6366F1] hover:bg-[#4F46E5] text-white cursor-pointer'
                  } transition-colors`}
                >
                  <span>Continue to Configure</span>
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
                          <div className="w-10 h-10 rounded-md bg-[#202020] flex items-center justify-center text-xl mr-3 overflow-hidden">
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
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[#444] from-[#2E2E2E] to-[#232323]">
                    <div className="flex items-center">
                      <div className="bg-[#6366F1]/10 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                        <Briefcase size={18} className="text-[#6366F1]" />
                      </div>
                      <h2 className="text-lg font-medium">Integrations</h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-1">
                        {connectedServices.googleWorkspace && (
                          <div className="w-6 h-6 rounded-full bg-white p-0.5 ring-2 ring-[#2E2E2E]">
                            <Image src="/logos/google.svg" alt="Google" width={20} height={20} />
                          </div>
                        )}
                        {connectedServices.github && (
                          <div className="w-6 h-6 rounded-full bg-[#24292e] p-0.5 ring-2 ring-[#2E2E2E]">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                            </svg>
                          </div>
                        )}
                        {connectedServices.slack ? (
                          <div className="w-6 h-6 rounded-full bg-white p-0.5 ring-2 ring-[#2E2E2E]">
                            <Image src="/logos/slack.svg" alt="Slack" width={20} height={20} />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[#24292e] p-0.5 ring-2 ring-[#2E2E2E]">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                            </svg>
                          </div>
                        )}
                        {/* Add more connected service icons as needed */}
                      </div>
                      <div className="text-xs flex items-center bg-[#202020] px-2.5 py-1 rounded-full text-[#A3A3A3] border border-[#444]">
                        <span className="text-white mr-1">{Object.values(connectedServices).filter(Boolean).length}</span>/8
                      </div>
                      <button className="text-xs px-3 py-1.5 rounded-md bg-[#202020] text-[#A3A3A3] hover:text-white transition-colors">
                        Skip
                      </button>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-[#444]">
                    {/* Google Workspace */}
                    <div className="px-6 py-5 hover:bg-[#202020] transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-[#202020] rounded-lg flex items-center justify-center mr-4">
                            <Image src="/logos/google.svg" alt="Google Workspace" width={28} height={28} />
                          </div>
                          <div>
                            <h3 className="font-medium text-white mb-1">Google Workspace</h3>
                            <p className="text-sm text-[#A3A3A3]">Allow agents to access your Docs, Sheets, and Gmail</p>
                          </div>
                        </div>
                        {connectedServices.googleWorkspace ? (
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => initiateOAuthFlow('googleWorkspace')}
                              className="px-4 py-2 rounded-md border border-[#444] text-white hover:border-[#6366F1] transition-colors"
                              disabled={isConnecting.googleWorkspace}
                            >
                              {isConnecting.googleWorkspace ? (
                                <>
                                  <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                                  Reconnecting...
                                </>
                              ) : 'Connected'}
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => initiateOAuthFlow('googleWorkspace')}
                            disabled={isConnecting.googleWorkspace}
                            className="px-4 py-2 rounded-md border border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-colors flex items-center"
                          >
                            {isConnecting.googleWorkspace ? (
                              <>
                                <div className="w-4 h-4 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin mr-2"></div>
                                Connecting...
                              </>
                            ) : (
                              'Connect'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Database Access */}
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
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setShowDatabaseModal(true)} 
                            className="px-4 py-2 rounded-md border border-[#444] text-white hover:border-[#6366F1] transition-colors"
                          >
                            Connected
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* GitHub */}
                    <div className="px-6 py-5 hover:bg-[#202020] transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-[#202020] rounded-lg flex items-center justify-center mr-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" fill="white"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-white mb-1">GitHub</h3>
                            <p className="text-sm text-[#A3A3A3]">Allow agents to access repositories and create pull requests</p>
                          </div>
                        </div>
                        {connectedServices.github ? (
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => console.log('Configuring GitHub')}
                              className="px-4 py-2 rounded-md border border-[#444] text-white hover:border-[#6366F1] transition-colors"
                            >
                              Connected
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => initiateOAuthFlow('github')}
                            disabled={isConnecting.github}
                            className="px-4 py-2 rounded-md border border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-colors flex items-center"
                          >
                            {isConnecting.github ? (
                              <>
                                <div className="w-4 h-4 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin mr-2"></div>
                                Connecting...
                              </>
                            ) : (
                              'Connect'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Slack */}
                    <div className="px-6 py-5 hover:bg-[#202020] transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-[#202020] rounded-lg flex items-center justify-center mr-4">
                            <Image src="/logos/slack.svg" alt="Slack" width={28} height={28} />
                          </div>
                          <div>
                            <h3 className="font-medium text-white mb-1">Slack</h3>
                            <p className="text-sm text-[#A3A3A3]">Allow agents to send messages to your Slack channels</p>
                          </div>
                        </div>
                        {connectedServices.slack ? (
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => console.log('Configuring Slack')}
                              className="px-4 py-2 rounded-md border border-[#444] text-white hover:border-[#6366F1] transition-colors"
                            >
                              Connected
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => initiateOAuthFlow('slack')}
                            disabled={isConnecting.slack}
                            className="px-4 py-2 rounded-md border border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-colors flex items-center"
                          >
                            {isConnecting.slack ? (
                              <>
                                <div className="w-4 h-4 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin mr-2"></div>
                                Connecting...
                              </>
                            ) : (
                              'Connect'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* HubSpot */}
                    <div className="px-6 py-5 hover:bg-[#202020] transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-[#202020] rounded-lg flex items-center justify-center mr-4">
                            <Image src="/logos/hubspot.svg" alt="HubSpot" width={28} height={28} />
                          </div>
                          <div>
                            <h3 className="font-medium text-white mb-1">HubSpot</h3>
                            <p className="text-sm text-[#A3A3A3]">Allow agents to manage contacts and deals in HubSpot</p>
                          </div>
                        </div>
                        {connectedServices.hubspot ? (
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => console.log('Configuring HubSpot')}
                              className="px-4 py-2 rounded-md border border-[#444] text-white hover:border-[#6366F1] transition-colors"
                            >
                              Connected
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => initiateOAuthFlow('hubspot')}
                            disabled={isConnecting.hubspot}
                            className="px-4 py-2 rounded-md border border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-colors flex items-center"
                          >
                            {isConnecting.hubspot ? (
                              <>
                                <div className="w-4 h-4 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin mr-2"></div>
                                Connecting...
                              </>
                            ) : (
                              'Connect'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Custom Integration */}
                    <div className="px-6 py-5 hover:bg-[#202020] transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-[#202020] rounded-lg flex items-center justify-center mr-4">
                            <PlusCircle size={24} className="text-[#6366F1]" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white mb-1">Custom Integration</h3>
                            <p className="text-sm text-[#A3A3A3]">Connect a custom API endpoint for your agents</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setShowCustomIntegrationModal(true)}
                          className={`px-4 py-2 rounded-md border border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-colors flex items-center ${
                            isConnecting.customIntegration ? 'opacity-75 cursor-wait' : ''
                          }`}
                          disabled={isConnecting.customIntegration}
                        >
                          {isConnecting.customIntegration ? (
                            <>
                              <div className="w-4 h-4 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin mr-2"></div>
                              Setting Up...
                            </>
                          ) : (
                            'Set Up'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#2E2E2E] border border-[#444] rounded-xl overflow-hidden mb-8">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[#444]  from-[#2E2E2E] to-[#232323]">
                    <div className="flex items-center">
                      <div className="bg-[#6366F1]/10 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                        <Settings size={18} className="text-[#6366F1]" />
                      </div>
                      <h2 className="text-lg font-medium">Advanced Settings</h2>
                    </div>
                    <div className="flex items-center">
                      <div className="text-xs px-2.5 py-1 rounded-full bg-[#202020] text-[#A3A3A3] border border-[#444]">
                        Optional
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-medium" htmlFor="knowledge-access">Knowledge Access</label>
                        <div className="relative inline-block w-12 h-6 mr-2">
                          <input 
                            id="knowledge-access"
                            type="checkbox" 
                            className="opacity-0 w-0 h-0 absolute" 
                            checked={knowledgeAccess}
                            onChange={(e) => setKnowledgeAccess(e.target.checked)}
                          />
                          <label htmlFor="knowledge-access" className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 ${
                            knowledgeAccess ? 'bg-[#6366F1]' : 'bg-[#444]'
                          } rounded-md transition-colors`}>
                            <span 
                              className={`absolute w-4 h-4 bg-white rounded transition-transform duration-200 ${
                                knowledgeAccess ? 'right-1' : 'left-1'
                              } top-1`}
                            />
                          </label>
                        </div>
                      </div>
                      <p className="text-sm text-[#A3A3A3]">Allow agents to access internet for research</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-medium" htmlFor="memory-persistence">Memory Persistence</label>
                        <div className="relative inline-block w-12 h-6 mr-2">
                          <input 
                            id="memory-persistence"
                            type="checkbox" 
                            className="opacity-0 w-0 h-0 absolute" 
                            checked={memoryPersistence}
                            onChange={(e) => setMemoryPersistence(e.target.checked)}
                          />
                          <label htmlFor="memory-persistence" className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 ${
                            memoryPersistence ? 'bg-[#6366F1]' : 'bg-[#444]'
                          } rounded-md transition-colors`}>
                            <span 
                              className={`absolute w-4 h-4 bg-white rounded transition-transform duration-200 ${
                                memoryPersistence ? 'right-1' : 'left-1'
                              } top-1`}
                            />
                          </label>
                        </div>
                      </div>
                      <p className="text-sm text-[#A3A3A3]">Allow agents to remember past conversations and decisions</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-medium" htmlFor="autonomous-mode">Autonomous Mode</label>
                        <div className="relative inline-block w-12 h-6 mr-2">
                          <input 
                            id="autonomous-mode"
                            type="checkbox" 
                            className="opacity-0 w-0 h-0 absolute" 
                            checked={autonomousMode}
                            onChange={(e) => setAutonomousMode(e.target.checked)}
                          />
                          <label htmlFor="autonomous-mode" className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 ${
                            autonomousMode ? 'bg-[#6366F1]' : 'bg-[#444]'
                          } rounded-md transition-colors`}>
                            <span 
                              className={`absolute w-4 h-4 bg-white rounded transition-transform duration-200 ${
                                autonomousMode ? 'right-1' : 'left-1'
                              } top-1`}
                            />
                          </label>
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
                            <div className="w-10 h-10 rounded-md bg-[#202020] flex items-center justify-center flex-shrink-0 mr-3 overflow-hidden">
                              <img 
                                src={agent.icon} 
                                alt={agent.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white mb-0.5">{agent.name}</h3>
                              <p className="text-xs text-[#6366F1]">AI {agent.name} Role</p>
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {agent.capabilities.slice(0, 2).map((capability, idx) => (
                                  <span key={idx} className="inline-block text-[9px] px-1.5 py-0.5 bg-[#202020] text-[#A3A3A3] rounded-full whitespace-nowrap">
                                    {capability}
                                  </span>
                                ))}
                                {agent.capabilities.length > 2 && (
                                  <span className="inline-block text-[9px] px-1.5 py-0.5 bg-[#202020] text-[#A3A3A3] rounded-full whitespace-nowrap">
                                    +{agent.capabilities.length - 2}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAgentSelection(agent.id);
                              }}
                              className="ml-2 text-[#A3A3A3] hover:text-white flex-shrink-0"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
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
                
                <div className="bg-[#2E2E2E] border border-[#444] rounded-xl overflow-hidden mt-6">
                  <div className="px-6 py-4">
                    <h2 className="text-base font-medium">Team Status</h2>
                  </div>
                  <div className="px-6 py-4 bg-[#202020]">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#A3A3A3]">Tools Connected</span>
                          <span className="text-white">
                            {Object.values(connectedServices).filter(Boolean).length}/6
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#2E2E2E] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#6366F1] rounded-full" 
                            style={{ 
                              width: `${Math.min(100, (Object.values(connectedServices).filter(Boolean).length / 6) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#A3A3A3]">Team Readiness</span>
                          <span className="text-white">
                            {selectedAgents.length > 0 ? 
                              Math.floor((Object.values(connectedServices).filter(Boolean).length / 6) * 100) + 
                              Math.floor((selectedAgents.length / agentRoles.length) * 25)
                              : 0
                            }%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#2E2E2E] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#6366F1] rounded-full" 
                            style={{ 
                              width: `${selectedAgents.length > 0 ? 
                                Math.min(100, 
                                  Math.floor((Object.values(connectedServices).filter(Boolean).length / 6) * 100) + 
                                  Math.floor((selectedAgents.length / agentRoles.length) * 25)
                                ) : 0}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#2E2E2E]">
                      <div className="flex items-center text-xs text-[#A3A3A3]">
                        <svg className="mr-1.5" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Complete configuration to unlock full capabilities
                      </div>
                    </div>
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
                disabled={!projectName.trim() || isCreatingProject}
                className={`px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg flex items-center relative overflow-hidden group ${
                  !projectName.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:from-indigo-600 hover:to-indigo-700'
                }`}
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/30 to-indigo-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {isCreatingProject ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-white rounded-full"></div>
                    <span className="relative z-10">Creating Project...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Create Project</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Custom Integration Modal */}
            {showCustomIntegrationModal && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-[#202020] border border-[#444] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
                  <div className="sticky top-0 bg-[#202020] border-b border-[#444] px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-medium">
                      {integrationAdded ? 'Integration Added' : 'Set Up Custom Integration'}
                    </h2>
                    <button 
                      onClick={() => {
                        setShowCustomIntegrationModal(false);
                        if (integrationAdded) {
                          setIntegrationAdded(false);
                          setCustomIntegrationName('');
                          setCustomIntegrationEndpoint('');
                          setCustomIntegrationAPIKey('');
                          setCustomIntegrationDescription('');
                        }
                      }}
                      className="text-[#8A8F98] hover:text-white transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6L18 18"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="p-6">
                    {integrationAdded ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5"></path>
                          </svg>
                        </div>
                        <h3 className="text-xl font-medium mb-2">Integration Added Successfully</h3>
                        <p className="text-[#A3A3A3] mb-8">
                          Your custom integration "{customIntegrationName}" has been added to your project.
                        </p>
                        <div className="bg-[#2E2E2E] rounded-lg p-4 mb-8 text-left">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-[#A3A3A3]">Endpoint</span>
                            <span className="text-xs px-2 py-1 bg-[#1E293B] text-[#38BDF8] rounded-full border border-[#38BDF8]/30">Connected</span>
                          </div>
                          <p className="font-mono text-sm truncate">{customIntegrationEndpoint}</p>
                        </div>
                        <button
                          onClick={() => {
                            setShowCustomIntegrationModal(false);
                            setIntegrationAdded(false);
                            setCustomIntegrationName('');
                            setCustomIntegrationEndpoint('');
                            setCustomIntegrationAPIKey('');
                            setCustomIntegrationDescription('');
                          }}
                          className="px-6 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-md transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="mb-6">
                          <p className="text-[#A3A3A3] mb-6">
                            Connect your custom API endpoints to enable your AI agents to interact with your services.
                          </p>
                          
                          <div className="bg-[#2E2E2E] rounded-lg p-4 mb-6">
                            <h3 className="font-medium mb-2 flex items-center">
                              <svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              What You'll Need
                            </h3>
                            <ul className="space-y-2 text-sm text-[#A3A3A3]">
                              <li className="flex items-start gap-2">
                                <span className="w-4 h-4 rounded-full bg-[#6366F1] flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="w-2 h-2 bg-white rounded-full"></span>
                                </span>
                                <span>API endpoint URL (HTTPS required)</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="w-4 h-4 rounded-full bg-[#6366F1] flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="w-2 h-2 bg-white rounded-full"></span>
                                </span>
                                <span>Authentication credentials (API key, OAuth tokens, etc.)</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="w-4 h-4 rounded-full bg-[#6366F1] flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="w-2 h-2 bg-white rounded-full"></span>
                                </span>
                                <span>API documentation for endpoints your agents will use</span>
                              </li>
                            </ul>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Integration Name</label>
                              <input
                                type="text"
                                value={customIntegrationName}
                                onChange={(e) => setCustomIntegrationName(e.target.value)}
                                placeholder="e.g., CRM API, Payment Gateway, etc."
                                className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2">API Endpoint URL</label>
                              <input
                                type="url"
                                value={customIntegrationEndpoint}
                                onChange={(e) => setCustomIntegrationEndpoint(e.target.value)}
                                placeholder="https://api.example.com/v1"
                                className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2">Authentication Type</label>
                              <div className="grid grid-cols-3 gap-3">
                                <button
                                  onClick={() => setCustomIntegrationAuthType('api_key')}
                                  className={`p-3 rounded-lg text-center text-sm border ${
                                    customIntegrationAuthType === 'api_key' ? 'border-[#6366F1] bg-[#6366F1]/10' : 'border-[#444] hover:border-[#6366F1]'
                                  } transition-colors`}
                                >
                                  API Key
                                </button>
                                <button
                                  onClick={() => setCustomIntegrationAuthType('oauth')}
                                  className={`p-3 rounded-lg text-center text-sm border ${
                                    customIntegrationAuthType === 'oauth' ? 'border-[#6366F1] bg-[#6366F1]/10' : 'border-[#444] hover:border-[#6366F1]'
                                  } transition-colors`}
                                >
                                  OAuth 2.0
                                </button>
                                <button
                                  onClick={() => setCustomIntegrationAuthType('basic')}
                                  className={`p-3 rounded-lg text-center text-sm border ${
                                    customIntegrationAuthType === 'basic' ? 'border-[#6366F1] bg-[#6366F1]/10' : 'border-[#444] hover:border-[#6366F1]'
                                  } transition-colors`}
                                >
                                  Basic Auth
                                </button>
                              </div>
                            </div>
                            
                            {customIntegrationAuthType === 'api_key' && (
                              <div>
                                <label className="block text-sm font-medium mb-2">API Key</label>
                                <input
                                  type="password"
                                  value={customIntegrationAPIKey}
                                  onChange={(e) => setCustomIntegrationAPIKey(e.target.value)}
                                  placeholder="Enter your API key"
                                  className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
                                />
                              </div>
                            )}
                            
                            {customIntegrationAuthType === 'oauth' && (
                              <div className="bg-[#2E2E2E] p-4 rounded-lg">
                                <p className="text-sm text-[#A3A3A3] mb-3">
                                  OAuth 2.0 setup requires additional configuration through our developer console.
                                </p>
                                <button className="text-[#6366F1] text-sm hover:underline">
                                  Open Developer Console
                                </button>
                              </div>
                            )}
                            
                            {customIntegrationAuthType === 'basic' && (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">Username</label>
                                  <input
                                    type="text"
                                    placeholder="Enter username"
                                    className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2">Password</label>
                                  <input
                                    type="password"
                                    placeholder="Enter password"
                                    className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
                                  />
                                </div>
                              </div>
                            )}
                            
                            <div>
                              <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                              <textarea
                                value={customIntegrationDescription}
                                onChange={(e) => setCustomIntegrationDescription(e.target.value)}
                                placeholder="Describe what this API will be used for"
                                rows={3}
                                className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => setShowCustomIntegrationModal(false)}
                            className="px-4 py-2 border border-[#444] hover:border-[#6366F1] rounded-md transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              setIsAddingIntegration(true);
                              // Simulate API call to add the integration
                              setTimeout(() => {
                                setIsAddingIntegration(false);
                                setIntegrationAdded(true);
                              }, 1500);
                            }}
                            disabled={!customIntegrationName || !customIntegrationEndpoint || (customIntegrationAuthType === 'api_key' && !customIntegrationAPIKey) || isAddingIntegration}
                            className={`px-6 py-2.5 rounded-md transition-colors flex items-center ${
                              !customIntegrationName || !customIntegrationEndpoint || (customIntegrationAuthType === 'api_key' && !customIntegrationAPIKey) || isAddingIntegration
                                ? 'bg-[#444] text-[#999] cursor-not-allowed'
                                : 'bg-[#6366F1] hover:bg-[#4F46E5] text-white'
                            }`}
                          >
                            {isAddingIntegration ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Setting Up...
                              </>
                            ) : (
                              'Add Integration'
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Database Connection Modal */}
            {showDatabaseModal && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-[#202020] border border-[#444] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
                  <div className="sticky top-0 bg-[#202020] border-b border-[#444] px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-medium">Configure Database Connection</h2>
                    <button 
                      onClick={() => setShowDatabaseModal(false)}
                      className="text-[#8A8F98] hover:text-white transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6L18 18"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-6">
                      <p className="text-[#A3A3A3] mb-6">
                        Configure your database connection to allow AI agents to securely query and manage your data.
                      </p>
                      
                      <div className="bg-[#2E2E2E] rounded-lg p-4 mb-6">
                        <h3 className="font-medium mb-2 flex items-center">
                          <svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          Security Information
                        </h3>
                        <p className="text-sm text-[#A3A3A3] mb-2">
                          Your database credentials are securely stored and encrypted. Our system:
                        </p>
                        <ul className="space-y-2 text-sm text-[#A3A3A3]">
                          <li className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-[#6366F1] flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="w-2 h-2 bg-white rounded-full"></span>
                            </span>
                            <span>Uses end-to-end encryption for all credentials</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-[#6366F1] flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="w-2 h-2 bg-white rounded-full"></span>
                            </span>
                            <span>Only executes read-only queries by default</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-[#6366F1] flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="w-2 h-2 bg-white rounded-full"></span>
                            </span>
                            <span>Allows you to set explicit permissions and access controls</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Database Type</label>
                          <div className="grid grid-cols-3 gap-3">
                            <button
                              onClick={() => setDatabaseType('postgres')}
                              className={`p-3 rounded-lg text-center text-sm border ${
                                databaseType === 'postgres' ? 'border-[#6366F1] bg-[#6366F1]/10' : 'border-[#444] hover:border-[#6366F1]'
                              } transition-colors`}
                            >
                              PostgreSQL
                            </button>
                            <button
                              onClick={() => setDatabaseType('mysql')}
                              className={`p-3 rounded-lg text-center text-sm border ${
                                databaseType === 'mysql' ? 'border-[#6366F1] bg-[#6366F1]/10' : 'border-[#444] hover:border-[#6366F1]'
                              } transition-colors`}
                            >
                              MySQL
                            </button>
                            <button
                              onClick={() => setDatabaseType('mongodb')}
                              className={`p-3 rounded-lg text-center text-sm border ${
                                databaseType === 'mongodb' ? 'border-[#6366F1] bg-[#6366F1]/10' : 'border-[#444] hover:border-[#6366F1]'
                              } transition-colors`}
                            >
                              MongoDB
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Host</label>
                            <input
                              type="text"
                              value={databaseHost}
                              onChange={(e) => setDatabaseHost(e.target.value)}
                              placeholder="e.g., db.example.com"
                              className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Port</label>
                            <input
                              type="text"
                              value={databasePort}
                              onChange={(e) => setDatabasePort(e.target.value)}
                              placeholder={databaseType === 'postgres' ? '5432' : databaseType === 'mysql' ? '3306' : '27017'}
                              className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Database Name</label>
                          <input
                            type="text"
                            value={databaseName}
                            onChange={(e) => setDatabaseName(e.target.value)}
                            placeholder="e.g., my_application_db"
                            className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Username</label>
                          <input
                            type="text"
                            value={databaseUser}
                            onChange={(e) => setDatabaseUser(e.target.value)}
                            placeholder="Database username"
                            className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Password</label>
                          <input
                            type="password"
                            value={databasePassword}
                            onChange={(e) => setDatabasePassword(e.target.value)}
                            placeholder="Database password"
                            className="w-full px-4 py-3 bg-[#2E2E2E] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
                          />
                        </div>
                        
                        <div className="flex items-center py-2">
                          <input 
                            id="read-only-access" 
                            type="checkbox" 
                            className="w-4 h-4 accent-[#6366F1]" 
                            defaultChecked 
                          />
                          <label htmlFor="read-only-access" className="ml-2 text-sm text-[#A3A3A3]">
                            Limit to read-only access (recommended)
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowDatabaseModal(false)}
                        className="px-4 py-2 border border-[#444] hover:border-[#6366F1] rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setIsConnectingDatabase(true);
                          // Simulate testing the connection
                          setTimeout(() => {
                            setIsConnectingDatabase(false);
                            // Mark database as connected (or reconnected with new settings)
                            setConnectedServices(prev => ({ ...prev, database: true }));
                            setShowDatabaseModal(false);
                          }, 2000);
                        }}
                        disabled={!databaseHost || !databaseName || !databaseUser || !databasePassword || isConnectingDatabase}
                        className={`px-6 py-2.5 rounded-md transition-colors flex items-center ${
                          !databaseHost || !databaseName || !databaseUser || !databasePassword || isConnectingDatabase
                            ? 'bg-[#444] text-[#999] cursor-not-allowed'
                            : 'bg-[#6366F1] hover:bg-[#4F46E5] text-white'
                        }`}
                      >
                        {isConnectingDatabase ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Testing Connection...
                          </>
                        ) : (
                          'Connect Database'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
        projects={projects} 
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
          <span className="mr-4">Welcome, {user.email}</span>
          <div className="ml-auto">
            <SignOutButton />
          </div>
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