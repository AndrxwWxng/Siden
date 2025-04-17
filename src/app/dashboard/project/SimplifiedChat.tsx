'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, ChevronRight } from 'lucide-react';
import MessageFormatter from '@/components/MessageFormatter';
import mastraClient, { MastraAgentId } from '@/lib/mastraClient';

interface SimplifiedChatProps {
  projectId: string;
}

export default function SimplifiedChat({ projectId }: SimplifiedChatProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      sender: {
        id: 'user',
        name: 'You',
        avatar: '/avatar-placeholder.png'
      },
      content: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    
    try {
      // Choose an agent - for simplicity we'll use the marketingAgent
      const agentId: MastraAgentId = 'marketingAgent';
      const response = await mastraClient.getAgent(agentId).generate(newMessage);
      
      // Add bot response
      const botMessage = {
        id: (Date.now() + 100).toString(),
        sender: {
          id: 'bot',
          name: 'Chloe',
          avatar: '/roleheadshots/chloe.png'
        },
        content: response.text,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage = {
        id: (Date.now() + 100).toString(),
        sender: {
          id: 'system',
          name: 'System',
          avatar: '⚠️'
        },
        content: 'Sorry, there was an error processing your message. Please try again.',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex flex-col h-[400px] border border-[#313131] rounded-lg overflow-hidden bg-[#252525]">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b border-[#313131] bg-[#343131]">
        <div className="flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-[#6366F1]" />
          <span className="font-medium">Project Chat</span>
        </div>
        <button 
          onClick={() => window.open(`/dashboard/project/chat?id=${projectId}`, '_blank')}
          className="text-sm text-[#6366F1] hover:underline flex items-center"
        >
          Open Full Chat <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#252525]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#94A3B8] text-center">
            <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`mb-4 ${message.sender.id === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
              >
                <div className={`
                  max-w-[85%] flex gap-3 
                  ${message.sender.id === 'user' ? 'flex-row-reverse' : 'flex-row'}
                `}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#343131] flex items-center justify-center">
                    {message.sender.avatar.startsWith('/') ? (
                      <img 
                        src={message.sender.avatar} 
                        alt={message.sender.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span>{message.sender.avatar}</span>
                    )}
                  </div>
                  <div>
                    <div className={`
                      p-3 rounded-lg
                      ${message.sender.id === 'user' 
                        ? 'bg-[#6366F1] text-white' 
                        : 'bg-[#343131] text-white'}
                    `}>
                      <div className="text-sm break-words">
                        <MessageFormatter content={message.content} />
                      </div>
                    </div>
                    <div className="mt-1">
                      <span className="text-xs text-[#94A3B8]">
                        {message.sender.name} • {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#343131] flex items-center justify-center">
                <img 
                  src="/roleheadshots/chloe.png" 
                  alt="Chloe"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <div className="p-3 rounded-lg bg-[#343131] text-white">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-[#6366F1] animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-[#6366F1] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-[#6366F1] animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
                <div className="mt-1">
                  <span className="text-xs text-[#94A3B8]">Chloe is typing...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Chat input */}
      <div className="p-3 border-t border-[#313131] bg-[#343131]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Message the team..."
            className="flex-1 bg-[#252525] border border-[#313131] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#6366F1]"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !newMessage.trim()}
            className={`p-2 rounded-md ${
              newMessage.trim() && !isLoading
                ? 'bg-[#6366F1] text-white hover:bg-[#5254CC]' 
                : 'bg-[#343131] text-[#94A3B8]'
            } transition-colors`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 