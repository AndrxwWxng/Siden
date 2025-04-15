"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Settings, User, Mail, Globe, Camera, Save, ArrowLeft } from 'lucide-react';
import { UserService, UserProfile } from '@/services/userService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AccountPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const userProfile = await UserService.getCurrentUserProfile();
        
        if (userProfile) {
          setProfile(userProfile);
          setUsername(userProfile.username || '');
          setFullName(userProfile.full_name || '');
          setWebsite(userProfile.website || '');
          setAvatarUrl(userProfile.avatar_url || '');
        }
        
        // Get user email
        const supabase = (await import('@/utils/supabase/client')).createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setEmail(user.email || '');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, []);

  const handleAvatarUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Upload avatar if changed
      if (avatarFile) {
        const newAvatarUrl = await UserService.uploadAvatar(avatarFile);
        if (newAvatarUrl) {
          setAvatarUrl(newAvatarUrl);
        }
      }
      
      // Update profile
      const success = await UserService.updateUserProfile({
        username,
        full_name: fullName,
        website,
        avatar_url: avatarUrl
      });
      
      if (success) {
        // Show success message or redirect
        router.refresh();
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  // Generate initials for the avatar
  const initials = fullName 
    ? fullName.split(' ').map(name => name[0]).join('').toUpperCase()
    : username
      ? username[0].toUpperCase()
      : email
        ? email[0].toUpperCase()
        : 'U';

  return (
    <div className="min-h-screen bg-[#151515] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/dashboard" className="mr-4 p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-semibold text-white">Account Settings</h1>
        </div>
        
        {loading ? (
          <div className="bg-[#1E1E1E] rounded-xl p-8 flex justify-center">
            <div className="w-8 h-8 border-t-2 border-indigo-500 border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="bg-[#1E1E1E] rounded-xl overflow-hidden mb-6">
              <div className="p-6 border-b border-[#2A2A2A] flex items-center">
                <User size={20} className="text-indigo-500 mr-3" />
                <h2 className="text-xl font-medium text-white">Profile Information</h2>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-8 items-start">
                  {/* Avatar */}
                  <div className="flex flex-col items-center">
                    <div 
                      className="relative group cursor-pointer mb-4" 
                      onClick={handleAvatarUpload}
                    >
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold">
                        {avatarUrl ? (
                          <img 
                            src={avatarUrl} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{initials}</span>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera size={20} />
                      </div>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*"
                    />
                    <button 
                      onClick={handleAvatarUpload}
                      className="text-sm text-indigo-400 hover:text-indigo-300"
                    >
                      Change Avatar
                    </button>
                  </div>
                  
                  {/* Form */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-[#94A3B8]">
                        Username
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-3 text-[#6B7280]" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-[#252525] border border-[#313131] rounded-md focus:outline-none focus:border-indigo-500 text-white"
                          placeholder="Username"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-[#94A3B8]">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-2 bg-[#252525] border border-[#313131] rounded-md focus:outline-none focus:border-indigo-500 text-white"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-[#94A3B8]">
                        Email
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-3 text-[#6B7280]" />
                        <input
                          type="email"
                          value={email}
                          disabled
                          className="w-full pl-10 pr-4 py-2 bg-[#252525] border border-[#313131] rounded-md focus:outline-none focus:border-indigo-500 text-white opacity-70"
                          placeholder="Your email"
                        />
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        Email address cannot be changed
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-[#94A3B8]">
                        Website
                      </label>
                      <div className="relative">
                        <Globe size={16} className="absolute left-3 top-3 text-[#6B7280]" />
                        <input
                          type="url"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-[#252525] border border-[#313131] rounded-md focus:outline-none focus:border-indigo-500 text-white"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>
                  </div>
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
                    <Save size={18} className="mr-2" />
                    <span className="relative z-10">Save Changes</span>
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