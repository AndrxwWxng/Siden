"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import SignOutButton from './SignOutButton';

export default function AuthStatus() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  if (isLoading) {
    return (
      <div className="h-5 w-20 animate-pulse rounded bg-gray-200"></div>
    );
  }
  
  if (isAuthenticated) {
    return (
      <>
        <SignOutButton />
        <Link 
          href="/dashboard" 
          className="px-6 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-md transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:-translate-y-[2px]"
        >
          Dashboard
        </Link>
      </>
    );
  }
  
  return (
    <>
      <Link 
        href="/signin" 
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
    </>
  );
}
