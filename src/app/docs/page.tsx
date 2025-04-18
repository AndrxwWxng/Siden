'use client';

import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <NavBar />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="mb-6 inline-block">
            <div className="w-16 h-16 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12L15 15" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="9" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
          <p className="text-[#AAAAAA] max-w-md mx-auto">
            Our documentation is being updated. Check back soon for comprehensive guides and tutorials.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 