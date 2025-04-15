"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="relative flex items-center gap-2 rounded-lg bg-[#21212B] px-4 py-2.5 text-[#DADADA] hover:bg-[#2A2A36] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#1B1A19] disabled:opacity-60 overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/40 to-indigo-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      {isLoading ? (
        <span className="flex items-center gap-2 relative z-10">
          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm font-medium">Signing out...</span>
        </span>
      ) : (
        <>
          <LogOut size={16} strokeWidth={2} className="text-indigo-400 relative z-10 group-hover:translate-x-0.5 transition-transform duration-300" />
          <span className="text-sm font-medium relative z-10 group-hover:text-white transition-colors duration-300">Sign out</span>
        </>
      )}
    </button>
  );
}
