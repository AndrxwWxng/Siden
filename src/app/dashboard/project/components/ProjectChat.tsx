import { useState } from 'react';
import { Project } from '@/components/dashboard/types';
import { MessageSquare, Send } from 'lucide-react';

interface ProjectChatProps {
  project: Project;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
}

export default function ProjectChat({ project }: ProjectChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'System',
      content: `Welcome to the ${project.name} project chat! Ask me anything about this project.`,
      timestamp: new Date(),
      isUser: false
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: newMessage,
      timestamp: new Date(),
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'AI Assistant',
        content: `I'm a placeholder AI assistant for the ${project.name} project. The full chat functionality will be implemented soon!`,
        timestamp: new Date(),
        isUser: false
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <div className="bg-[#252525] rounded-xl border border-[#313131] h-[calc(100vh-240px)] flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-[#313131]">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-[#6366F1]" size={20} />
          <h2 className="text-xl font-medium">Project Chat</h2>
        </div>
        
        <div className="text-sm text-[#94A3B8]">
          Using {project.chatConfig?.model || 'default model'} • Temperature: {project.chatConfig?.temperature || 0.7}
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[70%] p-3 rounded-lg ${
                message.isUser 
                  ? 'bg-[#6366F1] text-white rounded-br-none' 
                  : 'bg-[#343131] rounded-bl-none'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{message.sender}</span>
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[70%] p-3 rounded-lg bg-[#343131] rounded-bl-none">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">AI Assistant</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-[#6366F1] animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-[#6366F1] animate-pulse delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-[#6366F1] animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-[#313131]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-grow px-4 py-3 bg-[#343131] border border-[#444] rounded-md focus:outline-none focus:border-[#6366F1]"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading}
            className="p-3 bg-[#6366F1] hover:bg-[#5254CC] text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
} 