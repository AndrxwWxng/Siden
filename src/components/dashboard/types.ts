// Project related types
export interface Project {
  id: string;
  name: string;
  description: string;
  agents: number;
  agentIds?: string[]; // Array of agent IDs selected for this project
  status: string;
  lastActive: string;
  progress: number;
  tags: string[];
}

// Agent related types
export interface AgentRole {
  id: string;
  name: string;
  icon: string;
  description: string;
  capabilities: string[];
  recommended: boolean;
}

export interface AgentTool {
  name: string;
  icon: string;
}

// User related types
export interface User {
  username: string;
  email: string;
  plan: string;
}

// Search and filtering
export type FilterType = 'all' | 'active' | 'archived'; 