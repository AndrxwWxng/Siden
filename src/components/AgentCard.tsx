'use client';

interface Agent {
  id: string;
  name: string;
  status: string;
  tasks: number;
  type: string;
  model: string;
  lastActive: string;
}

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: () => void;
}

export default function AgentCard({ agent, isSelected, onSelect }: AgentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-[#22C55E]';
      case 'idle':
        return 'bg-[#F59E0B]';
      case 'error':
        return 'bg-[#EF4444]';
      default:
        return 'bg-[#A3A3A3]';
    }
  };

  return (
    <div 
      className={`
        card p-3 mb-3 cursor-pointer transition-all
        ${isSelected ? 'border-[#6366F1]' : 'border-[#2e2e2e]'}
      `}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          <div className={`status-indicator ${getStatusColor(agent.status)} mr-2`}></div>
          <h4 className="font-medium">{agent.name}</h4>
        </div>
        <span className="text-xs bg-[#121212] px-2 py-1 rounded">{agent.type}</span>
      </div>
      
      <div className="text-xs text-[#A3A3A3] mb-2">
        <div className="flex justify-between mb-1">
          <span>Tasks: {agent.tasks}</span>
          <span>Model: {agent.model}</span>
        </div>
        <div>Last active: {agent.lastActive}</div>
      </div>
    </div>
  );
} 