"use client";

import React, { useState, useEffect } from 'react';
import { Settings, BellRing, ArrowLeft } from 'lucide-react';
import { UserService, UserSettings } from '@/services/userService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const router = useRouter();

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
      
      // Update settings - only email notifications, theme is always dark
      const success = await UserService.updateUserSettings({
        theme: 'dark', // Force dark theme
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