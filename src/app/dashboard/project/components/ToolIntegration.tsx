import { useState, useEffect } from 'react';
import { Link2, Plus, X, Check, Trash2, AlertTriangle } from 'lucide-react';
import { Project, ProjectIntegration, Service } from '@/components/dashboard/types';
import { updateProjectIntegrations } from '../projectFunctions';

interface ToolIntegrationProps {
  project: Project;
  onProjectUpdated?: (updatedProject: Project) => void;
}

// Service type icons mapping
const serviceTypeIcons = {
  api: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 18L22 12L17 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 6L2 12L7 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 4L10 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  database: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 8C16.4183 8 20 6.65685 20 5C20 3.34315 16.4183 2 12 2C7.58172 2 4 3.34315 4 5C4 6.65685 7.58172 8 12 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 12C4 13.6569 7.58172 15 12 15C16.4183 15 20 13.6569 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 5V19C4 20.6569 7.58172 22 12 22C16.4183 22 20 20.6569 20 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  storage: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7C3 5.89543 3.89543 5 5 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 15C12.5523 15 13 14.5523 13 14C13 13.4477 12.5523 13 12 13C11.4477 13 11 13.4477 11 14C11 14.5523 11.4477 15 12 15Z" fill="currentColor"/>
    </svg>
  ),
  other: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

