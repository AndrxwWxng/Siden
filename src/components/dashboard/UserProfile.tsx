import React, { useState } from 'react';
import { User } from './types';
import { Settings, HelpCircle, LogOut, ChevronDown } from 'lucide-react';

interface UserProfileProps extends Partial<User> {
  username: string;
  collapsed?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  username = 'Kendall Booker', 
  email = 'kendallbooker3@gmail.com', 
  plan = 'Professional plan',
  collapsed = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg hover:bg-[#202020] transition-colors p-2 cursor-pointer"
      >
        {collapsed ? (
          <div className="flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-[#6366F1] text-white flex items-center justify-center">
              <span className="text-sm font-medium">{username.split(' ').map(name => name[0]).join('')}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-[#6366F1] text-white flex items-center justify-center mr-3">
                <span className="text-sm font-medium">{username.split(' ').map(name => name[0]).join('')}</span>
              </div>
              <div className="flex-col flex">
                <span className="text-sm font-medium text-white leading-tight">{username}</span>
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
            <p className="text-xs text-[#94A3B8] mb-2">{email}</p>
            
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-medium mr-3">
                <span className="text-sm">{username.split(' ').map(name => name[0]).join('')}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white leading-tight">Personal</span>
                <div className="flex items-center mt-[2px]">
                  <span className="text-xs text-[#94A3B8] leading-none">Pro plan</span>

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
      )}
    </div>
  );
};

export default UserProfile; 