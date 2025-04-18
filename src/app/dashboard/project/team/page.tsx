'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PlusCircle, Settings, Wrench, Users, Check, Database, FileCode, BarChart4, Trash2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import ProjectHeader from '@/components/project/ProjectHeader';

interface Agent {
  id: string;
  name: string;
  icon: string;
  description: string;
  capabilities: string[];
  recommended: boolean;
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

export default function TeamPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams?.get('id') || '';
  const [projectName, setProjectName] = useState<string>('');
  const [projectData, setProjectData] = useState<any>(null);
  const [activeAgents, setActiveAgents] = useState<Agent[]>([]);
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [autonomousCommunication, setAutonomousCommunication] = useState(true);
  const [knowledgeSharing, setKnowledgeSharing] = useState(true);
  const [ceoApprovalMode, setCeoApprovalMode] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      
      setIsLoading(true);
      try {
        console.log('Loading project with ID:', projectId);
        
        // Use the same API endpoint as the chat page
        const projectData = await fetch(`/api/projects/${projectId}`).then(r => r.json());
        
        if (projectData.error) {
          console.error('Error loading project:', projectData.error);
        } else {
          console.log('Project data loaded:', projectData);
          setProjectData(projectData);
          setProjectName(projectData.name);
          
          // Access agentIds from the API response
          const projectAgentIds = projectData.agentIds || [];
          console.log('Project agent IDs:', projectAgentIds);
          
          if (Array.isArray(projectAgentIds) && projectAgentIds.length > 0) {
            // Filter agent roles based on project's agent IDs
            const activeAgentsList = agentRoles.filter(agent => 
              projectAgentIds.includes(agent.id)
            );
            
            console.log('Active agents after filtering:', activeAgentsList);
            
            // Always include CEO if not already included
            if (!activeAgentsList.some(a => a.id === 'ceo')) {
              const ceoAgent = agentRoles.find(a => a.id === 'ceo');
              if (ceoAgent) {
                activeAgentsList.unshift(ceoAgent);
              }
            }
            
            console.log('Final active agents:', activeAgentsList);
            setActiveAgents(activeAgentsList);
            
            // Calculate available agents (those not in the project)
            const remainingAgents = agentRoles.filter(agent => 
              !projectAgentIds.includes(agent.id) && agent.id !== 'ceo'
            );
            setAvailableAgents(remainingAgents);
          } else {
            // Default to CEO only if no agents specified
            console.log('No agent IDs found or empty array');
            const ceoAgent = agentRoles.find(a => a.id === 'ceo');
            if (ceoAgent) {
              setActiveAgents([ceoAgent]);
              setAvailableAgents(agentRoles.filter(a => a.id !== 'ceo'));
            } else {
              setActiveAgents([]);
              setAvailableAgents(agentRoles);
            }
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

  // Function to add an agent to the team
  const addAgentToTeam = async (agentId: string) => {
    if (!projectId) return;
    
    try {
      // Get current project data
      const supabase = createClient();
      const { data: currentProject, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
        
      if (fetchError) {
        console.error('Error fetching project:', fetchError);
        return;
      }
      
      // Create updated agents array (not agentIds - that's only in the API response)
      const currentAgents = currentProject.agents || [];
      
      // Don't add if already present
      if (currentAgents.includes(agentId)) {
        console.log(`Agent ${agentId} already in team`);
        return;
      }
      
      const updatedAgents = [...currentAgents, agentId];
      console.log('Updated agents array:', updatedAgents);
      
      // Update project with new agents array
      const { error: updateError } = await supabase
        .from('projects')
        .update({ agents: updatedAgents })
        .eq('id', projectId);
        
      if (updateError) {
        console.error('Error updating project:', updateError);
        return;
      }
      
      // Find the agent to add
      const agentToAdd = agentRoles.find(agent => agent.id === agentId);
      if (!agentToAdd) return;
      
      // Update local state
      setActiveAgents(prev => [...prev, agentToAdd]);
      setAvailableAgents(prev => prev.filter(agent => agent.id !== agentId));
      
    } catch (error) {
      console.error('Error adding agent to team:', error);
    }
  };

  // Add function to remove an agent from the team
  const removeAgentFromTeam = async (agentId: string) => {
    if (!projectId || agentId === 'ceo') return; // Don't allow removing the CEO
    
    try {
      // Get current project data
      const supabase = createClient();
      const { data: currentProject, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
        
      if (fetchError) {
        console.error('Error fetching project:', fetchError);
        return;
      }
      
      // Create updated agents array
      const currentAgents = currentProject.agents || [];
      
      // Filter out the agent to remove
      const updatedAgents = currentAgents.filter((id: string) => id !== agentId);
      console.log('Updated agents array after removal:', updatedAgents);
      
      // Update project with new agents array
      const { error: updateError } = await supabase
        .from('projects')
        .update({ agents: updatedAgents })
        .eq('id', projectId);
        
      if (updateError) {
        console.error('Error updating project:', updateError);
        return;
      }
      
      // Find the agent to remove
      const agentToRemove = agentRoles.find(agent => agent.id === agentId);
      if (!agentToRemove) return;
      
      // Update local state
      setActiveAgents(prev => prev.filter(agent => agent.id !== agentId));
      setAvailableAgents(prev => [...prev, agentToRemove]);
      
    } catch (error) {
      console.error('Error removing agent from team:', error);
    }
  };

  // Helper function to get human name from icon path
  const getHumanName = (iconPath: string) => {
    // Extract filename without extension
    const filename = iconPath.split('/').pop()?.split('.')[0] || '';
    
    // Map of filenames to human-readable names
    const nameMap: Record<string, string> = {
      'kenard': 'Kenard',
      'alex': 'Alex',
      'chloe': 'Chloe',
      'mark': 'Mark',
      'hannah': 'Hannah',
      'jenna': 'Jenna',
      'maisie': 'Maisie',
      'garek': 'Garek'
    };
    
    if (nameMap[filename]) {
      return nameMap[filename];
    }
    
    // Default fallback: Convert to capitalized name
    return filename.charAt(0).toUpperCase() + filename.slice(1);
  };

  return (
    <>
      {projectData && (
        <ProjectHeader 
          project={{ 
            id: projectId, 
            name: projectName, 
            status: projectData?.status || 'active' 
          }} 
          title={projectName} 
          section="Team Members" 
        />
      )}
      
      <div className="flex-1 overflow-auto bg-app-primary">
        <div className="max-w-6xl mx-auto p-6 h-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
            </div>
          ) : (
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Team Management</h1>
              <p className="text-[#A3A3A3] max-w-2xl mb-6">
                Configure your AI team members and their roles for this project.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  {/* Active team members */}
                  <div className="bg-[#2E2E2E] border border-[#444] rounded-xl overflow-hidden mb-8">
                    <div className="flex items-center px-6 py-4 border-b border-[#444] from-[#2E2E2E] to-[#232323]">
                      <div className="flex items-center">
                        <div className="bg-[#6366F1]/10 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                          <Users size={18} className="text-[#6366F1]" />
                        </div>
                        <h2 className="text-lg font-medium">Active Team Members</h2>
                      </div>
                    </div>
                    
                    <div className="p-0">
                      {activeAgents && activeAgents.length > 0 ? activeAgents.map((agent, index) => (
                        <div key={agent.id} className={`px-6 py-5 hover:bg-[#202020] transition-colors ${index < activeAgents.length - 1 ? 'border-b border-[#444]' : ''}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-[#202020] rounded-lg flex items-center justify-center mr-4 overflow-hidden">
                                <img 
                                  src={agent.icon} 
                                  alt={agent.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="font-medium text-white mb-1">
                                  {getHumanName(agent.icon)}
                                </h3>
                                <p className="text-sm text-[#A3A3A3]">{agent.name}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {agent.capabilities.slice(0, 3).map((capability, idx) => (
                                    <span key={idx} className="px-2 py-0.5 text-xs rounded-full bg-[#202020] text-[#A3A3A3] border border-[#444]">
                                      {capability}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {agent.id !== 'ceo' && (
                              <div className="group relative">
                                <button 
                                  onClick={() => removeAgentFromTeam(agent.id)}
                                  className="p-2.5 rounded-md border border-[#444] text-[#EF4444] hover:border-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                                  title="Remove agent"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )) : (
                        <div className="px-6 py-10 text-center">
                          <p className="text-[#A3A3A3]">No team members added yet. Add agents to your team to get started.</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Available roles section */}
                  <div className="bg-[#2E2E2E] border border-[#444] rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#444] from-[#2E2E2E] to-[#232323]">
                      <div className="flex items-center">
                        <div className="bg-[#6366F1]/10 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                          <PlusCircle size={18} className="text-[#6366F1]" />
                        </div>
                        <h2 className="text-lg font-medium">Available Roles</h2>
                      </div>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {availableAgents && availableAgents.length > 0 ? availableAgents.map(agent => (
                        <div key={agent.id} className="bg-[#202020] border border-[#444] rounded-lg p-5 hover:border-[#6366F1] transition-colors flex flex-col h-[220px]">
                          <div className="flex items-start mb-4">
                            <div className="w-12 h-12 bg-[#202020] rounded-lg flex items-center justify-center mr-3 overflow-hidden">
                              <img 
                                src={agent.icon} 
                                alt={agent.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-white text-lg truncate">{agent.name}</h4>
                              <p className="text-[#A3A3A3] text-sm line-clamp-2">{agent.description}</p>
                            </div>
                          </div>
                          
                          <div className="mt-auto">
                            <button 
                              onClick={() => addAgentToTeam(agent.id)}
                              className="w-full px-3 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm rounded-md transition-colors flex items-center justify-center gap-1.5"
                            >
                              <span>Add to Team</span>
                            </button>
                          </div>
                        </div>
                      )) : (
                        <div className="col-span-3 py-6 text-center">
                          <p className="text-[#A3A3A3]">All available roles have been added to your team.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Settings sidebar */}
                <div>
                  {/* Team Behavior */}
                  <div className="bg-[#2E2E2E] border border-[#444] rounded-xl overflow-hidden mb-6">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#444]">
                      <div className="flex items-center">
                        <div className="bg-[#6366F1]/10 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                          <Settings size={18} className="text-[#6366F1]" />
                        </div>
                        <h2 className="text-lg font-medium">Team Behavior</h2>
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col items-center justify-center">
                      <p className="text-[#A3A3A3] text-sm mb-2">Coming Soon</p>
                      <p className="text-center text-xs text-[#777] max-w-[200px]">Team behavior settings will be available in a future update.</p>
                    </div>
                  </div>
                  
                  {/* Agent Tools */}
                  <div className="bg-[#2E2E2E] border border-[#444] rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#444]">
                      <div className="flex items-center">
                        <div className="bg-[#6366F1]/10 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                          <Wrench size={18} className="text-[#6366F1]" />
                        </div>
                        <h2 className="text-lg font-medium">Agent Tools</h2>
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col items-center justify-center">
                      <p className="text-[#A3A3A3] text-sm mb-2">Coming Soon</p>
                      <p className="text-center text-xs text-[#777] max-w-[200px]">Tool integrations will be available in a future update.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
