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

  // Load user's theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const settings = await UserService.getUserSettings();
        if (settings?.theme) {
          setTheme(settings.theme as Theme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadTheme();
  }, []);

  // Apply the theme
  useEffect(() => {
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
  }, [theme]);

  // Handle system theme changes
  useEffect(() => {
    if (theme !== 'system') return;
    
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
  }, [theme]);

  // Save theme preference when it changes
  useEffect(() => {
    const saveTheme = async () => {
      await UserService.updateUserSettings({ theme });
    };

    saveTheme();
  }, [theme]);

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