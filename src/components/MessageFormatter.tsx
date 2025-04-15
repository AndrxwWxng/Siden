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
  content: string;
}

export const MessageFormatter: React.FC<MessageFormatterProps> = ({ content }) => {
  // Process code blocks
  const processedContent = formatMarkdownContent(content);
  
  return (
    <div className="message-content-formatted">
      <div dangerouslySetInnerHTML={{ __html: processedContent }} />
    </div>
  );
};

export function formatMarkdownContent(content: string): string {
  if (!content) return '';
  
  let processedContent = content;
  
  // Convert line breaks to paragraphs - this must be done first
  processedContent = processedContent
    .split('\n\n')
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0)
    .map(paragraph => 
      // Skip wrapping in <p> if it's a heading, list, or code block
      /^#{1,5}\s/.test(paragraph) || 
      /^(\s*-\s)/.test(paragraph) || 
      /^```/.test(paragraph) ||
      /^>/.test(paragraph) ? 
        paragraph : 
        `<p>${paragraph.replace(/\n/g, '<br/>')}</p>`
    )
    .join('\n');

  // Process code blocks with language
  processedContent = processedContent.replace(
    /```(\w+)\n([\s\S]*?)```/g, 
    (_, language, code) => `
      <div class="${styles.codeCanvas}">
        <div class="${styles.codeHeader}">
          <span class="${styles.codeLanguage}">${language}</span>
          <div class="${styles.codeActions}">
            <button class="${styles.codeCopyBtn}" onclick="copyCodeToClipboard(this)">Copy</button>
          </div>
        </div>
        <pre class="${styles.codeBlock}"><code class="${styles.codeContent}">${escapeHtml(code.trim())}</code></pre>
      </div>
    `
  );
  
  // Process code blocks without language
  processedContent = processedContent.replace(
    /```\n([\s\S]*?)```/g, 
    (_, code) => `
      <div class="${styles.codeCanvas}">
        <div class="${styles.codeHeader}">
          <span class="${styles.codeLanguage}">code</span>
          <div class="${styles.codeActions}">
            <button class="${styles.codeCopyBtn}" onclick="copyCodeToClipboard(this)">Copy</button>
          </div>
        </div>
        <pre class="${styles.codeBlock}"><code class="${styles.codeContent}">${escapeHtml(code.trim())}</code></pre>
      </div>
    `
  );
  
  // Process inline code
  processedContent = processedContent.replace(
    /`([^`]+)`/g, 
    (_, code) => `<code class="${styles.inlineCode}">${escapeHtml(code)}</code>`
  );
  
  // Process section titles (###)
  processedContent = processedContent
    .replace(/^### (.*$)/gim, `<h3 class="${styles.heading3}">$1</h3>`)
    .replace(/^#### (.*$)/gim, `<h4 class="${styles.heading4}">$1</h4>`)
    .replace(/^##### (.*$)/gim, `<h5 class="${styles.heading5}">$1</h5>`);
  
  // Process lists
  processedContent = processedContent
    .replace(/^\s*- (.*$)/gim, `<li class="${styles.listItem}">$1</li>`)
    .replace(new RegExp(`(<li class="${styles.listItem}">.*<\/li>\\s*)+`, 'gim'), 
      (match) => `<ul class="${styles.list}">${match}</ul>`);
  
  // Process bold
  processedContent = processedContent.replace(
    /\*\*(.*?)\*\*/g, 
    (_, text) => `<strong class="${styles.boldText}">${text}</strong>`
  );
  
  // Process blockquotes
  processedContent = processedContent.replace(
    /^>\s*(.*$)/gim,
    (_, text) => `<blockquote class="${styles.blockquote}">${text}</blockquote>`
  );
  
  // Process file paths (looks for patterns like path/to/file.js or /absolute/path/file.ext)
  processedContent = processedContent.replace(
    /\b(\/[\w\.\-\/]+\.\w+|\w+\/[\w\.\-\/]+\.\w+)\b/g,
    (match) => `<span class="${styles.filePath}">${match}</span>`
  );
  
  // Process highlight text (==highlighted==)
  processedContent = processedContent.replace(
    /==(.*?)==/g,
    (_, text) => `<span class="${styles.highlight}">${text}</span>`
  );
  
  // Process keyboard inputs
  processedContent = processedContent.replace(
    /<kbd>(.*?)<\/kbd>/g,
    (_, text) => `<span class="${styles.kbd}">${text}</span>`
  );
  
  // Process colored text for warnings, errors, success
  processedContent = processedContent
    .replace(/<error>(.*?)<\/error>/g, (_, text) => `<span class="${styles.error}">${text}</span>`)
    .replace(/<warning>(.*?)<\/warning>/g, (_, text) => `<span class="${styles.warning}">${text}</span>`)
    .replace(/<success>(.*?)<\/success>/g, (_, text) => `<span class="${styles.success}">${text}</span>`);

  // Process section titles without # (e.g. Project Plan: or Understanding Mastra AI:)
  processedContent = processedContent.replace(
    /^([A-Z][A-Za-z\s]+):\s*$/gim,
    (match) => `<div class="${styles.sectionTitle}">${match}</div>`
  );
  
  return processedContent;
}

// Helper function to escape HTML special characters
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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

export default MessageFormatter; 