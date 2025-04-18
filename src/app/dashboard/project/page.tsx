'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
