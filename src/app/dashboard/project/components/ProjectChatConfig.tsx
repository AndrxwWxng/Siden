import { useState, useEffect } from 'react';
import { Save, MessageSquare, Sliders } from 'lucide-react';
import { Project, ChatConfig } from '@/components/dashboard/types';
import { updateProjectChatConfig } from '../projectFunctions';

interface ProjectChatConfigProps {
  project: Project;
  onProjectUpdated?: (updatedProject: Project) => void;
}

export default function ProjectChatConfig({ project, onProjectUpdated }: ProjectChatConfigProps) {
  // Default config in case project doesn't have it
  const defaultConfig: ChatConfig = {
    model: 'gpt-4',
    temperature: 0.7,
    max_tokens: 2000,
    system_prompt: 'You are a helpful AI assistant working on this project.',
    tools_enabled: true
  };
  
  // Initialize with project's chat config or default
  const [chatConfig, setChatConfig] = useState<ChatConfig>(
    project.chatConfig || defaultConfig
  );
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Track changes to determine if there are unsaved changes
  useEffect(() => {
    const currentConfig = project.chatConfig || defaultConfig;
    
    const hasConfigChanged = 
      currentConfig.model !== chatConfig.model ||
      currentConfig.temperature !== chatConfig.temperature ||
      currentConfig.max_tokens !== chatConfig.max_tokens ||
      currentConfig.system_prompt !== chatConfig.system_prompt ||
      currentConfig.tools_enabled !== chatConfig.tools_enabled;
    
    setHasUnsavedChanges(hasConfigChanged);
  }, [chatConfig, project.chatConfig]);
  
  // Event handlers
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChatConfig({
      ...chatConfig,
      model: e.target.value
    });
  };
  
  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatConfig({
      ...chatConfig,
      temperature: parseFloat(e.target.value)
    });
  };
  
  const handleMaxTokensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatConfig({
      ...chatConfig,
      max_tokens: parseInt(e.target.value, 10)
    });
  };
  
  const handleSystemPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatConfig({
      ...chatConfig,
      system_prompt: e.target.value
    });
  };
  
  const handleToolsEnabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatConfig({
      ...chatConfig,
      tools_enabled: e.target.checked
    });
  };
  
  // Save chat configuration
  const handleSaveConfig = async () => {
    setIsUpdating(true);
    
    try {
      const success = await updateProjectChatConfig(project.id, chatConfig);
      
      if (success && onProjectUpdated) {
        // Update the project with new chat config
        onProjectUpdated({
          ...project,
          chatConfig
        });
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Error updating chat config:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Reset to original values
  const handleReset = () => {
    setChatConfig(project.chatConfig || defaultConfig);
    setHasUnsavedChanges(false);
  };
  
  return (
    <div className="bg-[#252525] rounded-xl border border-[#313131] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium">Team Chat Settings</h2>
      </div>
      
      <div className="space-y-6">
        <div className="bg-[#343131] border border-[#313131] rounded-md p-5 hover:border-[#444] transition-all">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <MessageSquare size={16} className="text-[#6366F1]" />
            <span>Language Model Configuration</span>
          </h3>
          <p className="text-sm text-[#94A3B8] mb-4">Configure the settings for the AI language model used in this project's team chat.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#94A3B8]">
                Model
              </label>
              <select
                value={chatConfig.model}
                onChange={handleModelChange}
                className="w-full px-3 py-2 bg-[#252525] border border-[#313131] rounded-md focus:outline-none focus:border-[#6366F1]"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-[#94A3B8]">
                Temperature: {chatConfig.temperature.toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={chatConfig.temperature}
                onChange={handleTemperatureChange}
                className="w-full bg-[#252525] rounded-lg appearance-none cursor-pointer h-2"
              />
              <div className="flex justify-between text-xs text-[#94A3B8] mt-1">
                <span>More Focused (0.0)</span>
                <span>More Creative (1.0)</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-[#94A3B8]">
                Max Tokens: {chatConfig.max_tokens}
              </label>
              <input
                type="range"
                min="256"
                max="8192"
                step="256"
                value={chatConfig.max_tokens}
                onChange={handleMaxTokensChange}
                className="w-full bg-[#252525] rounded-lg appearance-none cursor-pointer h-2"
              />
              <div className="flex justify-between text-xs text-[#94A3B8] mt-1">
                <span>Shorter (256)</span>
                <span>Longer (8192)</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-[#94A3B8]">
                System Prompt
              </label>
              <textarea
                rows={4}
                value={chatConfig.system_prompt}
                onChange={handleSystemPromptChange}
                className="w-full px-3 py-2 bg-[#252525] border border-[#313131] rounded-md focus:outline-none focus:border-[#6366F1]"
                placeholder="System instructions for the AI model..."
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="tools-enabled"
                checked={chatConfig.tools_enabled}
                onChange={handleToolsEnabledChange}
                className="h-4 w-4 bg-[#252525] border border-[#313131] rounded focus:outline-none focus:border-[#6366F1]"
              />
              <label htmlFor="tools-enabled" className="ml-2 text-sm text-[#94A3B8]">
                Enable Tools & Integrations
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 justify-end">
          <button 
            onClick={handleReset}
            disabled={isUpdating || !hasUnsavedChanges}
            className={`px-4 py-2 border ${
              hasUnsavedChanges 
                ? 'border-[#313131] hover:border-[#6366F1] text-white' 
                : 'border-[#313131] text-[#94A3B8]'
            } rounded-md transition-colors`}
          >
            Reset
          </button>
          <button 
            onClick={handleSaveConfig}
            disabled={isUpdating || !hasUnsavedChanges}
            className={`px-4 py-2 ${
              hasUnsavedChanges 
                ? 'bg-[#6366F1] hover:bg-[#5254CC] text-white' 
                : 'bg-[#343131] text-[#94A3B8]'
            } rounded-md transition-colors flex items-center gap-2`}
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save Configuration</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 