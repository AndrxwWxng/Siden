import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectHeader from '../components/ProjectHeader';
import ProjectSettings from '../components/ProjectSettings';
import TeamMembers from '../components/TeamMembers';
import ToolIntegration from '../components/ToolIntegration';
import ProjectReports from '../components/ProjectReports';
import ProjectChat from '../components/ProjectChat';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { getProjectById } from '@/services/projectService';

interface ProjectPageParams {
  params: {
    id: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageParams) {
  const project = await getProjectById(params.id);
  
  if (!project) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <ProjectHeader project={project} />
      
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="mb-6 bg-[#252525] border border-[#313131] p-1 rounded-lg">
            <TabsTrigger value="chat" className="data-[state=active]:bg-[#6366F1] data-[state=active]:text-white">
              Chat
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[#6366F1] data-[state=active]:text-white">
              Settings
            </TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-[#6366F1] data-[state=active]:text-white">
              Team
            </TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-[#6366F1] data-[state=active]:text-white">
              Integrations
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-[#6366F1] data-[state=active]:text-white">
              Reports
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat">
            <Suspense fallback={<LoadingSpinner />}>
              <ProjectChat project={project} />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="settings">
            <Suspense fallback={<LoadingSpinner />}>
              <ProjectSettings 
                project={project} 
                onProjectUpdated={(updatedProject) => {
                  // In a client component, we would update state here
                  // For server component, we can't directly update state
                  // We'll rely on client component logic or refresh
                  console.log('Project updated:', updatedProject);
                }} 
              />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="team">
            <Suspense fallback={<LoadingSpinner />}>
              <TeamMembers 
                project={project}
                onProjectUpdated={(updatedProject) => {
                  console.log('Team updated:', updatedProject);
                }} 
              />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="integrations">
            <Suspense fallback={<LoadingSpinner />}>
              <ToolIntegration 
                project={project}
                onProjectUpdated={(updatedProject) => {
                  console.log('Integrations updated:', updatedProject);
                }} 
              />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="reports">
            <Suspense fallback={<LoadingSpinner />}>
              <ProjectReports project={project} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 