'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import FeatureSection from '@/components/FeatureSection';

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState<string>('orchestration');
  
  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <NavBar />
      
      <main className="flex flex-col flex-grow">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center px-6 pt-36 pb-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('/grid-pattern.svg')] bg-repeat"></div>
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#121212] to-transparent pointer-events-none"></div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="inline-block py-1 px-3 bg-[#6366F1]/10 rounded-full text-[#6366F1] text-sm font-semibold mb-4">
                Features
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-[#AAAAAA]">
                Build your AI agent team with powerful features
              </h1>
              <p className="text-xl text-[#AAAAAA] max-w-2xl mx-auto">
                Everything you need to create, deploy, and manage sophisticated AI agent systems.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mt-8 w-full max-w-4xl mx-auto overflow-x-auto scrollbar-hide">
            <div className="flex p-1 bg-[#1a1a1a] rounded-full border border-[#2e2e2e] space-x-1">
              {[
                { id: 'orchestration', label: 'Orchestration' },
                { id: 'workflows', label: 'Visual Workflows' },
                { id: 'analytics', label: 'Analytics' },
                { id: 'scaling', label: 'Enterprise Scaling' },
                { id: 'integration', label: 'AI Integration' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`py-2 px-5 rounded-full whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-[#6366F1] text-white' 
                      : 'text-[#AAAAAA] hover:text-white'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>
        
        {/* Main Feature Section */}
        <FeatureSection />
        
        {/* Additional Feature Highlights */}
        <section className="py-20 bg-[#0A0A0A]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">More powerful capabilities</h2>
              <p className="text-xl text-[#AAAAAA] max-w-2xl mx-auto">
                Explore additional features that make our platform the best choice for AI agent teams.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Custom Agent Templates",
                  description: "Start with pre-built templates for common agent types or create your own reusable templates.",
                  icon: (
                    <svg className="w-7 h-7 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  )
                },
                {
                  title: "Real-time Monitoring",
                  description: "Get detailed insights into your agents' operations with real-time performance monitoring.",
                  icon: (
                    <svg className="w-7 h-7 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )
                },
                {
                  title: "API Integration",
                  description: "Connect your agents to external systems with our comprehensive API and webhooks.",
                  icon: (
                    <svg className="w-7 h-7 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )
                },
                {
                  title: "Custom Tools & Functions",
                  description: "Extend your agents' capabilities with custom tools and functions.",
                  icon: (
                    <svg className="w-7 h-7 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )
                },
                {
                  title: "Team Collaboration",
                  description: "Work together on agent projects with role-based access control and version history.",
                  icon: (
                    <svg className="w-7 h-7 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )
                },
                {
                  title: "Custom Deployment",
                  description: "Deploy your agents to our cloud or your own infrastructure with flexible options.",
                  icon: (
                    <svg className="w-7 h-7 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  )
                }
              ].map((feature, i) => (
                <div key={i} className="bg-[#171717] border border-[#2e2e2e] rounded-xl p-6 hover:border-[#6366F1]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#6366F1]/5">
                  <div className="w-12 h-12 bg-[#6366F1]/10 rounded-lg flex items-center justify-center mb-5">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-[#AAAAAA]">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 bg-[#121212] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/grid-pattern.svg')] bg-repeat"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#1a1a1a] to-[#131313] rounded-2xl p-12 border border-[#2e2e2e] shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-2/3 md:pr-12 mb-8 md:mb-0">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to build your AI agent team?</h2>
                  <p className="text-lg text-[#AAAAAA] mb-8">
                    Start your free trial today and discover how our platform can transform your AI agent workflows.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/dashboard" 
                      className="px-8 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
                    >
                      Start free trial
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                    <Link 
                      href="/contact" 
                      className="px-8 py-3 bg-transparent border border-[#2e2e2e] hover:border-[#6366F1] text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
                    >
                      Contact sales
                    </Link>
                  </div>
                </div>
                <div className="md:w-1/3">
                  <div className="rounded-lg bg-[#0D0D0D] p-5 border border-[#2e2e2e]">
                    <div className="text-sm text-[#AAAAAA] mb-3">Free trial includes:</div>
                    <ul className="space-y-3">
                      {[
                        "Full platform access",
                        "Up to 5 agents",
                        "1,000 agent runs",
                        "Community support",
                        "14-day trial period"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="w-5 h-5 text-[#6366F1] mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
} 