export default function ToolIntegration({ project, onProjectUpdated }: ToolIntegrationProps) {
  const initialIntegration: ProjectIntegration = project.integrations || { 
    connected: false, 
    services: [] 
  };
  
  const [integrations, setIntegrations] = useState<ProjectIntegration>(initialIntegration);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Form state for adding new service
  const [newService, setNewService] = useState<Partial<Service>>({
    name: '',
    type: 'api',
    endpoint: '',
    api_key: '',
    status: 'pending'
  });
  
  // Reset form when canceling
  const resetNewServiceForm = () => {
    setNewService({
      name: '',
      type: 'api',
      endpoint: '',
      api_key: '',
      status: 'pending'
    });
    setErrors({});
  };
  
  // Handle form input changes
  const handleNewServiceChange = (field: keyof Service, value: string) => {
    setNewService(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if any
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // Validate new service form
  const validateNewService = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!newService.name?.trim()) {
      newErrors.name = 'Service name is required';
    }
    
    if (newService.type === 'api' && !newService.endpoint?.trim()) {
      newErrors.endpoint = 'API endpoint is required';
    }
    
    if (!newService.api_key?.trim()) {
      newErrors.api_key = 'API key or authentication token is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Add new service
  const handleAddService = () => {
    if (!validateNewService()) {
      return;
    }
    
    // Generate a unique ID for the new service
    const newId = Date.now().toString();
    
    const serviceToAdd: Service = {
      id: newId,
      name: newService.name!,
      type: newService.type as 'api' | 'database' | 'storage' | 'other',
      endpoint: newService.endpoint,
      api_key: newService.api_key,
      status: 'connected'
    };
    
    const updatedIntegrations: ProjectIntegration = {
      connected: true,
      services: [...integrations.services, serviceToAdd]
    };
    
    setIntegrations(updatedIntegrations);
    setShowAddForm(false);
    resetNewServiceForm();
    
    // Save the updated integrations
    saveIntegrations(updatedIntegrations);
  };
  
  // Remove a service
  const handleRemoveService = (serviceId: string) => {
    const updatedServices = integrations.services.filter(service => service.id !== serviceId);
    const updatedIntegrations: ProjectIntegration = {
      connected: updatedServices.length > 0,
      services: updatedServices
    };
    
    setIntegrations(updatedIntegrations);
    setShowDeleteConfirm(null);
    
    // Save the updated integrations
    saveIntegrations(updatedIntegrations);
  };
  
  // Save integrations to the database
  const saveIntegrations = async (updatedIntegrations: ProjectIntegration) => {
    setIsSaving(true);
    
    try {
      const success = await updateProjectIntegrations(
        project.id,
        updatedIntegrations
      );
      
      if (success && onProjectUpdated) {
        onProjectUpdated({
          ...project,
          integrations: updatedIntegrations
        });
      }
    } catch (error) {
      console.error('Error updating integrations:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Update integration state when project changes
  useEffect(() => {
    if (project.integrations) {
      setIntegrations(project.integrations);
    }
  }, [project]);
  
  return (
    <div className="bg-[#252525] rounded-xl border border-[#313131] p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link2 size={20} className="text-[#6366F1]" />
          <h2 className="text-xl font-medium">Tool Integrations</h2>
        </div>
        
        {!showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="px-3 py-1.5 bg-[#6366F1] hover:bg-[#5254CC] text-white rounded-md transition-colors flex items-center gap-1.5"
          >
            <Plus size={16} />
            <span>Add Integration</span>
          </button>
        )}
      </div>
      
      {/* Connection status */}
      <div className="mb-6 flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${integrations.connected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
        <span className="text-sm text-[#94A3B8]">
          {integrations.connected 
            ? `Connected (${integrations.services.length} integration${integrations.services.length !== 1 ? 's' : ''})` 
            : 'Not connected'}
        </span>
      </div>
      
      {/* Add integration form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-[#343131] border border-[#444] rounded-md">
          <h3 className="font-medium mb-4">Add Integration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#94A3B8]">Service Name</label>
              <input
                type="text"
                value={newService.name}
                onChange={(e) => handleNewServiceChange('name', e.target.value)}
                placeholder="GitHub"
                className="w-full px-3 py-2 bg-[#252525] border border-[#313131] rounded-md focus:outline-none focus:border-[#6366F1]"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-[#94A3B8]">Service Type</label>
              <select
                value={newService.type}
                onChange={(e) => handleNewServiceChange('type', e.target.value)}
                className="w-full px-3 py-2 bg-[#252525] border border-[#313131] rounded-md focus:outline-none focus:border-[#6366F1]"
              >
                <option value="api">API</option>
                <option value="database">Database</option>
                <option value="storage">Storage</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {newService.type === 'api' && (
              <div>
                <label className="block text-sm font-medium mb-1 text-[#94A3B8]">Endpoint URL</label>
                <input
                  type="text"
                  value={newService.endpoint || ''}
                  onChange={(e) => handleNewServiceChange('endpoint', e.target.value)}
                  placeholder="https://api.example.com/v1"
                  className="w-full px-3 py-2 bg-[#252525] border border-[#313131] rounded-md focus:outline-none focus:border-[#6366F1]"
                />
                {errors.endpoint && <p className="text-red-400 text-sm mt-1">{errors.endpoint}</p>}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1 text-[#94A3B8]">
                API Key / Authentication Token
              </label>
              <input
                type="password"
                value={newService.api_key || ''}
                onChange={(e) => handleNewServiceChange('api_key', e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full px-3 py-2 bg-[#252525] border border-[#313131] rounded-md focus:outline-none focus:border-[#6366F1]"
              />
              <p className="text-xs text-[#94A3B8] mt-1">
                Your API key will be encrypted before storing
              </p>
              {errors.api_key && <p className="text-red-400 text-sm mt-1">{errors.api_key}</p>}
            </div>
            
            <div className="flex gap-2 justify-end mt-4">
              <button 
                onClick={() => {
                  setShowAddForm(false);
                  resetNewServiceForm();
                }}
                className="px-4 py-2 border border-[#313131] hover:border-[#444] text-[#94A3B8] rounded-md transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddService}
                disabled={isUpdating}
                className="px-4 py-2 bg-[#6366F1] hover:bg-[#5254CC] text-white rounded-md transition-colors flex items-center gap-2"
              >
                {isUpdating ? (
                  <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Add Service</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Integrations list */}
      {integrations.services.length > 0 ? (
        <div className="bg-[#343131] border border-[#313131] rounded-md">
          <ul className="divide-y divide-[#444]">
            {integrations.services.map((service) => (
              <li key={service.id} className="p-4">
                {showDeleteConfirm === service.id ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertTriangle size={16} />
                      <span>Are you sure you want to remove this integration?</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowDeleteConfirm(null)}
                        className="px-2 py-1 bg-[#252525] text-[#94A3B8] rounded-md hover:bg-[#313131]"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleRemoveService(service.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                        service.status === 'connected' ? 'bg-[#6366F1]/20 text-[#6366F1]' : 
                        service.status === 'error' ? 'bg-red-500/20 text-red-500' : 
                        'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {serviceTypeIcons[service.type]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{service.name}</h4>
                          <div className={`px-1.5 py-0.5 text-xs rounded ${
                            service.status === 'connected' ? 'bg-green-500/20 text-green-500' : 
                            service.status === 'error' ? 'bg-red-500/20 text-red-500' : 
                            'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {service.status === 'connected' ? 'Connected' : 
                             service.status === 'error' ? 'Error' : 'Pending'}
                          </div>
                        </div>
                        <p className="text-sm text-[#94A3B8]">
                          {service.type === 'api' ? (
                            <span className="truncate block max-w-[300px]">{service.endpoint}</span>
                          ) : (
                            <span>{service.type.charAt(0).toUpperCase() + service.type.slice(1)}</span>
                          )}
                        </p>
                        {service.error_message && (
                          <p className="text-sm text-red-400 mt-1">{service.error_message}</p>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setShowDeleteConfirm(service.id)}
                      className="p-1.5 rounded-md bg-[#252525] hover:bg-[#FF5A5A] text-[#94A3B8] hover:text-white transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-[#343131] border border-[#313131] rounded-md p-4 text-center text-[#94A3B8]">
          <p>No integrations yet. Add external tools to enhance your project.</p>
        </div>
      )}
      
      {/* Saving indicator */}
      {isSaving && (
        <div className="mt-4 flex items-center gap-2 text-[#94A3B8] text-sm">
          <div className="w-4 h-4 border-t-2 border-[#6366F1] border-solid rounded-full animate-spin"></div>
          <span>Saving changes...</span>
        </div>
      )}
    </div>
  );
} 