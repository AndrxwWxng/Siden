"use client";

import React, { useState, useRef } from 'react';
import { PaperclipIcon, FileIcon, XIcon } from 'lucide-react';

interface MultimodalUploadProps {
  onFileSelect: (files: { data: File, type: string, preview?: string }[]) => void;
}

export default function MultimodalUpload({ onFileSelect }: MultimodalUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<{ data: File, type: string, preview?: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles: { data: File, type: string, preview?: string }[] = [];
    
    Array.from(e.target.files).forEach(file => {
      // Determine file type
      let type = 'file';
      
      if (file.type.startsWith('image/')) {
        type = 'image';
        // Create preview URL for images
        const preview = URL.createObjectURL(file);
        newFiles.push({ data: file, type, preview });
      } else if (file.type === 'application/pdf') {
        type = 'pdf';
        newFiles.push({ data: file, type });
      } else {
        // Other file types
        newFiles.push({ data: file, type });
      }
    });
    
    const updatedFiles = [...selectedFiles, ...newFiles];
    setSelectedFiles(updatedFiles);
    onFileSelect(updatedFiles);
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    
    // If it's an image with a preview URL, revoke the object URL
    if (newFiles[index].preview) {
      URL.revokeObjectURL(newFiles[index].preview!);
    }
    
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    onFileSelect(newFiles);
  };
  
  return (
    <div className="w-full">
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative flex items-center bg-[#343131] px-3 py-1 rounded-lg">
              {file.type === 'image' ? (
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-2 overflow-hidden rounded">
                    {file.preview && <img src={file.preview} alt="Preview" className="w-full h-full object-cover" />}
                  </div>
                  <span className="text-xs truncate max-w-[100px]">{file.data.name}</span>
                </div>
              ) : file.type === 'pdf' ? (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-xs truncate max-w-[100px]">{file.data.name}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <FileIcon className="w-4 h-4 mr-2" />
                  <span className="text-xs truncate max-w-[100px]">{file.data.name}</span>
                </div>
              )}
              <button 
                onClick={() => removeFile(index)}
                className="ml-2 p-1 hover:bg-[#252525] rounded-full"
              >
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="relative">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className="absolute w-0 h-0 opacity-0"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-[#94A3B8] hover:text-white rounded-full hover:bg-[#252525] transition-colors"
          title="Attach files"
        >
          <PaperclipIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
} 