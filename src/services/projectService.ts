import { createClient } from '@/utils/supabase/client';
import { Project } from '@/components/dashboard/types';

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
      const supabase = createClient();
      console.log("Supabase client created");
      
      // Get the current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Authentication error:', authError);
        return null;
      }
      
      if (!user) {
        console.error('User not authenticated');
        return null;
      }
      
      console.log('Creating project with user ID:', user.id);
      
      // Create the complete project object including agents
      const projectObject = {
        user_id: user.id,
        name: projectData.name,
        description: projectData.description,
        status: projectData.status || 'active',
        agents: projectData.agents || [],
        last_active: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Project data to insert:', projectObject);
      
      // Insert the project and return the created data in one operation
      const { data, error } = await supabase
        .from('projects')
        .insert(projectObject)
        .select('*')
        .single();
      
      console.log('Insert result:', { data, error });
      
      if (error) {
        console.error('Insert error:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          fullError: JSON.stringify(error)
        });
        return null;
      }
      
      if (!data) {
        console.error('No data returned after project creation');
        return null;
      }
      
      console.log('Project created successfully:', data);
      
      // Transform to Project interface
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        status: data.status,
        lastActive: data.last_active || new Date().toISOString(),
        agents: Array.isArray(data.agents) ? data.agents.length : 0,
        agentIds: Array.isArray(data.agents) ? data.agents : [],
        progress: 0,
        tags: []
      };
    } catch (error) {
      // Log full details of the error
      console.error('Error in createProject:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
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
} 