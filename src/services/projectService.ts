import { createClient } from '@/utils/supabase/client';
import { Project } from '@/components/dashboard/types';

export interface ProjectData {
  id?: string;
  name: string;
  description: string;
  status?: string;
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
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Insert the project
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: projectData.name,
          description: projectData.description,
          status: projectData.status || 'active',
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating project:', error);
        return null;
      }
      
      // Transform to Project interface
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        status: data.status,
        lastActive: data.last_active,
        agents: 0, // New projects have no agents
        progress: 0, // New projects have no progress
        tags: [] // New projects have no tags
      };
    } catch (error) {
      console.error('Error in createProject:', error);
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
        agents: 0, // Default for now until we implement agent tracking
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
        agents: 0, // Default for now until we implement agent tracking
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