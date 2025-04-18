import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Folder, ChevronLeft, ChevronRight, MessageSquare, Settings, Users, Wrench, LineChart, User, LogOut, ClipboardList } from 'lucide-react';
import Logo from '../Logo';
import { createClient } from '@/utils/supabase/client';
import UserProfile from '../dashboard/UserProfile';

interface ProjectSidebarProps {
  projectId: string;
  activeSection?: 'chat' | 'team' | 'tools' | 'reports' | 'settings';
  onCollapse?: (collapsed: boolean) => void;
}

export default function ProjectSidebar({ projectId, activeSection = 'chat', onCollapse }: ProjectSidebarProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userSession, setUserSession] = useState<any>(null);
  const [projectData, setProjectData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      setUserSession(data.session);
      
      // If no session, redirect to sign in
      if (!data.session) {
        router.push('/signin');
      }
    };
    
    checkSession();
    
    // Set up subscription for auth changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserSession(session);
      if (!session) {
        router.push('/signin');
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    // Fetch project data
    const fetchProjectData = async () => {
      if (projectId) {
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();
          
          if (error) {
            console.error('Error fetching project:', error);
          } else {
            setProjectData(data);
          }
        } catch (err) {
          console.error('Error in project fetch:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchProjectData();
  }, [projectId]);

  const handleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onCollapse) {
      onCollapse(newCollapsed);
    }
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigateToSection = (section: string) => {
    if (!projectId) return;
    router.push(`/dashboard/project/${section}?id=${projectId}`);
  };

  return (
    <div 
      className={`fixed left-0 h-full bg-app-secondary border-r border-app-color z-10 transition-all duration-200 flex flex-col`}
      style={{ width: isCollapsed ? '60px' : '280px' }}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-center border-b border-app-color flex-shrink-0">
        {isCollapsed ? (
          <Logo size="sm" />
        ) : (
          <Logo size="md" />
        )}
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        <div className={`px-4 pt-6 mb-8 ${isCollapsed ? 'flex justify-center' : ''}`}>
          {isCollapsed ? (
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-8 h-8 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-md transition-colors"
              title="Back to Dashboard"
            >
              <Folder size={16} />
            </button>
          ) : (
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full flex items-center justify-center px-4 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors text-sm font-medium"
            >
              Back to Dashboard
            </button>
          )}
        </div>
        
        <div>
          <div className={`py-2 flex items-center justify-between mb-2 ${isCollapsed ? 'px-0 justify-center' : 'px-5'}`}>
            {!isCollapsed && (
              <h3 className="text-[11px] font-medium text-app-secondary uppercase tracking-wider">Navigation</h3>
            )}
          </div>
          
          <div className={`space-y-1.5 mt-1 ${isCollapsed ? 'px-2' : 'px-3'}`}>            
            {/* Project Chat */}
            <button 
              onClick={() => navigateToSection('chat')}
              className={`flex items-center rounded-md transition-colors text-sm group ${
                activeSection === 'chat' ? 'bg-app-tertiary' : ''
              } ${isCollapsed 
                ? 'w-10 h-10 justify-center px-0 py-0 hover:bg-app-tertiary' 
                : 'w-full px-3 py-2.5 text-app-primary hover:bg-app-tertiary'}`}
              title={isCollapsed ? 'Chat' : ''}
            >
              <div className={`w-6 h-6 bg-app-tertiary rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-app-tertiary ${isCollapsed ? '' : 'mr-3'}`}>
                <MessageSquare size={14} className="text-app-secondary" />
              </div>
              {!isCollapsed && <span className="truncate">Chat</span>}
            </button>
            
            {/* Team Members */}
            <button 
              onClick={() => navigateToSection('team')}
              className={`flex items-center rounded-md transition-colors text-sm group ${
                activeSection === 'team' ? 'bg-app-tertiary' : ''
              } ${isCollapsed 
                ? 'w-10 h-10 justify-center px-0 py-0 hover:bg-app-tertiary' 
                : 'w-full px-3 py-2.5 text-app-primary hover:bg-app-tertiary'}`}
              title={isCollapsed ? 'Team' : ''}
            >
              <div className={`w-6 h-6 bg-app-tertiary rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-app-tertiary ${isCollapsed ? '' : 'mr-3'}`}>
                <Users size={14} className="text-app-secondary" />
              </div>
              {!isCollapsed && <span className="truncate">Team Members</span>}
            </button>
            
            {/* Tools & Integrations */}
            <button 
              onClick={() => navigateToSection('tools')}
              className={`flex items-center rounded-md transition-colors text-sm group ${
                activeSection === 'tools' ? 'bg-app-tertiary' : ''
              } ${isCollapsed 
                ? 'w-10 h-10 justify-center px-0 py-0 hover:bg-app-tertiary' 
                : 'w-full px-3 py-2.5 text-app-primary hover:bg-app-tertiary'}`}
              title={isCollapsed ? 'Tools' : ''}
            >
              <div className={`w-6 h-6 bg-app-tertiary rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-app-tertiary ${isCollapsed ? '' : 'mr-3'}`}>
                <Wrench size={14} className="text-app-secondary" />
              </div>
              {!isCollapsed && <span className="truncate">Tools & Integrations</span>}
            </button>
            
            {/* Project Settings */}
            <button 
              onClick={() => navigateToSection('settings')}
              className={`flex items-center rounded-md transition-colors text-sm group ${
                activeSection === 'settings' ? 'bg-app-tertiary' : ''
              } ${isCollapsed 
                ? 'w-10 h-10 justify-center px-0 py-0 hover:bg-app-tertiary' 
                : 'w-full px-3 py-2.5 text-app-primary hover:bg-app-tertiary'}`}
              title={isCollapsed ? 'Settings' : ''}
            >
              <div className={`w-6 h-6 bg-app-tertiary rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-app-tertiary ${isCollapsed ? '' : 'mr-3'}`}>
                <Settings size={14} className="text-app-secondary" />
              </div>
              {!isCollapsed && <span className="truncate">Settings</span>}
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer section */}
      <div className="mt-auto border-t border-app-color flex-shrink-0">
        {/* Toggle button */}
        <div className="py-3 px-3 flex justify-center items-center border-b border-app-color">
          <button 
            onClick={handleCollapse} 
            className="w-9 h-9 rounded-full flex items-center justify-center text-app-secondary hover:text-app-primary transition-colors"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        <div className={`py-3 ${isCollapsed ? 'px-1 flex justify-center' : 'px-3'}`}>
          <UserProfile 
            collapsed={isCollapsed} 
            username={userSession?.user?.user_metadata?.name || userSession?.user?.user_metadata?.full_name} 
            email={userSession?.user?.email}
            plan={userSession?.user?.user_metadata?.plan || 'Free plan'} 
          />
        </div>
      </div>
    </div>
  );
} 