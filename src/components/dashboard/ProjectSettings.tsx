import React, { useState, useEffect } from 'react';
import { ProjectService } from '@/services/projectService';
import { Project, ChatConfig, ProjectIntegration } from './types';
import ProjectChatConfig from './ProjectChatConfig';
import ProjectIntegrations from './ProjectIntegrations';
import { Settings } from 'lucide-react';

interface ProjectSettingsProps {
  projectId: string;
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({ projectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true);
        const projectData = await ProjectService.getProjectById(projectId);
        setProject(projectData);
      } catch (err) {
        console.error('Error loading project:', err);
        setError('Failed to load project settings');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (projectId) {
      loadProject();
    }
  }, [projectId]);
  
  const handleSaveChatConfig = async (config: ChatConfig) => {
    if (!projectId) return false;
    
    try {
      const success = await ProjectService.updateProjectChatConfig(projectId, config);
      if (success && project) {
        // Update local state if save was successful
        setProject({
          ...project,
          chatConfig: config
        });
      }
      return success;
    } catch (err) {
      console.error('Error saving chat config:', err);
      return false;
    }
  };
  
  const handleSaveIntegrations = async (integrations: ProjectIntegration) => {
    if (!projectId) return false;
    
    try {
      const success = await ProjectService.updateProjectIntegrations(projectId, integrations);
      if (success && project) {
        // Update local state if save was successful
        setProject({
          ...project,
          integrations: integrations
        });
      }
      return success;
    } catch (err) {
      console.error('Error saving integrations:', err);
      return false;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-8 h-8 border-t-2 border-indigo-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error || !project) {
    return (
      <div className="bg-[#2E2E2E] border border-[#444] rounded-xl p-6 mt-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="text-red-500" size={24} />
          </div>
          <h3 className="text-xl font-medium mb-2">Error Loading Settings</h3>
          <p className="text-[#A3A3A3] mb-6">
            {error || "Couldn't load project settings. Please try again later."}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 mb-12">
      <h2 className="text-2xl font-bold mt-8">Project Settings</h2>
      <p className="text-[#A3A3A3]">
        Configure your project's AI and integration settings to customize functionality.
      </p>
      
      <ProjectChatConfig 
        projectId={projectId}
        initialConfig={project.chatConfig || {
          model: 'gpt-4',
          temperature: 0.7,
          max_tokens: 2000,
          system_prompt: 'You are a helpful AI assistant working on this project.',
          tools_enabled: true
        }}
        onSave={handleSaveChatConfig}
      />
      
      <ProjectIntegrations
        projectId={projectId}
        initialIntegrations={project.integrations || {
          connected: false,
          services: []
        }}
        onSave={handleSaveIntegrations}
      />
    </div>
  );
};

export default ProjectSettings; 