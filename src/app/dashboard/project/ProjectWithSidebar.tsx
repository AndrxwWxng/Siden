'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import ProjectSidebar from '@/components/project/ProjectSidebar';

interface ProjectWithSidebarProps {
  children: React.ReactNode;
}

export default function ProjectWithSidebar({ children }: ProjectWithSidebarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname() || '';
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Get projectId from search params
  const projectId = searchParams?.get('id') || '';
  
  // Determine active section from path
  const getActiveSection = () => {
    if (pathname.includes('/chat')) return 'chat';
    if (pathname.includes('/team')) return 'team';
    if (pathname.includes('/tools')) return 'tools';
    if (pathname.includes('/settings')) return 'settings';
    return 'chat';
  };
  
  const activeSection = getActiveSection();

  return (
    <div className="flex min-h-screen bg-app-primary">
      {/* Project Sidebar */}
      <ProjectSidebar 
        projectId={projectId}
        activeSection={activeSection}
        onCollapse={(collapsed) => setSidebarCollapsed(collapsed)}
      />
      
      {/* Main Content */}
      <main 
        className="flex-1 transition-all duration-200"
        style={{ 
          marginLeft: sidebarCollapsed ? '60px' : '280px',
          width: sidebarCollapsed ? 'calc(100% - 60px)' : 'calc(100% - 280px)'
        }}
      >
        {children}
      </main>
    </div>
  );
} 