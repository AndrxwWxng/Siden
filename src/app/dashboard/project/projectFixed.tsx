// This file demonstrates how to fix the checkbox issue

import React, { useState } from 'react';

export default function ToggleExample() {
  // State for toggles
  const [autonomousCommunication, setAutonomousCommunication] = useState(true);
  const [knowledgeSharing, setKnowledgeSharing] = useState(true);
  const [ceoApprovalMode, setCeoApprovalMode] = useState(true);
  
  return (
    <div className="bg-[#252525] rounded-xl border border-[#313131] p-6">
      <h2 className="text-xl font-medium mb-6">Team Settings</h2>
      
      {/* Toggle Switches - Properly implemented with onChange handlers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between py-2 border-b border-[#252525]">
          <div>
            <h4 className="text-sm font-medium">Autonomous Communication</h4>
            <p className="text-xs text-[#94A3B8] mt-1">Allow agents to communicate without your input</p>
          </div>
          <div 
            className="relative inline-block w-10 h-5 rounded-md bg-[#252525] cursor-pointer"
            onClick={() => setAutonomousCommunication(!autonomousCommunication)}
          >
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={autonomousCommunication}
              onChange={(e) => setAutonomousCommunication(e.target.checked)}
            />
            <span className={`block h-5 w-5 rounded-md bg-[#6366F1] absolute left-0 transition-transform transform ${autonomousCommunication ? 'translate-x-5' : 'translate-x-0'}`}></span>
          </div>
        </div>
        
        <div className="flex items-center justify-between py-2 border-b border-[#252525]">
          <div>
            <h4 className="text-sm font-medium">Knowledge Sharing</h4>
            <p className="text-xs text-[#94A3B8] mt-1">Share context and information between agents</p>
          </div>
          <div 
            className="relative inline-block w-10 h-5 rounded-md bg-[#252525] cursor-pointer"
            onClick={() => setKnowledgeSharing(!knowledgeSharing)}
          >
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={knowledgeSharing}
              onChange={(e) => setKnowledgeSharing(e.target.checked)}
            />
            <span className={`block h-5 w-5 rounded-md bg-[#6366F1] absolute left-0 transition-transform transform ${knowledgeSharing ? 'translate-x-5' : 'translate-x-0'}`}></span>
          </div>
        </div>
        
        <div className="flex items-center justify-between py-2 border-b border-[#252525]">
          <div>
            <h4 className="text-sm font-medium">CEO Approval Mode</h4>
            <p className="text-xs text-[#94A3B8] mt-1">Require your approval for major decisions</p>
          </div>
          <div 
            className="relative inline-block w-10 h-5 rounded-md bg-[#252525] cursor-pointer"
            onClick={() => setCeoApprovalMode(!ceoApprovalMode)}
          >
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={ceoApprovalMode}
              onChange={(e) => setCeoApprovalMode(e.target.checked)}
            />
            <span className={`block h-5 w-5 rounded-md bg-[#6366F1] absolute left-0 transition-transform transform ${ceoApprovalMode ? 'translate-x-5' : 'translate-x-0'}`}></span>
          </div>
        </div>
        
        {/* Alternative approach: using defaultChecked instead of checked */}
        <div className="flex items-center justify-between py-2 border-b border-[#252525]">
          <div>
            <h4 className="text-sm font-medium">Alternative: Using defaultChecked</h4>
            <p className="text-xs text-[#94A3B8] mt-1">This approach works for non-controlled components</p>
          </div>
          <div 
            className="relative inline-block w-10 h-5 rounded-md bg-[#252525] cursor-pointer"
          >
            <input 
              type="checkbox" 
              className="sr-only" 
              defaultChecked={true}
            />
            <span className="block h-5 w-5 rounded-md bg-[#6366F1] absolute left-0 transition-transform transform translate-x-5"></span>
          </div>
        </div>
      </div>
    </div>
  );
} 