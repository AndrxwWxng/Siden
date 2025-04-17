import React, { useState } from 'react';
import { Settings, Save, RefreshCw } from 'lucide-react';
import { ChatConfig } from './types';

interface ProjectChatConfigProps {
  projectId: string;
  initialConfig: ChatConfig;
  onSave: (config: ChatConfig) => Promise<boolean>;
}

const ProjectChatConfig: React.FC<ProjectChatConfigProps> = ({ 
  projectId, 
  initialConfig, 
  onSave 
}) => {
  const [config, setConfig] = useState<ChatConfig>(initialConfig || {
    model: 'gpt-4',
    temperature: 0.7,
    max_tokens: 2000,
    system_prompt: 'You are a helpful AI assistant working on this project.',
    tools_enabled: true
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await onSave(config);
      if (success) {
        setIsEditing(false);
      } else {
        alert('Failed to save chat configuration');
      }
    } catch (error) {
      console.error('Error saving chat config:', error);
      alert('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="bg-[#2E2E2E] border border-[#444] rounded-xl overflow-hidden mt-6">
      <div className="px-6 py-4 border-b border-[#444] flex items-center justify-between">
        <div className="flex items-center">
          <Settings size={18} className="text-[#6366F1] mr-2" />
          <h2 className="text-lg font-medium">AI Chat Configuration</h2>
        </div>
        
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-sm px-3 py-1.5 bg-[#3A3A3A] hover:bg-[#444] rounded-md transition-colors"
          >
            Edit Config
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="text-sm px-3 py-1.5 bg-[#3A3A3A] hover:bg-[#444] rounded-md transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`text-sm px-3 py-1.5 flex items-center gap-1 rounded-md transition-colors ${
                isSaving 
                  ? 'bg-[#4A4A4A] cursor-not-allowed' 
                  : 'bg-[#6366F1] hover:bg-[#4F46E5]'
              }`}
            >
              {isSaving ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Save
                </>
              )}
            </button>
          </div>
        )}
      </div>
      
      <div className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Model</label>
              <select 
                value={config.model}
                onChange={(e) => setConfig({...config, model: e.target.value})}
                className="w-full px-4 py-3 bg-[#202020] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3">Claude 3</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Temperature: {config.temperature}</label>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.temperature}
                onChange={(e) => setConfig({...config, temperature: parseFloat(e.target.value)})}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-[#A3A3A3]">
                <span>Deterministic (0.0)</span>
                <span>Creative (1.0)</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Max Tokens</label>
              <input 
                type="number"
                value={config.max_tokens}
                onChange={(e) => setConfig({...config, max_tokens: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-[#202020] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">System Prompt</label>
              <textarea 
                value={config.system_prompt}
                onChange={(e) => setConfig({...config, system_prompt: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 bg-[#202020] border border-[#444] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                type="checkbox"
                id="tools-enabled"
                checked={config.tools_enabled}
                onChange={(e) => setConfig({...config, tools_enabled: e.target.checked})}
                className="w-4 h-4 accent-[#6366F1]"
              />
              <label htmlFor="tools-enabled" className="text-sm">Enable tools and integrations</label>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-[#A3A3A3] mb-1">Model</div>
                <div className="font-medium">{config.model}</div>
              </div>
              
              <div>
                <div className="text-sm text-[#A3A3A3] mb-1">Temperature</div>
                <div className="font-medium">{config.temperature}</div>
              </div>
              
              <div>
                <div className="text-sm text-[#A3A3A3] mb-1">Max Tokens</div>
                <div className="font-medium">{config.max_tokens}</div>
              </div>
              
              <div>
                <div className="text-sm text-[#A3A3A3] mb-1">Tools Enabled</div>
                <div className="font-medium">{config.tools_enabled ? 'Yes' : 'No'}</div>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-[#A3A3A3] mb-1">System Prompt</div>
              <div className="p-3 bg-[#202020] rounded-lg text-sm font-mono whitespace-pre-wrap">
                {config.system_prompt}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectChatConfig; 