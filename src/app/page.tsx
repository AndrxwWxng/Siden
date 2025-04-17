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
                </Link>
                <Link 
                  href="/pricing" 
                  className="px-8 py-3 bg-transparent border border-[#2e2e2e] hover:border-[#6366F1] text-white font-medium rounded transition-all duration-200 flex items-center justify-center min-w-[180px]"
                >
                  View pricing
                </Link>
              </div>
            </div>

            <div 
              className={`relative w-full max-w-5xl mx-auto h-[620px] mt-16 transition-all duration-1000 delay-300 ${
                heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}
            >
              {/* Flat image placeholder for dashboard screenshot - to be replaced with custom Figma design */}
              <div className="w-full h-full flex justify-center items-center">
                <div 
                  className="w-full max-w-5xl h-full overflow-hidden relative"
                >
                  <Image
                    src="/mac.png"
                    alt="Siden AI dashboard in MacBook frame"
                    fill
                    className="object-contain"
                    quality={100}
                    priority
                  />
                  {/* Gradient fade overlay at the bottom */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(18, 18, 18, 0) 0%, rgba(18, 18, 18, 1) 100%)',
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
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
        </section>

        {/* Powerful Integrations Section */}
        <section className="py-32 bg-[#121212] w-full max-w-full overflow-hidden">
          <div className="container mx-auto px-50">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4"><span className="effortlessly-text"> Powerful Integrations</span></h2>
              <p className="text-lg text-[#AAAAAA]">
                Connect your agent team to your favorite tools and platforms for seamless workflows
              </p>
            </div>
            
            <div className="max-w-6xl mx-auto">
              {/* Integration cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {/* GitHub Integration */}
                <div className="bg-[#1B1A19] rounded-lg p-6 border border-[#2a2a2a] hover:border-[#6366F1] transition-all duration-300 group h-full flex flex-col">
                  <div className="flex items-start mb-4">
                    <div className="h-16 w-16 mr-4 flex items-center justify-center">
                      <svg className="w-14 h-14 text-white" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M512 0C229.12 0 0 229.12 0 512C0 738.56 146.56 929.92 350.08 997.76C375.68 1002.24 385.28 986.88 385.28 973.44C385.28 961.28 384.64 920.96 384.64 878.08C256 901.76 222.72 846.72 212.48 817.92C206.72 803.2 181.76 757.76 160 745.6C142.08 736 116.48 712.32 159.36 711.68C199.68 711.04 228.48 748.8 238.08 764.16C284.16 841.6 357.76 819.84 387.2 806.4C391.68 773.12 405.12 751.36 419.84 738.56C305.92 725.76 186.88 681.6 186.88 485.76C186.88 429.44 206.72 383.36 239.36 347.52C234.24 334.72 216.32 282.24 244.48 211.84C244.48 211.84 287.36 198.4 385.28 264.32C426.24 252.8 469.76 247.04 513.28 247.04C556.8 247.04 600.32 252.8 641.28 264.32C739.2 197.76 782.08 211.84 782.08 211.84C810.24 282.24 792.32 334.72 787.2 347.52C819.84 383.36 839.68 428.8 839.68 485.76C839.68 682.24 720 725.76 606.08 738.56C624.64 754.56 640.64 785.28C640.64 833.28C640.64 901.76 640 956.16 640 973.44C640 986.88 649.6 1002.88 675.2 997.76C877.44 929.92 1024 737.92 1024 512C1024 229.12 794.88 0 512 0Z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-[#6366F1]">GitHub</h3>
                      <p className="text-sm text-[#AAAAAA]">Code & Version Control</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-[#AAAAAA]">Enable your agents to manage repositories, create pull requests, and review code changes autonomously.</p>
                  </div>
                </div>

                {/* Slack Integration */}
                <div className="bg-[#1B1A19] rounded-lg p-6 border border-[#2a2a2a] hover:border-[#6366F1] transition-all duration-300 group h-full flex flex-col">
                  <div className="flex items-start mb-4">
                    <div className="h-16 w-16 mr-4 flex items-center justify-center">
                      <svg className="w-14 h-14" viewBox="0 0 2447.6 2452.5" xmlns="http://www.w3.org/2000/svg">
                        <g clipRule="evenodd" fillRule="evenodd">
                          <path d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z" fill="#36c5f0"/>
                          <path d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z" fill="#2eb67d"/>
                          <path d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z" fill="#ecb22e"/>
                          <path d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0" fill="#e01e5a"/>
                        </g>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-[#6366F1]">Slack</h3>
                      <p className="text-sm text-[#AAAAAA]">Team Communication</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-[#AAAAAA]">Let your agents communicate directly with your team in Slack channels, providing updates and responding to requests.</p>
                  </div>
                </div>

                {/* Google Integration */}
                <div className="bg-[#1B1A19] rounded-lg p-6 border border-[#2a2a2a] hover:border-[#6366F1] transition-all duration-300 group h-full flex flex-col">
                  <div className="flex items-start mb-4">
                    <div className="h-16 w-16 mr-4 flex items-center justify-center">
                      <svg className="w-14 h-14" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                        <g id="_x31__stroke">
                          <g id="Google">
                            <path clipRule="evenodd" d="M27.585,64c0-4.157,0.69-8.143,1.923-11.881L7.938,35.648    C3.734,44.183,1.366,53.801,1.366,64c0,10.191,2.366,19.802,6.563,28.332l21.558-16.503C28.266,72.108,27.585,68.137,27.585,64" fill="#FBBC05" fillRule="evenodd"/>
                            <path clipRule="evenodd" d="M65.457,26.182c9.031,0,17.188,3.2,23.597,8.436L107.698,16    C96.337,6.109,81.771,0,65.457,0C40.129,0,18.361,14.484,7.938,35.648l21.569,16.471C34.477,37.033,48.644,26.182,65.457,26.182" fill="#EA4335" fillRule="evenodd"/>
                            <path clipRule="evenodd" d="M65.457,101.818c-16.812,0-30.979-10.851-35.949-25.937    L7.938,92.349C18.361,113.516,40.129,128,65.457,128c15.632,0,30.557-5.551,41.758-15.951L86.741,96.221    C80.964,99.86,73.689,101.818,65.457,101.818" fill="#34A853" fillRule="evenodd"/>
                            <path clipRule="evenodd" d="M126.634,64c0-3.782-0.583-7.855-1.457-11.636H65.457v24.727    h34.376c-1.719,8.431-6.397,14.912-13.092,19.13l20.474,15.828C118.981,101.129,126.634,84.861,126.634,64" fill="#4285F4" fillRule="evenodd"/>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-[#6366F1]">Google</h3>
                      <p className="text-sm text-[#AAAAAA]">Docs, Sheets & Calendar</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-[#AAAAAA]">Integrate with Google to let agents draft documents, analyze spreadsheets, and manage schedules.</p>
                  </div>
                </div>

                {/* HubSpot Integration */}
                <div className="bg-[#1B1A19] rounded-lg p-6 border border-[#2a2a2a] hover:border-[#6366F1] transition-all duration-300 group h-full flex flex-col">
                  <div className="flex items-start mb-4">
                    <div className="h-16 w-16 mr-4 flex items-center justify-center">
                      <svg className="w-14 h-14" viewBox="6.20856283 .64498824 244.26943717 251.24701176" xmlns="http://www.w3.org/2000/svg">
                        <path d="m191.385 85.694v-29.506a22.722 22.722 0 0 0 13.101-20.48v-.677c0-12.549-10.173-22.722-22.721-22.722h-.678c-12.549 0-22.722 10.173-22.722 22.722v.677a22.722 22.722 0 0 0 13.101 20.48v29.506a64.342 64.342 0 0 0 -30.594 13.47l-80.922-63.03c.577-2.083.878-4.225.912-6.375a25.6 25.6 0 1 0 -25.633 25.55 25.323 25.323 0 0 0 12.607-3.43l79.685 62.007c-14.65 22.131-14.258 50.974.987 72.7l-24.236 24.243c-1.96-.626-4-.959-6.057-.987-11.607.01-21.01 9.423-21.007 21.03.003 11.606 9.412 21.014 21.018 21.017 11.607.003 21.02-9.4 21.03-21.007a20.747 20.747 0 0 0 -.988-6.056l23.976-23.985c21.423 16.492 50.846 17.913 73.759 3.562 22.912-14.352 34.475-41.446 28.985-67.918-5.49-26.473-26.873-46.734-53.603-50.792m-9.938 97.044a33.17 33.17 0 1 1 0-66.316c17.85.625 32 15.272 32.01 33.134.008 17.86-14.127 32.522-31.977 33.165" fill="#ff7a59"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-[#6366F1]">HubSpot</h3>
                      <p className="text-sm text-[#AAAAAA]">CRM & Marketing</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-[#AAAAAA]">Connect your agents to HubSpot for lead management, customer communication, and marketing campaign analytics.</p>
                  </div>
                </div>
              </div>
              
              {/* Call to action */}
              <div className="mt-16 text-center">
                
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
            
            {/* Removed the three cards that were here */}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}