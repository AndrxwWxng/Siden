import React from 'react';
import { Users, ChevronRight } from 'lucide-react';
import { Project } from './types';

interface ProjectCardProps extends Omit<Project, 'id'> {
  id: string;
  onViewProject: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  description,
  agents,
  lastActive,
  tags,
  onViewProject
}) => {
  return (
    <div className="bg-[#2E2E2E] border border-[#444] rounded-xl hover:border-[#6366F1]/30 transition-all duration-300 overflow-hidden h-full flex flex-col">
      <div className="p-6 flex-1">
        <div className="mb-4">
          <h3 className="text-xl font-medium text-white mb-2">{name}</h3>
          <p className="text-[#94A3B8] text-sm line-clamp-2">{description}</p>
        </div>
        
        <div className="flex items-center text-sm text-[#94A3B8] mb-5">
          <span className="flex items-center mr-5">
            <Users size={15} className="mr-2" />
            {agents} agents
          </span>
          <span className="flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] mr-1.5"></span>
            Active {lastActive}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="px-2.5 py-1 text-xs bg-[#252525] text-[#94A3B8] rounded-md">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="border-t border-[#444] px-6 py-3 flex justify-between items-center">
        <button 
          onClick={() => onViewProject(id)}
          className="text-[#6366F1] hover:text-[#818CF8] font-medium transition-colors flex items-center text-sm"
        >
          View Project
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default ProjectCard; 