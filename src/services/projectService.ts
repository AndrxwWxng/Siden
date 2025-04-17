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
      
      // Create a simpler project object (without agents for now)
      const projectObject = {
        user_id: user.id,
        name: projectData.name,
        description: projectData.description,
        status: projectData.status || 'active',
        // Don't include agents field for now to test
      };
      
      console.log('Project data to insert:', projectObject);
      
      // Try to insert without returning data first
      const insertResult = await supabase
        .from('projects')
        .insert(projectObject);
      
      console.log('Insert result:', insertResult);
      
      if (insertResult.error) {
        console.error('Insert error:', {
          message: insertResult.error.message,
          code: insertResult.error.code,
          details: insertResult.error.details,
          hint: insertResult.error.hint,
          fullError: JSON.stringify(insertResult.error)
        });
        return null;
      }
      
      // If insert was successful, get the inserted record
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        console.error('Error fetching inserted project:', error);
        return null;
      }
      
      if (!data) {
        console.error('No data returned after project creation');
        return null;
      }
      
      console.log('Project created successfully:', data);
      
      // Now update the project with the agents if needed
      if (projectData.agents && projectData.agents.length > 0) {
        const { error: updateError } = await supabase
          .from('projects')
          .update({ agents: projectData.agents })
          .eq('id', data.id);
          
        if (updateError) {
          console.error('Error updating project with agents:', updateError);
          // Continue anyway since we have the basic project created
        }
      }
      
      // Transform to Project interface
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        status: data.status,
        lastActive: data.last_active || new Date().toISOString(),
        agents: projectData.agents?.length || 0,
        agentIds: projectData.agents || [],
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
      
      const { error } = await supabase
        .from('projects')
        .update({
          name: projectData.name,
          description: projectData.description,
          status: projectData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
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