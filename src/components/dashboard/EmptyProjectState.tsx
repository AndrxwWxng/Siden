import React from 'react';
import { PlusCircle } from 'lucide-react';

interface EmptyProjectStateProps {
  onCreateProject: () => void;
}

const EmptyProjectState: React.FC<EmptyProjectStateProps> = ({ onCreateProject }) => {
  return (
    <div className="text-center max-w-lg mx-auto py-16 px-8">
      <div className="w-24 h-24 rounded-full bg-[#252525] flex items-center justify-center mx-auto mb-6">
        <PlusCircle size={48} className="text-[#6366F1]" />
      </div>
      <h3 className="text-3xl font-medium mb-4">No projects yet</h3>
      <p className="text-[#A3A3A3] text-lg mb-10 leading-relaxed">
        Start building with AI-powered agents to bring your ideas to life.
      </p>
      <button 
        onClick={onCreateProject}
        className="px-8 py-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg transition-colors shadow-lg inline-flex items-center gap-3 text-lg font-medium"
      >
        <PlusCircle size={22} />
        Create Your First Project
      </button>
    </div>
  );
};

export default EmptyProjectState; 