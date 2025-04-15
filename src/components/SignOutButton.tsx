"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      className="px-4 py-2 text-[#AAAAAA] hover:text-white transition-all duration-300 relative group"
    >
      <span>{isLoading ? 'Signing out...' : 'Sign out'}</span>
      <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#6366F1] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
    </button>
  );
}
