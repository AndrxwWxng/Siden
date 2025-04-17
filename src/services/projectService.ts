import { createClient } from '@/utils/supabase/client';
import { supabaseConfig } from '@/utils/supabase/config';
import { Project, ChatConfig, ProjectIntegration, NotificationSettings } from '@/components/dashboard/types';

export interface ProjectData {
  id?: string;
  name: string;
  description: string;
  status?: string;
  agents?: string[];
  chatConfig?: ChatConfig;
  notificationSettings?: NotificationSettings;
  teamMembers?: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
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
      
      // Fetch user profile to get username
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url')
        .eq('id', user.id)
        .single();
      
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
        chat_config: projectData.chatConfig || {
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
        },
        notification_settings: projectData.notificationSettings || {
          email_notifications: true,
          daily_summary: true,
          agent_activity_alerts: false
        },
        // Add team members array with owner as first member
        team_members: [{
          id: user.id,
          name: profileData?.full_name || profileData?.username || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          avatar: profileData?.avatar_url || '',
          role: 'owner'
        }]
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
          tags: [],
          notificationSettings: data.notification_settings || {
            email_notifications: true,
            daily_summary: true,
            agent_activity_alerts: false
          },
          teamMembers: data.team_members || []
        };
      } catch (e) {
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
            tags: [],
            notificationSettings: data.notification_settings || {
              email_notifications: true,
              daily_summary: true,
              agent_activity_alerts: false
            },
            teamMembers: data.team_members || []
          };
        } catch (error) {
          console.error('Error in two-step project creation:', error);
          return null;
        }
      }
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
        agents: Array.isArray(project.agents) ? project.agents.length : 0, // Get actual number of agents
        agentIds: Array.isArray(project.agents) ? project.agents : [], // Get array of agent IDs
        chatConfig: project.chat_config || {}, // Add chat config
        integrations: project.integrations || { connected: false, services: [] }, // Add integrations
        progress: 0, // Default for now until we implement progress tracking
        tags: [], // Default for now until we implement tags
        notificationSettings: project.notification_settings || {
          email_notifications: true,
          daily_summary: true,
          agent_activity_alerts: false
        },
        teamMembers: project.team_members || []
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
        .or(`user_id.eq.${user.id},team_members->>[].id.eq.${user.id}`) // Check if user is owner or team member
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
        chatConfig: data.chat_config || {}, // Add chat config
        integrations: data.integrations || { connected: false, services: [] }, // Add integrations
        progress: 0, // Default for now until we implement progress tracking
        tags: [], // Default for now until we implement tags
        notificationSettings: data.notification_settings || {
          email_notifications: true,
          daily_summary: true,
          agent_activity_alerts: false
        },
        teamMembers: data.team_members || []
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
      
      // Get project to check permissions
      const project = await this.getProjectById(id);
      if (!project) {
        console.error('Project not found or access denied');
        return false;
      }
      
      // Check if user is owner or editor
      const userRole = project.teamMembers?.find(member => member.id === user.id)?.role;
      if (userRole !== 'owner' && userRole !== 'editor') {
        console.error('User does not have permission to update project');
        return false;
      }
      
      // Create update object with all possible fields
      const updateObject = {
        name: projectData.name,
        description: projectData.description,
        status: projectData.status,
        updated_at: new Date().toISOString(),
        last_active: new Date().toISOString()
      };
      
      // Only add agents if it's provided (to avoid overwriting with undefined)
      if (projectData.agents !== undefined) {
        updateObject['agents'] = projectData.agents;
      }
      
      // Add chat config if provided
      if (projectData.chatConfig) {
        updateObject['chat_config'] = projectData.chatConfig;
      }
      
      // Add team members if provided
      if (projectData.teamMembers) {
        updateObject['team_members'] = projectData.teamMembers;
      }
      
      // Update the project
      const { error } = await supabase
        .from('projects')
        .update(updateObject)
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
      
      // Get project to check permissions
      const project = await this.getProjectById(id);
      if (!project) {
        console.error('Project not found or access denied');
        return false;
      }
      
      // Get current user to verify ownership
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Authentication error:', authError);
        return false;
      }
      
      // Check if user is owner
      const userRole = project.teamMembers?.find(member => member.id === user.id)?.role;
      if (userRole !== 'owner') {
        console.error('Only project owner can delete a project');
        return false;
      }
      
      // Delete the project (RLS will ensure user can only delete their own projects)
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Extra validation to ensure user owns the project
      
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
      const supabase = createClient();
      
      // Get project to check permissions
      const project = await this.getProjectById(projectId);
      if (!project) {
        console.error('Project not found or access denied');
        return false;
      }
      
      // Get current user to verify ownership
      const { data: userData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !userData?.user) {
        console.error('Authentication error:', authError);
        return false;
      }
      
      // Check if user is owner or editor
      const userRole = project.teamMembers?.find(member => member.id === userData.user.id)?.role;
      if (userRole !== 'owner' && userRole !== 'editor') {
        console.error('User does not have permission to update chat config');
        return false;
      }
      
      // Update the project with new chat config
      const { error } = await supabase
        .from('projects')
        .update({ 
          chat_config: chatConfig,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);
      
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
      
      // Get project to check permissions
      const project = await this.getProjectById(projectId);
      if (!project) {
        console.error('Project not found or access denied');
        return false;
      }
      
      // Get current user to verify permissions
      const { data: userData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !userData?.user) {
        console.error('Authentication error:', authError);
        return false;
      }
      
      // Check if user is owner or editor
      const userRole = project.teamMembers?.find(member => member.id === userData.user.id)?.role;
      if (userRole !== 'owner' && userRole !== 'editor') {
        console.error('User does not have permission to update integrations');
        return false;
      }
      
      // Update the project with new integrations
      const { error } = await supabase
        .from('projects')
        .update({ 
          integrations: integrations,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);
      
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
  
  /**
   * Add an agent to a project
   */
  static async addAgentToProject(projectId: string, agentId: string): Promise<boolean> {
    try {
      // First get the current project
      const project = await this.getProjectById(projectId);
      
      if (!project) {
        console.error('Project not found');
        return false;
      }
      
      // Get current user to verify permissions
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      
      // Check if user is owner or editor
      const userRole = project.teamMembers?.find(member => member.id === userData.user?.id)?.role;
      if (userRole !== 'owner' && userRole !== 'editor') {
        console.error('User does not have permission to add agents');
        return false;
      }
      
      // Add agent to the list if not already present
      const agents = [...(project.agentIds || [])];
      if (!agents.includes(agentId)) {
        agents.push(agentId);
      } else {
        // Agent already in the project
        return true;
      }
      
      // Update the project with the new agents list
      return await this.updateProject(projectId, { agents });
    } catch (error) {
      console.error('Error in addAgentToProject:', error);
      return false;
    }
  }
  
  /**
   * Remove an agent from a project
   */
  static async removeAgentFromProject(projectId: string, agentId: string): Promise<boolean> {
    try {
      // First get the current project
      const project = await this.getProjectById(projectId);
      
      if (!project) {
        console.error('Project not found');
        return false;
      }
      
      // Get current user to verify permissions
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      
      // Check if user is owner or editor
      const userRole = project.teamMembers?.find(member => member.id === userData.user?.id)?.role;
      if (userRole !== 'owner' && userRole !== 'editor') {
        console.error('User does not have permission to remove agents');
        return false;
      }
      
      // Remove agent from the list
      const agents = (project.agentIds || []).filter(id => id !== agentId);
      
      // Update the project with the new agents list
      return await this.updateProject(projectId, { agents });
    } catch (error) {
      console.error('Error in removeAgentFromProject:', error);
      return false;
    }
  }
  
  /**
   * Update project notification settings
   */
  static async updateProjectNotificationSettings(projectId: string, settings: NotificationSettings): Promise<boolean> {
    try {
      const supabase = createClient();
      
      // Get project to check permissions
      const project = await this.getProjectById(projectId);
      if (!project) {
        console.error('Project not found or access denied');
        return false;
      }
      
      // Get current user to verify permissions
      const { data: userData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !userData?.user) {
        console.error('Authentication error:', authError);
        return false;
      }
      
      // Check if user is owner or editor
      const userRole = project.teamMembers?.find(member => member.id === userData.user.id)?.role;
      if (userRole !== 'owner' && userRole !== 'editor') {
        console.error('User does not have permission to update notification settings');
        return false;
      }
      
      // Update the project with new notification settings
      const { error } = await supabase
        .from('projects')
        .update({ 
          notification_settings: settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);
      
      if (error) {
        console.error('Error updating project notification settings:', JSON.stringify(error));
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateProjectNotificationSettings:', error);
      return false;
    }
  }
  
  /**
   * Add a team member to a project
   */
  static async addTeamMemberToProject(
    projectId: string, 
    email: string
  ): Promise<{ success: boolean; project?: Project }> {
    try {
      const supabase = createClient();
      
      // Get the current project
      const project = await this.getProjectById(projectId);
      if (!project) {
        console.error('Project not found or access denied');
        return { success: false };
      }
      
      // Get current user to verify permissions
      const { data: userData } = await supabase.auth.getUser();
      
      // Check if user is owner (only owners can add team members)
      const userRole = project.teamMembers?.find(member => member.id === userData.user?.id)?.role;
      if (userRole !== 'owner') {
        console.error('Only project owner can add team members');
        return { success: false };
      }
      
      // Find user by email
      const { data: usersByEmail, error: userError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .eq('email', email)
        .single();
      
      if (userError || !usersByEmail) {
        console.error('User not found with that email');
        return { success: false };
      }
      
      // Check if user is already a team member
      const existingTeamMembers = project.teamMembers || [];
      if (existingTeamMembers.some(member => member.id === usersByEmail.id)) {
        console.log('User is already a team member');
        return { success: true, project: project };
      }
      
      // Add the new team member
      const newTeamMember: TeamMember = {
        id: usersByEmail.id,
        name: usersByEmail.full_name || usersByEmail.username || email.split('@')[0],
        email: email,
        avatar: usersByEmail.avatar_url || undefined,
        role: 'editor' // Default role for new members
      };
      
      const updatedTeamMembers = [...existingTeamMembers, newTeamMember];
      
      // Update the project with the new team members
      const updateSuccess = await this.updateProject(projectId, { 
        teamMembers: updatedTeamMembers 
      });
      
      if (!updateSuccess) {
        return { success: false };
      }
      
      // Get the updated project
      const updatedProject = await this.getProjectById(projectId);
      
      return { 
        success: true,
        project: updatedProject || undefined
      };
    } catch (error) {
      console.error('Error in addTeamMemberToProject:', error);
      return { success: false };
    }
  }
  
  /**
   * Remove a team member from a project
   */
  static async removeTeamMemberFromProject(
    projectId: string, 
    memberId: string
  ): Promise<{ success: boolean; project?: Project }> {
    try {
      const supabase = createClient();
      
      // Get the current project
      const project = await this.getProjectById(projectId);
      if (!project) {
        console.error('Project not found or access denied');
        return { success: false };
      }
      
      // Get current user to verify permissions
      const { data: userData } = await supabase.auth.getUser();
      
      // Check if user is owner (only owners can remove team members)
      const userRole = project.teamMembers?.find(member => member.id === userData.user?.id)?.role;
      if (userRole !== 'owner') {
        console.error('Only project owner can remove team members');
        return { success: false };
      }
      
      // Ensure user isn't trying to remove themselves as owner
      if (memberId === userData.user?.id) {
        console.error('Owner cannot remove themselves from the project');
        return { success: false };
      }
      
      // Filter out the member to remove
      const existingTeamMembers = project.teamMembers || [];
      const updatedTeamMembers = existingTeamMembers.filter(member => member.id !== memberId);
      
      // If no change, member wasn't in the team
      if (updatedTeamMembers.length === existingTeamMembers.length) {
        console.log('Member not found in team');
        return { success: false };
      }
      
      // Update the project with the new team members
      const updateSuccess = await this.updateProject(projectId, { 
        teamMembers: updatedTeamMembers 
      });
      
      if (!updateSuccess) {
        return { success: false };
      }
      
      // Get the updated project
      const updatedProject = await this.getProjectById(projectId);
      
      return { 
        success: true,
        project: updatedProject || undefined
      };
    } catch (error) {
      console.error('Error in removeTeamMemberFromProject:', error);
      return { success: false };
    }
  }
} 