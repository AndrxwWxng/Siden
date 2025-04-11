import React, { useState } from 'react';
import { Search, Filter, Grid } from 'lucide-react';
import { FilterType } from './types';

interface ProjectSearchProps {
  onSearch: (term: string) => void;
  onFilterChange: (filter: FilterType) => void;
  selectedFilter: FilterType;
}

const ProjectSearch: React.FC<ProjectSearchProps> = ({ 
  onSearch, 
  onFilterChange, 
  selectedFilter 
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
            className="block w-full pl-12 pr-4 py-3 bg-[#202020] border border-[#444] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] text-base"
          />
        </div>
        
        <div className="flex bg-[#202020] border border-[#444] rounded-lg overflow-hidden">
          <button 
            onClick={() => onFilterChange('all')}
            className={`px-5 py-3 text-sm font-medium ${selectedFilter === 'all' ? 'bg-[#313030] text-white' : 'bg-transparent text-[#A3A3A3] hover:text-white'} transition-colors`}
          >
            All
          </button>
          <button 
            onClick={() => onFilterChange('active')}
            className={`px-5 py-3 text-sm font-medium ${selectedFilter === 'active' ? 'bg-[#313030] text-white' : 'bg-transparent text-[#A3A3A3] hover:text-white'} transition-colors`}
          >
            Active
          </button>
          <button 
            onClick={() => onFilterChange('archived')}
            className={`px-5 py-3 text-sm font-medium ${selectedFilter === 'archived' ? 'bg-[#313030] text-white' : 'bg-transparent text-[#A3A3A3] hover:text-white'} transition-colors`}
          >
            Archived
          </button>
        </div>
        
        <button className="p-3 rounded-lg border border-[#444] hover:border-[#6366F1] transition-colors bg-[#202020]">
          <Filter size={20} className="text-[#A3A3A3]" />
        </button>
        
        <button className="p-3 rounded-lg border border-[#444] hover:border-[#6366F1] transition-colors bg-[#202020]">
          <Grid size={20} className="text-[#A3A3A3]" />
        </button>
      </div>
    </div>
  );
};

export default ProjectSearch; 