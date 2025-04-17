import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import type { Project } from '@/hooks/useProject';

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="ml-1">Back</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold">{project.name}</h1>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground capitalize">{project.status}</span>
          </div>
        </div>

        <nav className="flex items-center space-x-4">
          <Link
            href={`/dashboard/project/${project.id}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Overview
          </Link>
          <Link
            href={`/dashboard/project/${project.id}/chat`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Team Chat
          </Link>
          <Link
            href={`/dashboard/project/${project.id}/settings`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Settings
          </Link>
        </nav>
      </div>
    </header>
  );
} 