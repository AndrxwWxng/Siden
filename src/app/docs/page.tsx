'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('quickstart');
  const pathname = usePathname();

  // Update active section based on hash URL
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setActiveSection(hash);
      // Scroll to section
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname]);

  // Handle section click
  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    window.history.pushState(null, '', `#${section}`);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-64 lg:w-72 flex-shrink-0">
              <div className="sticky top-24 bg-[#1a1a1a] rounded-lg border border-[#2e2e2e] overflow-hidden">
                <div className="p-4 border-b border-[#2e2e2e]">
                  <h2 className="font-bold text-xl">Documentation</h2>
                </div>
                
                <div className="p-2">
                  <div className="mb-4">
                    <div className="px-2 py-1 text-[#AAAAAA] text-sm font-medium">Getting Started</div>
                    <div className="mt-1 space-y-1">
                      <SidebarLink 
                        section="quickstart" 
                        active={activeSection === 'quickstart'}
                        onClick={() => handleSectionClick('quickstart')}
                      >
                        Quick Start Guide
                      </SidebarLink>
                      <SidebarLink 
                        section="installation" 
                        active={activeSection === 'installation'}
                        onClick={() => handleSectionClick('installation')}
                      >
                        Installation
                      </SidebarLink>
                      <SidebarLink 
                        section="configuration" 
                        active={activeSection === 'configuration'}
                        onClick={() => handleSectionClick('configuration')}
                      >
                        Configuration
                      </SidebarLink>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="px-2 py-1 text-[#AAAAAA] text-sm font-medium">Core Concepts</div>
                    <div className="mt-1 space-y-1">
                      <SidebarLink 
                        section="agent-basics" 
                        active={activeSection === 'agent-basics'}
                        onClick={() => handleSectionClick('agent-basics')}
                      >
                        Agent Basics
                      </SidebarLink>
                      <SidebarLink 
                        section="workflows" 
                        active={activeSection === 'workflows'}
                        onClick={() => handleSectionClick('workflows')}
                      >
                        Workflows
                      </SidebarLink>
                      <SidebarLink 
                        section="teams" 
                        active={activeSection === 'teams'}
                        onClick={() => handleSectionClick('teams')}
                      >
                        Agent Teams
                      </SidebarLink>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="px-2 py-1 text-[#AAAAAA] text-sm font-medium">Advanced</div>
                    <div className="mt-1 space-y-1">
                      <SidebarLink 
                        section="custom-models" 
                        active={activeSection === 'custom-models'}
                        onClick={() => handleSectionClick('custom-models')}
                      >
                        Custom Models
                      </SidebarLink>
                      <SidebarLink 
                        section="api-reference" 
                        active={activeSection === 'api-reference'}
                        onClick={() => handleSectionClick('api-reference')}
                      >
                        API Reference
                      </SidebarLink>
                      <SidebarLink 
                        section="integrations" 
                        active={activeSection === 'integrations'}
                        onClick={() => handleSectionClick('integrations')}
                      >
                        Integrations
                      </SidebarLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-grow">
              <div className="bg-[#1a1a1a] rounded-lg border border-[#2e2e2e] p-6 md:p-8">
                {/* Content sections */}
                <DocumentSection 
                  id="quickstart" 
                  title="Quick Start Guide" 
                  active={activeSection === 'quickstart'}
                >
                  <p className="text-[#AAAAAA] mb-4">
                    Get up and running with your first agent team in minutes. Follow this guide to create and deploy your first collaborative AI agents.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-3">Prerequisites</h3>
                  <ul className="list-disc pl-5 space-y-2 text-[#AAAAAA] mb-6">
                    <li>Node.js 16 or higher</li>
                    <li>npm or yarn package manager</li>
                    <li>API keys for your preferred AI models</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mb-3">Step 1: Install the SDK</h3>
                  <div className="bg-[#121212] rounded-md p-4 mb-6 font-mono text-sm overflow-x-auto">
                    <pre>npm install @agent-team/sdk</pre>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">Step 2: Set up your first agent</h3>
                  <div className="bg-[#121212] rounded-md p-4 mb-6 font-mono text-sm overflow-x-auto">
                    <pre>{`import { createAgent } from '@agent-team/sdk';

const researcher = createAgent({
  name: 'Researcher',
  role: 'research',
  model: 'gpt-4-turbo',
  tools: [webSearch, documentRetrieval]
});`}</pre>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">Step 3: Create a simple workflow</h3>
                  <div className="bg-[#121212] rounded-md p-4 mb-6 font-mono text-sm overflow-x-auto">
                    <pre>{`import { createWorkflow } from '@agent-team/sdk';

const researchWorkflow = createWorkflow({
  name: 'Basic Research',
  steps: [
    {
      agent: researcher,
      task: 'Research the provided topic and summarize findings',
      output: 'research_results'
    }
  ]
});`}</pre>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">Step 4: Run your workflow</h3>
                  <div className="bg-[#121212] rounded-md p-4 mb-6 font-mono text-sm overflow-x-auto">
                    <pre>{`// Execute the workflow with input
const results = await researchWorkflow.execute({
  topic: 'Sustainable energy innovations in 2023',
  depth: 'comprehensive'
});

console.log(results.research_results);`}</pre>
                  </div>
                  
                  <div className="bg-[#0D0D0D] border border-[#2e2e2e] rounded-md p-4 mb-6">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-[#6366F1] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Note</span>
                    </div>
                    <p className="text-[#AAAAAA] text-sm">
                      Make sure to store your API keys securely and not expose them in client-side code. We recommend using environment variables.
                    </p>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">Next Steps</h3>
                  <p className="text-[#AAAAAA] mb-4">
                    Now that you have your first agent up and running, explore the following sections to learn more:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-[#AAAAAA]">
                    <li><a href="#agent-basics" className="text-[#6366F1] hover:underline">Agent Basics</a> - Learn about agent capabilities and configuration</li>
                    <li><a href="#workflows" className="text-[#6366F1] hover:underline">Workflows</a> - Create more complex agent interactions</li>
                    <li><a href="#teams" className="text-[#6366F1] hover:underline">Agent Teams</a> - Build collaborative agent systems</li>
                  </ul>
                </DocumentSection>
                
                <DocumentSection 
                  id="installation" 
                  title="Installation" 
                  active={activeSection === 'installation'}
                >
                  <p className="text-[#AAAAAA] mb-4">
                    Detailed installation instructions for different environments and platforms.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-3">npm</h3>
                  <div className="bg-[#121212] rounded-md p-4 mb-6 font-mono text-sm overflow-x-auto">
                    <pre>npm install @agent-team/sdk</pre>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">yarn</h3>
                  <div className="bg-[#121212] rounded-md p-4 mb-6 font-mono text-sm overflow-x-auto">
                    <pre>yarn add @agent-team/sdk</pre>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">pnpm</h3>
                  <div className="bg-[#121212] rounded-md p-4 mb-6 font-mono text-sm overflow-x-auto">
                    <pre>pnpm add @agent-team/sdk</pre>
                  </div>
                </DocumentSection>
                
                <DocumentSection 
                  id="configuration" 
                  title="Configuration" 
                  active={activeSection === 'configuration'}
                >
                  <p className="text-[#AAAAAA] mb-4">
                    Learn how to configure the SDK for optimal performance and security.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-3">Environment Setup</h3>
                  <div className="bg-[#121212] rounded-md p-4 mb-6 font-mono text-sm overflow-x-auto">
                    <pre>{`// .env file
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
PINECONE_API_KEY=your_pinecone_key`}</pre>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">SDK Configuration</h3>
                  <div className="bg-[#121212] rounded-md p-4 mb-6 font-mono text-sm overflow-x-auto">
                    <pre>{`import { configure } from '@agent-team/sdk';

configure({
  defaultProvider: 'openai',
  logging: {
    level: 'info',
    destination: 'console'
  },
  cache: {
    enabled: true,
    ttl: 3600 // 1 hour
  }
});`}</pre>
                  </div>
                </DocumentSection>
                
                <DocumentSection 
                  id="agent-basics" 
                  title="Agent Basics" 
                  active={activeSection === 'agent-basics'}
                >
                  <p className="text-[#AAAAAA] mb-4">
                    Understand the fundamentals of agent creation, configuration, and capabilities.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-3">Creating an Agent</h3>
                  <div className="bg-[#121212] rounded-md p-4 mb-6 font-mono text-sm overflow-x-auto">
                    <pre>{`import { createAgent } from '@agent-team/sdk';

const agent = createAgent({
  name: 'ContentWriter',
  description: 'Creates high-quality blog content',
  model: 'gpt-4-turbo',
  temperature: 0.7,
  maxTokens: 4000,
  systemPrompt: 'You are an expert content writer...'
});`}</pre>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">Agent Properties</h3>
                  <div className="bg-[#0D0D0D] border border-[#2e2e2e] rounded-md p-4 mb-6">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#2e2e2e]">
                          <th className="text-left py-2 px-2">Property</th>
                          <th className="text-left py-2 px-2">Type</th>
                          <th className="text-left py-2 px-2">Description</th>
                        </tr>
                      </thead>
                      <tbody className="text-[#AAAAAA]">
                        <tr className="border-b border-[#2e2e2e]">
                          <td className="py-2 px-2">name</td>
                          <td className="py-2 px-2">string</td>
                          <td className="py-2 px-2">Agent's identifier</td>
                        </tr>
                        <tr className="border-b border-[#2e2e2e]">
                          <td className="py-2 px-2">model</td>
                          <td className="py-2 px-2">string</td>
                          <td className="py-2 px-2">AI model to use</td>
                        </tr>
                        <tr className="border-b border-[#2e2e2e]">
                          <td className="py-2 px-2">temperature</td>
                          <td className="py-2 px-2">number</td>
                          <td className="py-2 px-2">Creativity level (0.0-1.0)</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-2">tools</td>
                          <td className="py-2 px-2">Tool[]</td>
                          <td className="py-2 px-2">Functions agent can use</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </DocumentSection>
                
                {/* Add more document sections for other topics */}
                <DocumentSection 
                  id="workflows" 
                  title="Workflows" 
                  active={activeSection === 'workflows'}
                >
                  <p className="text-[#AAAAAA] mb-4">
                    Learn how to create and manage workflows for coordinating multiple agents.
                  </p>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Creating a Workflow</h3>
                    <p className="text-[#AAAAAA] mb-4">Coming soon...</p>
                  </div>
                </DocumentSection>
                
                <DocumentSection 
                  id="teams" 
                  title="Agent Teams" 
                  active={activeSection === 'teams'}
                >
                  <p className="text-[#AAAAAA] mb-4">
                    Build collaborative agent systems that work together to solve complex problems.
                  </p>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Creating a Team</h3>
                    <p className="text-[#AAAAAA] mb-4">Coming soon...</p>
                  </div>
                </DocumentSection>
                
                <DocumentSection 
                  id="custom-models" 
                  title="Custom Models" 
                  active={activeSection === 'custom-models'}
                >
                  <p className="text-[#AAAAAA] mb-4">
                    Integrate your own or third-party AI models into the agent ecosystem.
                  </p>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Model Integration</h3>
                    <p className="text-[#AAAAAA] mb-4">Coming soon...</p>
                  </div>
                </DocumentSection>
                
                <DocumentSection 
                  id="api-reference" 
                  title="API Reference" 
                  active={activeSection === 'api-reference'}
                >
                  <p className="text-[#AAAAAA] mb-4">
                    Complete API reference for the Agent Team SDK.
                  </p>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Core Functions</h3>
                    <p className="text-[#AAAAAA] mb-4">Coming soon...</p>
                  </div>
                </DocumentSection>
                
                <DocumentSection 
                  id="integrations" 
                  title="Integrations" 
                  active={activeSection === 'integrations'}
                >
                  <p className="text-[#AAAAAA] mb-4">
                    Connect your agent teams with external systems and services.
                  </p>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Available Integrations</h3>
                    <p className="text-[#AAAAAA] mb-4">Coming soon...</p>
                  </div>
                </DocumentSection>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

interface SidebarLinkProps {
  section: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function SidebarLink({ section, active, onClick, children }: SidebarLinkProps) {
  return (
    <a 
      href={`#${section}`}
      className={`
        block px-3 py-2 rounded-md text-sm transition-all duration-200
        ${active 
          ? 'bg-[#6366F1]/10 text-white font-medium' 
          : 'text-[#AAAAAA] hover:text-white hover:bg-[#2a2a2a]'
        }
      `}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
}

interface DocumentSectionProps {
  id: string;
  title: string;
  active: boolean;
  children: React.ReactNode;
}

function DocumentSection({ id, title, active, children }: DocumentSectionProps) {
  return (
    <div 
      id={id}
      className={`transition-all duration-300 ${active ? 'block' : 'hidden'}`}
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-6">{title}</h2>
      {children}
    </div>
  );
} 