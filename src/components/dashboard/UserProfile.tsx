import React, { useState, useEffect } from 'react';
import { User } from './types';
import { Settings, HelpCircle, LogOut, ChevronDown, User as UserIcon, Moon, Sun } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

interface UserProfileProps extends Partial<User> {
  username?: string;
  collapsed?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  username, 
  email,
  plan = 'Free plan',
  collapsed = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState<{username?: string, email?: string}>({
    username,
    email
  });
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    async function getUserData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Use user metadata for name if available, otherwise create initials from email
        const displayName = user.user_metadata?.name || 
                           user.user_metadata?.full_name || 
                           (user.email ? user.email.split('@')[0] : 'User');
        
        setUserData({
          username: displayName,
          email: user.email
        });
      }
    }
    
    getUserData();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      
      // Sign out directly with Supabase
      await supabase.auth.signOut();
      
      // Refresh router for server components
      router.refresh();
      
      // Full page reload to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Generate initials from username
  const initials = userData.username
    ? userData.username.split(' ').map(name => name[0]).join('')
    : userData.email
      ? userData.email[0].toUpperCase()
      : 'U';

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg hover:bg-[#202020] transition-colors p-2 cursor-pointer"
      >
        {collapsed ? (
          <div className="flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center">
              <span className="text-sm font-medium">{initials}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center mr-3">
                <span className="text-sm font-medium">{initials}</span>
              </div>
              <div className="flex-col flex">
                <span className="text-sm font-medium text-app-primary leading-tight truncate max-w-[140px]">
                  {userData.username || 'Loading...'}
                </span>
                <span className="text-xs text-app-secondary leading-tight mt-[2px]">{plan}</span>
              </div>
            </div>
            <ChevronDown 
              size={16} 
              className={`text-app-secondary hover:text-app-primary transition-colors transform ${isOpen ? 'rotate-180' : 'rotate-0'} transition-transform duration-200`} 
            />
          </div>
        )}
      </div>
      
      {/* Dropdown menu - shown when isOpen is true */}
      {isOpen && (
        <div className={`absolute bottom-full ${collapsed ? 'left-0 ml-0' : 'left-0'} mb-2 w-[270px] bg-app-primary border border-app-color rounded-lg shadow-xl z-20`}>
          <div className="p-4">
            <p className="text-xs text-app-secondary mb-2 truncate">{userData.email || 'Loading email...'}</p>
            
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center font-medium mr-3">
                <span className="text-sm">{initials}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm font-medium text-app-primary leading-tight truncate max-w-[170px]">
                  {userData.username || 'Loading...'}
                </span>
                <div className="flex items-center mt-[2px]">
                  <span className="text-xs text-app-secondary leading-none">{plan}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-app-color">
            <Link href="/dashboard/account" className="w-full text-left px-4 py-3 text-sm hover:bg-[#252525] transition-colors flex items-center">
              <UserIcon size={16} className="mr-3 text-app-secondary" />
              <span>My Account</span>
            </Link>
            <Link href="/dashboard/settings" className="w-full text-left px-4 py-3 text-sm hover:bg-[#252525] transition-colors flex items-center">
              <Settings size={16} className="mr-3 text-app-secondary" />
              <span>Settings</span>
            </Link>
            <button 
              onClick={toggleTheme}
              className="w-full text-left px-4 py-3 text-sm hover:bg-app-tertiary transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center">
                {resolvedTheme === 'dark' ? (
                  <Moon size={16} className="mr-3 text-app-secondary" />
                ) : (
                  <Sun size={16} className="mr-3 text-amber-500" />
                )}
                <span>{resolvedTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              <div className={`relative inline-block w-10 h-5 rounded-full transition-colors duration-300 ${
                resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-indigo-100'
              }`}>
                <span 
                  className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full transition-transform duration-300 transform ${
                    resolvedTheme === 'light' ? 'translate-x-5 bg-indigo-600' : 'translate-x-0 bg-indigo-400'
                  }`}
                ></span>
              </div>
            </button>
            <div className="flex items-center justify-between px-4 py-3 text-sm hover:bg-[#252525] transition-colors">
              <div className="flex items-center">
                <HelpCircle size={16} className="mr-3 text-app-secondary" />
                <span>Help & Support</span>
              </div>
              <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded">New</span>
            </div>
          </div>
          
          <div className="border-t border-app-color p-3">
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg transition-all flex items-center justify-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/30 to-indigo-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {isLoggingOut ? (
                <div className="flex items-center justify-center relative z-10">
                  <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="font-medium">Signing out...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center relative z-10">
                  <LogOut size={16} className="mr-2" />
                  <span className="font-medium">Sign out</span>
                </div>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 