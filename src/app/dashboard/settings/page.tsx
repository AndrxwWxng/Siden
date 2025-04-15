"use client";

import React, { useState, useEffect } from 'react';
import { Settings, BellRing, Moon, ArrowLeft } from 'lucide-react';
import { UserService, UserSettings } from '@/services/userService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const router = useRouter();

  // Load user settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const userSettings = await UserService.getUserSettings();
        
        if (userSettings) {
          setSettings(userSettings);
          setTheme(userSettings.theme || 'dark');
          setEmailNotifications(userSettings.email_notifications);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Update settings
      const success = await UserService.updateUserSettings({
        theme,
        email_notifications: emailNotifications
      });
      
      if (success) {
        // Show success message or redirect
        router.refresh();
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#151515] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/dashboard" className="mr-4 p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-semibold text-white">Settings</h1>
        </div>
        
        {loading ? (
          <div className="bg-[#1E1E1E] rounded-xl p-8 flex justify-center">
            <div className="w-8 h-8 border-t-2 border-indigo-500 border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="bg-[#1E1E1E] rounded-xl overflow-hidden mb-6">
              <div className="p-6 border-b border-[#2A2A2A] flex items-center">
                <Settings size={20} className="text-indigo-500 mr-3" />
                <h2 className="text-xl font-medium text-white">Preferences</h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Theme */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Moon size={18} className="text-indigo-400 mr-3" />
                      <label className="text-white font-medium">Theme</label>
                    </div>
                    
                    <div className="relative inline-flex">
                      <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="appearance-none bg-[#252525] border border-[#313131] text-white text-sm rounded-md px-4 py-2 pr-8 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="system">System</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                        <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[#94A3B8] ml-7">
                    Choose your preferred theme
                  </p>
                </div>
                
                {/* Email Notifications */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <BellRing size={18} className="text-indigo-400 mr-3" />
                      <label className="text-white font-medium">Email Notifications</label>
                    </div>
                    
                    <div 
                      className="relative inline-block w-12 h-6 rounded-full bg-[#252525] cursor-pointer"
                      onClick={() => setEmailNotifications(!emailNotifications)}
                    >
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={emailNotifications}
                        onChange={() => setEmailNotifications(!emailNotifications)}
                      />
                      <span 
                        className={`absolute left-1 top-1 bottom-1 w-4 rounded-full transition-transform transform ${
                          emailNotifications ? 'translate-x-6 bg-indigo-500' : 'translate-x-0 bg-[#6B7280]'
                        }`}
                      ></span>
                    </div>
                  </div>
                  <p className="text-sm text-[#94A3B8] ml-7">
                    Receive email notifications about project updates and system alerts
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium flex items-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/30 to-indigo-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {saving ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-white rounded-full"></div>
                    <span className="relative z-10">Saving...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Save Preferences</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 