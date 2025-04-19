'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserService } from '@/services/userService';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'dark' | 'light';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  // Prevent flash of wrong theme
  useEffect(() => {
    setMounted(true);
    
    // Check for stored theme in localStorage as a fallback
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Load user's theme preference on mount
  useEffect(() => {
    if (!mounted) return;
    
    const loadTheme = async () => {
      try {
        const settings = await UserService.getUserSettings();
        if (settings?.theme) {
          setTheme(settings.theme as Theme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        // Fallback to localStorage if user settings can't be loaded
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme) {
          setTheme(savedTheme);
        }
      }
    };

    loadTheme();
  }, [mounted]);

  // Apply the theme
  useEffect(() => {
    if (!mounted) return;
    
    // Determine the effective theme
    const effectiveTheme = 
      theme === 'system' 
        ? window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'dark' 
          : 'light'
        : theme;
    
    setResolvedTheme(effectiveTheme);
    
    // Apply theme to document
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    
    // Store in localStorage as fallback
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  // Handle system theme changes
  useEffect(() => {
    if (!mounted || theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      if (mediaQuery.matches) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  // Save theme preference when it changes
  useEffect(() => {
    if (!mounted) return;
    
    const saveTheme = async () => {
      try {
        await UserService.updateUserSettings({ theme });
      } catch (error) {
        console.error('Error saving theme:', error);
        // Still save to localStorage as fallback
        localStorage.setItem('theme', theme);
      }
    };

    // Save to localStorage immediately as a reliable fallback
    localStorage.setItem('theme', theme);
    
    // Also try to save to user settings in the background
    saveTheme();
  }, [theme, mounted]);
  
  // Prevents flash of unstyled content
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 