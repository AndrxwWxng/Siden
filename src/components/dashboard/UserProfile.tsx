import React, { useState, useEffect } from 'react';
import { User } from './types';
import { Settings, HelpCircle, LogOut, ChevronDown } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

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
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoggingOut(false);
    }
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
                <span className="text-sm font-medium text-white leading-tight truncate max-w-[140px]">
                  {userData.username || 'Loading...'}
                </span>
                <span className="text-xs text-[#94A3B8] leading-tight mt-[2px]">{plan}</span>
              </div>
            </div>
            <ChevronDown 
              size={16} 
              className={`text-[#A3A3A3] hover:text-white transition-colors transform ${isOpen ? 'rotate-180' : 'rotate-0'} transition-transform duration-200`} 
            />
          </div>
        )}
      </div>
      
      {/* Dropdown menu - shown when isOpen is true */}
      {isOpen && (
        <div className={`absolute bottom-full ${collapsed ? 'left-0 ml-0' : 'left-0'} mb-2 w-[255px] bg-[#202020] border border-[#313131] rounded-lg shadow-xl z-20`}>
          <div className="p-3">
            <p className="text-xs text-[#94A3B8] mb-2 truncate">{userData.email || 'Loading email...'}</p>
            
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center font-medium mr-3">
                <span className="text-sm">{initials}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white leading-tight truncate max-w-[150px]">
                  {userData.username || 'Loading...'}
                </span>
                <div className="flex items-center mt-[2px]">
                  <span className="text-xs text-[#94A3B8] leading-none">{plan}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-[#313131]">
            <button className="w-full text-left px-4 py-3 text-sm hover:bg-[#252525] transition-colors flex items-center">
              <Settings size={16} className="mr-3 text-[#A3A3A3]" />
              <span>Settings</span>
            </button>
            <div className="flex items-center justify-between px-4 py-3 text-sm hover:bg-[#252525] transition-colors">
              <div className="flex items-center">
                <HelpCircle size={16} className="mr-3 text-[#A3A3A3]" />
                <span>Help & Support</span>
              </div>
              <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded">New</span>
            </div>
          </div>
          
          <div className="border-t border-[#313131]">
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full text-left px-4 py-3 text-sm hover:bg-[#252525] transition-colors flex items-center"
            >
              {isLoggingOut ? (
                <>
                  <svg className="animate-spin mr-3 h-4 w-4 text-[#A3A3A3]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing out...</span>
                </>
              ) : (
                <>
                  <LogOut size={16} className="mr-3 text-[#A3A3A3]" />
                  <span>Sign out</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 