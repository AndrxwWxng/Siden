import { createClient } from '@/utils/supabase/client';

export interface UserProfile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
}

export interface UserSettings {
  theme: string;
  email_notifications: boolean;
}

/**
 * Service for handling user profile and settings operations with Supabase
 */
export class UserService {
  /**
   * Get the current user's profile
   */
  static async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const supabase = createClient();
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }
      
      // Get the user's profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return {
        id: data.id,
        username: data.username || user.email?.split('@')[0] || 'User',
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        website: data.website
      };
    } catch (error) {
      console.error('Error in getCurrentUserProfile:', error);
      return null;
    }
  }
  
  /**
   * Update the current user's profile
   */
  static async updateUserProfile(profile: Partial<UserProfile>): Promise<boolean> {
    try {
      const supabase = createClient();
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return false;
      }
      
      // Update the user's profile
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profile.username,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          website: profile.website,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        console.error('Error updating user profile:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      return false;
    }
  }
  
  /**
   * Get the current user's settings
   */
  static async getUserSettings(): Promise<UserSettings | null> {
    try {
      const supabase = createClient();
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }
      
      // Get the user's settings
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user settings:', error);
        return null;
      }
      
      return {
        theme: data.theme || 'dark',
        email_notifications: data.email_notifications
      };
    } catch (error) {
      console.error('Error in getUserSettings:', error);
      return {
        theme: 'dark',
        email_notifications: true
      };
    }
  }
  
  /**
   * Update the current user's settings
   */
  static async updateUserSettings(settings: Partial<UserSettings>): Promise<boolean> {
    try {
      const supabase = createClient();
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return false;
      }
      
      // Update the user's settings
      const { error } = await supabase
        .from('user_settings')
        .update({
          theme: settings.theme,
          email_notifications: settings.email_notifications,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error updating user settings:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateUserSettings:', error);
      return false;
    }
  }
  
  /**
   * Upload a user avatar
   */
  static async uploadAvatar(file: File): Promise<string | null> {
    try {
      const supabase = createClient();
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }
      
      // Upload the avatar
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        return null;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      // Update the user's profile with the new avatar URL
      await this.updateUserProfile({ avatar_url: publicUrl });
      
      return publicUrl;
    } catch (error) {
      console.error('Error in uploadAvatar:', error);
      return null;
    }
  }
} 