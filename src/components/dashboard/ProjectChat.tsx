import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Bot, User, RefreshCw } from 'lucide-react';
import { ChatConfig, ProjectIntegration } from './types';

interface ProjectChatProps {
  projectId: string;
  chatConfig: ChatConfig;
  integrations: ProjectIntegration;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const ProjectChat: React.FC<ProjectChatProps> = ({
  projectId,
  chatConfig,
  integrations
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'system',
      content: 'This is your project assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || isProcessing) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would call your API to process the message
      // using the selected AI model from chatConfig
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate response based on chatConfig and integrations
      let responseText = `I'm your AI assistant using the ${chatConfig.model} model with temperature ${chatConfig.temperature}. `;
      
      if (newMessage.toLowerCase().includes('integration') || newMessage.toLowerCase().includes('connect')) {
        const connectedServices = integrations.services.filter(s => s.status === 'connected');
        if (connectedServices.length > 0) {
          responseText += `You have ${connectedServices.length} connected services: ${connectedServices.map(s => s.name).join(', ')}.`;
        } else {
          responseText += 'You don\'t have any integrations connected yet. You can add them in the Project Settings.';
        }
      } else if (newMessage.toLowerCase().includes('system prompt') || newMessage.toLowerCase().includes('prompt')) {
        responseText += `The current system prompt is: "${chatConfig.system_prompt}"`;
      } else if (newMessage.toLowerCase().includes('tool') || newMessage.toLowerCase().includes('tools')) {
        responseText += `Tools are currently ${chatConfig.tools_enabled ? 'enabled' : 'disabled'} for this project.`;
      } else {
        responseText += 'I can help you with your project. Ask me anything about it!';
      }
      
      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: 'Sorry, there was an error processing your message. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="bg-[#2E2E2E] border-b border-[#444] px-6 py-4 flex items-center">
        <Bot className="text-[#6366F1] mr-2" size={20} />
        <h2 className="text-lg font-medium">{chatConfig.model} Assistant</h2>
        {chatConfig.tools_enabled && integrations.connected && (
          <div className="ml-2 px-2 py-0.5 text-xs bg-[#6366F1]/20 text-[#6366F1] rounded-md">
            Integrations Enabled
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#222]">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-3/4 rounded-lg px-4 py-3 ${
                message.role === 'user' 
                  ? 'bg-[#6366F1] text-white'
                  : message.role === 'system'
                    ? 'bg-[#3A3A3A] text-[#CCC]'
                    : 'bg-[#2E2E2E] text-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {message.role === 'user' ? (
                  <User size={14} className="text-white/80" />
                ) : message.role === 'system' ? (
                  <Bot size={14} className="text-white/80" />
                ) : (
                  <Bot size={14} className="text-[#6366F1]" />
                )}
                <span className="text-xs text-white/60">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-[#444] p-4 bg-[#2E2E2E]">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-[#222] rounded-lg border border-[#444] overflow-hidden">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 bg-transparent border-0 resize-none focus:outline-none focus:ring-0"
              disabled={isProcessing}
            />
            <div className="p-2 border-t border-[#444] flex justify-between items-center">
              <button className="text-[#777] hover:text-white transition-colors">
                <Paperclip size={16} />
              </button>
              <div className="text-xs text-[#777]">
                {chatConfig.model} · Temp: {chatConfig.temperature} · Max tokens: {chatConfig.max_tokens}
              </div>
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isProcessing}
            className={`px-4 py-3 rounded-lg ${
              !newMessage.trim() || isProcessing
                ? 'bg-[#444] text-[#999] cursor-not-allowed'
                : 'bg-[#6366F1] hover:bg-[#4F46E5] text-white'
            } transition-colors flex items-center`}
          >
            {isProcessing ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectChat; 