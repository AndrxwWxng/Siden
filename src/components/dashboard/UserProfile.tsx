import React from 'react';
import { User } from './types';
import { Settings, HelpCircle, LogOut, ChevronDown } from 'lucide-react';

interface UserProfileProps extends Partial<User> {
  username: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  username = 'Kendall Booker', 
  email = 'kendallbooker3@gmail.com', 
  plan = 'Professional plan' 
}) => {
  return (
    <div className="rounded-lg hover:bg-[#202020] transition-colors p-2 cursor-pointer relative group">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-9 h-9 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-medium mr-3">
            {username.split(' ').map(name => name[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{username}</p>
            <p className="text-xs text-[#A3A3A3]">{plan}</p>
          </div>
        </div>
        <ChevronDown size={16} className="text-[#A3A3A3] group-hover:text-white transition-colors" />
      </div>
      
      {/* Dropdown menu - hidden by default, shown on hover/click */}
      <div className="absolute bottom-full left-0 mb-2 w-72 bg-[#202020] border border-[#313131] rounded-lg shadow-xl hidden group-hover:block z-20">
        <div className="p-4">
          <p className="text-sm text-[#A3A3A3] mb-2">{email}</p>
          <div className="flex items-center p-3 bg-[#161616] rounded-lg mb-2">
            <div className="w-10 h-10 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-medium mr-3">
              {username.split(' ').map(name => name[0]).join('')}
            </div>
            <div>
              <p className="text-sm font-medium">Personal</p>
              <p className="text-xs text-[#A3A3A3] flex items-center">
                Pro plan
                <span className="ml-2 h-4 w-4 rounded-full bg-[#6366F1] flex items-center justify-center">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </p>
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
            <span className="text-xs bg-[#6366F1] text-white px-2 py-0.5 rounded">New</span>
          </div>
        </div>
        
        <div className="border-t border-[#313131]">
          <button className="w-full text-left px-4 py-3 text-sm hover:bg-[#252525] transition-colors flex items-center">
            <LogOut size={16} className="mr-3 text-[#A3A3A3]" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 