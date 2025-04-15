'use client';

import React from 'react';
import styles from './MessageFormatter.module.css';

// Extend Window interface to include our custom function
declare global {
  interface Window {
    copyCodeToClipboard: (button: HTMLButtonElement) => void;
  }
}

interface MessageFormatterProps {
  content: string | { type: string; data?: string; text?: string; mimeType?: string }[];
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

export const MessageFormatter: React.FC<MessageFormatterProps> = ({ content }) => {
  // If content is a string, format it as before
  if (typeof content === 'string') {
    const processedContent = formatMarkdownContent(content);
    return (
      <div className="message-content-formatted">
        <div dangerouslySetInnerHTML={{ __html: processedContent }} />
      </div>
    );
  }
  
  // If content is an array (multimodal content), process each part
  if (Array.isArray(content)) {
    return (
      <div className="message-content-formatted">
        {content.map((part, index) => {
          if (part.type === 'text' && part.text) {
            // Text content
            return (
              <div key={index} dangerouslySetInnerHTML={{ __html: formatMarkdownContent(part.text) }} />
            );
          } else if (part.type === 'image' && part.data) {
            // Image content
            return (
              <div key={index} className="my-2">
                <img 
                  src={`data:${part.mimeType || 'image/jpeg'};base64,${part.data}`} 
                  alt="Uploaded image" 
                  className="max-w-full rounded-md"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            );
          } else if (part.type === 'file' && part.data) {
            // File attachment (e.g. PDF)
            if (part.mimeType === 'application/pdf') {
              return (
                <div key={index} className="my-2 p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center text-sm">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium">PDF Document</span>
                  </div>
                  <a 
                    href={`data:application/pdf;base64,${part.data}`}
                    download="document.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition duration-150 ease-in-out"
                  >
                    Download PDF
                  </a>
                </div>
              );
            }
            
            return (
              <div key={index} className="my-2 p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center text-sm">
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">File Attachment</span>
                </div>
                <a 
                  href={`data:${part.mimeType || 'application/octet-stream'};base64,${part.data}`}
                  download="file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition duration-150 ease-in-out"
                >
                  Download File
                </a>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }
  
  // Fallback for any other content format
  return (
    <div className="message-content-formatted">
      <div className="text-gray-500 italic">
        [Content could not be displayed]
      </div>
    </div>
  );
};

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

export default MessageFormatter; 