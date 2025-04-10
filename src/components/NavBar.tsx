'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav 
      className={`
        fixed top-0 left-0 right-0 z-50 h-[72px]
        ${isScrolled ? 'bg-[#121212]/90 backdrop-blur-sm border-b border-[#2e2e2e]' : 'bg-transparent'}
        transition-all duration-300
      `}
    >
      <div className="container mx-auto h-full px-6">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo size="md" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/features">Features</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="/docs">Documentation</NavLink>
            <NavLink href="/blog">Blog</NavLink>
          </div>
          
          {/* Authentication/CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login" 
              className="px-4 py-2 text-[#AAAAAA] hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link 
              href="/dashboard" 
              className="px-5 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded transition-colors"
            >
              Start building
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              className="text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#121212] border-b border-[#2e2e2e]">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col space-y-3 mb-4">
              <MobileNavLink href="/features" onClick={() => setIsMobileMenuOpen(false)}>Features</MobileNavLink>
              <MobileNavLink href="/pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</MobileNavLink>
              <MobileNavLink href="/docs" onClick={() => setIsMobileMenuOpen(false)}>Documentation</MobileNavLink>
              <MobileNavLink href="/blog" onClick={() => setIsMobileMenuOpen(false)}>Blog</MobileNavLink>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Link 
                href="/login" 
                className="w-full px-4 py-2 border border-[#2e2e2e] text-center rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link 
                href="/dashboard" 
                className="w-full px-4 py-2 bg-[#6366F1] text-white text-center rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Start building
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

function NavLink({ href, children }: NavLinkProps) {
  return (
    <Link 
      href={href} 
      className="px-4 py-2 text-[#AAAAAA] hover:text-white transition-colors rounded-md"
    >
      {children}
    </Link>
  );
}

interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}

function MobileNavLink({ href, children, onClick }: MobileNavLinkProps) {
  return (
    <Link 
      href={href} 
      className="w-full px-4 py-2 text-[#AAAAAA] hover:text-white transition-colors"
      onClick={onClick}
    >
      {children}
    </Link>
  );
} 