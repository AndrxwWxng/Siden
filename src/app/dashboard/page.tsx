'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AgentCard from '@/components/AgentCard';
import CodePanel from '@/components/CodePanel';

const mockAgents = [
  {
    id: 'a1',
    name: 'Assistant Agent',
    status: 'active',
    tasks: 4,
    type: 'primary',
    model: 'gpt-4-turbo',
    lastActive: '2 mins ago'
  },
  {
    id: 'a2',
    name: 'Research Agent',
    status: 'idle',
    tasks: 1,
    type: 'support',
    model: 'gpt-4-turbo',
    lastActive: '15 mins ago'
  },
  {
    id: 'a3',
    name: 'Code Agent',
    status: 'error',
    tasks: 0,
    type: 'specialized',
    model: 'gpt-4-turbo',
    lastActive: '1 hour ago'
  }
];

const mockTasks = [
  {
    id: 't1',
    title: 'Research market trends in AI automation',
    status: 'in-progress',
    priority: 'high',
    assignedTo: 'a2',
    createdAt: '2023-10-15T14:23:01Z'
  },
  {
    id: 't2',
    title: 'Generate weekly analytics report',
    status: 'pending',
    priority: 'medium',
    assignedTo: 'a1',
    createdAt: '2023-10-15T16:48:22Z'
  },
  {
    id: 't3',
    title: 'Review and improve documentation',
    status: 'completed',
    priority: 'low',
    assignedTo: 'a1',
    createdAt: '2023-10-14T09:12:45Z'
  },
  {
    id: 't4',
    title: 'Debug error in API response handling',
    status: 'failed',
    priority: 'critical',
    assignedTo: 'a3',
    createdAt: '2023-10-15T11:35:17Z'
  }
];

export default function Dashboard() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  
  const handleSelectAgent = (agentId: string) => {
    setSelectedAgent(agentId);
  };
  
  const selectedAgentData = selectedAgent 
    ? mockAgents.find(agent => agent.id === selectedAgent) 
    : mockAgents[0];
  
  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      <NavBar />
      
      <div className="main-content flex flex-1">
        {/* Sidebar */}
        <div className="sidebar p-4">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Workspace</h3>
            <ul className="space-y-2 text-[#A3A3A3]">
              <li className="text-white font-medium">
                <a href="#" className="flex items-center px-3 py-2 rounded bg-[#1a1a1a]">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center px-3 py-2 rounded hover:bg-[#1a1a1a] transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Agents
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center px-3 py-2 rounded hover:bg-[#1a1a1a] transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Tasks
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center px-3 py-2 rounded hover:bg-[#1a1a1a] transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Your Agents</h3>
            {mockAgents.map(agent => (
              <AgentCard 
                key={agent.id}
                agent={agent} 
                isSelected={selectedAgent === agent.id}
                onSelect={() => handleSelectAgent(agent.id)}
              />
            ))}
            <button className="w-full mt-4 py-2 border border-dashed border-[#2e2e2e] rounded-md text-[#A3A3A3] hover:border-[#6366F1] hover:text-[#6366F1] transition-colors">
              + Add new agent
            </button>
          </div>
        </div>
        
        {/* Central Panel */}
        <div className="central-panel p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">Agent Tasks</h2>
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Filter by:</span>
              <select className="bg-[#1a1a1a] border border-[#2e2e2e] text-white rounded-md text-sm px-3 py-1.5">
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            
            <button className="btn btn-primary">
              New Task
            </button>
          </div>
          
          <div className="space-y-4">
            {mockTasks.map(task => (
              <div 
                key={task.id} 
                className="card bg-[#1a1a1a] p-4 border border-[#2e2e2e] rounded-lg hover:border-[#6366F1] transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{task.title}</h3>
                  <div className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${task.status === 'in-progress' ? 'bg-[#6366F1]/20 text-[#6366F1]' : ''}
                    ${task.status === 'pending' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : ''}
                    ${task.status === 'completed' ? 'bg-[#22C55E]/20 text-[#22C55E]' : ''}
                    ${task.status === 'failed' ? 'bg-[#EF4444]/20 text-[#EF4444]' : ''}
                  `}>
                    {task.status.replace('-', ' ')}
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-[#A3A3A3] mb-2">
                  <span className="mr-4">
                    Assigned to: {mockAgents.find(a => a.id === task.assignedTo)?.name}
                  </span>
                  <span>
                    Priority: 
                    <span className={`
                      ml-1
                      ${task.priority === 'critical' ? 'text-[#EF4444]' : ''}
                      ${task.priority === 'high' ? 'text-[#F59E0B]' : ''}
                      ${task.priority === 'medium' ? 'text-white' : ''}
                      ${task.priority === 'low' ? 'text-[#A3A3A3]' : ''}
                    `}>
                      {task.priority}
                    </span>
                  </span>
                </div>
                
                <div className="flex justify-between mt-4 text-sm">
                  <div className="text-[#A3A3A3]">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-[#A3A3A3] hover:text-white transition-colors">
                      Edit
                    </button>
                    <button className="text-[#A3A3A3] hover:text-white transition-colors">
                      View Logs
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Code Panel */}
        <CodePanel agent={selectedAgentData} />
      </div>
      
      <Footer />
    </div>
  );
} 