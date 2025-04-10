'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`relative ${sizeClasses[size]} mr-2 bg-[#6366F1] rounded-md overflow-hidden flex items-center justify-center`}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
        >
          <circle cx="12" cy="12" r="3" fill="white" />
          <path 
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" 
            fill="white" 
          />
          <path 
            d="M18 12L12 12" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
          />
          <path 
            d="M12 6V12" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
          />
          <path 
            d="M12 18V15" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
          />
        </svg>
      </div>
      <div className="flex items-center text-white font-bold">
        <span className="text-[#6366F1]">Agent</span>
        <span>Team</span>
      </div>
    </div>
  );
} 