'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
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
      title: 'Introducing Advanced Analytics for Agent Teams',
      excerpt: 'Our latest platform update brings powerful analytics capabilities to help you understand and optimize your AI agent teams.',
      category: 'product',
      date: 'May 15, 2023',
      readTime: '4 min read',
      image: '/blog/blog-3.jpg',
      author: {
        name: 'Emma Wilson',
        avatar: '/team/avatar-3.jpg',
        title: 'Product Manager'
      }
    }
  ];
  
  const recentPosts = [
    {
      id: 4,
      title: 'The Future of Work: How AI Agent Teams Are Reshaping Industries',
      excerpt: 'Explore how AI agent teams are transforming various industries and what this means for the future of work.',
      category: 'industry',
      date: 'Jun 8, 2023',
      readTime: '7 min read',
      image: '/blog/blog-4.jpg',
      author: {
        name: 'David Kim',
        avatar: '/team/avatar-4.jpg',
        title: 'Content Strategist'
      }
    },
    {
      id: 5,
      title: 'Best Practices for Prompt Engineering in Multi-Agent Systems',
      excerpt: 'Learn advanced techniques for crafting effective prompts that help your agents collaborate efficiently.',
      category: 'tutorials',
      date: 'Jun 3, 2023',
      readTime: '10 min read',
      image: '/blog/blog-5.jpg',
      author: {
        name: 'Alex Johnson',
        avatar: '/team/avatar-5.jpg',
        title: 'AI Engineer'
      }
    },
    {
      id: 6,
      title: 'New Integration: Connect Your Agent Teams with Slack',
      excerpt: 'Our new Slack integration allows you to interact with your AI agent teams directly from your workspace.',
      category: 'product',
      date: 'May 30, 2023',
      readTime: '3 min read',
      image: '/blog/blog-6.jpg',
      author: {
        name: 'Emma Wilson',
        avatar: '/team/avatar-3.jpg',
        title: 'Product Manager'
      }
    },
    {
      id: 7,
      title: 'E-commerce Giant Reduces Customer Service Response Time by 80%',
      excerpt: 'How a leading e-commerce company used our platform to revolutionize their customer service operations.',
      category: 'case-studies',
      date: 'May 22, 2023',
      readTime: '5 min read',
      image: '/blog/blog-7.jpg',
      author: {
        name: 'Michael Torres',
        avatar: '/team/avatar-2.jpg',
        title: 'Customer Success Manager'
      }
    },
    {
      id: 8,
      title: 'The Role of AI Agents in Enterprise Digital Transformation',
      excerpt: 'A comprehensive analysis of how AI agent teams fit into broader digital transformation strategies.',
      category: 'industry',
      date: 'May 18, 2023',
      readTime: '9 min read',
      image: '/blog/blog-8.jpg',
      author: {
        name: 'David Kim',
        avatar: '/team/avatar-4.jpg',
        title: 'Content Strategist'
      }
    },
    {
      id: 9,
      title: 'Tutorial: Creating Your First Autonomous Agent Workflow',
      excerpt: 'A step-by-step guide to building your first fully autonomous workflow with multiple specialized agents.',
      category: 'tutorials',
      date: 'May 12, 2023',
      readTime: '12 min read',
      image: '/blog/blog-9.jpg',
      author: {
        name: 'Sarah Chen',
        avatar: '/team/avatar-1.jpg',
        title: 'AI Research Lead'
      }
    }
  ];
  
  const filteredPosts = selectedCategory === 'all' 
    ? recentPosts 
    : recentPosts.filter(post => post.category === selectedCategory);
  
  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <NavBar />
      
      <main className="flex flex-col flex-grow pt-24">
        {/* Hero Section */}
        <section className="pt-16 pb-24 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <div className="inline-block py-1 px-3 bg-[#6366F1]/10 rounded-full text-[#6366F1] text-sm font-semibold mb-4">
                Our Blog
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight max-w-4xl mx-auto">
                Insights on AI Agent Teams & Orchestration
              </h1>
              <p className="text-xl text-[#AAAAAA] max-w-2xl mx-auto">
                Tutorials, case studies, and industry insights to help you build better AI agent systems.
              </p>
            </div>
            
            {/* Featured Posts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
              {featuredPosts.map((post, index) => (
                <Link key={post.id} href={`/blog/${post.id}`} className="block group">
                  <div className="bg-[#171717] border border-[#2e2e2e] rounded-xl overflow-hidden hover:border-[#6366F1]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#6366F1]/5 h-full flex flex-col">
                    <div className="relative h-48 bg-[#1a1a1a]">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212] opacity-50 z-10"></div>
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 bg-[#6366F1] text-white text-xs rounded-full">
                          {categories.find(cat => cat.id === post.category)?.name}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-[#6366F1] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-[#AAAAAA] mb-4 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#252525] mr-3"></div>
                          <div>
                            <div className="text-sm font-medium">{post.author.name}</div>
                            <div className="text-xs text-[#AAAAAA]">{post.author.title}</div>
                          </div>
                        </div>
                        <div className="text-xs text-[#AAAAAA]">{post.date} · {post.readTime}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Category Filter */}
            <div className="flex justify-center mb-12 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex p-1 bg-[#1a1a1a] rounded-full border border-[#2e2e2e] space-x-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`py-2 px-5 rounded-full whitespace-nowrap transition-all duration-200 ${
                      selectedCategory === category.id 
                        ? 'bg-[#6366F1] text-white' 
                        : 'text-[#AAAAAA] hover:text-white'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Recent Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`} className="block group">
                  <div className="bg-[#171717] border border-[#2e2e2e] rounded-xl overflow-hidden hover:border-[#6366F1]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#6366F1]/5 h-full flex flex-col">
                    <div className="relative h-48 bg-[#1a1a1a]">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212] opacity-50 z-10"></div>
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 bg-[#6366F1] text-white text-xs rounded-full">
                          {categories.find(cat => cat.id === post.category)?.name}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-[#6366F1] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-[#AAAAAA] mb-4 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#252525] mr-3"></div>
                          <div>
                            <div className="text-sm font-medium">{post.author.name}</div>
                            <div className="text-xs text-[#AAAAAA]">{post.author.title}</div>
                          </div>
                        </div>
                        <div className="text-xs text-[#AAAAAA]">{post.date} · {post.readTime}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Newsletter Section */}
            <div className="mt-24 bg-gradient-to-br from-[#1a1a1a] to-[#131313] rounded-2xl p-12 border border-[#2e2e2e] shadow-xl">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay updated with our latest insights</h2>
                <p className="text-lg text-[#AAAAAA] mb-8">
                  Subscribe to our newsletter to receive the latest articles, tutorials, and product updates.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-grow py-3 px-4 bg-[#0D0D0D] border border-[#2e2e2e] rounded-lg focus:outline-none focus:border-[#6366F1]"
                  />
                  <button className="py-3 px-6 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium rounded-lg transition-all duration-200">
                    Subscribe
                  </button>
                </div>
                <div className="text-xs text-[#777777] mt-4">
                  We respect your privacy. Unsubscribe at any time.
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