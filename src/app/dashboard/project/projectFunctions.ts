import { ProjectService } from '@/services/projectService';
import { Project, ChatConfig, ProjectIntegration, NotificationSettings } from '@/components/dashboard/types';

// Save project general settings (name and description)
export const saveProjectSettings = async (
  project: Project,
  name: string,
  description: string
): Promise<{ success: boolean; updatedProject?: Project }> => {
  try {
    const success = await ProjectService.updateProject(project.id, {
      name,
      description
    });
    
    if (success) {
      // Return updated project data
      return {
        success: true,
        updatedProject: {
          ...project,
          name,
          description
        }
      };
    }
    
    return { success: false };
  } catch (error) {
    console.error('Error saving project settings:', error);
    return { success: false };
  }
};

// Delete a project
export const deleteProject = async (projectId: string): Promise<boolean> => {
  try {
    return await ProjectService.deleteProject(projectId);
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
};

// Update project chat configuration
export const updateProjectChatConfig = async (
  projectId: string, 
  chatConfig: ChatConfig
): Promise<boolean> => {
  try {
    return await ProjectService.updateProjectChatConfig(projectId, chatConfig);
  } catch (error) {
    console.error('Error updating project chat config:', error);
    return false;
  }
};

// Update project integrations
export const updateProjectIntegrations = async (
  projectId: string, 
  integrations: ProjectIntegration
): Promise<boolean> => {
  try {
    return await ProjectService.updateProjectIntegrations(projectId, integrations);
  } catch (error) {
    console.error('Error updating project integrations:', error);
    return false;
  }
};

// Add agent to project
export const addAgentToProject = async (
  projectId: string,
  agentId: string
): Promise<boolean> => {
  try {
    return await ProjectService.addAgentToProject(projectId, agentId);
  } catch (error) {
    console.error('Error adding agent to project:', error);
    return false;
  }
};

// Remove agent from project
export const removeAgentFromProject = async (
  projectId: string,
  agentId: string
): Promise<boolean> => {
  try {
    return await ProjectService.removeAgentFromProject(projectId, agentId);
  } catch (error) {
    console.error('Error removing agent from project:', error);
    return false;
  }
};

// Update project notification settings
export const updateProjectNotificationSettings = async (
  projectId: string, 
  notificationSettings: NotificationSettings
): Promise<boolean> => {
  try {
    return await ProjectService.updateProjectNotificationSettings(projectId, notificationSettings);
  } catch (error) {
    console.error('Error updating project notification settings:', error);
    return false;
  }
}; 