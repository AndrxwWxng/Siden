import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings, Trash2, AlertTriangle
} from 'lucide-react';
import { Project, NotificationSettings } from '@/components/dashboard/types';
import { 
  saveProjectSettings, 
  deleteProject,
  updateProjectNotificationSettings
} from '../projectFunctions';

interface ProjectSettingsProps {
  project: Project;
  onProjectUpdated?: (updatedProject: Project) => void;
}

export default function ProjectSettings({ project, onProjectUpdated }: ProjectSettingsProps) {
  const router = useRouter();
  
  // Default notification settings with correct property names
  const defaultNotifications: NotificationSettings = {
    email_notifications: true,
    daily_summary: true,
    agent_activity_alerts: false
  };
  
  // State
  const [projectName, setProjectName] = useState(project.name);
  const [projectDescription, setProjectDescription] = useState(project.description || '');
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(
    project.notificationSettings || defaultNotifications
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hasNotificationChanges, setHasNotificationChanges] = useState(false);
  
  // Track unsaved changes
  useEffect(() => {
    const hasNameChanged = project.name !== projectName;
    const hasDescriptionChanged = project.description !== projectDescription;
    setHasUnsavedChanges(hasNameChanged || hasDescriptionChanged);
  }, [project, projectName, projectDescription]);
  
  // Track notification changes
  useEffect(() => {
    const currentSettings = project.notificationSettings || defaultNotifications;
    
    const hasSettingsChanged = 
      currentSettings.email_notifications !== notificationSettings.email_notifications ||
      currentSettings.daily_summary !== notificationSettings.daily_summary ||
      currentSettings.agent_activity_alerts !== notificationSettings.agent_activity_alerts;
    
    setHasNotificationChanges(hasSettingsChanged);
  }, [project, notificationSettings]);
  
  // Save project settings
  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      // First save general settings
      const { success, updatedProject } = await saveProjectSettings(
        project, 
        projectName, 
        projectDescription
      );
      
      let projectWithAllUpdates = updatedProject || project;
      
      // Then save notification settings if they've changed
      if (hasNotificationChanges) {
        const notificationSuccess = await updateProjectNotificationSettings(
          project.id,
          notificationSettings
        );
        
        if (notificationSuccess) {
          // Update with notification settings
          projectWithAllUpdates = {
            ...projectWithAllUpdates,
            notificationSettings
          };
        }
      }
      
      if (success && onProjectUpdated && projectWithAllUpdates) {
        onProjectUpdated(projectWithAllUpdates);
        setHasUnsavedChanges(false);
        setHasNotificationChanges(false);
      }
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Update notification settings handlers
  const handleEmailNotificationsChange = (value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      email_notifications: value
    }));
  };
  
  const handleDailySummaryChange = (value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      daily_summary: value
    }));
  };
  
  const handleActivityAlertsChange = (value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      agent_activity_alerts: value
    }));
  };
  
  // Delete project
  const handleDeleteProject = async () => {
    setIsDeleting(true);
    
    try {
      const success = await deleteProject(project.id);
      
      if (success) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };
  
  // Cancel changes
  const handleCancelChanges = () => {
    setProjectName(project.name);
    setProjectDescription(project.description || '');
    setNotificationSettings(project.notificationSettings || defaultNotifications);
    setHasUnsavedChanges(false);
    setHasNotificationChanges(false);
  };
  
  return (
    <div className="bg-[#252525] rounded-xl border border-[#313131] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium">Project Settings</h2>
        {showDeleteConfirm && (
          <div className="flex items-center gap-3 px-4 py-2 bg-red-900/30 border border-red-800 rounded-md">
            <AlertTriangle className="text-red-500" size={18} />
            <span className="text-red-200 text-sm">Are you sure you want to delete this project?</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-2 py-1 text-xs rounded-md bg-[#343131] hover:bg-[#252525] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteProject}
                disabled={isDeleting}
                className="px-2 py-1 text-xs rounded-md bg-red-800 hover:bg-red-700 transition-colors flex items-center gap-1"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3 h-3 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>Delete</>
                )}
              </button>
            </div>
          </div>
        )}
        {!showDeleteConfirm && (
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 border border-red-800 hover:border-red-700 text-red-500 hover:text-red-400 rounded-md transition-colors flex items-center gap-2"
          >
            <Trash2 size={16} />
            <span>Delete Project</span>
          </button>
        )}
      </div>
      <div className="space-y-6">
        <div className="bg-[#343131] border border-[#313131] rounded-md p-5 hover:border-[#444] transition-all">
          <h3 className="font-medium mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#94A3B8]">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-2 bg-[#252525] border border-[#313131] rounded-md focus:outline-none focus:border-[#6366F1]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#94A3B8]">Project Description</label>
              <textarea
                rows={3}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full px-3 py-2 bg-[#252525] border border-[#313131] rounded-md focus:outline-none focus:border-[#6366F1]"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-[#343131] border border-[#313131] rounded-md p-5 hover:border-[#444] transition-all">
          <h3 className="font-medium mb-4">Notification Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#94A3B8]">Email Notifications</label>
              <div 
                className="relative inline-block w-10 h-5 rounded-md bg-[#252525] cursor-pointer"
                onClick={() => handleEmailNotificationsChange(!notificationSettings.email_notifications)}
              >
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={notificationSettings.email_notifications}
                  onChange={() => {}} // Add empty handler to avoid React warning
                />
                <span className={`block h-5 w-5 rounded-md ${notificationSettings.email_notifications ? 'bg-[#6366F1]' : 'bg-[#313131]'} absolute left-0 transition-transform transform ${notificationSettings.email_notifications ? 'translate-x-5' : 'translate-x-0'}`}></span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#94A3B8]">Daily Summary</label>
              <div 
                className="relative inline-block w-10 h-5 rounded-md bg-[#252525] cursor-pointer"
                onClick={() => handleDailySummaryChange(!notificationSettings.daily_summary)}
              >
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={notificationSettings.daily_summary}
                  onChange={() => {}} // Add empty handler to avoid React warning
                />
                <span className={`block h-5 w-5 rounded-md ${notificationSettings.daily_summary ? 'bg-[#6366F1]' : 'bg-[#313131]'} absolute left-0 transition-transform transform ${notificationSettings.daily_summary ? 'translate-x-5' : 'translate-x-0'}`}></span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#94A3B8]">Agent Activity Alerts</label>
              <div 
                className="relative inline-block w-10 h-5 rounded-md bg-[#252525] cursor-pointer"
                onClick={() => handleActivityAlertsChange(!notificationSettings.agent_activity_alerts)}
              >
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={notificationSettings.agent_activity_alerts}
                  onChange={() => {}} // Add empty handler to avoid React warning
                />
                <span className={`block h-5 w-5 rounded-md ${notificationSettings.agent_activity_alerts ? 'bg-[#6366F1]' : 'bg-[#313131]'} absolute left-0 transition-transform transform ${notificationSettings.agent_activity_alerts ? 'translate-x-5' : 'translate-x-0'}`}></span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 justify-end">
          <button 
            onClick={handleCancelChanges}
            disabled={isSaving || (!hasUnsavedChanges && !hasNotificationChanges)}
            className={`px-4 py-2 border ${hasUnsavedChanges || hasNotificationChanges ? 'border-[#313131] hover:border-[#6366F1] text-white' : 'border-[#313131] text-[#94A3B8]'} rounded-md transition-colors`}
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveSettings}
            disabled={isSaving || (!hasUnsavedChanges && !hasNotificationChanges)} 
            className={`px-4 py-2 ${
              hasUnsavedChanges || hasNotificationChanges ? 'bg-[#6366F1] hover:bg-[#5254CC] text-white' : 'bg-[#343131] text-[#94A3B8]'
            } rounded-md transition-colors flex items-center gap-2`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>Save Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 