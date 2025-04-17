'use client';

import { useSearchParams } from 'next/navigation';
import SimplifiedChat from './SimplifiedChat';
import dynamic from 'next/dynamic';

// Dynamically import the ProjectDetail component to avoid circular references
const ProjectDetail = dynamic(() => import('./page'), { ssr: false });

export default function ProjectWrapper() {
  const searchParams = useSearchParams();
  const projectId = searchParams?.get('id') || 'unknown';
  
  return (
    <div className="space-y-6">
      {/* SimplifiedChat Component */}
      <div className="mb-6">
        <SimplifiedChat projectId={projectId} />
      </div>
      
      {/* Original Project Component */}
      <ProjectDetail />
    </div>
  );
} 