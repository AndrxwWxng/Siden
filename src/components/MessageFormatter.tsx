'use client';

import React from 'react';
import Image from 'next/image';
import styles from './MessageFormatter.module.css';

// Extend Window interface to include our custom function
declare global {
  interface Window {
    copyCodeToClipboard: (button: HTMLButtonElement) => void;
  }
}

// Define types for multimodal content
interface TextContent {
  type: 'text';
  text: string;
}

interface ImageContent {
  type: 'image';
  data: string;
  mimeType: string;
}

interface FileContent {
  type: 'file';
  data: string;
  mimeType: string;
  name?: string;
}

type ContentPart = TextContent | ImageContent | FileContent;

interface MessageFormatterProps {
  content: string | ContentPart[] | any;
}

// Helper function to format markdown content
const formatMarkdownContent = (content: string) => {
  let processedContent = content;
  
  // Format code blocks
  processedContent = processedContent.replace(
    /```(\w+)?\n([\s\S]+?)\n```/g,
    (match, language, code) => {
      return `<pre class="code-block language-${language || 'plaintext'}"><code>${
        code.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      }</code></pre>`;
    }
  );
  
  // Format inline code
  processedContent = processedContent.replace(
    /`([^`]+)`/g, 
    (match, code) => {
      return `<code class="inline-code">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`;
    }
  );
  
  // Format links
  processedContent = processedContent.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g, 
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>'
  );
  
  // Format lists
  processedContent = processedContent.replace(
    /^\s*[-*]\s+(.+)$/gm,
    '<li>$1</li>'
  ).replace(
    /(<li>.+<\/li>)\n(?=<li>)/g,
    '$1'
  ).replace(
    /(<li>.+<\/li>)(?!\n)/g,
    '<ul class="list-disc pl-5 my-2">$1</ul>'
  );
  
  // Format numbered lists
  processedContent = processedContent.replace(
    /^\s*(\d+)\.\s+(.+)$/gm,
    '<li>$2</li>'
  ).replace(
    /(<li>.+<\/li>)\n(?=<li>)/g,
    '$1'
  ).replace(
    /(<li>.+<\/li>)(?!\n)/g,
    '<ol class="list-decimal pl-5 my-2">$1</ol>'
  );
  
  // Format paragraphs - using [\s\S] instead of . with s flag for cross-platform compatibility 
  processedContent = processedContent.replace(
    /\n\n([\s\S]+?)(?=\n\n|$)/g,
    '<p>$1</p>'
  );
  
  // Format line breaks
  processedContent = processedContent.replace(/\n/g, '<br/>');
  
  return processedContent;
};

export default function MessageFormatter({ content }: MessageFormatterProps) {
  // If content is just a string, render it directly
  if (typeof content === 'string') {
    return <div className={`whitespace-pre-wrap ${styles.messageContent}`}>{content}</div>;
  }
  
  // If content is an array (multimodal content), render each part appropriately
  if (Array.isArray(content)) {
    return (
      <div className={`space-y-3 ${styles.messageContent}`}>
        {(content as ContentPart[]).map((part, index) => {
          if (part.type === 'text') {
            return <div key={index} className="whitespace-pre-wrap">{part.text}</div>;
          } else if (part.type === 'image') {
            // For images, render the actual image
            try {
              return (
                <div key={index} className="relative">
                  <div className="relative w-full max-w-md h-auto overflow-hidden rounded-md">
                    <Image 
                      src={`data:${part.mimeType};base64,${part.data}`} 
                      alt="Uploaded image" 
                      width={400} 
                      height={300}
                      className="object-contain"
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                </div>
              );
            } catch (error) {
              console.error('Error rendering image:', error);
              return <div key={index} className="text-red-400 text-sm">[Error displaying image]</div>;
            }
          } else if (part.type === 'file') {
            // For files like PDFs, just show a placeholder
            return (
              <div key={index} className="flex items-center p-3 bg-[#252525] rounded-md">
                <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Attached file: {(part as FileContent).name || 'document'}</span>
              </div>
            );
          } else {
            // For unrecognized content types
            return <div key={index} className="text-xs italic">[Unsupported content type]</div>;
          }
        })}
      </div>
    );
  }
  
  // Fallback for other content types - shouldn't normally reach here
  return <div className="text-xs italic">[Unsupported message format]</div>;
}

// Add copy functionality
if (typeof window !== 'undefined') {
  window.copyCodeToClipboard = function(button: HTMLButtonElement) {
    const codeBlock = button.closest(`.${styles.codeCanvas}`)?.querySelector('code');
    if (!codeBlock) return;
    
    const textToCopy = codeBlock.textContent || '';
    navigator.clipboard.writeText(textToCopy).then(() => {
      // Show copied confirmation
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      button.disabled = true;
      
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 2000);
    });
  };
} 