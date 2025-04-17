import { useState } from 'react';
import { 
  Users, PlusCircle, Settings, Check, X
} from 'lucide-react';
import { Project } from '@/components/dashboard/types';
import { 
  addAgentToProject, 
  removeAgentFromProject 
} from '../projectFunctions';

interface ProjectAgentsProps {
  project: Project;
  onProjectUpdated?: (updatedProject: Project) => void;
}

// Mock agent data - in a real app, this would come from an API or database
const mockAgents = [
  {
    id: 'marketing',
    name: 'Marketing Officer',
    role: 'Handles marketing strategy and campaigns',
    status: 'active',
    avatar: '/roleheadshots/darius.png',
    skills: ['Market Analysis', 'Campaign Planning', 'SEO']
  },
  {
    id: 'product',
    name: 'Product Manager',
    role: 'Oversees product development and roadmap',
    status: 'active',
    avatar: '/roleheadshots/abena.png',
    skills: ['Roadmapping', 'User Research', 'Prioritization']
  },
  {
    id: 'developer',
    name: 'Developer',
    role: 'Handles technical implementation',
    status: 'inactive',
    avatar: '/roleheadshots/jackson.png',
    skills: ['Coding', 'Architecture', 'Testing']
  },
  {
    id: 'sales',
    name: 'Sales Representative',
    role: 'Handles client relationships and sales',
    status: 'inactive',
    avatar: '/roleheadshots/sarah.png',
    skills: ['Negotiation', 'Prospecting', 'Presentations']
  }
];

export default function ProjectAgents({ project, onProjectUpdated }: ProjectAgentsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addingAgent, setAddingAgent] = useState<string | null>(null);
  const [removingAgent, setRemovingAgent] = useState<string | null>(null);
  
  // Get active agent IDs from project
  const activeAgentIds = project.agentIds || [];
  
  // Filter agents by active status based on project data
  const activeAgents = mockAgents.filter(agent => activeAgentIds.includes(agent.id));
  const inactiveAgents = mockAgents.filter(agent => !activeAgentIds.includes(agent.id));
  
  // Add agent to project
  const handleAddAgent = async (agentId: string) => {
    setAddingAgent(agentId);
    setIsLoading(true);
    
    try {
      const success = await addAgentToProject(project.id, agentId);
      
      if (success && onProjectUpdated) {
        // Create updated project object with the new agent
        const updatedAgentIds = [...activeAgentIds, agentId];
        
        onProjectUpdated({
          ...project,
          agentIds: updatedAgentIds,
          agents: updatedAgentIds.length
        });
      }
    } catch (error) {
      console.error('Error adding agent:', error);
    } finally {
      setAddingAgent(null);
      setIsLoading(false);
    }
  };
  
  // Remove agent from project
  const handleRemoveAgent = async (agentId: string) => {
    setRemovingAgent(agentId);
    setIsLoading(true);
    
    try {
      const success = await removeAgentFromProject(project.id, agentId);
      
      if (success && onProjectUpdated) {
        // Create updated project object without the removed agent
        const updatedAgentIds = activeAgentIds.filter(id => id !== agentId);
        
        onProjectUpdated({
          ...project,
          agentIds: updatedAgentIds,
          agents: updatedAgentIds.length
        });
      }
    } catch (error) {
      console.error('Error removing agent:', error);
    } finally {
      setRemovingAgent(null);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-[#252525] rounded-xl border border-[#313131] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium">Configure Your Team</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[#343131] hover:bg-[#252525] text-sm rounded-md transition-colors flex items-center gap-2">
            <Settings size={14} />
            <span>Team Settings</span>
          </button>
        </div>
      </div>
      
      {/* Active agents */}
      <div className="mb-8">
        <div className="bg-[#343131] border border-[#313131] rounded-md p-5 mb-6">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Users size={16} className="text-[#6366F1]" />
            <span>Active Team Members</span>
          </h3>
          <p className="text-sm text-[#94A3B8] mb-4">Configure which AI team members are active in your project and customize their roles.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeAgents.map(agent => (
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
                      <span className="px-2 py-0.5 text-xs rounded-md border bg-[#1E293B] text-[#38BDF8] border-[#38BDF8]/30">
                        active
                      </span>
                    </div>
                    <p className="text-sm text-[#94A3B8] mb-3">{agent.role}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {agent.skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-xs rounded-md bg-[#343131] text-[#94A3B8]">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-end">
                      <button 
                        onClick={() => handleRemoveAgent(agent.id)}
                        disabled={isLoading || removingAgent === agent.id}
                        className="px-3 py-1.5 border border-red-800/30 hover:border-red-800/60 text-red-400 text-sm rounded-md transition-colors flex items-center gap-1"
                      >
                        {removingAgent === agent.id ? (
                          <>
                            <div className="w-3 h-3 border-t-2 border-red-400 border-solid rounded-full animate-spin"></div>
                            <span>Removing...</span>
                          </>
                        ) : (
                          <>
                            <X size={14} />
                            <span>Remove</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Available agents */}
        {inactiveAgents.length > 0 && (
          <div className="bg-[#343131] border border-[#313131] rounded-md p-5">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <PlusCircle size={16} className="text-[#6366F1]" />
              <span>Available Team Members</span>
            </h3>
            <p className="text-sm text-[#94A3B8] mb-4">Add more AI team members to your project from the available roles.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inactiveAgents.map(agent => (
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
                        <span className="px-2 py-0.5 text-xs rounded-md border bg-[#1E293B] text-yellow-400 border-yellow-500/30">
                          available
                        </span>
                      </div>
                      <p className="text-sm text-[#94A3B8] mb-3">{agent.role}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {agent.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-xs rounded-md bg-[#343131] text-[#94A3B8]">
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex justify-end">
                        <button 
                          onClick={() => handleAddAgent(agent.id)}
                          disabled={isLoading || addingAgent === agent.id}
                          className="px-3 py-1.5 border border-[#6366F1]/30 hover:border-[#6366F1]/60 text-[#6366F1] text-sm rounded-md transition-colors flex items-center gap-1"
                        >
                          {addingAgent === agent.id ? (
                            <>
                              <div className="w-3 h-3 border-t-2 border-[#6366F1] border-solid rounded-full animate-spin"></div>
                              <span>Adding...</span>
                            </>
                          ) : (
                            <>
                              <Check size={14} />
                              <span>Add to Team</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 