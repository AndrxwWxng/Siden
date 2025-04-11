import React from 'react';
import { Plus } from 'lucide-react';

interface NewProjectCardProps {
  onClick: () => void;
}

const NewProjectCard: React.FC<NewProjectCardProps> = ({ onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="border border-[#444] rounded-xl hover:border-[#6366F1]/30 transition-all duration-300 h-full bg-[#2E2E2E] flex items-stretch"
    >
      <div className="flex flex-col justify-between p-6 w-full">
        <div className="mb-auto">
          <div className="h-10 w-10 rounded-full bg-[#252525] flex items-center justify-center mb-4">
            <Plus size={20} className="text-[#6366F1]" />
          </div>
          <h3 className="text-lg font-medium mb-2">New project</h3>
          <p className="text-[#94A3B8] text-sm">
            Build with AI-powered assistance
          </p>
        </div>
        
        <div className="mt-4">
          <button className="text-sm text-[#6366F1] font-medium hover:text-[#818CF8] transition-colors">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewProjectCard; 