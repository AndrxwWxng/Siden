'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
// Add Instrument Serif font
import '@fontsource/instrument-serif';

// Styles
const styles = {
  effortlesslyText: `
    .effortlessly-text {
      font-family: "Instrument Serif", serif;
      font-style: italic;
      font-weight: 400;
      letter-spacing: 0em;
      color: #6366F1;
      position: relative;
      display: inline-block;
      text-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
      transition: all 0.3s ease;
      font-size: 1.15em;
      margin: 0 0.05em;
    }
    
    .effortlessly-text:hover {
      text-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
    }
  `
};

export default function Home() {
  
  // Add animation tracking refs
  const heroRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);

  // Animation state
  const [heroVisible, setHeroVisible] = useState(false);
  const [logosVisible, setLogosVisible] = useState(false);
  const [productVisible, setProductVisible] = useState(false);

  
  useEffect(() => {    
    // Setup intersection observer for animations
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observers: IntersectionObserver[] = [];
    
    // Helper function to create an observer
    const createObserver = (
      ref: React.RefObject<HTMLDivElement | null>, 
      setVisible: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      if (!ref.current) return;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);
      
      observer.observe(ref.current);
      observers.push(observer);
    };
    
    // Create observers for each section
    createObserver(heroRef, setHeroVisible);
    createObserver(logosRef, setLogosVisible);
    createObserver(productRef, setProductVisible);

    
    return () => {
      // Cleanup observers
      observers.forEach(observer => observer.disconnect());
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <style dangerouslySetInnerHTML={{ __html: styles.effortlesslyText }} />
      <NavBar />
      
      <main className="flex flex-col flex-grow">
        {/* Hero Section */}
        <section 
          ref={heroRef}
          className="flex flex-col items-center justify-center pt-32 pb-48 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#121212] via-transparent to-[#121212] pointer-events-none"></div>
          
          <div className="container mx-auto px-50 relative z-10">
            <div 
              className={`flex flex-col items-center text-center mb-16 transition-all duration-1000 ${
                heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight max-w-4xl">
                Build and orchestrate your AI agent team <span className="effortlessly-text">effortlessly</span>
              </h1>
              <p className="text-xl md:text-2xl text-[#AAAAAA] max-w-2xl mx-auto mb-10">
                The purpose-built platform for creating, deploying, and managing AI agents at scale.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link 
                  href="/dashboard" 
                  className="px-8 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium rounded transition-all duration-200 flex items-center justify-center min-w-[180px]"
                >
                  Start building
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link 
                  href="/pricing" 
                  className="px-8 py-3 bg-transparent border border-[#2e2e2e] hover:border-[#6366F1] text-white font-medium rounded transition-all duration-200 flex items-center justify-center min-w-[180px]"
                >
                  View pricing
                </Link>
                <Link
                  href="/chat"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mx-2"
                >
                  Chat with Agents
                </Link>
              </div>
            </div>
            
            <div 
              className={`relative w-full max-w-5xl mx-auto h-[700px] mt-16 transition-all duration-1000 delay-300 ${
                heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}
            >
              {/* 3D perspective UI mockup with layered effect */}
              <div className="absolute inset-0 w-full h-[620px] perspective-[2000px] flex justify-center items-center">
                {/* Main Dashboard UI */}
                <div 
                  className="w-full max-w-5xl h-full rounded-xl border border-[#3a3a3a] bg-[#171717] shadow-2xl overflow-hidden backdrop-blur-sm transform-gpu relative"
                  style={{
                    boxShadow: '0 50px 100px -20px rgba(99, 102, 241, 0.2), 0 30px 60px -30px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
                    transformOrigin: 'center center',
                    transform: 'rotateX(15deg) rotateY(7deg) rotateZ(-1deg) translateZ(0px)',
                    perspective: '2000px',
                    background: 'linear-gradient(135deg, rgba(28, 28, 28, 0.95) 0%, rgba(18, 18, 18, 0.95) 50%, rgba(12, 12, 12, 0.95) 100%)',
                    backdropFilter: 'blur(12px)'
                  }}
                >
                  {/* Top window controls */}
                  <div className="h-9 bg-[#0D0D0D] flex items-center px-4 border-b border-[#2a2a2a]">
                    <div className="flex space-x-2 mr-4">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#FDBC2C]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="h-5 bg-[#1e1e1e] rounded-md w-64 flex items-center justify-center">
                        <div className="h-3 w-3 bg-[#3e3e3e] rounded-full mr-2"></div>
                        <div className="h-2 w-32 bg-[#3e3e3e] rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* App interface content */}
                  <div className="flex h-[calc(100%-36px)]">
                    {/* Left sidebar */}
                    <div className="w-56 bg-[#111111] border-r border-[#2a2a2a] p-3 flex flex-col">
                      <div className="flex items-center space-x-2 px-2 py-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]"></div>
                        <div className="text-lg font-semibold text-white">Siden</div>
                      </div>
                      
                      <div className="h-px bg-[#2a2a2a] my-3"></div>
                      
                      <div className="space-y-1 mb-4">
                        <div className="px-2 py-2 rounded bg-[#1e1e1e] text-white text-sm flex items-center">
                          <div className="w-4 h-4 mr-2 bg-[#3e3e3e] rounded"></div>
                          Dashboard
                        </div>
                        <div className="px-2 py-2 text-[#888] text-sm flex items-center hover:bg-[#1a1a1a] transition-colors rounded">
                          <div className="w-4 h-4 mr-2 bg-[#3e3e3e] rounded"></div>
                          Agents
                        </div>
                        <div className="px-2 py-2 text-[#888] text-sm flex items-center hover:bg-[#1a1a1a] transition-colors rounded">
                          <div className="w-4 h-4 mr-2 bg-[#3e3e3e] rounded"></div>
                          Workflows
                        </div>
                        <div className="px-2 py-2 text-[#888] text-sm flex items-center hover:bg-[#1a1a1a] transition-colors rounded">
                          <div className="w-4 h-4 mr-2 bg-[#3e3e3e] rounded"></div>
                          Analytics
                        </div>
                      </div>
                      
                      <div className="text-xs uppercase text-[#666] px-2 mb-2">Teams</div>
                      <div className="space-y-1">
                        <div className="px-2 py-2 text-[#888] text-sm flex items-center hover:bg-[#1a1a1a] transition-colors rounded">
                          <div className="w-4 h-4 mr-2 rounded-full bg-[#E879F9]"></div>
                          Research
                        </div>
                        <div className="px-2 py-2 text-[#888] text-sm flex items-center hover:bg-[#1a1a1a] transition-colors rounded">
                          <div className="w-4 h-4 mr-2 rounded-full bg-[#34D399]"></div>
                          Production
                        </div>
                      </div>
                      
                      <div className="mt-auto pt-3 border-t border-[#2a2a2a] flex items-center px-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] mr-2"></div>
                        <div className="text-sm text-white">Kendall B.</div>
                      </div>
                    </div>
                    
                    {/* Main content */}
                    <div className="flex-1 bg-[#0D0D0D] p-4 overflow-hidden">
                      <div className="flex justify-between items-center mb-6">
                        <div className="text-lg font-semibold text-white">Agent Dashboard</div>
                        <div className="flex space-x-2">
                          <div className="h-8 w-8 rounded-md flex items-center justify-center bg-[#1a1a1a] hover:bg-[#222] transition-colors">
                            <div className="w-4 h-4 bg-[#3e3e3e] rounded"></div>
                          </div>
                          <div className="h-8 w-8 rounded-md flex items-center justify-center bg-[#1a1a1a] hover:bg-[#222] transition-colors">
                            <div className="w-4 h-4 bg-[#3e3e3e] rounded"></div>
                          </div>
                          <div className="h-8 px-3 rounded-md flex items-center justify-center bg-[#6366F1] text-white text-sm hover:bg-[#5254cc] transition-colors">
                            New Agent
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-[#151515] rounded-lg border border-[#2a2a2a] p-3 hover:border-[#3a3a3a] transition-all duration-200">
                          <div className="text-[#888] text-sm mb-1">Active Agents</div>
                          <div className="text-2xl font-semibold text-white">24</div>
                          <div className="flex items-center mt-2">
                            <div className="text-xs text-[#34D399]">+3 this week</div>
                            <div className="w-12 h-4 ml-auto">
                              <div className="w-full h-1 bg-[#1e1e1e] rounded-full overflow-hidden mt-1">
                                <div className="h-full w-3/4 bg-[#34D399] rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#151515] rounded-lg border border-[#2a2a2a] p-3 hover:border-[#3a3a3a] transition-all duration-200">
                          <div className="text-[#888] text-sm mb-1">Total Tasks</div>
                          <div className="text-2xl font-semibold text-white">189</div>
                          <div className="flex items-center mt-2">
                            <div className="text-xs text-[#6366F1]">+42 today</div>
                            <div className="w-12 h-4 ml-auto">
                              <div className="w-full h-1 bg-[#1e1e1e] rounded-full overflow-hidden mt-1">
                                <div className="h-full w-4/5 bg-[#6366F1] rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#151515] rounded-lg border border-[#2a2a2a] p-3 hover:border-[#3a3a3a] transition-all duration-200">
                          <div className="text-[#888] text-sm mb-1">Completion Rate</div>
                          <div className="text-2xl font-semibold text-white">94.2%</div>
                          <div className="flex items-center mt-2">
                            <div className="text-xs text-[#34D399]">+1.8% from last month</div>
                            <div className="w-12 h-4 ml-auto">
                              <div className="w-full h-1 bg-[#1e1e1e] rounded-full overflow-hidden mt-1">
                                <div className="h-full w-[94%] bg-[#34D399] rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Agent cards */}
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { name: "Data Analyzer", status: "Online", tasks: 12, color: "#34D399", progress: 76 },
                          { name: "Code Assistant", status: "Online", tasks: 28, color: "#6366F1", progress: 89 },
                          { name: "Research Agent", status: "Offline", tasks: 7, color: "#F87171", progress: 23 },
                          { name: "Customer Support", status: "Idle", tasks: 0, color: "#FDBC2C", progress: 45 }
                        ].map((agent, i) => (
                          <div key={i} className="bg-[#151515] rounded-lg border border-[#2a2a2a] p-4 hover:border-[#3e3e3e] transition-all duration-200 cursor-pointer group">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-lg mr-3 flex items-center justify-center" style={{ 
                                  background: `linear-gradient(135deg, ${agent.color}, ${agent.color}aa)`
                                }}>
                                  <div className="w-5 h-5 bg-white/20 rounded-sm"></div>
                                </div>
                                <div>
                                  <div className="text-white font-medium">{agent.name}</div>
                                  <div className="text-xs text-[#888] mt-0.5">{agent.tasks} active tasks</div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full mr-1.5" style={{ 
                                  backgroundColor: agent.status === "Online" ? "#34D399" : agent.status === "Idle" ? "#FDBC2C" : "#F87171",
                                  boxShadow: agent.status === "Online" ? '0 0 8px rgba(52, 211, 153, 0.6)' : agent.status === "Idle" ? '0 0 8px rgba(253, 188, 44, 0.6)' : '0 0 8px rgba(248, 113, 113, 0.6)'
                                }}></div>
                                <div className="text-xs text-[#888]">{agent.status}</div>
                              </div>
                            </div>
                            <div className="mt-3 h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ 
                                width: `${agent.progress}%`, 
                                backgroundColor: agent.color,
                                boxShadow: `0 0 8px ${agent.color}99`
                              }}></div>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <div className="text-xs text-[#888]">Efficiency</div>
                              <div className="text-xs font-medium text-white">{agent.progress}%</div>
                            </div>
                            <div className="flex space-x-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="text-xs text-[#6366F1] hover:underline cursor-pointer">Configure</div>
                              <div className="text-xs text-[#6366F1] hover:underline cursor-pointer">View Details</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Right panel */}
                    <div className="w-64 bg-[#111111] border-l border-[#2a2a2a] p-3 flex flex-col">
                      <div className="text-sm font-medium text-white mb-3">Agent Details</div>
                      
                      <div className="bg-[#151515] rounded-lg border border-[#2a2a2a] p-3 mb-3">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-lg mr-3 flex items-center justify-center bg-gradient-to-br from-[#6366F1] to-[#4F46E5]">
                            <div className="w-5 h-5 bg-white/20 rounded-sm"></div>
                          </div>
                          <div>
                            <div className="text-white font-medium">Code Assistant</div>
                            <div className="text-xs text-[#888]">v2.4.1</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <div className="text-[#888]">Status</div>
                            <div className="text-white flex items-center">
                              <div className="h-1.5 w-1.5 rounded-full mr-1 bg-[#34D399]"></div>
                              Active
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <div className="text-[#888]">Uptime</div>
                            <div className="text-white">3d 14h 22m</div>
                          </div>
                          <div className="flex justify-between">
                            <div className="text-[#888]">Memory Usage</div>
                            <div className="text-white">2.4 GB</div>
                          </div>
                          <div className="flex justify-between">
                            <div className="text-[#888]">Tasks Completed</div>
                            <div className="text-white">437</div>
                          </div>
                        </div>
                        
                        <div className="h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden mt-3 mb-1">
                          <div className="h-full w-[89%] rounded-full bg-[#6366F1]"></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-[#888]">CPU Load</div>
                          <div className="text-xs font-medium text-white">89%</div>
                        </div>
                      </div>
                      
                      <div className="text-sm font-medium text-white mb-2">Recent Activity</div>
                      <div className="space-y-2 flex-1 overflow-hidden">
                        {[
                          { action: "Code review completed", time: "2m ago" },
                          { action: "New task assigned", time: "7m ago" },
                          { action: "PR #342 merged", time: "12m ago" },
                          { action: "Bug fix suggested", time: "25m ago" }
                        ].map((activity, i) => (
                          <div key={i} className="bg-[#151515] rounded p-2 text-xs">
                            <div className="text-white">{activity.action}</div>
                            <div className="text-[#888]">{activity.time}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-2 mt-3">
                        <button className="w-full py-2 bg-[#222] text-white text-sm rounded hover:bg-[#2a2a2a] transition-colors">
                          View Details
                        </button>
                        <button className="w-full py-2 bg-[#6366F1] text-white text-sm rounded hover:bg-[#5254cc] transition-colors">
                          Configure Agent
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating cards */}
                <div 
                  className="absolute -left-16 -top-14 w-72 bg-[#151515] rounded-lg border border-[#3a3a3a] p-3 shadow-xl transform-gpu"
                  style={{
                    transform: 'rotateX(15deg) rotateY(8deg) rotateZ(-1deg) translateZ(100px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 10px 20px rgba(0, 0, 0, 0.2)',
                    background: 'linear-gradient(135deg, rgba(28, 28, 28, 0.95) 0%, rgba(18, 18, 18, 0.95) 100%)',
                    backdropFilter: 'blur(12px)'
                  }}
                >
                  <div className="text-sm font-medium text-white mb-2">Task Queue</div>
                  <div className="space-y-2">
                    {[
                      { name: "Analyze user data", priority: "High", agent: "Data Analyzer" },
                      { name: "Optimize search algorithm", priority: "Medium", agent: "Code Assistant" },
                    ].map((task, i) => (
                      <div key={i} className="bg-[#1a1a1a] rounded p-2 text-xs">
                        <div className="text-white font-medium">{task.name}</div>
                        <div className="flex justify-between mt-1">
                          <div className="text-[#888]">{task.agent}</div>
                          <div className={`text-xs ${
                            task.priority === "High" ? "text-[#F87171]" : 
                            task.priority === "Medium" ? "text-[#FDBC2C]" : "text-[#34D399]"
                          }`}>{task.priority}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div 
                  className="absolute -right-20 top-24 w-60 bg-[#151515] rounded-lg border border-[#3a3a3a] p-3 shadow-xl transform-gpu"
                  style={{
                    transform: 'rotateX(14deg) rotateY(8deg) rotateZ(-1deg) translateZ(160px)',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.45), 0 10px 30px rgba(0, 0, 0, 0.2)',
                    background: 'linear-gradient(135deg, rgba(28, 28, 28, 0.95) 0%, rgba(18, 18, 18, 0.95) 100%)',
                    backdropFilter: 'blur(12px)'
                  }}
                >
                  <div className="text-sm font-medium text-white mb-2">Performance</div>
                  <div className="flex items-center justify-center h-20">
                    <div className="w-16 h-16 rounded-full border-4 border-[#6366F1] flex items-center justify-center">
                      <div className="text-lg font-bold text-white">92%</div>
                    </div>
                    <div className="ml-3">
                      <div className="text-xs text-[#888]">Overall Score</div>
                      <div className="text-xs text-[#34D399] mt-1">+5.4% this week</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Glass reflections - linear light streak effect */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl" 
                style={{ 
                  transform: 'rotateX(15deg) rotateY(7deg) rotateZ(-1deg)',
                }}>
                <div className="absolute -top-[30%] -right-[100%] w-[200%] h-[40%] bg-gradient-to-l from-transparent via-white to-transparent opacity-[0.02] blur-[1px]"
                  style={{ transform: 'rotate(45deg)' }}></div>
                <div className="absolute -top-[35%] -right-[100%] w-[200%] h-[10%] bg-gradient-to-l from-transparent via-white to-transparent opacity-[0.015] blur-[0.5px]"
                  style={{ transform: 'rotate(45deg)' }}></div>
              </div>
              
              {/* Reflections and shadows */}
              <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[85%] h-[100px]" 
                style={{
                  background: 'linear-gradient(to bottom, rgba(99, 102, 241, 0.05), transparent)',
                  filter: 'blur(40px)',
                  transform: 'rotateX(75deg) skewX(12deg) scale(0.9, 0.5)',
                  opacity: 0.2,
                  borderRadius: '50%'
                }}>
              </div>
              
              {/* Glow effects */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px]" 
                style={{
                  background: 'radial-gradient(circle, rgba(99, 102, 241, 0.02) 0%, transparent 70%)',
                  filter: 'blur(50px)',
                }}>
              </div>

              {/* Left edge enhancement */}
              <div className="absolute top-0 left-0 bottom-0 w-[20px]" 
                style={{
                  background: 'linear-gradient(to right, rgba(99, 102, 241, 0.02), transparent)',
                  filter: 'blur(8px)',
                }}>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-[-120px] left-0 right-0 h-[240px] bg-gradient-radial from-[#6366F1]/2 to-transparent opacity-20 blur-3xl"></div>
        </section>
        
        {/* Logos Section with animations */}
        <section 
          ref={logosRef}
          className="py-24 border-t border-[#1e1e1e] w-full max-w-full overflow-hidden"
        >
          <div className="container mx-auto px-50">
            <p className={`text-center text-[#AAAAAA] uppercase text-sm tracking-wider mb-10 transition-all duration-700 ${
              logosVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}>
              Powered by builders
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
              {[
                { src: '/logos/next.svg', alt: 'Next.js' },
                { src: '/logos/resend.svg', alt: 'Resend' },
                { src: '/logos/supabase.svg', alt: 'Supabase' },
                { src: '/logos/openai.svg', alt: 'OpenAI' },
                { src: '/logos/arth.svg', alt: 'Arth' },
                { src: '/logos/clark.svg', alt: 'Clark' }
              ].map((logo, i) => (
                <div 
                  key={i} 
                  className={`relative h-8 w-28 transition-all duration-700 hover:opacity-100 ${
                    logosVisible ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    fill
                    className="object-contain filter brightness-200 contrast-0 hover:brightness-100 hover:contrast-100 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Product Showcase with animations */}
        <section 
          ref={productRef}
          className="py-24 bg-[#121212]"
        >
          <div className="container mx-auto px-50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div 
                className={`md:w-1/2 transition-all duration-1000 ${
                  productVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <span className="text-white">Build your team in </span>
                  <span className="effortlessly-text">minutes</span>
                  <span className="text-white">, not weeks</span>
                </h2>
                <p className="text-[#AAAAAA] text-lg mb-8 leading-relaxed">
                  Our powerful platform empowers you to create, configure, and orchestrate sophisticated AI agents that collaborate seamlessly, eliminating complex setup and management headaches.
                </p>
                
                <div className="space-y-8">
                  {[
                    {
                      title: "Define your specialized agents",
                      desc: "Quickly create purpose-built agents for specific tasks with our templates or custom configurations. Tailor capabilities, memory, and knowledge sources with just a few clicks."
                    },
                    {
                      title: "Orchestrate seamless workflows",
                      desc: "Connect multiple agents in powerful workflows that handle complex, multi-step processes automatically. Define how agents communicate and collaborate to achieve your goals."
                    },
                    {
                      title: "Deploy and optimize performance",
                      desc: "Launch your agent team instantly and leverage real-time analytics to monitor performance, identify bottlenecks, and continuously improve your AI operations."
                    }
                  ].map((step, i) => (
                    <div 
                      key={i} 
                      className="flex items-start group"
                      style={{ 
                        transitionDelay: `${(i+1) * 200}ms`,
                        transform: productVisible ? 'translateX(0)' : 'translateX(-20px)',
                        opacity: productVisible ? 1 : 0,
                        transition: 'all 0.7s ease-out'
                      }}
                    >
                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#6366F1] to-[#4F46E5] text-white font-bold mr-4 shadow-lg shadow-[#6366F1]/20 group-hover:shadow-[#6366F1]/30 transition-all duration-300">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                        <p className="text-[#AAAAAA] leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div 
                  className="mt-10"
                  style={{ 
                    transitionDelay: '700ms',
                    transform: productVisible ? 'translateY(0)' : 'translateY(20px)',
                    opacity: productVisible ? 1 : 0,
                    transition: 'all 0.7s ease-out'
                  }}
                >
                  <Link 
                    href="/dashboard" 
                    className="px-8 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium rounded transition-all duration-200 flex items-center w-fit group"
                  >
                    Start building now
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              <div 
                className={`md:w-1/2 h-[500px] bg-[#0f0f0f] rounded-xl border border-[#2e2e2e] overflow-hidden relative shadow-2xl transition-all duration-1000 delay-500 ${
                  productVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}
              >
                {/* Product UI mockup */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]"></div>
                <div className="absolute inset-0 p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] mr-3"></div>
                    <div className="h-6 w-32 bg-[#252525] rounded"></div>
                    <div className="ml-auto flex space-x-2">
                      <div className="h-8 w-8 rounded-md bg-[#252525]"></div>
                      <div className="h-8 w-8 rounded-md bg-[#252525]"></div>
                      <div className="h-8 px-3 rounded-md bg-[#6366F1] flex items-center justify-center">
                        <div className="h-2 w-16 bg-white/30 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 h-[420px]">
                    <div className="w-1/4 bg-[#151515] rounded-lg border border-[#2a2a2a] p-4 flex flex-col">
                      <div className="h-5 w-24 bg-[#252525] rounded mb-4"></div>
                      <div className="space-y-2 mb-4">
                        <div className="h-10 bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-md flex items-center px-3">
                          <div className="h-3 w-3 rounded-sm bg-[#6366F1] mr-2"></div>
                          <div className="h-3 w-16 bg-white/20 rounded-sm"></div>
                        </div>
                        <div className="h-10 bg-[#1e1e1e] rounded-md flex items-center px-3">
                          <div className="h-3 w-3 rounded-sm bg-[#3e3e3e] mr-2"></div>
                          <div className="h-3 w-20 bg-[#3e3e3e] rounded-sm"></div>
                        </div>
                        <div className="h-10 bg-[#1e1e1e] rounded-md flex items-center px-3">
                          <div className="h-3 w-3 rounded-sm bg-[#3e3e3e] mr-2"></div>
                          <div className="h-3 w-12 bg-[#3e3e3e] rounded-sm"></div>
                        </div>
                      </div>
                      
                      <div className="h-px bg-[#2a2a2a] my-3"></div>
                      
                      <div className="h-5 w-16 bg-[#252525] rounded mb-3"></div>
                      <div className="space-y-2 flex-1">
                        <div className="bg-[#1a1a1a] rounded-md border border-[#2a2a2a] p-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-md bg-[#34D399]/20 flex items-center justify-center mr-3">
                              <div className="h-3 w-3 bg-[#34D399] rounded-sm"></div>
                            </div>
                            <div className="h-4 w-32 bg-[#252525] rounded"></div>
                          </div>
                          <div className="h-6 w-16 bg-[#252525] rounded-md"></div>
                        </div>
                        <div className="bg-[#1a1a1a] rounded-md border border-[#2a2a2a] p-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-md bg-[#6366F1]/20 flex items-center justify-center mr-3">
                              <div className="h-3 w-3 bg-[#6366F1] rounded-sm"></div>
                            </div>
                            <div className="h-4 w-36 bg-[#252525] rounded"></div>
                          </div>
                          <div className="h-6 w-16 bg-[#252525] rounded-md"></div>
                        </div>
                        <div className="bg-[#1a1a1a] rounded-md border border-[#2a2a2a] p-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-md bg-[#F87171]/20 flex items-center justify-center mr-3">
                              <div className="h-3 w-3 bg-[#F87171] rounded-sm"></div>
                            </div>
                            <div className="h-4 w-24 bg-[#252525] rounded"></div>
                          </div>
                          <div className="h-6 w-16 bg-[#252525] rounded-md"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-2/4 flex flex-col gap-4">
                      <div className="h-1/2 bg-[#151515] rounded-lg border border-[#2a2a2a] p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div className="h-5 w-32 bg-[#252525] rounded"></div>
                          <div className="h-8 px-3 rounded-md bg-[#1a1a1a] flex items-center justify-center">
                            <div className="h-2 w-12 bg-[#3e3e3e] rounded-sm"></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3 h-[calc(100%-40px)]">
                          <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-3 flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                              <div className="h-3 w-20 bg-[#3e3e3e] rounded-sm"></div>
                              <div className="h-3 w-3 rounded-full bg-[#34D399]"></div>
                            </div>
                            <div className="h-4 w-12 bg-[#252525] rounded mb-2"></div>
                            <div className="mt-auto h-1 bg-[#252525] rounded-full w-full overflow-hidden">
                              <div className="h-full w-4/5 bg-[#34D399] rounded-full"></div>
                            </div>
                          </div>
                          <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-3 flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                              <div className="h-3 w-16 bg-[#3e3e3e] rounded-sm"></div>
                              <div className="h-3 w-3 rounded-full bg-[#6366F1]"></div>
                            </div>
                            <div className="h-4 w-14 bg-[#252525] rounded mb-2"></div>
                            <div className="mt-auto h-1 bg-[#252525] rounded-full w-full overflow-hidden">
                              <div className="h-full w-2/3 bg-[#6366F1] rounded-full"></div>
                            </div>
                          </div>
                          <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-3 flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                              <div className="h-3 w-18 bg-[#3e3e3e] rounded-sm"></div>
                              <div className="h-3 w-3 rounded-full bg-[#F87171]"></div>
                            </div>
                            <div className="h-4 w-10 bg-[#252525] rounded mb-2"></div>
                            <div className="mt-auto h-1 bg-[#252525] rounded-full w-full overflow-hidden">
                              <div className="h-full w-1/2 bg-[#F87171] rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="h-1/2 bg-[#151515] rounded-lg border border-[#2a2a2a] p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div className="h-5 w-28 bg-[#252525] rounded"></div>
                          <div className="flex space-x-2">
                            <div className="h-8 px-3 rounded-md bg-[#1a1a1a] flex items-center justify-center">
                              <div className="h-2 w-16 bg-[#3e3e3e] rounded-sm"></div>
                            </div>
                            <div className="h-8 px-3 rounded-md bg-[#6366F1] flex items-center justify-center">
                              <div className="h-2 w-12 bg-white/30 rounded-sm"></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3 h-[calc(100%-40px)]">
                          <div className="bg-[#1a1a1a] rounded-md border border-[#2a2a2a] p-3 flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="h-6 w-6 rounded-md bg-[#34D399]/20 flex items-center justify-center mr-3">
                                <div className="h-3 w-3 bg-[#34D399] rounded-sm"></div>
                              </div>
                              <div className="h-4 w-32 bg-[#252525] rounded"></div>
                            </div>
                            <div className="h-6 w-16 bg-[#252525] rounded-md"></div>
                          </div>
                          <div className="bg-[#1a1a1a] rounded-md border border-[#2a2a2a] p-3 flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="h-6 w-6 rounded-md bg-[#6366F1]/20 flex items-center justify-center mr-3">
                                <div className="h-3 w-3 bg-[#6366F1] rounded-sm"></div>
                              </div>
                              <div className="h-4 w-36 bg-[#252525] rounded"></div>
                            </div>
                            <div className="h-6 w-16 bg-[#252525] rounded-md"></div>
                          </div>
                          <div className="bg-[#1a1a1a] rounded-md border border-[#2a2a2a] p-3 flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="h-6 w-6 rounded-md bg-[#F87171]/20 flex items-center justify-center mr-3">
                                <div className="h-3 w-3 bg-[#F87171] rounded-sm"></div>
                              </div>
                              <div className="h-4 w-24 bg-[#252525] rounded"></div>
                            </div>
                            <div className="h-6 w-16 bg-[#252525] rounded-md"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-1/4 bg-[#151515] rounded-lg border border-[#2a2a2a] p-4 flex flex-col">
                      <div className="h-5 w-20 bg-[#252525] rounded mb-4"></div>
                      
                      <div className="mb-5 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-3">
                        <div className="flex items-center mb-3">
                          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-[#6366F1] to-[#4F46E5] mr-2"></div>
                          <div>
                            <div className="h-3 w-24 bg-white/20 rounded-sm"></div>
                            <div className="h-2 w-12 bg-[#3e3e3e] rounded-sm mt-1"></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between">
                            <div className="h-2 w-12 bg-[#3e3e3e] rounded-sm"></div>
                            <div className="h-2 w-16 bg-[#3e3e3e] rounded-sm"></div>
                          </div>
                          <div className="flex justify-between">
                            <div className="h-2 w-14 bg-[#3e3e3e] rounded-sm"></div>
                            <div className="h-2 w-10 bg-[#3e3e3e] rounded-sm"></div>
                          </div>
                        </div>
                        
                        <div className="h-1.5 bg-[#252525] rounded-full w-full overflow-hidden">
                          <div className="h-full w-4/5 bg-[#6366F1] rounded-full"></div>
                        </div>
                      </div>
                      
                      <div className="h-5 w-24 bg-[#252525] rounded mb-3"></div>
                      <div className="space-y-2 flex-1">
                        <div className="bg-[#1a1a1a] rounded p-2">
                          <div className="h-3 w-32 bg-white/20 rounded-sm mb-1"></div>
                          <div className="h-2 w-14 bg-[#3e3e3e] rounded-sm"></div>
                        </div>
                        <div className="bg-[#1a1a1a] rounded p-2">
                          <div className="h-3 w-28 bg-white/20 rounded-sm mb-1"></div>
                          <div className="h-2 w-10 bg-[#3e3e3e] rounded-sm"></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-auto pt-3 border-t border-[#2a2a2a]">
                        <div className="h-8 bg-[#252525] rounded"></div>
                        <div className="h-8 bg-[#6366F1] rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Add a subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#6366F1]/5 via-transparent to-[#6366F1]/5 opacity-50 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Powerful Integrations Section */}
        <section className="py-32 bg-[#121212] w-full max-w-full overflow-hidden">
          <div className="container mx-auto px-50">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4"><span className="effortlessly-text"> Powerful Integrations</span></h2>
              <p className="text-lg text-[#AAAAAA]">
                Seamlessly connect with your favorite tools and platforms
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              {/* Carousel-style integration logos */}
              <div className="flex justify-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                  <div className="bg-[#1B1A19] rounded-lg p-6 flex items-center justify-center transition-all duration-300 hover:bg-[#252525] h-24 w-40">
                    <img src="/plangrid.svg" alt="Plangrid" className="max-h-10 opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="bg-[#1B1A19] rounded-lg p-6 flex items-center justify-center transition-all duration-300 hover:bg-[#252525] h-24 w-40">
                    <img src="/replit.svg" alt="Replit" className="max-h-10 opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="bg-[#1B1A19] rounded-lg p-6 flex items-center justify-center transition-all duration-300 hover:bg-[#252525] h-24 w-40">
                    <img src="/combinator.svg" alt="Combinator" className="max-h-10 opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="bg-[#1B1A19] rounded-lg p-6 flex items-center justify-center transition-all duration-300 hover:bg-[#252525] h-24 w-40">
                    <img src="/netlify.svg" alt="Netlify" className="max-h-10 opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
              
              {/* Navigation dots */}
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button className="w-3 h-3 rounded-full bg-[#6366F1]"></button>
                  <button className="w-3 h-3 rounded-full bg-[#333333]"></button>
                  <button className="w-3 h-3 rounded-full bg-[#333333]"></button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* RAG Architecture Section */}
        <section className="py-32 bg-[#121212] relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
          
          <div className="container mx-auto px-50 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="effortlessly-text">Process</span>
              </h2>
              <p className="text-lg text-[#AAAAAA] max-w-3xl mx-auto">
                Each agent has its own machine with tools and context. Agents connect to data sources, collaborate with teammates, and deliver results.
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto bg-[#151515] border border-[#2a2a2a] rounded-xl p-8 relative">
              <div className="flex flex-col space-y-8">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-semibold text-[#6366F1]">.configure()</div>
                  <div className="text-lg font-semibold text-[#6366F1]">.execute()</div>
                  <div className="text-lg font-semibold text-[#6366F1]">.deliver()</div>
                </div>
                
                <div className="grid grid-cols-5 gap-6">
                  {/* First row */}
                  <div className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-4 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-6 h-6 text-[#AAAAAA] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-sm text-[#AAAAAA]">Project Setup</span>
                    </div>
                  </div>
                  
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="w-full h-px bg-[#6366F1] opacity-30 relative">
                      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                        <div className="w-1 h-1 rounded-full bg-[#6366F1] opacity-70 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-4 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-6 h-6 text-[#6366F1] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h2a2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2v1.5" />
                        <path d="M13 11.5V13a2 2 0 002 2h3.5a2.5 2.5 0 010 5H18a2 2 0 00-2 2v1.065" />
                        <path d="M2 8V6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2h-3" />
                      </svg>
                      <span className="text-sm text-[#6366F1]">Agent Selection</span>
                    </div>
                  </div>
                  
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="w-full h-px bg-[#6366F1] opacity-30 relative">
                      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                        <div className="w-1 h-1 rounded-full bg-[#6366F1] opacity-70 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-4 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-6 h-6 text-[#AAAAAA] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                      <span className="text-sm text-[#AAAAAA]">Tool Connection</span>
                    </div>
                  </div>
                  
                  {/* Second row with vertical spacers */}
                  <div className="flex justify-center">
                    <div className="h-16 w-px bg-[#6366F1] opacity-30"></div>
                  </div>
                  <div></div>
                  <div className="flex justify-center">
                    <div className="h-16 w-px bg-[#6366F1] opacity-30"></div>
                  </div>
                  <div></div>
                  <div className="flex justify-center">
                    <div className="h-16 w-px bg-[#6366F1] opacity-30"></div>
                  </div>
                  
                  {/* Third row - Execution layer */}
                  <div className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-4 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-6 h-6 text-[#34D399] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="M12 16v-4M12 8h.01" />
                      </svg>
                      <span className="text-sm text-[#AAAAAA]">User Request</span>
                    </div>
                  </div>
                  
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="w-full h-px bg-[#34D399] opacity-30 relative">
                      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                        <div className="w-1 h-1 rounded-full bg-[#34D399] opacity-70 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-4 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-6 h-6 text-[#34D399] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 7h-3a2 2 0 01-2-2V2" />
                        <path d="M9 18a2 2 0 01-2-2v-1a2 2 0 00-2-2H3" />
                        <path d="M3 7h2a2 2 0 012 2v1a2 2 0 002 2h2" />
                        <path d="M14 18h1a2 2 0 002-2v-1a2 2 0 012-2h2" />
                        <rect x="7" y="9" width="10" height="6" rx="2" />
                      </svg>
                      <span className="text-sm text-[#AAAAAA]">E2B Sandbox</span>
                    </div>
                  </div>
                  
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="w-full h-px bg-[#34D399] opacity-30 relative">
                      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                        <div className="w-1 h-1 rounded-full bg-[#34D399] opacity-70 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-4 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-6 h-6 text-[#34D399] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="M15.5 16a4 4 0 100-8 4 4 0 000 8z" />
                        <path d="M8.5 16a4 4 0 100-8 4 4 0 000 8z" />
                      </svg>
                      <span className="text-sm text-[#AAAAAA]">Agent Output</span>
                    </div>
                  </div>
                  
                  {/* More vertical spacers */}
                  <div className="flex justify-center">
                    <div className="h-16 w-px bg-[#F87171] opacity-30"></div>
                  </div>
                  <div></div>
                  <div className="flex justify-center">
                    <div className="h-16 w-px bg-[#F87171] opacity-30"></div>
                  </div>
                  <div></div>
                  <div className="flex justify-center">
                    <div className="h-16 w-px bg-[#F87171] opacity-30"></div>
                  </div>
                  
                  {/* Fourth row - Resource layer */}
                  <div className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-4 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-6 h-6 text-[#F87171] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                      </svg>
                      <span className="text-sm text-[#AAAAAA]">Shared Memory</span>
                    </div>
                  </div>
                  
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="w-full h-px bg-[#F87171] opacity-30 relative">
                      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                        <div className="w-1 h-1 rounded-full bg-[#F87171] opacity-70 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-4 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-6 h-6 text-[#F87171] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm text-[#AAAAAA]">Tool Access</span>
                    </div>
                  </div>
                  
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="w-full h-px bg-[#F87171] opacity-30 relative">
                      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                        <div className="w-1 h-1 rounded-full bg-[#F87171] opacity-70 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-4 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-6 h-6 text-[#F87171] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 6l6 6l-6 6" />
                      </svg>
                      <span className="text-sm text-[#AAAAAA]">Knowledge Base</span>
                    </div>
                  </div>
                </div>
                
                {/* Technology Logos */}
                <div className="grid grid-cols-5 gap-2 mt-4">
                  <div className="flex justify-center">
                    <div className="flex space-x-2">
                      <div className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#555] rounded-sm"></div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#555] rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                  <div></div>
                  <div className="flex justify-center">
                    <div className="flex space-x-2">
                      <div className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#555] rounded-sm"></div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#555] rounded-sm"></div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#555] rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                  <div></div>
                  <div className="flex justify-center">
                    <div className="flex space-x-2">
                      <div className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#555] rounded-sm"></div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#555] rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="bg-[#171717] border border-[#2a2a2a] rounded-lg p-6 transition-all duration-300 hover:border-[#3a3a3a]">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center mr-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 7h-3a2 2 0 01-2-2V2" />
                      <path d="M9 18a2 2 0 01-2-2v-1a2 2 0 00-2-2H3" />
                      <path d="M3 7h2a2 2 0 012 2v1a2 2 0 002 2h2" />
                      <path d="M14 18h1a2 2 0 002-2v-1a2 2 0 012-2h2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white">Secure Sandboxes</h3>
                </div>
                <p className="text-sm text-[#AAAAAA]">
                  Isolated execution environments for each agent with secure access to tools
                </p>
              </div>
              
              <div className="bg-[#171717] border border-[#2a2a2a] rounded-lg p-6 transition-all duration-300 hover:border-[#3a3a3a]">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center mr-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white">Customizable Tooling</h3>
                </div>
                <p className="text-sm text-[#AAAAAA]">
                  Configure each agent with role-specific tools and permissions
                </p>
              </div>
              
              <div className="bg-[#171717] border border-[#2a2a2a] rounded-lg p-6 transition-all duration-300 hover:border-[#3a3a3a]">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center mr-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white">Team Collaboration</h3>
                </div>
                <p className="text-sm text-[#AAAAAA]">
                  Agents coordinate autonomously to solve complex problems as a team
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Agent Collaboration Framework */}
        <section className="py-32 bg-[#0A0A0A] relative overflow-hidden">
          {/* Background grid and gradient effects */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
          <div className="absolute inset-0 bg-gradient-radial from-[#6366F1]/10 to-transparent opacity-30"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Agent Collaboration Framework
              </h2>
              <p className="text-xl text-[#AAAAAA] leading-relaxed">
                Experience seamless teamwork as our AI agents collaborate to tackle complex challenges with precision and efficiency
              </p>
            </div>

            {/* Main collaboration visualization */}
            <div className="max-w-7xl mx-auto">
              {/* Top row - Agent cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ),
                    title: "Research Agent",
                    role: "Data Analysis & Research",
                    status: "Active",
                    tasks: 12,
                    color: "#34D399"
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    ),
                    title: "Code Assistant",
                    role: "Development & Testing",
                    status: "Active",
                    tasks: 8,
                    color: "#6366F1"
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    ),
                    title: "Support Agent",
                    role: "User Assistance",
                    status: "Active",
                    tasks: 15,
                    color: "#F59E0B"
                  }
                ].map((agent, i) => (
                  <div 
                    key={i}
                    className="group relative bg-[#151515] rounded-xl border border-[#2a2a2a] p-6 hover:border-[#6366F1] transition-all duration-300"
                    style={{
                      background: 'linear-gradient(145deg, rgba(21,21,21,0.9) 0%, rgba(15,15,15,0.9) 100%)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1]/0 via-[#6366F1]/5 to-[#6366F1]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center`} style={{ backgroundColor: `${agent.color}20`, color: agent.color }}>
                          {agent.icon}
                        </div>
                        <div className="flex items-center">
                          <div className={`h-2 w-2 rounded-full mr-2`} style={{ backgroundColor: agent.color }}></div>
                          <span className="text-sm text-[#AAAAAA]">{agent.status}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mb-2">{agent.title}</h3>
                      <p className="text-[#888888] text-sm mb-4">{agent.role}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-[#6366F1] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span className="text-sm text-[#AAAAAA]">{agent.tasks} active tasks</span>
                        </div>
                        <div className="h-8 w-8 rounded-lg bg-[#252525] hover:bg-[#2a2a2a] transition-colors flex items-center justify-center cursor-pointer">
                          <svg className="w-4 h-4 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Central collaboration hub */}
              <div className="bg-[#151515] rounded-2xl border border-[#2a2a2a] p-8 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-6">Real-time Collaboration</h3>
                    <div className="space-y-6">
                      {[
                        {
                          title: "Shared Knowledge Base",
                          description: "Agents access and contribute to a centralized knowledge repository",
                          icon: (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          )
                        },
                        {
                          title: "Task Distribution",
                          description: "Intelligent workload balancing and task assignment",
                          icon: (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                          )
                        },
                        {
                          title: "Resource Optimization",
                          description: "Dynamic resource allocation based on task requirements",
                          icon: (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          )
                        }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start">
                          <div className="w-10 h-10 rounded-lg bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center mr-4 flex-shrink-0">
                            {item.icon}
                          </div>
                          <div>
                            <h4 className="text-white font-medium mb-1">{item.title}</h4>
                            <p className="text-[#888888] text-sm">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    {/* Visualization */}
                    <div className="aspect-square rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-radial from-[#6366F1]/5 to-transparent"></div>
                      
                      {/* Animated connection lines */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                        <path 
                          d="M200,100 C150,150 250,250 200,300" 
                          className="stroke-[#6366F1] stroke-2 opacity-20"
                          fill="none"
                          strokeDasharray="6 6"
                        />
                        <path 
                          d="M100,200 C150,150 250,250 300,200" 
                          className="stroke-[#6366F1] stroke-2 opacity-20"
                          fill="none"
                          strokeDasharray="6 6"
                        />
                        <circle cx="200" cy="200" r="60" className="fill-[#6366F1]/10 stroke-[#6366F1] stroke-2"/>
                        <circle cx="200" cy="100" r="20" className="fill-[#34D399]/20 stroke-[#34D399] stroke-2"/>
                        <circle cx="100" cy="200" r="20" className="fill-[#6366F1]/20 stroke-[#6366F1] stroke-2"/>
                        <circle cx="300" cy="200" r="20" className="fill-[#F59E0B]/20 stroke-[#F59E0B] stroke-2"/>
                        <circle cx="200" cy="300" r="20" className="fill-[#6366F1]/20 stroke-[#6366F1] stroke-2"/>
                      </svg>
                      
                      {/* Central hub label */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-[#6366F1] font-medium mb-1">Collaboration Hub</div>
                          <div className="text-[#888888] text-sm">Active Agents: 4</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "Active Agents", value: "12", change: "+3", color: "#34D399" },
                  { label: "Tasks Completed", value: "1,234", change: "+127", color: "#6366F1" },
                  { label: "Success Rate", value: "98.2%", change: "+2.1%", color: "#F59E0B" },
                  { label: "Response Time", value: "1.2s", change: "-0.3s", color: "#6366F1" }
                ].map((metric, i) => (
                  <div key={i} className="bg-[#151515] rounded-xl border border-[#2a2a2a] p-6">
                    <div className="text-[#888888] text-sm mb-2">{metric.label}</div>
                    <div className="text-2xl font-semibold text-white mb-2">{metric.value}</div>
                    <div className="flex items-center">
                      <span className={`text-sm ${metric.change.startsWith('+') ? 'text-[#34D399]' : 'text-[#F87171]'}`}>
                        {metric.change} this week
                      </span>
                      <div className="ml-auto w-16">
                        <div className="h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: '75%', backgroundColor: metric.color }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
    </div>
  );
}
