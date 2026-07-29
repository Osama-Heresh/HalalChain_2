import React, { useState } from 'react';
import { X, Users, RefreshCw, CheckCircle2, ShieldCheck, Code, Briefcase, UserCheck } from 'lucide-react';
import { CertificationApplication, RemoteEmployee, UserRole } from '../../types';

interface ReassignTeamModalProps {
  isOpen: boolean;
  project: CertificationApplication | null;
  employees?: RemoteEmployee[];
  currentUserRole?: UserRole;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReassignTeamModal: React.FC<ReassignTeamModalProps> = ({
  isOpen,
  project,
  employees = [],
  currentUserRole = 'pm',
  onClose,
  onSuccess
}) => {
  const [roleToReassign, setRoleToReassign] = useState<
    'tech_auditor' | 'scholar' | 'business_analyst' | 'qa'
  >('tech_auditor');
  const [selectedEmployeeName, setSelectedEmployeeName] = useState<string>('');
  const [customEmployeeName, setCustomEmployeeName] = useState<string>('');
  const [reason, setReason] = useState<string>('PM Workload rebalancing and audit speed optimization');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !project) return null;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'tech_auditor': return <Code className="w-4 h-4 text-blue-500" />;
      case 'scholar': return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      case 'business_analyst': return <Briefcase className="w-4 h-4 text-cyan-500" />;
      case 'qa': return <UserCheck className="w-4 h-4 text-purple-500" />;
      default: return <Users className="w-4 h-4 text-amber-500" />;
    }
  };

  const currentAssignedName = project.assignedReviewers
    ? project.assignedReviewers[roleToReassign] || 'Unassigned'
    : 'Dr. Ziyad Al-Hassan';

  const handleReassignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newName = selectedEmployeeName || customEmployeeName;
    if (!newName) {
      alert('Please select or enter the name of the new team member.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/reassign-team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleToReassign,
          newEmployeeId: `EMP-${Date.now().toString().slice(-4)}`,
          newEmployeeName: newName,
          reason,
          pmName: `Project Manager (${currentUserRole.toUpperCase()})`
        })
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        alert('Failed to reassign team member.');
      }
    } catch (err) {
      console.error('Reassign team error:', err);
      alert('Error connecting to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-6 animate-in fade-in zoom-in-95 font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-amber-600 tracking-wider">
                TEAM CAPACITY MANAGEMENT
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Reassign Work & Task Distribution
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Context */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-mono">
          <span className="text-slate-400 text-[10px] uppercase block">Selected Project</span>
          <span className="font-extrabold text-slate-900 dark:text-white text-sm">{project.companyName} ({project.id})</span>
        </div>

        <form onSubmit={handleReassignSubmit} className="space-y-4 text-xs font-mono">
          {/* Select Role to Reassign */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Evaluation Role to Reassign:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'tech_auditor', label: 'Technical Auditor' },
                { id: 'scholar', label: 'Sharia Scholar' },
                { id: 'business_analyst', label: 'Business Analyst' },
                { id: 'qa', label: 'QA Officer' }
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRoleToReassign(r.id as any)}
                  className={`p-3 rounded-2xl border flex items-center gap-2 transition-all font-bold text-left ${
                    roleToReassign === r.id
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {getRoleIcon(r.id)}
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Current vs New Assignment */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Currently Assigned</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm block">{currentAssignedName}</span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Assign New Team Member:
            </label>
            {employees.length > 0 ? (
              <select
                value={selectedEmployeeName}
                onChange={(e) => setSelectedEmployeeName(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
              >
                <option value="">-- Select Available Remote Professional --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name} ({emp.role} - {emp.country})
                  </option>
                ))}
              </select>
            ) : null}

            <input
              type="text"
              placeholder="Or enter new reviewer full name manually..."
              value={customEmployeeName}
              onChange={(e) => setCustomEmployeeName(e.target.value)}
              className="w-full mt-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Reason for Reassignment (Audit Trail Log):
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow"
            >
              {isSubmitting ? 'Updating...' : 'Confirm Reassignment'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
