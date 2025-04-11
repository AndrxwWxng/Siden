import React from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Folder, Command } from 'lucide-react';
import Logo from '../Logo';
import UserProfile from './UserProfile';
import { Project } from './types';

interface SidebarProps {
  projects: Project[];
  onNewProject: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ projects, onNewProject }) => {
  const router = useRouter();

  return (
    <div className="w-[280px] border-r border-[#313131] bg-[#131313] flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-[#313131]">
        <Logo />
      </div>
      
      <div className="flex-1 py-6 overflow-auto flex flex-col">
        <div className="px-4 mb-6">
          <button 
            onClick={onNewProject}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#6366F1] hover:bg-[#5254CC] rounded-lg transition-colors text-sm font-medium shadow-md"
          >
            <PlusCircle size={16} />
            Create Project
          </button>
        </div>
        
        <div className="mb-auto">
          <div className="px-6 py-2 flex items-center justify-between">
            <h3 className="text-[8px] font-medium text-[#8A8F98] uppercase tracking-wider">Projects</h3>
            <span className="text-[8px] bg-[#252525] text-[#8A8F98] rounded-md px-1.5 py-0.5">
              {projects.length}
            </span>
          </div>
          
          <div className="mt-2 space-y-1 px-3">
            {projects.map(project => (
              <button 
                key={project.id}
                onClick={() => router.push(`/dashboard/project?id=${project.id}`)}
                className="w-full flex items-center rounded-md px-3 py-2.5 text-[#E6E8EB] hover:bg-[#202020] transition-colors text-sm group"
              >
                <div className="mr-3 w-7 h-7 bg-[#252525] rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-[#313030]">
                  <Folder size={15} className="text-[#A3A3A3]" />
                </div>
                <span className="truncate">{project.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="border-t border-[#313131] p-3">
        <UserProfile username="Kendall Booker" plan="Professional plan" />
      </div>
    </div>
  );
};

export default Sidebar; 