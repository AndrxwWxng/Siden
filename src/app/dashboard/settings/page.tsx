"use client";

import React, { useState, useEffect } from 'react';
import { Settings, BellRing, Moon, ArrowLeft } from 'lucide-react';
import { UserService, UserSettings } from '@/services/userService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Load user settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const userSettings = await UserService.getUserSettings();
        
        if (userSettings) {
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
    <div className="min-h-screen bg-app-secondary p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/dashboard" className="mr-4 p-2 rounded-lg hover:bg-app-tertiary transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-semibold text-app-primary">Settings</h1>
        </div>
        
        {loading ? (
          <div className="bg-app-primary rounded-xl p-8 flex justify-center">
            <div className="w-8 h-8 border-t-2 border-indigo-500 border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="bg-app-primary rounded-xl overflow-hidden mb-6">
              <div className="p-6 border-b border-app-color flex items-center">
                <Settings size={20} className="text-indigo-500 mr-3" />
                <h2 className="text-xl font-medium text-app-primary">Preferences</h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Theme */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Moon size={18} className="text-indigo-400 mr-3" />
                      <label className="text-app-primary font-medium">Theme</label>
                    </div>
                    
                    <div className="relative inline-flex">
                      <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value as any)}
                        className="appearance-none bg-app-tertiary border border-app-color text-app-primary text-sm rounded-md px-4 py-2 pr-8 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="system">System</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-app-primary">
                        <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-app-secondary ml-7">
                    Choose your preferred theme
                  </p>
                </div>
                
                {/* Email Notifications */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <BellRing size={18} className="text-indigo-400 mr-3" />
                      <label className="text-app-primary font-medium">Email Notifications</label>
                    </div>
                    
                    <div 
                      className="relative inline-block w-12 h-6 rounded-full bg-app-tertiary cursor-pointer"
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
                  <p className="text-sm text-app-secondary ml-7">
                    Receive email notifications about project updates and system alerts
                  </p>
                </div>
                
                {/* Save Button */}
                <div className="pt-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded transition-colors flex items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Settings</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 