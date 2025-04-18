import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface ProjectHeaderProps {
  project: {
    id: string;
    name: string;
    status: string;
  };
  title: string;
  section?: string;
}

export const ProjectHeader = ({ project, title, section }: ProjectHeaderProps) => {
  const pathname = usePathname();
  
  // Define tab paths
  const tabs = [
    { name: 'Chat', path: `/dashboard/project/chat/${project.id}` },
    { name: 'Team', path: `/dashboard/project/team/${project.id}` },
    { name: 'Settings', path: `/dashboard/project/settings/${project.id}` },
    { name: 'Tools', path: `/dashboard/project/tools${project.id}` },
  ];

  // Check if current path matches the tab
  const isActivePath = (path: string) => {
    // For root project path
    if (path === `/dashboard/project/${project.id}` && pathname === path) {
      return true;
    }
    // For nested paths
    return pathname?.startsWith(path) && path !== `/dashboard/project/${project.id}`;
  };

  return (
    <header className="border-b border-app-color bg-app-primary">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="flex items-center text-app-secondary hover:text-app-primary transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="ml-1">Back</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold">
              <span className="text-indigo-500">{title}</span>
              {section && <span className="text-app-secondary">• {section}</span>}
            </h1>
          </div>
        </div>

        <nav className="flex items-center space-x-1">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              href={tab.path}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                isActivePath(tab.path) 
                  ? 'text-app-primary bg-indigo-500/10 font-medium' 
                  : 'text-app-secondary hover:text-app-primary hover:bg-app-tertiary'
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default ProjectHeader; 