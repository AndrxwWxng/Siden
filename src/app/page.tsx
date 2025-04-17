'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';

// Import CodeAnimation with no SSR to prevent hydration errors
const CodeAnimation = dynamic(() => import('@/components/CodeAnimation'), { 
  ssr: false 
});

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  
  // Add animation tracking refs
  const heroRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const integrationsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  // Animation state
  const [heroVisible, setHeroVisible] = useState(false);
  const [logosVisible, setLogosVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [productVisible, setProductVisible] = useState(false);
  const [integrationsVisible, setIntegrationsVisible] = useState(false);
  const [testimonialsVisible, setTestimonialsVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
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
    createObserver(featuresRef, setFeaturesVisible);
    createObserver(productRef, setProductVisible);
    createObserver(integrationsRef, setIntegrationsVisible);
    createObserver(testimonialsRef, setTestimonialsVisible);
    createObserver(ctaRef, setCtaVisible);
    
    return () => {
      // Cleanup observers
      observers.forEach(observer => observer.disconnect());
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <NavBar />
      
      <main className="flex flex-col flex-grow">
        {/* Hero Section with animations */}
        <section 
          ref={heroRef}
          className="flex flex-col items-center justify-center px-6 pt-32 pb-48 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#121212] via-transparent to-[#121212] pointer-events-none"></div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
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
                  href="/signup" 
                  className="px-8 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium rounded transition-all duration-200 flex items-center justify-center min-w-[180px] "
                >
                  Start building
                </Link>
                <Link 
                  href="/pricing" 
                  className="px-8 py-3 bg-transparent border border-[#2e2e2e] hover:border-[#6366F1] text-white font-medium rounded transition-all duration-200 flex items-center justify-center min-w-[180px] "
                >
                  View pricing
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
                        <div className="text-lg font-semibold text-white">AgentTeam</div>
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
                              <div className="text-xs text-[#6366F1] cursor-pointer">Configure</div>
                              <div className="text-xs text-[#6366F1] cursor-pointer">View Details</div>
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
          className="py-24 border-t border-[#1e1e1e]"
        >
          <div className="container mx-auto px-6">
            <p 
              className={`text-center text-[#AAAAAA] uppercase text-sm tracking-wider mb-10 transition-all duration-700 ${
                logosVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              Trusted by innovative teams at
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className={`h-8 w-32 bg-[#1e1e1e] rounded opacity-50 transition-all duration-700 ${
                    logosVisible ? 'opacity-50 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                ></div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Features Section with animations */}
        <section 
          ref={featuresRef}
          className="py-32 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div 
                className={`transition-all duration-700 ${
                  featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="flex items-center mb-3">
                  <span className="text-sm font-medium text-[#AAAAAA] uppercase tracking-wider">Features</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <span className="text-white">Agent infrastructure </span>
                  <span className="effortlessly-text">you'll enjoy using</span>
                </h2>
                
                <p className="text-lg text-[#AAAAAA] max-w-2xl mb-16 leading-relaxed">
                  Optimized for speed and efficiency. Create agents in seconds, orchestrate their interactions,
                  and breeze through your AI workflows in views tailored to your team.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 relative">
                {[
                  {
                    title: "Agent Orchestration",
                    description: "Coordinate multiple AI agents working together seamlessly on complex tasks with built-in communication protocols.",
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )
                  },
                  {
                    title: "Visual Workflow Builder",
                    description: "Create sophisticated agent workflows using our intuitive drag-and-drop interface, no coding required.",
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                    )
                  },
                  {
                    title: "Real-time Analytics",
                    description: "Track and optimize every agent's performance with comprehensive metrics and insights dashboard.",
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )
                  },
                  {
                    title: "Flexible Integrations",
                    description: "Connect your agents to APIs, databases, and third-party services with our extensive library of connectors.",
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                      </svg>
                    )
                  },
                  {
                    title: "Advanced Monitoring",
                    description: "Real-time monitoring with end-to-end tracing and logging of every agent interaction and transaction.",
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    )
                  },
                  {
                    title: "Team Collaboration",
                    description: "Built for teams with fine-grained roles, permissions, and collaborative agent management features.",
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )
                  }
                ].map((feature, i) => (
                  <div 
                    key={i} 
                    className="rounded-xl bg-[#121212] shadow-2xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden border border-[#222] hover:border-[#6366F1]/30"
                    style={{ 
                      transitionDelay: `${i * 100}ms`,
                      transform: featuresVisible ? 'translateY(0)' : 'translateY(40px)',
                      opacity: featuresVisible ? 1 : 0,
                      transition: 'all 0.7s ease-out'
                    }}
                  >
                    <div className="p-7 relative">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#6366F1] to-[#4F46E5] text-white mb-5 shadow-lg shadow-[#6366F1]/20">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                      <p className="text-[#AAAAAA]">{feature.description}</p>
                      
                      <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-[#6366F1]/5 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-[-120px] left-0 right-0 h-[240px] bg-gradient-radial from-[#6366F1]/3 to-transparent opacity-20 blur-3xl"></div>
        </section>
        
        {/* Product Showcase with animations */}
        <section 
          ref={productRef}
          className="py-24 bg-[#0E0E0E]"
        >
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div 
                className={`md:w-1/2 transition-all duration-1000 ${
                  productVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <span className="text-white">Build your agent team in </span>
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
                    href="/signup" 
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
        
        {/* Integrations Section with animations */}
        <section 
          ref={integrationsRef}
          className="py-32 bg-[#0F0F0F] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#6366F1]/5 to-transparent opacity-30 blur-3xl"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div 
                className={`lg:w-1/2 transition-all duration-1000 ${
                  integrationsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}
              >
                <div className="flex items-center mb-3">
                  <span className="text-sm font-medium text-[#AAAAAA] uppercase tracking-wider">Integrations</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <span className="text-white">Connect your agents to </span>
                  <span className="effortlessly-text ml-2">powerful</span>
                  <span className="text-white ml-2">tools</span>
                </h2>
                <p className="text-[#AAAAAA] text-lg mb-8 leading-relaxed">
                  Extend your AI agents' capabilities by connecting them to your existing tech stack. Our platform seamlessly integrates with popular APIs, databases, and services to ensure your agents can access all the tools and data they need.
                </p>
                
                <div className="space-y-6 mb-10">
                  {[
                    {
                      title: "Flexible API connections",
                      description: "Connect to any REST API or GraphQL endpoint with our no-code integration builder. Transform data and handle authentication automatically.",
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )
                    },
                    {
                      title: "Database connectors",
                      description: "Access SQL, NoSQL, and vector databases to store and retrieve information your agents need, with built-in security and performance optimizations.",
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                      )
                    },
                    {
                      title: "Pre-built connectors",
                      description: "Get started quickly with our library of pre-built integrations for popular services and platforms in your workflow.",
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )
                    }
                  ].map((feature, i) => (
                    <div 
                      key={i} 
                      className="flex items-start"
                      style={{ 
                        transitionDelay: `${(i+1) * 200}ms`,
                        transform: integrationsVisible ? 'translateX(0)' : 'translateX(-20px)',
                        opacity: integrationsVisible ? 1 : 0,
                        transition: 'all 0.7s ease-out'
                      }}
                    >
                      <div className="flex-shrink-0 mt-1 w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#6366F1]/20 to-[#4F46E5]/20 text-[#6366F1] mr-4">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2 text-white">{feature.title}</h3>
                        <p className="text-[#AAAAAA]">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div 
                  className="flex items-center"
                  style={{ 
                    transitionDelay: '800ms',
                    transform: integrationsVisible ? 'translateY(0)' : 'translateY(20px)',
                    opacity: integrationsVisible ? 1 : 0,
                    transition: 'all 0.7s ease-out'
                  }}
                >
                  <Link 
                    href="/integrations" 
                    className="text-[#6366F1] hover:text-[#4F46E5] font-medium flex items-center transition-colors duration-200 group"
                  >
                    Explore all integrations
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              <div 
                className={`lg:w-1/2 transition-all duration-1000 delay-500 ${
                  integrationsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}
              >
                {/* Floating integration cards */}
                <div className="relative mx-auto w-full max-w-xl h-[500px] perspective-[1000px]">
                  <div className="grid grid-cols-3 grid-rows-3 gap-3 w-full h-full absolute top-0 left-0 transform-gpu">
                    {[
                      { name: "Slack", color: "#4A154B", icon: "slack.svg", x: 10, y: 10, z: 70, rotate: 15 },
                      { name: "GitHub", color: "#181717", icon: "github.svg", x: -15, y: -5, z: 40, rotate: -8 },
                      { name: "Notion", color: "#000000", icon: "notion.svg", x: 25, y: -10, z: 20, rotate: 12 },
                      { name: "Salesforce", color: "#00A1E0", icon: "salesforce.svg", x: -20, y: 20, z: 50, rotate: -10 },
                      { name: "Airtable", color: "#F82B60", icon: "airtable.svg", x: 0, y: 0, z: 80, rotate: 0 },
                      { name: "Zapier", color: "#FF4A00", icon: "zapier.svg", x: 15, y: 15, z: 30, rotate: 5 },
                      { name: "MySQL", color: "#4479A1", icon: "mysql.svg", x: -10, y: -15, z: 10, rotate: -5 },
                      { name: "MongoDB", color: "#47A248", icon: "mongodb.svg", x: 20, y: -20, z: 60, rotate: 10 },
                      { name: "AWS", color: "#FF9900", icon: "aws.svg", x: -25, y: 5, z: 90, rotate: -12 }
                    ].map((integration, i) => (
                      <div 
                        key={i} 
                        className="relative rounded-lg p-5 bg-[#151515] border border-[#2a2a2a] hover:border-[#6366F1] transition-all duration-300 shadow-xl flex flex-col items-center justify-center group"
                        style={{
                          transform: `translateX(${integration.x}px) translateY(${integration.y}px) translateZ(${integration.z}px) rotateY(${integration.rotate}deg)`,
                          transition: 'all 0.5s ease-out',
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        <div className="w-12 h-12 rounded-lg bg-white bg-opacity-10 flex items-center justify-center mb-3">
                          <div className="w-6 h-6 opacity-70"></div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-white mb-1">{integration.name}</div>
                          <div className="text-xs text-[#888]">Integrated</div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Connection lines between integration cards */}
                <div className="absolute inset-0 pointer-events-none">
                  <svg className="w-full h-full opacity-30" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100,100 C150,120 250,150 300,200" stroke="#6366F1" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                    <path d="M200,50 C220,100 250,200 280,300" stroke="#6366F1" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                    <path d="M50,200 C100,220 200,250 350,280" stroke="#6366F1" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                    <path d="M120,300 C150,250 200,200 250,150" stroke="#6366F1" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                  </svg>
                </div>
                
                {/* Central glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#6366F1] rounded-full blur-3xl opacity-10"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials with animations */}
        <section 
          ref={testimonialsRef}
          className="py-32 bg-[#0E0E0E] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div 
              className={`text-center mb-16 transition-all duration-700 ${
                testimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="flex items-center justify-center mb-3">
                <span className="text-sm font-medium text-[#AAAAAA] uppercase tracking-wider">Testimonials</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="text-white">What teams are </span>
                <span className="effortlessly-text">saying</span>
              </h2>
              <p className="text-lg text-[#AAAAAA] max-w-2xl mx-auto mb-8 leading-relaxed">
                AgentTeam is transforming how organizations build and deploy AI agents. Here's what our customers have to say about their experience.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  quote: "AgentTeam has dramatically improved our AI development workflow. What used to take weeks now takes days. The visual workflow builder makes it easy for our non-technical team members to contribute.",
                  name: "Sarah Chen",
                  title: "CTO, TechNova",
                  rating: 5
                },
                {
                  quote: "The ability to orchestrate multiple agents working together seamlessly has been a game-changer for our customer support operations. We've reduced resolution times by 68%.",
                  name: "Marcus Johnson",
                  title: "Head of AI, SupportAI",
                  rating: 5
                },
                {
                  quote: "We've reduced our AI development costs by 60% while increasing capabilities. AgentTeam is now central to our operations, helping us scale AI initiatives across our organization.",
                  name: "Elena Rodriguez",
                  title: "Director of Innovation, GlobalCorp",
                  rating: 5
                }
              ].map((testimonial, i) => (
                <div 
                  key={i} 
                  className="bg-[#151515] p-6 rounded-xl border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all duration-300 group h-full flex flex-col"
                  style={{ 
                    transitionDelay: `${i * 200}ms`,
                    transform: testimonialsVisible ? 'translateY(0)' : 'translateY(40px)',
                    opacity: testimonialsVisible ? 1 : 0,
                    transition: 'all 0.7s ease-out'
                  }}
                >
                  <div className="mb-5">
                    <svg className="w-8 h-8 text-[#6366F1]/40" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="text-white text-lg mb-6 flex-grow">{testimonial.quote}</p>
                  
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-white">{testimonial.name}</h4>
                        <p className="text-[#888] text-sm">{testimonial.title}</p>
                      </div>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-[#2a2a2a]">
                      <div className="text-[#6366F1] text-sm font-medium cursor-pointer flex items-center">
                        Read full story
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div 
              className={`flex justify-center mt-10 transition-all duration-700 delay-700 ${
                testimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <Link 
                href="/case-studies" 
                className="px-6 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium rounded transition-all duration-200 flex items-center group"
              >
                View all case studies
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Bottom gradient */}
          <div className="absolute bottom-[-120px] left-0 right-0 h-[240px] bg-gradient-radial from-[#6366F1]/2 to-transparent opacity-20 blur-3xl"></div>
        </section>
        
        {/* CTA Section with animations */}
        <section 
          ref={ctaRef}
          className="py-32 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#6366F1]/10 to-transparent opacity-30 blur-3xl"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div 
              className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
                ctaVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to build your AI team?</h2>
              <p className="text-xl text-[#AAAAAA] mb-10 max-w-2xl mx-auto">
                Start building powerful AI agent systems today with our flexible pricing plans.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/signup" 
                  className="px-8 py-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium rounded transition-all duration-200 flex items-center justify-center min-w-[200px]"
                >
                  Get started for free
                </Link>
                <Link 
                  href="/contact" 
                  className="px-8 py-4 bg-transparent border border-[#2e2e2e] hover:border-[#6366F1] text-white font-medium rounded transition-all duration-200 flex items-center justify-center min-w-[200px]"
                >
                  Contact sales
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      <style jsx>{`
        .bg-grid-pattern {
          background-size: 50px 50px;
          background-image: 
            linear-gradient(to right, #1e1e1e 1px, transparent 1px),
            linear-gradient(to bottom, #1e1e1e 1px, transparent 1px);
        }
        
        .bg-gradient-radial {
          background-image: radial-gradient(circle, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 70%);
        }
        
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
        
        /* Add animation classes */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}