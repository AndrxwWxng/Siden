import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Folder, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Logo from '../Logo';
import UserProfile from './UserProfile';
import { Project } from './types';

interface SidebarProps {
  projects: Project[];
  selectedProject: Project | null;
  onNewProject: () => void;
  onCollapse?: (collapsed: boolean) => void;
}

export const Sidebar = ({ projects, selectedProject, onNewProject, onCollapse }: SidebarProps) => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
  };

  return (
    <div 
      className={`fixed left-0 h-full bg-[#1B1A19] border-r border-[#313131] z-10 transition-all duration-200 flex flex-col`}
      style={{ width: isCollapsed ? '60px' : '280px' }}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-center border-b border-[#313131] flex-shrink-0">
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
              className="w-8 h-8 flex items-center justify-center bg-[#6366F1] hover:bg-[#5254CC] rounded-md transition-colors"
              title="Create Project"
            >
              <Plus size={16} />
            </button>
          ) : (
            <button 
              onClick={onNewProject}
              className="w-full flex items-center justify-center px-4 py-3 bg-[#6366F1] hover:bg-[#5254CC] rounded-lg transition-colors text-sm font-medium"
            >
              Create Project
            </button>
          )}
        </div>
        
        <div>
          <div className={`py-2 flex items-center justify-between mb-2 ${isCollapsed ? 'px-0 justify-center' : 'px-5'}`}>
            {!isCollapsed && (
              <h3 className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">Projects</h3>
            )}
            <span className="text-[11px] bg-[#252525] text-[#94A3B8] rounded-md px-1.5 py-0.5 w-6 h-6 flex items-center justify-center">
              {projects.length}
            </span>
          </div>
          
          <div className={`space-y-1.5 mt-1 ${isCollapsed ? 'px-2' : 'px-3'}`}>
            {projects.map(project => (
              <button 
                key={project.id}
                onClick={() => router.push(`/dashboard/project?id=${project.id}`)}
                className={`flex items-center rounded-md transition-colors text-sm group ${isCollapsed 
                  ? 'w-10 h-10 justify-center px-0 py-0 hover:bg-[#252525]' 
                  : 'w-full px-3 py-2.5 text-[#E6E8EB] hover:bg-[#252525]'}`}
                title={isCollapsed ? project.name : ''}
              >
                <div className={`w-6 h-6 bg-[#252525] rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-[#313131] ${isCollapsed ? '' : 'mr-3'}`}>
                  <Folder size={14} className="text-[#94A3B8]" />
                </div>
                {!isCollapsed && <span className="truncate">{project.name}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer section */}
      <div className="mt-auto border-t border-[#313131] flex-shrink-0">
        {/* Toggle button */}
        <div className="py-3 px-3 flex justify-center items-center border-b border-[#313131]">
          <button 
            onClick={handleCollapse} 
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#94A3B8] hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        
        {/* User profile */}
        <div className={`py-3 ${isCollapsed ? 'px-1 flex justify-center' : 'px-3'}`}>
          <UserProfile collapsed={isCollapsed} username="Kendall Booker" plan="Professional plan" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 