'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  return (
    <nav 
      className={`
        fixed top-0 left-0 right-0 z-50 h-[72px] w-full max-w-[100vw]
        ${isScrolled 
          ? 'bg-[#121212]/80 backdrop-blur-md border-b border-[#2e2e2e]' 
          : 'bg-transparent'}
        transition-all duration-300
      `}
    >
      <div className="container mx-auto h-full px-50 max-w-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center group"
          >
            <div className="relative overflow-hidden">
              <Logo size="md" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1]/0 via-[#6366F1]/30 to-[#6366F1]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover:translate-x-full"></div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="/features" active={pathname === '/features'}>Features</NavLink>
            <NavLink href="/pricing" active={pathname === '/pricing'}>Pricing</NavLink>
            <NavLink href="/docs" active={pathname === '/docs'}>Documentation</NavLink>
            <NavLink href="/blog" active={pathname === '/blog'}>Blog</NavLink>
          </div>
          
          {/* Authentication/CTA */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/login" 
              className="px-4 py-2 text-[#AAAAAA] hover:text-white transition-all duration-300 relative group"
            >
              <span>Log in</span>
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#6366F1] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
            <Link 
              href="/dashboard" 
              className="px-6 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-md transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:-translate-y-[2px]"
            >
              Start building
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              className="text-white p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative w-6 h-6">
                <span 
                  className={`absolute h-0.5 bg-white transition-all duration-300 transform ${
                    isMobileMenuOpen 
                      ? 'rotate-45 top-3' 
                      : 'top-1.5'
                  } left-0 right-0`}
                ></span>
                <span 
                  className={`absolute h-0.5 bg-white transition-all duration-300 transform ${
                    isMobileMenuOpen 
                      ? 'opacity-0' 
                      : 'opacity-100'
                  } top-3 left-0 right-0`}
                ></span>
                <span 
                  className={`absolute h-0.5 bg-white transition-all duration-300 transform ${
                    isMobileMenuOpen 
                      ? '-rotate-45 top-3' 
                      : 'top-4.5'
                  } left-0 right-0`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`
          md:hidden fixed inset-x-0 z-40 bg-[#121212]/95 backdrop-blur-lg border-b border-[#2e2e2e]
          transform transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-y-[72px] opacity-100' : '-translate-y-full opacity-0'}
        `}
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col space-y-4 mb-6">
            <MobileNavLink href="/features" onClick={() => setIsMobileMenuOpen(false)}>Features</MobileNavLink>
            <MobileNavLink href="/pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</MobileNavLink>
            <MobileNavLink href="/docs" onClick={() => setIsMobileMenuOpen(false)}>Documentation</MobileNavLink>
            <MobileNavLink href="/blog" onClick={() => setIsMobileMenuOpen(false)}>Blog</MobileNavLink>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Link 
              href="/login" 
              className="w-full px-4 py-3 border border-[#2e2e2e] text-center rounded-md hover:border-[#6366F1] transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Log in
            </Link>
            <Link 
              href="/dashboard" 
              className="w-full px-4 py-3 bg-[#6366F1] text-white text-center rounded-md hover:bg-[#4F46E5] transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Start building
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

function NavLink({ href, children, active }: NavLinkProps) {
  return (
    <Link 
      href={href} 
      className={`
        px-4 py-2 relative group rounded-md overflow-hidden
        transition-all duration-300
        ${active 
          ? 'text-white' 
          : 'text-[#AAAAAA] hover:text-white'
        }
      `}
    >
      <span className="relative z-10">{children}</span>
      {active && (
        <span className="absolute inset-0 bg-[#6366F1]/10 rounded-md"></span>
      )}
      <span 
        className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left bg-[#6366F1]/10 rounded-md"
        style={{ display: active ? 'none' : 'block' }}
      ></span>
    </Link>
  );
}

interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}

function MobileNavLink({ href, children, onClick }: MobileNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href} 
      className={`
        w-full px-4 py-3 flex items-center rounded-md transition-all duration-300
        ${isActive 
          ? 'text-white bg-[#6366F1]/10 font-medium' 
          : 'text-[#AAAAAA] hover:text-white hover:bg-[#2a2a2a]'
        }
      `}
      onClick={onClick}
    >
      <span>{children}</span>
      {isActive && (
        <span className="ml-auto">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM7 11.4L3.6 8L5 6.6L7 8.6L11 4.6L12.4 6L7 11.4Z" fill="#6366F1" />
          </svg>
        </span>
      )}
    </Link>
  );
}