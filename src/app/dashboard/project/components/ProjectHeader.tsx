import { Project } from '@/components/dashboard/types';
import { ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

interface ProjectHeaderProps {
  project: Project;
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  // Format the last active date
  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    
    // If date is invalid, return 'Just now'
    if (isNaN(date.getTime())) {
      return 'Just now';
    }
    
    // Calculate time difference in milliseconds
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 30) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      // Format date as MMM DD, YYYY
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };
  
  return (
    <header className="bg-[#252525] border-b border-[#313131] py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-1 text-[#94A3B8] hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Projects</span>
            </Link>
            
            <div className="h-5 border-r border-[#313131]"></div>
            
            <div>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                <Clock size={14} />
                <span>Last active: {formatLastActive(project.lastActive)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Display team members icons/avatars */}
            {project.teamMembers && project.teamMembers.length > 0 && (
              <div className="flex -space-x-2">
                {project.teamMembers.slice(0, 3).map((member, i) => (
                  <div 
                    key={i} 
                    className="w-8 h-8 rounded-full border-2 border-[#252525] overflow-hidden"
                    title={member.name}
                  >
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#6366F1] flex items-center justify-center text-white font-medium">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                ))}
                
                {project.teamMembers.length > 3 && (
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-[#252525] bg-[#343131] flex items-center justify-center text-xs text-[#94A3B8]"
                    title={`${project.teamMembers.length - 3} more team member${project.teamMembers.length - 3 !== 1 ? 's' : ''}`}
                  >
                    +{project.teamMembers.length - 3}
                  </div>
                )}
              </div>
            )}
            
            <div 
              className={`px-2 py-1 text-xs rounded-full ${
                project.status === 'active' ? 'bg-green-500/20 text-green-500' : 
                project.status === 'archived' ? 'bg-yellow-500/20 text-yellow-500' : 
                'bg-red-500/20 text-red-500'
              }`}
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 