'use client';

import { useState } from 'react';

interface Agent {
  id: string;
  name: string;
  status: string;
  tasks: number;
  type: string;
  model: string;
  lastActive: string;
}

interface CodePanelProps {
  agent: Agent | undefined;
}

export default function CodePanel({ agent }: CodePanelProps) {
  const [activeTab, setActiveTab] = useState('config');
  
  // Mock configuration code based on agent data
  const getAgentConfig = () => {
    if (!agent) return '';
    
    return `// ${agent.name} Configuration
import { createAgent } from 'agent-team';

const ${agent.id} = createAgent({
  name: '${agent.name}',
  role: '${agent.type}',
  model: '${agent.model}',
  systemPrompt: \`You are a ${agent.type} agent that
    assists with various tasks related to your role.
    Respond to requests in a helpful and accurate manner.\`,
  tools: [
    webSearch,
    documentRetrieval,
    ${agent.type === 'primary' ? 'apiAccess,' : ''}
    ${agent.type === 'support' ? 'dataAnalysis,' : ''}
    ${agent.type === 'specialized' ? 'codeInterpreter,' : ''}
    fileAccess
  ],
  parameters: {
    temperature: ${agent.type === 'primary' ? '0.7' : agent.type === 'support' ? '0.5' : '0.3'},
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  }
});

// Register with team
team.addAgent(${agent.id});

// Configure behavior
${agent.id}.setResponseFormat('markdown');
${agent.id}.enableLogging();
${agent.type === 'primary' ? `${agent.id}.setAsCoordinator();` : ''}

export default ${agent.id};`;
  };
  
  // Mock runtime code
  const getRuntimeCode = () => {
    if (!agent) return '';
    
    return `// Runtime status for ${agent.name}
import { getAgentStatus, AgentEvent } from 'agent-team';

const status = getAgentStatus('${agent.id}');

// Event listeners
${agent.id}.on(AgentEvent.TaskAssigned, (task) => {
  console.log(\`Task assigned to ${agent.name}: \${task.title}\`);
  notifyTeam(\`${agent.name} is processing task: \${task.title}\`);
});

${agent.id}.on(AgentEvent.TaskCompleted, (task, result) => {
  console.log(\`Task completed by ${agent.name}\`);
  storeResult(task.id, result);
});

// Status information
console.log(\`Status: ${agent.status}\`);
console.log(\`Active Tasks: ${agent.tasks}\`);
console.log(\`Last Communication: ${agent.lastActive}\`);

// Performance metrics
const metrics = await getAgentMetrics('${agent.id}');
console.log(\`Average Response Time: \${metrics.avgResponseTime}ms\`);
console.log(\`Success Rate: \${metrics.successRate}%\`);`;
  };
  
  // Active code based on tab
  const activeCode = activeTab === 'config' 
    ? getAgentConfig() 
    : getRuntimeCode();
  
  // Syntax highlight the code
  const highlightSyntax = (code: string) => {
    if (!code) return [];
    
    return code.split('\n').map((line, i) => {
      // Basic syntax highlighting (simplified version of what we'd do with a proper lib)
      const highlightedLine = line
        .replace(/\/\/(.*)/g, '<span style="color: #6A9955;">$&</span>') // Comments
        .replace(/import|export|const|await|function|if|else|return/g, '<span style="color: #569CD6;">$&</span>') // Keywords
        .replace(/('.*?'|".*?"|`.*?`)/g, '<span style="color: #CE9178;">$&</span>') // Strings
        .replace(/\b(createAgent|setResponseFormat|enableLogging|setAsCoordinator|getAgentStatus|on|log)\b/g, '<span style="color: #DCDCAA;">$&</span>') // Functions
        .replace(/\b(name|role|model|systemPrompt|tools|parameters|temperature|max_tokens)\b(?=:)/g, '<span style="color: #9CDCFE;">$&</span>'); // Properties
      
      return (
        <div key={i} className="code-line">
          <span className="line-number">{i + 1}</span>
          <span dangerouslySetInnerHTML={{ __html: highlightedLine }} />
        </div>
      );
    });
  };
  
  return (
    <div className="code-panel">
      <div className="flex items-center border-b border-[#2e2e2e] pb-3 mb-4">
        <button 
          className={`px-4 py-2 mr-2 rounded ${activeTab === 'config' ? 'bg-[#2e2e2e] text-white' : 'text-[#A3A3A3]'}`}
          onClick={() => setActiveTab('config')}
        >
          Configuration
        </button>
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'runtime' ? 'bg-[#2e2e2e] text-white' : 'text-[#A3A3A3]'}`}
          onClick={() => setActiveTab('runtime')}
        >
          Runtime
        </button>
        
        <div className="ml-auto flex items-center text-sm">
          <button className="px-3 py-1 text-[#A3A3A3] hover:text-white transition-colors">
            Copy
          </button>
          <button className="px-3 py-1 text-[#A3A3A3] hover:text-white transition-colors">
            Edit
          </button>
        </div>
      </div>
      
      {agent ? (
        <div className="code-editor overflow-y-auto">
          {highlightSyntax(activeCode)}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[400px] text-[#A3A3A3]">
          Select an agent to view its configuration
        </div>
      )}
    </div>
  );
} 