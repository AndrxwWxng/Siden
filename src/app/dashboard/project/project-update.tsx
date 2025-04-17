// HOW TO UPDATE THE PROJECT PAGE:

/*
To update the main project page (src/app/dashboard/project/page.tsx) to add the functionality 
we've implemented in the separate components, follow these steps:

1. Add the additional imports at the top of the file:
```typescript
import { 
  MessageSquare, Users, Wrench, LineChart, 
  Settings, PlusCircle, Send, Paperclip,
  MoreHorizontal, Search, ChevronLeft, ChevronRight,
  Folder, Trash2, AlertTriangle
} from 'lucide-react';
import ProjectSettings from './components/ProjectSettings';
import ProjectAgents from './components/ProjectAgents';
import ProjectIntegrations from './components/ProjectIntegrations';
import ProjectChatConfig from './components/ProjectChatConfig';
```

2. Add additional state variables inside the ProjectDetail component:
```typescript
const [isSaving, setIsSaving] = useState<boolean>(false);
const [isDeleting, setIsDeleting] = useState<boolean>(false);
const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
```

3. Add an effect to track unsaved changes:
```typescript
// Track unsaved changes
useEffect(() => {
  if (project) {
    const hasNameChanged = project.name !== projectName;
    const hasDescriptionChanged = project.description !== projectDescription;
    setHasUnsavedChanges(hasNameChanged || hasDescriptionChanged);
  }
}, [project, projectName, projectDescription]);
```

4. Replace the renderTabContent function to use the new components:
```typescript
const renderTabContent = () => {
  // If we're still loading or have no project, show loading state
  if (isLoading || !project) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-t-2 border-indigo-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  switch (activeTab) {
    case 'communication':
      // Keep existing communication tab content
      return (
        <div className="bg-[#252525] rounded-xl border border-[#313131] flex flex-col h-[75vh]">
          {/* Communication header */}
          <div className="p-4 border-b border-[#313131] flex items-center justify-between">
            {/* ... existing communication tab content ... */}
          </div>
          
          {/* Agent info panel */}
          {showAgentInfo && (
            <div className="p-4 border-b border-[#313131] bg-[#343131]">
              {/* ... existing agent info content ... */}
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#252525]">
            {/* ... existing messages content ... */}
          </div>
          
          <div className="p-4 border-t border-[#313131] bg-[#343131]">
            {/* ... existing message input content ... */}
          </div>
        </div>
      );
    case 'agents':
      return (
        <ProjectAgents 
          project={project}
          onProjectUpdated={(updatedProject) => setProject(updatedProject)}
        />
      );
    case 'tools':
      return (
        <ProjectIntegrations 
          project={project}
          onProjectUpdated={(updatedProject) => setProject(updatedProject)}
        />
      );
    case 'reports':
      // Keep existing reports tab content
      return (
        <div className="bg-[#252525] rounded-xl border border-[#313131] p-6">
          <h2 className="text-xl font-medium mb-6">Work Reports</h2>
          <div className="space-y-6">
            {/* ... existing reports content ... */}
          </div>
        </div>
      );
    case 'settings':
      return (
        <div className="space-y-8">
          <ProjectSettings 
            project={project}
            onProjectUpdated={(updatedProject) => setProject(updatedProject)}
          />
          
          <ProjectChatConfig 
            project={project}
            onProjectUpdated={(updatedProject) => setProject(updatedProject)}
          />
        </div>
      );
    default:
      return null;
  }
};
```

5. Now the project page will use the new components with all the functionality for editing, 
   saving, and deleting projects, as well as managing agents and integrations.

Additionally, make sure you've created the required folder structure:
```
src/app/dashboard/project/
  ├── page.tsx
  ├── projectFunctions.ts
  └── components/
      ├── ProjectSettings.tsx
      ├── ProjectAgents.tsx 
      ├── ProjectIntegrations.tsx
      └── ProjectChatConfig.tsx
```
*/ 