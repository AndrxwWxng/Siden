import { useState } from 'react';
import { 
  PlusCircle, Wrench, Database, Cloud, Globe, 
  Server, File, Code, Link2, Unlink, Trash2
} from 'lucide-react';
import { Project, Service } from '@/components/dashboard/types';
import { updateProjectIntegrations } from '../projectFunctions';

interface ProjectIntegrationsProps {
  project: Project;
  onProjectUpdated?: (updatedProject: Project) => void;
}

// Mock tools data - this would typically come from an API or database
const mockTools = [
  {
    id: 'github',
    name: 'GitHub',
    type: 'service',
    description: 'Connect your GitHub repositories for code integration',
    icon: <Code size={18} />,
    connected: false,
    category: 'Development'
  },
  {
    id: 'slack',
    name: 'Slack',
    type: 'communication',
    description: 'Send updates and notifications to your Slack channels',
    icon: <Cloud size={18} />,
    connected: true,
    category: 'Communication'
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    type: 'database',
    description: 'Connect to your PostgreSQL database',
    icon: <Database size={18} />,
    connected: false,
    category: 'Data & Analytics'
  },
  {
    id: 'aws',
    name: 'AWS S3',
    type: 'storage',
    description: 'Use Amazon S3 for file storage and retrieval',
    icon: <Server size={18} />,
    connected: true,
    category: 'Development'
  },
  {
    id: 'google_drive',
    name: 'Google Drive',
    type: 'storage',
    description: 'Access and manage your Google Drive files',
    icon: <File size={18} />,
    connected: false,
    category: 'Productivity'
  },
  {
    id: 'api',
    name: 'Custom API',
    type: 'api',
    description: 'Connect to your own custom API endpoints',
    icon: <Globe size={18} />,
    connected: false,
    category: 'Development'
  }
];

