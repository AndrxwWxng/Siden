'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PlusCircle, Settings, Wrench, Database, FileCode, BarChart4, Check, Users, Briefcase } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import ProjectHeader from '@/components/project/ProjectHeader';
import Image from 'next/image';
import { ReactNode } from 'react';

interface Tool {
  id: string;
  name: string;
  icon: string | ReactNode;
  description: string;
  connected: boolean;
}

export default function ToolsPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams?.get('id') || '';
  const [projectName, setProjectName] = useState<string>('');
  const [projectData, setProjectData] = useState<any>(null);
  const [connectedTools, setConnectedTools] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [knowledgeAccess, setKnowledgeAccess] = useState(true);
  const [memoryPersistence, setMemoryPersistence] = useState(true);
  const [autonomousMode, setAutonomousMode] = useState(false);
  const [sandboxMode, setSandboxMode] = useState(false);
  const [isConnecting, setIsConnecting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      
      setIsLoading(true);
      try {
        // Use the same API endpoint as the team page
        const projectData = await fetch(`/api/projects/${projectId}`).then(r => r.json());
        
        if (projectData.error) {
          console.error('Error loading project:', projectData.error);
        } else {
          console.log('Project data loaded:', projectData);
          setProjectData(projectData);
          setProjectName(projectData.name);
          
          // Set connected tools based on project data
          // Assuming project data has a tools field or similar
          setConnectedTools(projectData.tools || ['googleWorkspace', 'database']);
        }
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProject();
  }, [projectId]);

  const initiateOAuthFlow = (service: string) => {
    setIsConnecting(prev => ({ ...prev, [service]: true }));
    
    // Simulate OAuth flow with timeout
    setTimeout(() => {
      setConnectedTools(prev => {
        if (prev.includes(service)) {
          return prev;
        }
        return [...prev, service];
      });
      setIsConnecting(prev => ({ ...prev, [service]: false }));
    }, 1500);
  };

  const disconnectTool = (service: string) => {
    setConnectedTools(prev => prev.filter(tool => tool !== service));
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
          section="Tools & Integration" 
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
              <h1 className="text-3xl font-bold mb-2">Configure Your Tools</h1>
              <p className="text-[#A3A3A3] max-w-2xl mb-6">
                Connect tools and resources that your AI team can use to help accomplish your goals.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                          {connectedTools.includes('googleWorkspace') && (
                            <div className="w-6 h-6 rounded-full bg-white p-0.5 ring-2 ring-[#2E2E2E]">
                              <Image src="/logos/google.svg" alt="Google" width={20} height={20} />
                            </div>
                          )}
                          {connectedTools.includes('github') && (
                            <div className="w-6 h-6 rounded-full bg-[#24292e] p-0.5 ring-2 ring-[#2E2E2E]">
                              <Image src="/logos/github.svg" alt="GitHub" width={18} height={18} />
                            </div>
                          )}
                          {connectedTools.includes('slack') && (
                            <div className="w-6 h-6 rounded-full bg-white p-0.5 ring-2 ring-[#2E2E2E]">
                              <Image src="/logos/slack.svg" alt="Slack" width={20} height={20} />
                            </div>
                          )}
                          {connectedTools.includes('hubspot') && (
                            <div className="w-6 h-6 rounded-full bg-white p-0.5 ring-2 ring-[#2E2E2E]">
                              <Image src="/logos/hubspot.svg" alt="HubSpot" width={20} height={20} />
                            </div>
                          )}
                          {connectedTools.includes('database') && (
                            <div className="w-6 h-6 rounded-full bg-white p-0.5 ring-2 ring-[#2E2E2E]">
                              <div className="w-full h-full flex items-center justify-center bg-[#38BDF8] rounded-full">
                                <Database size={12} color="white" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-xs flex items-center bg-[#202020] px-2.5 py-1 rounded-md text-[#A3A3A3] border border-[#444]">
                          <span className="text-white mr-1">{connectedTools.length}</span>/8
                        </div>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-[#444]">
                      {/* Google Workspace */}
                      <div className="px-6 py-5 hover:bg-[#202020] transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-[#202020] rounded-lg flex items-center justify-center mr-4">
                              <Image src="/logos/google.svg" alt="Google" width={28} height={28} />
                            </div>
                            <div>
                              <h3 className="font-medium text-white mb-1">Google Workspace</h3>
                              <p className="text-sm text-[#A3A3A3]">Allow agents to access your Docs, Sheets, and Gmail</p>
                            </div>
                          </div>
                          <div className="px-2.5 py-1.5 text-xs bg-[#333] rounded text-[#A3A3A3]">
                            Coming Soon
                          </div>
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
                          <div className="px-2.5 py-1.5 text-xs bg-[#333] rounded text-[#A3A3A3]">
                            Coming Soon
                          </div>
                        </div>
                      </div>
                      
                      {/* GitHub */}
                      <div className="px-6 py-5 hover:bg-[#202020] transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-[#202020] rounded-lg flex items-center justify-center mr-4">
                              <Image src="/logos/github.svg" alt="GitHub" width={28} height={28} />
                            </div>
                            <div>
                              <h3 className="font-medium text-white mb-1">GitHub</h3>
                              <p className="text-sm text-[#A3A3A3]">Allow agents to access repositories and create pull requests</p>
                            </div>
                          </div>
                          <div className="px-2.5 py-1.5 text-xs bg-[#333] rounded text-[#A3A3A3]">
                            Coming Soon
                          </div>
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
                          <div className="px-2.5 py-1.5 text-xs bg-[#333] rounded text-[#A3A3A3]">
                            Coming Soon
                          </div>
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
                          <div className="px-2.5 py-1.5 text-xs bg-[#333] rounded text-[#A3A3A3]">
                            Coming Soon
                          </div>
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
                          <div className="px-2.5 py-1.5 text-xs bg-[#333] rounded text-[#A3A3A3]">
                            Coming Soon
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  {/* Advanced Settings */}
                  <div className="bg-[#2E2E2E] border border-[#444] rounded-xl overflow-hidden mb-6">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#444]">
                      <div className="flex items-center">
                        <div className="bg-[#6366F1]/10 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                          <Settings size={18} className="text-[#6366F1]" />
                        </div>
                        <h2 className="text-lg font-medium">Advanced Settings</h2>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <h3 className="font-medium text-sm">Knowledge Access</h3>
                          <p className="text-xs text-[#A3A3A3] mt-0.5">Allow agents to access internet for research</p>
                        </div>
                        <div 
                          className="relative inline-block w-10 h-5 rounded-md bg-[#202020] cursor-pointer"
                          onClick={() => setKnowledgeAccess(!knowledgeAccess)}
                        >
                          <span className={`block h-5 w-5 rounded-md ${knowledgeAccess ? 'bg-[#6366F1]' : 'bg-[#444]'} absolute left-0 transition-transform transform ${knowledgeAccess ? 'translate-x-5' : 'translate-x-0'}`}></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <h3 className="font-medium text-sm">Memory Persistence</h3>
                          <p className="text-xs text-[#A3A3A3] mt-0.5">Allow agents to remember past conversations</p>
                        </div>
                        <div 
                          className="relative inline-block w-10 h-5 rounded-md bg-[#202020] cursor-pointer"
                          onClick={() => setMemoryPersistence(!memoryPersistence)}
                        >
                          <span className={`block h-5 w-5 rounded-md ${memoryPersistence ? 'bg-[#6366F1]' : 'bg-[#444]'} absolute left-0 transition-transform transform ${memoryPersistence ? 'translate-x-5' : 'translate-x-0'}`}></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <h3 className="font-medium text-sm">Autonomous Mode</h3>
                          <p className="text-xs text-[#A3A3A3] mt-0.5">Allow agents to work without approval</p>
                        </div>
                        <div 
                          className="relative inline-block w-10 h-5 rounded-md bg-[#202020] cursor-pointer"
                          onClick={() => setAutonomousMode(!autonomousMode)}
                        >
                          <span className={`block h-5 w-5 rounded-md ${autonomousMode ? 'bg-[#6366F1]' : 'bg-[#444]'} absolute left-0 transition-transform transform ${autonomousMode ? 'translate-x-5' : 'translate-x-0'}`}></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <h3 className="font-medium text-sm">Sandbox Mode <span className="text-[10px] ml-1 px-1.5 py-0.5 bg-[#6366F1]/20 text-[#6366F1] rounded-sm">Coming Soon</span></h3>
                          <p className="text-xs text-[#A3A3A3] mt-0.5">Run tools in isolated environment</p>
                        </div>
                        <div 
                          className="relative inline-block w-10 h-5 rounded-md bg-[#202020] opacity-50 cursor-not-allowed"
                        >
                          <span className="block h-5 w-5 rounded-md bg-[#444] absolute left-0 transform translate-x-0"></span>
                        </div>
                      </div>
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