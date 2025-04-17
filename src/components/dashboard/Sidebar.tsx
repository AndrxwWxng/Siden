import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Folder, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Logo from '../Logo';
import UserProfile from './UserProfile';
import { Project } from './types';
import { createClient } from '@/utils/supabase/client';

interface SidebarProps {
  projects: Project[];
  selectedProject: Project | null;
  onNewProject: () => void;
  onCollapse?: (collapsed: boolean) => void;
}

export const Sidebar = ({ projects, selectedProject, onNewProject, onCollapse }: SidebarProps) => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userSession, setUserSession] = useState<any>(null);

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

  const handleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
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
              onClick={onNewProject}
              className="w-8 h-8 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-md transition-colors"
              title="Create Project"
            >
              <Plus size={16} />
            </button>
          ) : (
            <button 
              onClick={onNewProject}
              className="w-full flex items-center justify-center px-4 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors text-sm font-medium"
            >
              Create Project
            </button>
          )}
        </div>
        
        <div>
          <div className={`py-2 flex items-center justify-between mb-2 ${isCollapsed ? 'px-0 justify-center' : 'px-5'}`}>
            {!isCollapsed && (
              <h3 className="text-[11px] font-medium text-app-secondary uppercase tracking-wider">Projects</h3>
            )}
            <span className="text-[11px] bg-app-tertiary text-app-secondary rounded-md px-1.5 py-0.5 w-6 h-6 flex items-center justify-center">
              {projects.length}
            </span>
          </div>
          
          <div className={`space-y-1.5 mt-1 ${isCollapsed ? 'px-2' : 'px-3'}`}>
            {projects.map(project => (
              <button 
                key={project.id}
                onClick={() => router.push(`/dashboard/project/${project.id}`)}
                className={`flex items-center rounded-md transition-colors text-sm group ${isCollapsed 
                  ? 'w-10 h-10 justify-center px-0 py-0 hover:bg-app-tertiary' 
                  : 'w-full px-3 py-2.5 text-app-primary hover:bg-app-tertiary'}`}
                title={isCollapsed ? project.name : ''}
              >
                <div className={`w-6 h-6 bg-app-tertiary rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-app-tertiary ${isCollapsed ? '' : 'mr-3'}`}>
                  <Folder size={14} className="text-app-secondary" />
                </div>
                {!isCollapsed && <span className="truncate">{project.name}</span>}
              </button>
            ))}
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
        
        {/* User profile */}
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
};

export default Sidebar; 