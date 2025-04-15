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
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });
    
    // Cleanup subscription when component unmounts
    return () => {
      subscription.unsubscribe();
    };
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
          className="relative overflow-hidden px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg transition-all duration-300 hover:shadow-lg group"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/40 to-indigo-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative z-10 font-medium">Dashboard</span>
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
        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
      </Link>
      <Link 
        href="/signup" 
        className="relative overflow-hidden px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg transition-all duration-300 hover:shadow-lg group"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/40 to-indigo-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        <span className="relative z-10 font-medium">Start building</span>
      </Link>
    </>
  );
}
