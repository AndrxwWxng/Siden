import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface ProjectHeaderProps {
  project: {
    id: string;
    name: string;
    status: string;
  };
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const pathname = usePathname();
  
  // Define tab paths
  const tabs = [
    { name: 'Overview', path: `/dashboard/project/${project.id}` },
    { name: 'Team Chat', path: `/dashboard/project/${project.id}/chat` },
    { name: 'Analytics', path: `/dashboard/project/${project.id}/analytics` },
    { name: 'Knowledge Base', path: `/dashboard/project/${project.id}/knowledge` },
    { name: 'Settings', path: `/dashboard/project/${project.id}/settings` },
  ];
  
  // Check if current path matches the tab
  const isActivePath = (path: string) => {
    // For root project path
    if (path === `/dashboard/project/${project.id}` && pathname === path) {
      return true;
    }
    // For nested paths
    return pathname.startsWith(path) && path !== `/dashboard/project/${project.id}`;
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
            <h1 className="text-lg font-semibold">{project.name}</h1>
            <span className="text-app-secondary">•</span>
            <span className="text-sm text-app-secondary capitalize">{project.status}</span>
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
} 