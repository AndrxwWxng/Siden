'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  MessageSquare, Users, Wrench, LineChart, 
  Settings, PlusCircle, Send, Paperclip,
  MoreHorizontal, Search, ChevronLeft, ChevronRight,
  Folder
} from 'lucide-react';
import Logo from '@/components/Logo';
// Import the client-side Mastra client instead of server-side
import mastraClient from '@/lib/mastraClient';
import { ProjectService } from '@/services/projectService';
import { Project } from '@/components/dashboard/types';

export default function ProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams?.get('id') || '';

  useEffect(() => {
    if (projectId) {
      // Simple redirect without validation to avoid the 400 error
      router.push(`/dashboard/project/tools?id=${projectId}`);
    } else {
      router.push('/dashboard');
    }
  }, [projectId, router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-app-primary">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-white">Redirecting to project...</p>
      </div>
    </div>
  );
}
