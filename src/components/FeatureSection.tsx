'use client';

export default function FeatureSection() {
  return (
    <section className="py-24 bg-[#0E0E0E]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key features designed for AI teams</h2>
          <p className="text-[#AAAAAA] text-xl max-w-2xl mx-auto">
            Built specifically for teams creating and managing AI agent systems.
          </p>
        </div>
        
        {/* Feature 1 */}
        <div className="flex flex-col md:flex-row items-center mb-32 gap-12">
          <div className="md:w-1/2 order-2 md:order-1">
            <span className="text-[#6366F1] font-medium mb-2 inline-block">Agent Orchestration</span>
            <h3 className="text-2xl md:text-3xl font-bold mb-6">Coordinate multiple agents working as a team</h3>
            <p className="text-[#AAAAAA] mb-6">
              Create specialized agents that work together seamlessly. Coordinate complex workflows where multiple agents collaborate to achieve goals beyond what individual agents can accomplish.
            </p>
            
            <ul className="space-y-3">
              {[
                "Build agent teams with specialized roles and capabilities",
                "Define clear communication patterns between agents",
                "Create hierarchical systems with supervisor agents",
                "Monitor real-time interactions between team members"
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <svg className="w-5 h-5 text-[#6366F1] mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:w-1/2 order-1 md:order-2">
            <div className="bg-[#1a1a1a] rounded-lg border border-[#2e2e2e] p-6 relative">
              <div className="bg-[#121212] rounded-md p-4">
                <div className="flex mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#22C55E]"></div>
                  </div>
                </div>
                
                <div className="font-mono text-sm text-[#AAAAAA]">
                  <CodeSnippet content={`
// Agent orchestration example
import { createTeam, createAgent } from 'agent-team';

// Create specialized agents
const researcher = createAgent({
  name: 'Researcher',
  role: 'research',
  model: 'gpt-4-turbo',
  tools: [webSearch, documentRetrieval]
});

const writer = createAgent({
  name: 'Writer',
  role: 'content',
  model: 'gpt-4-turbo'
});

const editor = createAgent({
  name: 'Editor',
  role: 'review',
  model: 'gpt-4-turbo'
});

// Create a team and define workflow
const contentTeam = createTeam({
  name: 'Content Creation',
  agents: [researcher, writer, editor],
  workflow: [
    {
      agent: researcher,
      task: 'Research the topic and gather information',
      output: 'research_data'
    },
    {
      agent: writer,
      task: 'Write the content based on research',
      input: 'research_data',
      output: 'draft_content'
    },
    {
      agent: editor,
      task: 'Review and edit the content',
      input: 'draft_content',
      output: 'final_content'
    }
  ]
});

// Start the workflow
contentTeam.start({
  topic: 'AI Agent Teams',
  format: 'blog post',
  style: 'professional'
});`} />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Feature 2 */}
        <div className="flex flex-col md:flex-row items-center mb-32 gap-12">
          <div className="md:w-1/2">
            <div className="bg-[#1a1a1a] rounded-lg border border-[#2e2e2e] p-6 relative h-[500px] flex flex-col">
              {/* Visual Builder UI Mockup */}
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold">Workflow Builder</h4>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-[#252525] rounded text-sm">Preview</button>
                  <button className="px-3 py-1 bg-[#6366F1] rounded text-sm">Save</button>
                </div>
              </div>
              
              <div className="flex-grow bg-[#121212] rounded-lg p-4 border border-[#2e2e2e] flex items-center justify-center">
                {/* Workflow builder nodes mockup */}
                <div className="relative w-full h-full">
                  {/* Node 1 */}
                  <div className="absolute left-[20%] top-[20%] w-[120px] h-[70px] bg-[#252525] rounded-lg border border-[#2e2e2e] flex flex-col items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#6366F1]/30 flex items-center justify-center mb-1">
                      <svg className="w-4 h-4 text-[#6366F1]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-xs">Research</div>
                  </div>
                  
                  {/* Node 2 */}
                  <div className="absolute left-[50%] top-[45%] w-[120px] h-[70px] bg-[#252525] rounded-lg border border-[#2e2e2e] flex flex-col items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#22C55E]/30 flex items-center justify-center mb-1">
                      <svg className="w-4 h-4 text-[#22C55E]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-xs">Content</div>
                  </div>
                  
                  {/* Node 3 */}
                  <div className="absolute left-[70%] top-[70%] w-[120px] h-[70px] bg-[#252525] rounded-lg border border-[#2e2e2e] flex flex-col items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#F59E0B]/30 flex items-center justify-center mb-1">
                      <svg className="w-4 h-4 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                    <div className="text-xs">Edit</div>
                  </div>
                  
                  {/* Connection lines */}
                  <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#6366F1" />
                      </marker>
                    </defs>
                    <line x1="40%" y1="30%" x2="48%" y2="45%" stroke="#6366F1" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <line x1="60%" y1="67%" x2="68%" y2="72%" stroke="#6366F1" strokeWidth="2" markerEnd="url(#arrowhead)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <span className="text-[#6366F1] font-medium mb-2 inline-block">Visual Workflow Builder</span>
            <h3 className="text-2xl md:text-3xl font-bold mb-6">Design complex agent workflows without coding</h3>
            <p className="text-[#AAAAAA] mb-6">
              Our intuitive visual workflow builder lets you design sophisticated agent systems by connecting nodes and defining relationships, without writing a single line of code.
            </p>
            
            <ul className="space-y-3">
              {[
                "Drag-and-drop interface for creating agent workflows",
                "Custom input/output mapping between agents",
                "Save and reuse workflow templates",
                "Debug mode to visualize data flow in real-time",
                "Export workflows as code for advanced customization"
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <svg className="w-5 h-5 text-[#6366F1] mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Feature 3 */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 order-2 md:order-1">
            <span className="text-[#6366F1] font-medium mb-2 inline-block">Advanced Analytics</span>
            <h3 className="text-2xl md:text-3xl font-bold mb-6">Optimize your agents with detailed metrics</h3>
            <p className="text-[#AAAAAA] mb-6">
              Gain deep insights into how your agents are performing individually and as a team. Track metrics, identify bottlenecks, and continuously improve your AI systems.
            </p>
            
            <ul className="space-y-3">
              {[
                "Performance dashboards for individual agents and teams",
                "Track response times, success rates, and efficiency metrics",
                "Identify patterns and optimize agent prompts based on data",
                "Set alerts for critical performance thresholds",
                "Historical performance tracking and trend analysis"
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <svg className="w-5 h-5 text-[#6366F1] mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:w-1/2 order-1 md:order-2">
            <div className="bg-[#1a1a1a] rounded-lg border border-[#2e2e2e] p-6 relative">
              {/* Analytics Dashboard Mockup */}
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold">Performance Analytics</h4>
                <div className="flex items-center space-x-2 text-sm text-[#AAAAAA]">
                  <span>Last 30 days</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[#252525] rounded-lg p-4">
                  <div className="text-[#AAAAAA] text-sm mb-1">Success Rate</div>
                  <div className="text-2xl font-bold">94.3%</div>
                  <div className="text-[#22C55E] text-xs flex items-center mt-1">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <span>+2.1%</span>
                  </div>
                </div>
                
                <div className="bg-[#252525] rounded-lg p-4">
                  <div className="text-[#AAAAAA] text-sm mb-1">Avg Response Time</div>
                  <div className="text-2xl font-bold">2.4s</div>
                  <div className="text-[#22C55E] text-xs flex items-center mt-1">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span>-0.3s</span>
                  </div>
                </div>
                
                <div className="bg-[#252525] rounded-lg p-4">
                  <div className="text-[#AAAAAA] text-sm mb-1">Total Tasks</div>
                  <div className="text-2xl font-bold">7,452</div>
                  <div className="text-[#F59E0B] text-xs flex items-center mt-1">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <span>+12.4%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#121212] rounded-lg p-4 h-64 relative mb-4">
                <div className="absolute bottom-4 left-4 right-4 h-40">
                  {/* Performance graph */}
                  <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-[#6366F1]/20 to-transparent"></div>
                  
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40">
                    <path 
                      d="M0,35 L5,32 L10,33 L15,30 L20,31 L25,28 L30,25 L35,26 L40,20 L45,22 L50,18 L55,15 L60,17 L65,13 L70,16 L75,12 L80,10 L85,15 L90,8 L95,5 L100,7" 
                      fill="none" 
                      stroke="#6366F1" 
                      strokeWidth="1.5"
                    />
                    
                    <circle cx="50" cy="18" r="2" fill="#6366F1" />
                    <circle cx="75" cy="12" r="2" fill="#6366F1" />
                    <circle cx="95" cy="5" r="2" fill="#6366F1" />
                  </svg>
                </div>
                
                <div className="flex justify-between text-[#AAAAAA] text-xs mb-1">
                  <span>Jan 1</span>
                  <span>Jan 15</span>
                  <span>Jan 30</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#252525] rounded-lg p-4">
                  <div className="text-[#AAAAAA] text-sm mb-2">Agent Performance</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Research Agent</span>
                      <div className="w-1/2 h-2 bg-[#121212] rounded-full overflow-hidden">
                        <div className="h-full bg-[#22C55E] rounded-full" style={{ width: '96%' }}></div>
                      </div>
                      <span className="text-xs">96%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Writer Agent</span>
                      <div className="w-1/2 h-2 bg-[#121212] rounded-full overflow-hidden">
                        <div className="h-full bg-[#6366F1] rounded-full" style={{ width: '88%' }}></div>
                      </div>
                      <span className="text-xs">88%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Code Agent</span>
                      <div className="w-1/2 h-2 bg-[#121212] rounded-full overflow-hidden">
                        <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: '82%' }}></div>
                      </div>
                      <span className="text-xs">82%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#252525] rounded-lg p-4">
                  <div className="text-[#AAAAAA] text-sm mb-2">Task Distribution</div>
                  <div className="h-[100px] relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#121212" strokeWidth="20" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#6366F1" strokeWidth="20" strokeDasharray="251" strokeDashoffset="0" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#22C55E" strokeWidth="20" strokeDasharray="251" strokeDashoffset="157" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#F59E0B" strokeWidth="20" strokeDasharray="251" strokeDashoffset="205" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Helper component for code snippets with syntax highlighting
function CodeSnippet({ content }: { content: string }) {
  const formattedCode = content.trim().split('\n').map((line, i) => {
    // Basic syntax highlighting
    const processedLine = line
      .replace(/\/\/(.*)/g, '<span style="color: #6A9955;">$&</span>') // Comments
      .replace(/import|export|const|function|if|else|return/g, '<span style="color: #569CD6;">$&</span>') // Keywords
      .replace(/('.*?'|".*?"|`.*?`)/g, '<span style="color: #CE9178;">$&</span>') // Strings
      .replace(/\b(createTeam|createAgent|start)\b/g, '<span style="color: #DCDCAA;">$&</span>') // Functions
      .replace(/\b(name|role|model|tools|workflow|agent|task|output|input)\b(?=:)/g, '<span style="color: #9CDCFE;">$&</span>'); // Properties
    
    return (
      <div key={i} className="code-line">
        <span className="mr-4 inline-block w-6 text-right text-[#6d6d6d]">{i + 1}</span>
        <span dangerouslySetInnerHTML={{ __html: processedLine }} />
      </div>
    );
  });
  
  return <div className="space-y-1">{formattedCode}</div>;
} 