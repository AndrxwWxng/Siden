'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Settings, Bell, AlertTriangle, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import ProjectHeader from '@/components/project/ProjectHeader';

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams?.get('id') || '';
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [projectData, setProjectData] = useState<any>(null);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [dailySummary, setDailySummary] = useState<boolean>(true);
  const [activityAlerts, setActivityAlerts] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      
      setIsLoading(true);
      try {
        // Use the API endpoint like other pages
        const response = await fetch(`/api/projects/${projectId}`);
        
        if (!response.ok) {
          console.error('Error loading project:', response.statusText);
          return;
        }
        
        try {
          const projectData = await response.json();
          console.log('Project data loaded:', projectData);
          setProjectData(projectData);
          setProjectName(projectData.name || '');
          setProjectDescription(projectData.description || '');
          
          // Load notification settings from project data if available
          if (projectData.settings?.notifications) {
            setEmailNotifications(projectData.settings.notifications.email ?? true);
            setDailySummary(projectData.settings.notifications.dailySummary ?? true);
            setActivityAlerts(projectData.settings.notifications.activityAlerts ?? false);
          }
        } catch (parseError) {
          console.error('Error parsing project data:', parseError);
        }
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProject();
  }, [projectId]);

  const handleSaveChanges = async () => {
    if (!projectId) return;
    
    setIsSaving(true);
    try {
      // Create the updated project data
      const updatedProject = {
        name: projectName,
        description: projectDescription,
        settings: {
          ...projectData?.settings,
          notifications: {
            email: emailNotifications,
            dailySummary: dailySummary,
            activityAlerts: activityAlerts
          }
        }
      };
      
      // Use fetch to update via API like other pages
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProject),
      });
      
      if (!response.ok) {
        console.error('Error saving project settings:', response.statusText);
        return;
      }
      
      try {
        const result = await response.json();
        console.log('Project settings saved successfully', result);
        // Update the local project data
        setProjectData({
          ...projectData,
          ...updatedProject
        });
      } catch (parseError) {
        console.error('Error parsing save response:', parseError);
      }
    } catch (error) {
      console.error('Error saving project settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectId) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        console.error('Error deleting project:', response.statusText);
        return;
      }
      
      // Redirect to dashboard on successful deletion
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
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
          section="Settings" 
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
              <h1 className="text-3xl font-bold mb-2">Project Settings</h1>
              <p className="text-[#A3A3A3] max-w-2xl mb-6">
                Configure your project settings and preferences.
              </p>
              
              <div className="space-y-8">
                <div className="bg-[#2E2E2E] border border-[#444] rounded-xl overflow-hidden">
                  <div className="flex items-center px-6 py-4 border-b border-[#444]">
                    <div className="flex items-center">
                      <div className="bg-[#6366F1]/10 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                        <Settings size={18} className="text-[#6366F1]" />
                      </div>
                      <h2 className="text-lg font-medium">General Settings</h2>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Project Name</label>
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="w-full px-3 py-2 bg-[#202020] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Project Description</label>
                      <textarea
                        rows={3}
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-[#202020] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] text-white"
                        placeholder="Describe your project..."
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#2E2E2E] border border-[#444] rounded-xl overflow-hidden">
                  <div className="flex items-center px-6 py-4 border-b border-[#444]">
                    <div className="flex items-center">
                      <div className="bg-[#6366F1]/10 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                        <Bell size={18} className="text-[#6366F1]" />
                      </div>
                      <h2 className="text-lg font-medium">Notification Settings</h2>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <h3 className="font-medium text-sm">Email Notifications</h3>
                        <p className="text-xs text-[#A3A3A3] mt-0.5">Receive updates about your project via email</p>
                      </div>
                      <div 
                        className="relative inline-block w-10 h-5 rounded-md bg-[#202020] cursor-pointer"
                        onClick={() => setEmailNotifications(!emailNotifications)}
                      >
                        <span className={`block h-5 w-5 rounded-md ${emailNotifications ? 'bg-[#6366F1]' : 'bg-[#444]'} absolute left-0 transition-transform transform ${emailNotifications ? 'translate-x-5' : 'translate-x-0'}`}></span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <h3 className="font-medium text-sm">Daily Summary</h3>
                        <p className="text-xs text-[#A3A3A3] mt-0.5">Get a daily overview of your project's progress</p>
                      </div>
                      <div 
                        className="relative inline-block w-10 h-5 rounded-md bg-[#202020] cursor-pointer"
                        onClick={() => setDailySummary(!dailySummary)}
                      >
                        <span className={`block h-5 w-5 rounded-md ${dailySummary ? 'bg-[#6366F1]' : 'bg-[#444]'} absolute left-0 transition-transform transform ${dailySummary ? 'translate-x-5' : 'translate-x-0'}`}></span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <h3 className="font-medium text-sm">Agent Activity Alerts</h3>
                        <p className="text-xs text-[#A3A3A3] mt-0.5">Get notified when agents complete important tasks</p>
                      </div>
                      <div 
                        className="relative inline-block w-10 h-5 rounded-md bg-[#202020] cursor-pointer"
                        onClick={() => setActivityAlerts(!activityAlerts)}
                      >
                        <span className={`block h-5 w-5 rounded-md ${activityAlerts ? 'bg-[#6366F1]' : 'bg-[#444]'} absolute left-0 transition-transform transform ${activityAlerts ? 'translate-x-5' : 'translate-x-0'}`}></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#2E2E2E] border border-[#444] rounded-xl overflow-hidden">
                  <div className="flex items-center px-6 py-4 border-b border-[#444]">
                    <div className="flex items-center">
                      <div className="bg-[#EF4444]/10 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                        <AlertTriangle size={18} className="text-[#EF4444]" />
                      </div>
                      <h2 className="text-lg font-medium">Danger Zone</h2>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="p-4 border border-[#EF4444]/20 rounded-lg bg-[#EF4444]/5">
                      <h4 className="text-sm font-medium text-[#EF4444]">Delete Project</h4>
                      <p className="text-sm text-[#A3A3A3] mt-1 mb-4">
                        Once you delete this project, there is no going back. All agents, conversations, and resources will be permanently deleted.
                      </p>
                      <button 
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 bg-[#202020] text-[#EF4444] hover:bg-[#EF4444]/10 text-sm rounded-md border border-[#EF4444]/30 transition-colors"
                      >
                        Delete Project
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end">
                  <button 
                    onClick={() => router.back()}
                    className="px-4 py-2 border border-[#444] hover:border-[#6366F1] rounded-md transition-colors text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="px-4 py-2 bg-[#6366F1] hover:bg-[#5254CC] text-white rounded-md transition-colors flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2E2E2E] border border-[#444] rounded-xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#444]">
              <h3 className="font-medium text-lg">Confirm Deletion</h3>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="text-[#A3A3A3] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-lg p-4 mb-6">
                <AlertTriangle size={20} className="text-[#EF4444] mb-2" />
                <p className="text-white">
                  Are you sure you want to delete <span className="font-semibold">{projectName}</span>? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-[#444] hover:border-[#6366F1] rounded-md transition-colors text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProject}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-md transition-colors flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete Project</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
