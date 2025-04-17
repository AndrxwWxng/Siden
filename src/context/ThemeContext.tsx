'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserService } from '@/services/userService';

// type Theme = 'dark' | 'light' | 'system';
type Theme = 'dark'; // Only allow dark theme

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'dark'; // Only dark is allowed
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<'dark'>('dark'); // Always dark

  // Load user's theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const settings = await UserService.getUserSettings();
        // Ignore any saved theme preferences - always use dark
        setTheme('dark');
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadTheme();
  }, []);

  // Apply the theme - always dark
  useEffect(() => {
    // Force dark theme
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);

  // Comment out system theme detection
  /*
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
  */

  // Save theme preference - but force it to dark
  useEffect(() => {
    const saveTheme = async () => {
      await UserService.updateUserSettings({ theme: 'dark' });
    };

    saveTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ 
      theme: 'dark', 
      setTheme: () => {}, // No-op function as we don't allow changing theme
      resolvedTheme: 'dark' 
    }}>
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