import { createClient } from '@/utils/supabase/client';
import { supabaseConfig } from '@/utils/supabase/config';
import { Project, ChatConfig, ProjectIntegration } from '@/components/dashboard/types';

export interface ProjectData {
  id?: string;
  name: string;
  description: string;
  status?: string;
  agents?: string[];
}

/**
 * Service for handling project operations with Supabase
 */
export class ProjectService {
  /**
   * Create a new project for the current user
   */
  static async createProject(projectData: ProjectData): Promise<Project | null> {
    try {
      console.log("Creating Supabase client...");
      const supabase = createClient();
      console.log("Supabase client created with URL:", supabaseConfig.url);
      
      // Get the current user
      console.log("Getting current user...");
      const { data: userData, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Authentication error:', JSON.stringify(authError));
        return null;
      }
      
      const user = userData?.user;
      if (!user) {
        console.error('User not authenticated');
        return null;
      }
      
      console.log('Creating project with user ID:', user.id);
      
      // Create the project object
      const projectObject = {
        user_id: user.id,
        name: projectData.name || 'Untitled Project',
        description: projectData.description || '',
        status: projectData.status || 'active',
        agents: projectData.agents || [],
        // Add timestamps to ensure they're set properly
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
        // Add chat configuration
        chat_config: {
          model: 'gpt-4',
          temperature: 0.7,
          max_tokens: 2000,
          system_prompt: 'You are a helpful AI assistant working on this project.',
          tools_enabled: true
        },
        // Add default integrations settings
        integrations: {
          connected: false,
          services: []
        }
      };
      
      console.log('Project data to insert:', JSON.stringify(projectObject));
      
      try {
        // Try to insert with returning in a single operation
        const { data, error } = await supabase
          .from('projects')
          .insert(projectObject)
          .select()
          .single();
          
        if (error) {
          console.error('Insert error with returning failed:', JSON.stringify(error));
          throw error;
        }
        
        console.log('Project created successfully with data:', JSON.stringify(data));
        
        // Transform to Project interface
        return {
          id: data.id,
          name: data.name,
          description: data.description,
          status: data.status,
          lastActive: data.last_active || new Date().toISOString(),
          agents: Array.isArray(data.agents) ? data.agents.length : 0,
          agentIds: Array.isArray(data.agents) ? data.agents : [],
          chatConfig: data.chat_config || {},
          integrations: data.integrations || { connected: false, services: [] },
          progress: 0,
          tags: []
        };
      } catch (innerError) {
        console.error('Failed with single operation, trying two-step approach');
        
        // Try two-step approach if the combined approach fails
        try {
          // First just insert
          const { error: insertError } = await supabase
            .from('projects')
            .insert(projectObject);
            
          if (insertError) {
            console.error('Insert error in two-step approach:', JSON.stringify(insertError));
            throw insertError;
          }
          
          // Then query for the most recent project
          const { data: projects, error: fetchError } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id)
            .eq('name', projectData.name)
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (fetchError) {
            console.error('Fetch error in two-step approach:', JSON.stringify(fetchError));
            throw fetchError;
          }
          
          if (!projects || projects.length === 0) {
            throw new Error('No projects found after insertion');
          }
          
          const data = projects[0];
          console.log('Project created with two-step approach:', JSON.stringify(data));
          
          return {
            id: data.id,
            name: data.name,
            description: data.description,
            status: data.status,
            lastActive: data.last_active || new Date().toISOString(),
            agents: Array.isArray(data.agents) ? data.agents.length : 0,
            agentIds: Array.isArray(data.agents) ? data.agents : [],
            chatConfig: data.chat_config || {},
            integrations: data.integrations || { connected: false, services: [] },
            progress: 0,
            tags: []
          };
        } catch (twoStepError) {
          console.error('Two-step approach also failed:', JSON.stringify(twoStepError));
          throw twoStepError;
        }
      }
    } catch (error) {
      // Log full details of the error
      console.error('Error in createProject:', error);
      console.error('Error type:', typeof error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      } else {
        console.error('Non-Error object thrown:', JSON.stringify(error));
      }
      return null;
    }
  }
  
  /**
   * Get all projects for the current user
   */
  static async getUserProjects(): Promise<Project[]> {
    try {
      const supabase = createClient();
      
      // Get the current user first to ensure we're authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('Error: User not authenticated');
        return [];
      }
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching projects:', error.message);
        return [];
      }
      
      if (!data) {
        return [];
      }
      
      // Transform to Project interface
      return data.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        lastActive: project.last_active,
        agents: Array.isArray(project.agents) ? project.agents.length : 0, // Get actual number of agents
        agentIds: Array.isArray(project.agents) ? project.agents : [], // Get array of agent IDs
        progress: 0, // Default for now until we implement progress tracking
        tags: [] // Default for now until we implement tags
      }));
    } catch (error) {
      console.error('Error in getUserProjects:', error);
      return [];
    }
  }
  
  /**
   * Get a specific project by ID
   */
  static async getProjectById(id: string): Promise<Project | null> {
    try {
      const supabase = createClient();
      
      // Get the current user first to ensure we're authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('Error: User not authenticated');
        return null;
      }
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching project:', error.message);
        return null;
      }
      
      if (!data) {
        console.error('Project not found or access denied');
        return null;
      }
      
      // Transform to Project interface
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        status: data.status,
        lastActive: data.last_active,
        agents: Array.isArray(data.agents) ? data.agents.length : 0, // Get actual number of agents
        agentIds: Array.isArray(data.agents) ? data.agents : [], // Get array of agent IDs
        progress: 0, // Default for now until we implement progress tracking
        tags: [] // Default for now until we implement tags
      };
    } catch (error) {
      console.error('Error in getProjectById:', error);
      return null;
    }
  }
  
  /**
   * Update an existing project
   */
  static async updateProject(id: string, projectData: Partial<ProjectData>): Promise<boolean> {
    try {
      const supabase = createClient();
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Authentication error:', authError);
        return false;
      }
      
      // Create update object with all possible fields
      const updateObject = {
        name: projectData.name,
        description: projectData.description,
        status: projectData.status,
        updated_at: new Date().toISOString()
      };
      
      // Only add agents if it's provided (to avoid overwriting with undefined)
      if (projectData.agents !== undefined) {
        updateObject['agents'] = projectData.agents;
      }
      
      // Update the project
      const { error } = await supabase
        .from('projects')
        .update(updateObject)
        .eq('id', id)
        .eq('user_id', user.id); // Make sure user owns the project
      
      if (error) {
        console.error('Error updating project:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateProject:', error);
      return false;
    }
  }
  
  /**
   * Delete a project
   */
  static async deleteProject(id: string): Promise<boolean> {
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting project:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteProject:', error);
      return false;
    }
  }
  
  /**
   * Update project chat configuration
   */
  static async updateProjectChatConfig(projectId: string, chatConfig: ChatConfig): Promise<boolean> {
    try {
      console.log('Updating chat config for project:', projectId);
      const supabase = createClient();
      
      // Get current user to verify ownership
      const { data: userData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !userData?.user) {
        console.error('Authentication error:', authError);
        return false;
      }
      
      // Update the project with new chat config
      const { error } = await supabase
        .from('projects')
        .update({ 
          chat_config: chatConfig,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .eq('user_id', userData.user.id); // Ensure user owns this project
      
      if (error) {
        console.error('Error updating project chat config:', JSON.stringify(error));
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateProjectChatConfig:', error);
      return false;
    }
  }
  
  /**
   * Update project integrations
   */
  static async updateProjectIntegrations(projectId: string, integrations: ProjectIntegration): Promise<boolean> {
    try {
      console.log('Updating integrations for project:', projectId);
      const supabase = createClient();
      
      // Get current user to verify ownership
      const { data: userData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !userData?.user) {
        console.error('Authentication error:', authError);
        return false;
      }
      
      // Update the project with new integrations
      const { error } = await supabase
        .from('projects')
        .update({ 
          integrations: integrations,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .eq('user_id', userData.user.id); // Ensure user owns this project
      
      if (error) {
        console.error('Error updating project integrations:', JSON.stringify(error));
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateProjectIntegrations:', error);
      return false;
    }
  }
} 