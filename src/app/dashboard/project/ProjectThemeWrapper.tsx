'use client';

import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import ProjectWithSidebar from './ProjectWithSidebar';

export default function ProjectThemeWrapper({ 
  children 
}: { 
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <ProjectWithSidebar>
        {children}
      </ProjectWithSidebar>
    </ThemeProvider>
  );
} 