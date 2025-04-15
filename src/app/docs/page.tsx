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
      
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-6">
          {/* Page Title */}
          <div className="mb-12 max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Documentation</h1>
            <p className="text-lg text-[#AAAAAA]">Everything you need to build powerful AI agent teams</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-64 lg:w-72 flex-shrink-0">
              <div className="sticky top-28 bg-[#151515] rounded-xl border border-[#2a2a2a] overflow-hidden">
                <div className="p-4 border-b border-[#2a2a2a]">
                  <h2 className="font-bold text-xl">Contents</h2>
                </div>
                
                <div className="p-3">
                  <div className="mb-5">
                    <div className="px-2 py-1 text-[#AAAAAA] text-sm font-medium uppercase tracking-wider">Getting Started</div>
                    <div className="mt-2 space-y-1">
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
                  
                  <div className="mb-5">
                    <div className="px-2 py-1 text-[#AAAAAA] text-sm font-medium uppercase tracking-wider">Core Concepts</div>
                    <div className="mt-2 space-y-1">
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
                  
                  <div className="mb-5">
                    <div className="px-2 py-1 text-[#AAAAAA] text-sm font-medium uppercase tracking-wider">Advanced</div>
                    <div className="mt-2 space-y-1">
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
              <div className="bg-[#151515] rounded-xl border border-[#2a2a2a] p-8">
                {/* Content sections */}
                <DocumentSection 
                  id="quickstart" 
                  title="Quick Start Guide" 
                  active={activeSection === 'quickstart'}
                >
                  <p className="text-[#AAAAAA] mb-6 text-lg">
                    Get up and running with your first agent team in minutes. Follow this guide to create and deploy your first collaborative AI agents.
                  </p>
                  
                  <div className="mb-10">
                    <h3 className="text-xl font-semibold mb-4">Prerequisites</h3>
                    <ul className="list-disc pl-5 space-y-2 text-[#AAAAAA] mb-6">
                      <li>Node.js 16 or higher</li>
                      <li>npm or yarn package manager</li>
                      <li>API keys for your preferred AI models</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-10">
                    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
                      <div className="border-b border-[#2a2a2a] px-6 py-4">
                        <h3 className="text-xl font-semibold">Step 1: Install the SDK</h3>
                      </div>
                      <div className="p-6">
                        <div className="bg-[#121212] rounded-md p-4 font-mono text-sm overflow-x-auto">
                          <pre>npm install @agent-team/sdk</pre>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
                      <div className="border-b border-[#2a2a2a] px-6 py-4">
                        <h3 className="text-xl font-semibold">Step 2: Set up your first agent</h3>
                      </div>
                      <div className="p-6">
                        <div className="bg-[#121212] rounded-md p-4 font-mono text-sm overflow-x-auto">
                          <pre>{`import { createAgent } from '@agent-team/sdk';

const researcher = createAgent({
  name: 'Researcher',
  role: 'research',
  model: 'gpt-4-turbo',
  tools: [webSearch, documentRetrieval]
});`}</pre>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
                      <div className="border-b border-[#2a2a2a] px-6 py-4">
                        <h3 className="text-xl font-semibold">Step 3: Create a simple workflow</h3>
                      </div>
                      <div className="p-6">
                        <div className="bg-[#121212] rounded-md p-4 font-mono text-sm overflow-x-auto">
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
                      </div>
                    </div>
                    
                    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
                      <div className="border-b border-[#2a2a2a] px-6 py-4">
                        <h3 className="text-xl font-semibold">Step 4: Run your workflow</h3>
                      </div>
                      <div className="p-6">
                        <div className="bg-[#121212] rounded-md p-4 font-mono text-sm overflow-x-auto">
                          <pre>{`// Execute the workflow with input
const results = await researchWorkflow.execute({
  topic: 'Sustainable energy innovations in 2023',
  depth: 'comprehensive'
});

console.log(results.research_results);`}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-10 bg-[#6366F1]/5 border border-[#6366F1]/20 rounded-xl p-5">
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-[#6366F1] mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <span className="font-medium text-white block mb-2">Important Note</span>
                        <p className="text-[#AAAAAA]">
                          Make sure to store your API keys securely and not expose them in client-side code. We recommend using environment variables.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-10">
                    <h3 className="text-xl font-semibold mb-4">Next Steps</h3>
                    <p className="text-[#AAAAAA] mb-4">
                      Now that you have your first agent up and running, explore the following sections to learn more:
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1 w-7 h-7 rounded-full bg-[#6366F1]/10 flex items-center justify-center text-[#6366F1] mr-4">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                        <div>
                          <a href="#agent-basics" className="text-white font-medium hover:text-[#6366F1] transition-colors">Agent Basics</a>
                          <p className="text-[#AAAAAA]">Learn about agent capabilities and configuration</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1 w-7 h-7 rounded-full bg-[#6366F1]/10 flex items-center justify-center text-[#6366F1] mr-4">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                        <div>
                          <a href="#workflows" className="text-white font-medium hover:text-[#6366F1] transition-colors">Workflows</a>
                          <p className="text-[#AAAAAA]">Create more complex agent interactions</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1 w-7 h-7 rounded-full bg-[#6366F1]/10 flex items-center justify-center text-[#6366F1] mr-4">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                        <div>
                          <a href="#teams" className="text-white font-medium hover:text-[#6366F1] transition-colors">Agent Teams</a>
                          <p className="text-[#AAAAAA]">Build collaborative agent systems</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </DocumentSection>
                
                <DocumentSection 
                  id="installation" 
                  title="Installation" 
                  active={activeSection === 'installation'}
                >
                  <p className="text-[#AAAAAA] mb-6 text-lg">
                    Detailed installation instructions for different environments and platforms.
                  </p>
                  
                  <div className="space-y-8">
                    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
                      <div className="border-b border-[#2a2a2a] px-6 py-4">
                        <h3 className="text-xl font-semibold">npm</h3>
                      </div>
                      <div className="p-6">
                        <div className="bg-[#121212] rounded-md p-4 font-mono text-sm overflow-x-auto">
                          <pre>npm install @agent-team/sdk</pre>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
                      <div className="border-b border-[#2a2a2a] px-6 py-4">
                        <h3 className="text-xl font-semibold">yarn</h3>
                      </div>
                      <div className="p-6">
                        <div className="bg-[#121212] rounded-md p-4 font-mono text-sm overflow-x-auto">
                          <pre>yarn add @agent-team/sdk</pre>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
                      <div className="border-b border-[#2a2a2a] px-6 py-4">
                        <h3 className="text-xl font-semibold">pnpm</h3>
                      </div>
                      <div className="p-6">
                        <div className="bg-[#121212] rounded-md p-4 font-mono text-sm overflow-x-auto">
                          <pre>pnpm add @agent-team/sdk</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </DocumentSection>
                
                <DocumentSection 
                  id="configuration" 
                  title="Configuration" 
                  active={activeSection === 'configuration'}
                >
                  <p className="text-[#AAAAAA] mb-6 text-lg">
                    Learn how to configure the SDK for optimal performance and security.
                  </p>
                  
                  <div className="space-y-8">
                    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
                      <div className="border-b border-[#2a2a2a] px-6 py-4">
                        <h3 className="text-xl font-semibold">Environment Setup</h3>
                      </div>
                      <div className="p-6">
                        <div className="bg-[#121212] rounded-md p-4 font-mono text-sm overflow-x-auto">
                          <pre>{`// .env file
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
PINECONE_API_KEY=your_pinecone_key`}</pre>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
                      <div className="border-b border-[#2a2a2a] px-6 py-4">
                        <h3 className="text-xl font-semibold">SDK Configuration</h3>
                      </div>
                      <div className="p-6">
                        <div className="bg-[#121212] rounded-md p-4 font-mono text-sm overflow-x-auto">
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
                      </div>
                    </div>
                  </div>
                </DocumentSection>
                
                <DocumentSection 
                  id="agent-basics" 
                  title="Agent Basics" 
                  active={activeSection === 'agent-basics'}
                >
                  <p className="text-[#AAAAAA] mb-6 text-lg">
                    Understand the fundamentals of agent creation, configuration, and capabilities.
                  </p>
                  
                  <div className="space-y-8">
                    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
                      <div className="border-b border-[#2a2a2a] px-6 py-4">
                        <h3 className="text-xl font-semibold">Creating an Agent</h3>
                      </div>
                      <div className="p-6">
                        <div className="bg-[#121212] rounded-md p-4 font-mono text-sm overflow-x-auto">
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
                      </div>
                    </div>
                    
                    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
                      <div className="border-b border-[#2a2a2a] px-6 py-4">
                        <h3 className="text-xl font-semibold">Agent Properties</h3>
                      </div>
                      <div className="p-6">
                        <div className="bg-[#121212] rounded-md overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
                                <th className="text-left py-3 px-4">Property</th>
                                <th className="text-left py-3 px-4">Type</th>
                                <th className="text-left py-3 px-4">Description</th>
                              </tr>
                            </thead>
                            <tbody className="text-[#AAAAAA]">
                              <tr className="border-b border-[#2a2a2a]">
                                <td className="py-3 px-4">name</td>
                                <td className="py-3 px-4 text-[#6366F1]">string</td>
                                <td className="py-3 px-4">Agent's identifier</td>
                              </tr>
                              <tr className="border-b border-[#2a2a2a]">
                                <td className="py-3 px-4">model</td>
                                <td className="py-3 px-4 text-[#6366F1]">string</td>
                                <td className="py-3 px-4">AI model to use</td>
                              </tr>
                              <tr className="border-b border-[#2a2a2a]">
                                <td className="py-3 px-4">temperature</td>
                                <td className="py-3 px-4 text-[#6366F1]">number</td>
                                <td className="py-3 px-4">Creativity level (0.0-1.0)</td>
                              </tr>
                              <tr>
                                <td className="py-3 px-4">tools</td>
                                <td className="py-3 px-4 text-[#6366F1]">Tool[]</td>
                                <td className="py-3 px-4">Functions agent can use</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </DocumentSection>
                
                {/* Add more document sections for other topics with the new style */}
                <DocumentSection 
                  id="workflows" 
                  title="Workflows" 
                  active={activeSection === 'workflows'}
                >
                  <p className="text-[#AAAAAA] mb-6 text-lg">
                    Learn how to create and manage workflows for coordinating multiple agents.
                  </p>
                  
                  <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
                    <div className="border-b border-[#2a2a2a] px-6 py-4">
                      <h3 className="text-xl font-semibold">Creating a Workflow</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-[#AAAAAA]">Coming soon...</p>
                    </div>
                  </div>
                </DocumentSection>
                
                <DocumentSection 
                  id="teams" 
                  title="Agent Teams" 
                  active={activeSection === 'teams'}
                >
                  <p className="text-[#AAAAAA] mb-6 text-lg">
                    Build collaborative agent systems that work together to solve complex problems.
                  </p>
                  
                  <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
                    <div className="border-b border-[#2a2a2a] px-6 py-4">
                      <h3 className="text-xl font-semibold">Creating a Team</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-[#AAAAAA]">Coming soon...</p>
                    </div>
                  </div>
                </DocumentSection>
                
                <DocumentSection 
                  id="custom-models" 
                  title="Custom Models" 
                  active={activeSection === 'custom-models'}
                >
                  <p className="text-[#AAAAAA] mb-6 text-lg">
                    Integrate your own or third-party AI models into the agent ecosystem.
                  </p>
                  
                  <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
                    <div className="border-b border-[#2a2a2a] px-6 py-4">
                      <h3 className="text-xl font-semibold">Model Integration</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-[#AAAAAA]">Coming soon...</p>
                    </div>
                  </div>
                </DocumentSection>
                
                <DocumentSection 
                  id="api-reference" 
                  title="API Reference" 
                  active={activeSection === 'api-reference'}
                >
                  <p className="text-[#AAAAAA] mb-6 text-lg">
                    Complete API reference for the Agent Team SDK.
                  </p>
                  
                  <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
                    <div className="border-b border-[#2a2a2a] px-6 py-4">
                      <h3 className="text-xl font-semibold">Core Functions</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-[#AAAAAA]">Coming soon...</p>
                    </div>
                  </div>
                </DocumentSection>
                
                <DocumentSection 
                  id="integrations" 
                  title="Integrations" 
                  active={activeSection === 'integrations'}
                >
                  <p className="text-[#AAAAAA] mb-6 text-lg">
                    Connect your agent teams with external systems and services.
                  </p>
                  
                  <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
                    <div className="border-b border-[#2a2a2a] px-6 py-4">
                      <h3 className="text-xl font-semibold">Available Integrations</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-[#AAAAAA]">Coming soon...</p>
                    </div>
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
          : 'text-[#AAAAAA] hover:text-white hover:bg-[#1e1e1e]'
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