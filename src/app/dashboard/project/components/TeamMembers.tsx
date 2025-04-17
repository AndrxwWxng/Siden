import { useState, useEffect } from 'react';
import { Users, Plus, X, Check, UserMinus } from 'lucide-react';
import { Project } from '@/components/dashboard/types';
import { addTeamMember, removeTeamMember } from '../projectFunctions';

interface TeamMembersProps {
  project: Project;
  onProjectUpdated?: (updatedProject: Project) => void;
}

export default function TeamMembers({ project, onProjectUpdated }: TeamMembersProps) {
  const [teamMembers, setTeamMembers] = useState(project.teamMembers || []);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Handle adding a new team member
  const handleAddTeamMember = async () => {
    if (!newMemberEmail.trim()) {
      setAddError('Please enter a valid email address');
      return;
    }
    
    if (!newMemberEmail.includes('@')) {
      setAddError('Please enter a valid email address');
      return;
    }
    
    setIsAdding(true);
    setAddError(null);
    
    try {
      const { success, updatedProject } = await addTeamMember(
        project.id,
        newMemberEmail
      );
      
      if (success && updatedProject) {
        setTeamMembers(updatedProject.teamMembers || []);
        setNewMemberEmail('');
        setShowAddForm(false);
        
        if (onProjectUpdated) {
          onProjectUpdated(updatedProject);
        }
      } else {
        setAddError('Failed to add team member. User might not exist.');
      }
    } catch (error) {
      console.error('Error adding team member:', error);
      setAddError('An unexpected error occurred');
    } finally {
      setIsAdding(false);
    }
  };
  
  // Handle removing a team member
  const handleRemoveTeamMember = async (memberId: string) => {
    setIsRemoving(true);
    
    try {
      const { success, updatedProject } = await removeTeamMember(
        project.id,
        memberId
      );
      
      if (success && updatedProject) {
        setTeamMembers(updatedProject.teamMembers || []);
        
        if (onProjectUpdated) {
          onProjectUpdated(updatedProject);
        }
      }
    } catch (error) {
      console.error('Error removing team member:', error);
    } finally {
      setIsRemoving(false);
    }
  };
  
  // Update team members when project changes
  useEffect(() => {
    setTeamMembers(project.teamMembers || []);
  }, [project]);
  
  return (
    <div className="bg-[#252525] rounded-xl border border-[#313131] p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-[#6366F1]" />
          <h2 className="text-xl font-medium">Team Members</h2>
        </div>
        
        {!showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="px-3 py-1.5 bg-[#6366F1] hover:bg-[#5254CC] text-white rounded-md transition-colors flex items-center gap-1.5"
          >
            <Plus size={16} />
            <span>Add Member</span>
          </button>
        )}
      </div>
      
      {/* Add member form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-[#343131] border border-[#444] rounded-md">
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#94A3B8]">Email Address</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="flex-1 px-3 py-2 bg-[#252525] border border-[#313131] rounded-md focus:outline-none focus:border-[#6366F1]"
                />
                <button 
                  onClick={handleAddTeamMember}
                  disabled={isAdding}
                  className="px-3 py-2 bg-[#6366F1] hover:bg-[#5254CC] text-white rounded-md transition-colors flex items-center gap-2 min-w-[80px] justify-center"
                >
                  {isAdding ? (
                    <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Add</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={() => {setShowAddForm(false); setAddError(null);}}
                  className="px-3 py-2 bg-[#343131] hover:bg-[#252525] border border-[#444] text-white rounded-md transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              {addError && <p className="text-red-400 text-sm mt-1">{addError}</p>}
            </div>
          </div>
        </div>
      )}
      
      {/* Team members list */}
      <div className="bg-[#343131] border border-[#313131] rounded-md">
        {teamMembers.length === 0 ? (
          <div className="p-4 text-center text-[#94A3B8]">
            <p>No team members yet. Add team members to collaborate on this project.</p>
          </div>
        ) : (
          <ul className="divide-y divide-[#444]">
            {teamMembers.map((member) => (
              <li key={member.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 bg-[#6366F1] rounded-full flex items-center justify-center text-white font-medium">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-sm text-[#94A3B8]">{member.email}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleRemoveTeamMember(member.id)}
                  disabled={isRemoving || member.role === 'owner'}
                  className={`p-1.5 rounded-md ${
                    member.role === 'owner' 
                      ? 'bg-[#252525] text-[#94A3B8] cursor-not-allowed' 
                      : 'bg-[#252525] hover:bg-[#FF5A5A] hover:text-white text-[#94A3B8] hover:text-white'
                  } transition-colors`}
                  title={member.role === 'owner' ? "Project owner can't be removed" : "Remove from project"}
                >
                  <UserMinus size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 