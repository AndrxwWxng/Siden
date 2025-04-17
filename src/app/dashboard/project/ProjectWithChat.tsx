'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SimplifiedChat from './SimplifiedChat';
import ProjectDetail from './page';

interface ProjectWithChatProps {
  projectId: string;
}

export default function ProjectWithChat({ projectId }: ProjectWithChatProps) {
  const router = useRouter();
  
  // We need this to ensure the component is properly hydrated on the client
  useEffect(() => {
    // This is just to make sure the component is mounted client-side
  }, []);
  
  return (
    <div className="space-y-6">
      {/* The SimplifiedChat Component */}
      <SimplifiedChat projectId={projectId} />
      
      {/* The Original Project Component */}
      <ProjectDetail />
    </div>
  );
} 