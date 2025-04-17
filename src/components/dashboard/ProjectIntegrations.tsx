import React, { useState } from 'react';
import { Database, Plus, Link2, Check, X, RefreshCw } from 'lucide-react';
import { ProjectIntegration } from './types';

interface ProjectIntegrationsProps {
  projectId: string;
  initialIntegrations: ProjectIntegration;
  onSave: (integrations: ProjectIntegration) => Promise<boolean>;
}

const ProjectIntegrations: React.FC<ProjectIntegrationsProps> = ({
  projectId,
  initialIntegrations,
  onSave
}) => {
  const [integrations, setIntegrations] = useState<ProjectIntegration>(
    initialIntegrations || {
      connected: false,
      services: []
    }
  );
  
  const [isAddingService, setIsAddingService] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state for new integration
  const [newService, setNewService] = useState({
    name: '',
    type: 'api',
    endpoint: '',
    apiKey: '',
    status: 'disconnected' as const
  });
  
  const addService = async () => {
    if (!newService.name || !newService.endpoint) {
      alert('Please provide a name and endpoint for the integration');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Test the connection (simulated)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add the service with connected status
      const updatedIntegrations = {
        ...integrations,
        connected: true,
        services: [
          ...integrations.services,
          {
            ...newService,
            status: 'connected' as const,
            lastConnected: new Date().toISOString()
          }
        ]
      };
      
      // Save to backend
      const success = await onSave(updatedIntegrations);
      
      if (success) {
        setIntegrations(updatedIntegrations);
        setIsAddingService(false);
        setNewService({
          name: '',
          type: 'api',
          endpoint: '',
          apiKey: '',
          status: 'disconnected' as const
        });
      } else {
        alert('Failed to save integration');
      }
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Failed to connect to the service');
    } finally {
      setIsSaving(false);
    }
  };
  
  const removeService = async (index: number) => {
    const updatedServices = [...integrations.services];
    updatedServices.splice(index, 1);
    
    const updatedIntegrations = {
      ...integrations,
      connected: updatedServices.length > 0,
      services: updatedServices
    };
    
    try {
      const success = await onSave(updatedIntegrations);
      if (success) {
        setIntegrations(updatedIntegrations);
      } else {
        alert('Failed to remove integration');
      }
    } catch (error) {
      console.error('Error removing service:', error);
    }
  };
  
  return (
    <div className="bg-[#2E2E2E] border border-[#444] rounded-xl overflow-hidden mt-6">
      <div className="px-6 py-4 border-b border-[#444] flex items-center justify-between">
        <div className="flex items-center">
          <Database size={18} className="text-[#6366F1] mr-2" />
          <h2 className="text-lg font-medium">Integrations & Services</h2>
        </div>
        
        <button 
          onClick={() => setIsAddingService(true)}
          className="text-sm px-3 py-1.5 bg-[#3A3A3A] hover:bg-[#444] rounded-md transition-colors flex items-center gap-1"
        >
          <Plus size={14} />
          Add Service
        </button>
      </div>
      
      <div className="p-6">
        {isAddingService ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Service Name</label>
              <input 
                type="text"
                value={newService.name}
                onChange={(e) => setNewService({...newService, name: e.target.value})}
                placeholder="e.g., Company API, Payment Service"
                className="w-full px-4 py-3 bg-[#202020] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Service Type</label>
              <select 
                value={newService.type}
                onChange={(e) => setNewService({...newService, type: e.target.value})}
                className="w-full px-4 py-3 bg-[#202020] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
              >
                <option value="api">REST API</option>
                <option value="database">Database</option>
                <option value="webhook">Webhook</option>
                <option value="custom">Custom Integration</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Endpoint URL</label>
              <input 
                type="text"
                value={newService.endpoint}
                onChange={(e) => setNewService({...newService, endpoint: e.target.value})}
                placeholder="https://api.example.com/v1"
                className="w-full px-4 py-3 bg-[#202020] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">API Key / Auth Token</label>
              <input 
                type="password"
                value={newService.apiKey}
                onChange={(e) => setNewService({...newService, apiKey: e.target.value})}
                placeholder="Enter your API key"
                className="w-full px-4 py-3 bg-[#202020] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
              />
              <p className="mt-1 text-xs text-[#A3A3A3]">Your API key is securely stored and encrypted</p>
            </div>
            
            <div className="flex gap-2 justify-end mt-4">
              <button 
                onClick={() => setIsAddingService(false)}
                className="px-4 py-2 border border-[#444] hover:border-[#6366F1] rounded-md transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={addService}
                disabled={isSaving || !newService.name || !newService.endpoint}
                className={`px-6 py-2 rounded-md transition-colors flex items-center gap-2 ${
                  isSaving || !newService.name || !newService.endpoint
                    ? 'bg-[#444] text-[#999] cursor-not-allowed'
                    : 'bg-[#6366F1] hover:bg-[#4F46E5] text-white'
                }`}
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Link2 size={16} />
                    Connect Service
                  </>
                )}
              </button>
            </div>
          </div>
        ) : integrations.services.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-[#A3A3A3] mb-4">
              Connected services are accessible to your project's AI agents
            </p>
            
            <div className="space-y-3">
              {integrations.services.map((service, index) => (
                <div key={index} className="p-4 bg-[#202020] rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        service.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <button 
                      onClick={() => removeService(index)}
                      className="text-[#999] hover:text-white transition-colors"
                      title="Remove integration"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-[#A3A3A3]">Type</div>
                      <div>{service.type}</div>
                    </div>
                    <div>
                      <div className="text-[#A3A3A3]">Status</div>
                      <div className="flex items-center gap-1">
                        {service.status === 'connected' ? (
                          <>
                            <Check size={14} className="text-green-500" />
                            <span>Connected</span>
                          </>
                        ) : (
                          <>
                            <X size={14} className="text-red-500" />
                            <span>Disconnected</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-[#A3A3A3]">Endpoint</div>
                      <div className="font-mono text-xs truncate">{service.endpoint}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#202020] rounded-full flex items-center justify-center mx-auto mb-4">
              <Database size={24} className="text-[#6366F1]" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Integrations Connected</h3>
            <p className="text-[#A3A3A3] mb-6 max-w-md mx-auto">
              Connect your project to external services, APIs, or databases to enhance your AI agents' capabilities.
            </p>
            <button 
              onClick={() => setIsAddingService(true)}
              className="px-6 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-md transition-colors inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Add Your First Integration
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectIntegrations; 