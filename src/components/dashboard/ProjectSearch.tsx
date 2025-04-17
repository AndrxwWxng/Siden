import React, { useState } from 'react';
import { Search, Filter, Grid } from 'lucide-react';
import { FilterType } from './types';

export interface ProjectSearchProps {
  onSearch: (term: string) => void;
  onFilterChange: (filter: FilterType) => void;
  currentFilter?: FilterType;
}

const ProjectSearch: React.FC<ProjectSearchProps> = ({ 
  onSearch, 
  onFilterChange, 
  currentFilter = 'all'
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#A3A3A3]" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search projects..."
            className="block w-full pl-12 pr-4 py-3 h-[46px] bg-[#202020] border border-[#444] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] text-base"
          />
        </div>
        
        <div className="flex h-[46px] bg-[#202020] border border-[#444] rounded-lg overflow-hidden">
          <button 
            onClick={() => onFilterChange('all')}
            className={`px-5 h-full flex items-center text-sm font-medium ${currentFilter === 'all' ? 'bg-[#313030] text-white' : 'bg-transparent text-[#A3A3A3] hover:text-white'} transition-colors`}
          >
            All
          </button>
          <button 
            onClick={() => onFilterChange('active')}
            className={`px-5 h-full flex items-center text-sm font-medium ${currentFilter === 'active' ? 'bg-[#313030] text-white' : 'bg-transparent text-[#A3A3A3] hover:text-white'} transition-colors`}
          >
            Active
          </button>
          <button 
            onClick={() => onFilterChange('archived')}
            className={`px-5 h-full flex items-center text-sm font-medium ${currentFilter === 'archived' ? 'bg-[#313030] text-white' : 'bg-transparent text-[#A3A3A3] hover:text-white'} transition-colors`}
          >
            Archived
          </button>
        </div>
        
        <button className="h-[46px] w-[46px] flex items-center justify-center rounded-lg border border-[#444] hover:border-[#6366F1] transition-colors bg-[#202020]">
          <Filter size={20} className="text-[#A3A3A3]" />
        </button>
        
        <button className="h-[46px] w-[46px] flex items-center justify-center rounded-lg border border-[#444] hover:border-[#6366F1] transition-colors bg-[#202020]">
          <Grid size={20} className="text-[#A3A3A3]" />
        </button>
      </div>
    </div>
  );
};

export default ProjectSearch; 