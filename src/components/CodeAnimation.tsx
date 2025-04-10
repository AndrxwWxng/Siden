'use client';

import { useState, useEffect, useRef } from 'react';

export default function CodeAnimation() {
  const [mounted, setMounted] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [visibleCode, setVisibleCode] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  
  // Only run animations after component is mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Mock code to animate
  const code = [
    "// Initialize your agent team",
    "import { createTeam, createAgent } from 'agent-team';",
    "",
    "// Create specialized agents",
    "const assistant = createAgent({",
    "  name: 'Assistant',",
    "  role: 'primary',",
    "  model: 'gpt-4-turbo',",
    "  systemPrompt: `You are a helpful assistant that coordinates tasks.`",
    "});",
    "",
    "const researcher = createAgent({",
    "  name: 'Researcher',",
    "  role: 'support',",
    "  model: 'gpt-4-turbo',",
    "  tools: [webSearch, documentRetrieval]",
    "});",
    "",
    "const coder = createAgent({",
    "  name: 'Coder',",
    "  role: 'specialized',",
    "  model: 'gpt-4-turbo',",
    "  tools: [codeInterpreter, fileSystem]",
    "});",
    "",
    "// Build your team",
    "const team = createTeam({",
    "  name: 'Development Team',",
    "  agents: [assistant, researcher, coder],",
    "  coordinator: assistant",
    "});",
    "",
    "// Start your workflow",
    "team.initializeTask({",
    "  title: 'Build a React dashboard',",
    "  description: 'Create a dashboard that displays user analytics',",
    "  deliverables: ['Component design', 'Implementation', 'Documentation']",
    "});",
    "",
    "// Monitor progress",
    "team.on('taskComplete', (result) => {",
    "  console.log('Task completed successfully');",
    "  console.log(result);",
    "});"
  ];
  
  // Character by character typing animation
  useEffect(() => {
    if (!mounted) return;
    
    const animateCode = () => {
      if (currentLine < code.length) {
        const line = code[currentLine];
        setVisibleCode(prev => [...prev, line]);
        setCurrentLine(prevLine => prevLine + 1);
      } else {
        // Reset animation after completion with a delay
        setTimeout(() => {
          setVisibleCode([]);
          setCurrentLine(0);
        }, 3000);
      }
    };
    
    const typingTimeout = setTimeout(animateCode, currentLine === 0 ? 500 : 100);
    return () => clearTimeout(typingTimeout);
  }, [currentLine, mounted]);
  
  // Blinking cursor animation
  useEffect(() => {
    if (!mounted) return;
    
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    
    return () => clearInterval(cursorInterval);
  }, [mounted]);
  
  // Auto-scroll to keep the latest code visible
  useEffect(() => {
    if (!mounted) return;
    
    if (codeContainerRef.current) {
      codeContainerRef.current.scrollTop = codeContainerRef.current.scrollHeight;
    }
  }, [visibleCode, mounted]);
  
  // Syntax highlighting function
  const highlightSyntax = (line: string) => {
    return line
      .replace(/\/\/(.*)/g, '<span style="color: #6A9955;">$&</span>') // Comments
      .replace(/import|export|const|from/g, '<span style="color: #569CD6;">$&</span>') // Keywords
      .replace(/('.*?'|".*?"|`.*?`)/g, '<span style="color: #CE9178;">$&</span>') // Strings
      .replace(/\b(createTeam|createAgent|on|console\.log|initializeTask)\b/g, '<span style="color: #DCDCAA;">$&</span>') // Functions
      .replace(/\b(name|role|model|systemPrompt|tools|agents|coordinator|title|description|deliverables)\b(?=:)/g, '<span style="color: #9CDCFE;">$&</span>'); // Properties
  };
  
  // Don't render anything until client-side
  if (!mounted) {
    return <div className="relative w-full h-full bg-[#1e1e1e]"></div>;
  }
  
  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Code editor header */}
      <div className="bg-[#252525] flex items-center justify-between px-4 py-2 border-b border-[#2e2e2e]">
        <div className="flex items-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
            <div className="w-3 h-3 rounded-full bg-[#22C55E]"></div>
          </div>
          <span className="ml-4 text-sm text-[#AAAAAA]">agent-team-builder.ts</span>
        </div>
        <div className="text-sm text-[#AAAAAA]">TypeScript</div>
      </div>
      
      {/* Code content */}
      <div 
        ref={codeContainerRef}
        className="flex-1 overflow-auto p-4 bg-[#1e1e1e] font-mono text-sm"
      >
        <div className="code-container relative">
          {visibleCode.map((line, idx) => (
            <div key={idx} className="code-line flex">
              <span className="line-number w-8 text-right pr-4 text-[#6d6d6d] select-none">{idx + 1}</span>
              <span 
                dangerouslySetInnerHTML={{ 
                  __html: highlightSyntax(line) + (idx === visibleCode.length - 1 && showCursor ? '<span class="typing-cursor"></span>' : '') 
                }} 
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Typing status */}
      <div className="absolute bottom-3 right-3 text-xs bg-[#252525] px-2 py-1 rounded text-[#AAAAAA] opacity-70">
        typescript • agent-team API
      </div>
    </div>
  );
} 