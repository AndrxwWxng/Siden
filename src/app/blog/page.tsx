'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isInView, setIsInView] = useState(false);
  const blogRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (blogRef.current) {
      observer.observe(blogRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'tutorials', name: 'Tutorials' },
    { id: 'case-studies', name: 'Case Studies' },
    { id: 'product', name: 'Product Updates' },
    { id: 'industry', name: 'Industry News' }
  ];
  
  const featuredPosts = [
    {
      id: 1,
      title: 'Building Multi-Agent Teams: A Comprehensive Guide',
      excerpt: 'Learn how to design, implement, and optimize teams of AI agents that work together to solve complex problems.',
      category: 'tutorials',
      date: 'Jun 12, 2023',
      readTime: '8 min read',
      image: '/blog/blog-1.jpg',
      author: {
        name: 'Sarah Chen',
        avatar: '/team/avatar-1.jpg',
        title: 'AI Research Lead'
      }
    },
    {
      id: 2,
      title: 'How Fintech Company X Increased Efficiency by 300% with AI Agent Teams',
      excerpt: 'An in-depth case study on how a leading fintech company implemented our agent team platform to transform their operations.',
      category: 'case-studies',
      date: 'May 28, 2023',
      readTime: '6 min read',
      image: '/blog/blog-2.jpg',
      author: {
        name: 'Michael Torres',
        avatar: '/team/avatar-2.jpg',
        title: 'Customer Success Manager'
      }
    },
    {
      id: 3,
      title: 'The Future of AI Agent Orchestration: 2023 and Beyond',
      excerpt: 'Our predictions for the evolving landscape of AI agent technologies and how businesses can prepare for upcoming trends.',
      category: 'industry',
      date: 'May 15, 2023',
      readTime: '5 min read',
      image: '/blog/blog-3.jpg',
      author: {
        name: 'Alex Johnson',
        avatar: '/team/avatar-3.jpg',
        title: 'Head of Product'
      }
    },
    {
      id: 4,
      title: 'Introducing Advanced Agent Memory: Our Latest Feature',
      excerpt: 'A deep dive into our new agent memory system that dramatically improves context handling and long-term task execution.',
      category: 'product',
      date: 'May 10, 2023',
      readTime: '4 min read',
      image: '/blog/blog-4.jpg',
      author: {
        name: 'Emma Davis',
        avatar: '/team/avatar-4.jpg',
        title: 'Product Manager'
      }
    },
    {
      id: 5,
      title: 'Optimizing AI Agent Communication Protocols',
      excerpt: 'Technical insights into developing efficient communication systems between collaborative AI agents.',
      category: 'tutorials',
      date: 'Apr 28, 2023',
      readTime: '7 min read',
      image: '/blog/blog-5.jpg',
      author: {
        name: 'James Wilson',
        avatar: '/team/avatar-5.jpg',
        title: 'Senior Engineer'
      }
    },
    {
      id: 6,
      title: 'Healthcare Provider Reduces Patient Wait Times by 40% Using AI Agents',
      excerpt: 'How a major healthcare provider implemented our agent team platform to streamline patient care and reduce wait times.',
      category: 'case-studies',
      date: 'Apr 20, 2023',
      readTime: '6 min read',
      image: '/blog/blog-6.jpg',
      author: {
        name: 'Sophia Lee',
        avatar: '/team/avatar-6.jpg',
        title: 'Healthcare Solutions Specialist'
      }
    }
  ];
  
  // Filter posts based on selected category
  const filteredPosts = selectedCategory === 'all' 
    ? featuredPosts 
    : featuredPosts.filter(post => post.category === selectedCategory);
  
  // Get featured post
  const featuredPost = featuredPosts[0];
  
  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <NavBar />
      
      <main className="flex flex-col flex-grow pt-24">
        {/* Hero Section - Simplified and Modern */}
        <section className="pt-16 pb-20 px-6 relative">
          <div className="container mx-auto max-w-6xl relative">
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight max-w-4xl mx-auto hero-title" style={{ lineHeight: '1.3' }}>
                Insights on AI Agent Teams
              </h1>
              <p className="text-xl text-[#AAAAAA] max-w-2xl mx-auto">
                Tutorials, case studies, and industry insights to help you build better AI agent systems.
              </p>
            </div>
            
            {/* Featured Post - Clean and Minimal */}
            <div className="mb-20 animate-slide-up animate-delay-100">
              <div className="group relative h-[450px] rounded-xl overflow-hidden border border-[#2e2e2e] transition-all duration-300 hover:border-[#6366F1] shadow-md">
                {/* Minimalist gradient for image placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#080808]"></div>
                
                {/* Simple overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#00000070] to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                  <div className="flex flex-col items-start">
                    <span className="px-3 py-1 bg-[#6366F1] rounded-full text-xs font-semibold mb-4 transform translate-y-0 transition-all duration-300">
                      {featuredPost.category}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 transition-colors duration-300">
                      {featuredPost.title}
                    </h2>
                    <p className="text-[#AAAAAA] mb-6 max-w-3xl">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#2e2e2e] mr-4"></div>
                        <div>
                          <div className="font-medium">{featuredPost.author.name}</div>
                          <div className="text-sm text-[#AAAAAA]">{featuredPost.author.title}</div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-[#AAAAAA]">
                        <span>{featuredPost.date}</span>
                        <span className="mx-2">•</span>
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Link href={`/blog/${featuredPost.id}`} className="absolute inset-0 z-10">
                  <span className="sr-only">Read article</span>
                </Link>
              </div>
            </div>
            
            {/* Category Filters - Cleaner Design */}
            <div className="mb-12 flex justify-center animate-slide-up animate-delay-200">
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`py-2 px-5 rounded-md whitespace-nowrap transition-all duration-300 text-sm font-medium ${
                      selectedCategory === category.id 
                        ? 'bg-[#6366F1] text-white shadow-sm' 
                        : 'bg-[#191919] text-[#AAAAAA] hover:text-white hover:bg-[#222]'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Blog Posts Grid - Minimalist Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" ref={blogRef}>
              {filteredPosts.map((post, index) => (
                <div 
                  key={post.id}
                  className={`group bg-[#161616] rounded-xl border border-transparent hover:border-[#6366F1] shadow-sm transition-all duration-300 flex flex-col transform ${
                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="relative h-44 bg-[#0a0a0a] overflow-hidden rounded-t-xl">
                    {/* Minimal gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#161616] to-[#0a0a0a] group-hover:scale-105 transition-transform duration-500"></div>
                    
                    {/* Clean category label */}
                    <div className="absolute top-4 left-4 px-2 py-1 bg-[#6366F1] rounded-md text-xs font-medium">
                      {post.category}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-[#6366F1] transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="text-[#AAAAAA] text-sm mb-4 flex-grow line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex justify-between items-center mt-2 text-xs text-[#888]">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <Link href={`/blog/${post.id}`} className="absolute inset-0">
                    <span className="sr-only">Read article</span>
                  </Link>
                </div>
              ))}
            </div>
            
            {/* Newsletter Signup - Cleaner Design */}
            <div className="mt-16 bg-[#161616] p-8 rounded-xl border border-[#252525] animate-fade-in shadow-sm" style={{ animationDelay: '400ms' }}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="md:w-2/3 md:pr-10">
                  <h3 className="text-xl font-bold mb-2">Subscribe to our newsletter</h3>
                  <p className="text-[#AAAAAA]">
                    Get the latest insights on AI agent technology delivered straight to your inbox.
                  </p>
                </div>
                <div className="md:w-1/3 w-full">
                  <div className="flex">
                    <input 
                      type="email" 
                      placeholder="Your email" 
                      className="flex-grow px-4 py-3 bg-[#121212] border-y border-l border-[#252525] rounded-l-lg focus:outline-none focus:border-[#6366F1] text-white"
                    />
                    <button className="px-5 py-3 bg-[#6366F1] text-white rounded-r-lg hover:bg-[#4F46E5] transition-colors duration-300">
                      Subscribe
                    </button>
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