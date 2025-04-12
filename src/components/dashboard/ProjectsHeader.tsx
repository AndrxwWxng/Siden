import React from 'react';
import { PlusCircle } from 'lucide-react';

interface ProjectsHeaderProps {
  onCreateProject: () => void;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({ onCreateProject }) => {
  return (
    <div className="flex justify-between items-center mb-10">
      <div>
        <h1 className="text-4xl font-semibold mb-2">Your Projects</h1>
        <p className="text-[#A3A3A3] text-lg">Manage and track your AI agent workforces</p>
      </div>
      <button 
        onClick={onCreateProject}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-md transition-colors shadow-md hover:shadow-lg"
      >
        Create Project
      </button>
    </div>
  );
};

export default ProjectsHeader; 