import React from 'react';
import { Users, ChevronRight, Clock } from 'lucide-react';
import { Project } from './types';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
    } else if (diffHour > 0) {
      return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
    } else if (diffMin > 0) {
      return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
    } else {
      return 'just now';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-[#2E2E2E] border border-[#444] rounded-xl hover:border-[#6366F1]/30 transition-all duration-300 overflow-hidden h-full flex flex-col cursor-pointer"
    >
      <div className="p-6 flex-1">
        <div className="mb-4">
          <h3 className="text-xl font-medium text-white mb-2">{project.name}</h3>
          <p className="text-[#94A3B8] text-sm line-clamp-2">{project.description}</p>
        </div>
        
        <div className="flex items-center text-sm text-[#94A3B8] mb-5">
          <span className="flex items-center mr-5">
            <Users size={15} className="mr-2" />
            {project.agents || 0} agents
          </span>
          <span className="flex items-center">
            <Clock size={15} className="mr-2" />
            {project.lastActive ? formatRelativeTime(project.lastActive) : 'New'}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {project.tags && project.tags.map((tag, index) => (
            <span key={index} className="px-2.5 py-1 text-xs bg-[#252525] text-[#94A3B8] rounded-md">
              {tag}
            </span>
          ))}
          
          {(!project.tags || project.tags.length === 0) && (
            <span className="px-2.5 py-1 text-xs bg-[#252525] text-[#94A3B8] rounded-md">
              {project.status || 'active'}
            </span>
          )}
        </div>
      </div>
      
      <div className="border-t border-[#444] px-6 py-3 flex justify-between items-center">
        <div 
          className="text-[#6366F1] hover:text-[#818CF8] font-medium transition-colors flex items-center text-sm"
        >
          View Project
          <ChevronRight size={16} className="ml-1" />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 