export default function ProjectIntegrations({ project, onProjectUpdated }: ProjectIntegrationsProps) {
  const [activeCategory, setActiveCategory] = useState('All Tools');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  
  // Get project integrations
  const projectIntegrations = project.integrations || { connected: false, services: [] };
  
  // Determine if a service is connected in the project
  const isServiceConnected = (serviceId: string) => {
    return projectIntegrations.services.some(s => s.id === serviceId);
  };
  
  // Convert mock tool to service object
  const toolToService = (tool: any): Service => {
    return {
      id: tool.id,
      name: tool.name,
      type: tool.type as any,
      status: 'connected',
      endpoint: `https://api.example.com/${tool.id}` // Mock endpoint
    };
  };
  
  // Connect a service
  const handleConnectService = async (tool: any) => {
    setIsUpdating(tool.id);
    
    try {
      // Create a copy of current services
      const currentServices = [...projectIntegrations.services];
      
      // Add the new service
      const newService = toolToService(tool);
      const updatedServices = [...currentServices, newService];
      
      // Create updated integrations object
      const updatedIntegrations = {
        connected: updatedServices.length > 0,
        services: updatedServices
      };
      
      // Update the project integrations
      const success = await updateProjectIntegrations(project.id, updatedIntegrations);
      
      if (success && onProjectUpdated) {
        // Update the project in state
        onProjectUpdated({
          ...project,
          integrations: updatedIntegrations
        });
      }
    } catch (error) {
      console.error('Error connecting service:', error);
    } finally {
      setIsUpdating(null);
    }
  };
  
  // Disconnect a service
  const handleDisconnectService = async (serviceId: string) => {
    setIsUpdating(serviceId);
    
    try {
      // Create a copy of current services without the removed one
      const updatedServices = projectIntegrations.services.filter(s => s.id !== serviceId);
      
      // Create updated integrations object
      const updatedIntegrations = {
        connected: updatedServices.length > 0,
        services: updatedServices
      };
      
      // Update the project integrations
      const success = await updateProjectIntegrations(project.id, updatedIntegrations);
      
      if (success && onProjectUpdated) {
        // Update the project in state
        onProjectUpdated({
          ...project,
          integrations: updatedIntegrations
        });
      }
    } catch (error) {
      console.error('Error disconnecting service:', error);
    } finally {
      setIsUpdating(null);
    }
  };
  
  // Filter tools by category
  const getFilteredTools = () => {
    if (activeCategory === 'All Tools') {
      return mockTools;
    }
    return mockTools.filter(tool => tool.category === activeCategory);
  };
  
  const filteredTools = getFilteredTools();
  const connectedTools = filteredTools.filter(tool => 
    isServiceConnected(tool.id) || 
    (tool.connected && !projectIntegrations.services.some(s => s.id === tool.id))
  );
  const availableTools = filteredTools.filter(tool => 
    !isServiceConnected(tool.id) && 
    (!tool.connected || projectIntegrations.services.some(s => s.id === tool.id))
  );
  
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
      <div className="flex border-b border-[#313131] mb-6 overflow-x-auto pb-1">
        {['All Tools', 'Communication', 'Data & Analytics', 'Productivity', 'Development'].map(category => (
          <button 
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 whitespace-nowrap ${
              activeCategory === category 
                ? 'border-b-2 border-[#6366F1] text-white' 
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Connected tools */}
      {connectedTools.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm text-[#94A3B8] uppercase tracking-wider mb-4">Connected Tools</h3>
          <div className="space-y-4">
            {connectedTools.map(tool => (
              <div key={tool.id} className="bg-[#343131] border border-[#313131] rounded-md p-4 hover:border-[#444] transition-all">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-md bg-[#252525] flex items-center justify-center overflow-hidden mr-3 text-lg">
                    {tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-white">{tool.name}</h3>
                    </div>
                    <p className="text-sm text-[#94A3B8] mb-4">{tool.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-1 text-xs rounded-full bg-[#252525] text-[#38BDF8]">
                          Connected
                        </div>
                        <div className="text-xs text-[#94A3B8]">
                          Last used: 2 hours ago
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleDisconnectService(tool.id)}
                        disabled={isUpdating === tool.id}
                        className="px-3 py-1.5 text-sm rounded-md hover:bg-[#252525] transition-colors flex items-center gap-1 text-red-400"
                      >
                        {isUpdating === tool.id ? (
                          <>
                            <div className="w-3 h-3 border-t-2 border-red-400 border-solid rounded-full animate-spin"></div>
                            <span>Disconnecting...</span>
                          </>
                        ) : (
                          <>
                            <Unlink size={14} />
                            <span>Disconnect</span>
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
      
      {/* Available tools */}
      {availableTools.length > 0 && (
        <div>
          <h3 className="text-sm text-[#94A3B8] uppercase tracking-wider mb-4">Available Tools</h3>
          <div className="space-y-4">
            {availableTools.map(tool => (
              <div key={tool.id} className="bg-[#343131] border border-[#313131] rounded-md p-4 hover:border-[#444] transition-all">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-md bg-[#252525] flex items-center justify-center overflow-hidden mr-3 text-lg">
                    {tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-white">{tool.name}</h3>
                    </div>
                    <p className="text-sm text-[#94A3B8] mb-4">{tool.description}</p>
                    
                    <div className="flex items-center justify-end">
                      <button 
                        onClick={() => handleConnectService(tool)}
                        disabled={isUpdating === tool.id}
                        className="px-3 py-1.5 border border-[#6366F1]/30 hover:border-[#6366F1]/60 text-[#6366F1] text-sm rounded-md transition-colors flex items-center gap-1"
                      >
                        {isUpdating === tool.id ? (
                          <>
                            <div className="w-3 h-3 border-t-2 border-[#6366F1] border-solid rounded-full animate-spin"></div>
                            <span>Connecting...</span>
                          </>
                        ) : (
                          <>
                            <Link2 size={14} />
                            <span>Connect</span>
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
  );
} 