import React, { useState } from 'react';
import { CertificationApplication, UserRole } from '../../types';
import { RotateCcw, Trash2, Search, ShieldAlert, Layers, Building2, Calendar, AlertTriangle, X } from 'lucide-react';

interface ArchivedProjectsViewProps {
  archivedProjects?: CertificationApplication[];
  archivedApplications?: CertificationApplication[];
  currentUserRole: UserRole;
  onRefreshData: () => void;
  onClose?: () => void;
}

export const ArchivedProjectsView: React.FC<ArchivedProjectsViewProps> = ({
  archivedProjects,
  archivedApplications,
  currentUserRole,
  onRefreshData,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForPermanentDelete, setSelectedForPermanentDelete] = useState<CertificationApplication | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const rawList = archivedProjects || archivedApplications || [];
  const list = Array.isArray(rawList) ? rawList : [];

  const filtered = list.filter((app) => {
    if (!app) return false;
    const name = app.companyName || '';
    const id = app.id || '';
    const contract = app.contractAddress || '';
    const term = searchTerm.toLowerCase();
    return (
      name.toLowerCase().includes(term) ||
      id.toLowerCase().includes(term) ||
      contract.toLowerCase().includes(term)
    );
  });

  const handleRestore = async (appId: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/applications/${appId}/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: `User (${currentUserRole.toUpperCase()})`,
          userRole: currentUserRole
        })
      });
      if (res.ok) {
        onRefreshData();
      }
    } catch (err) {
      console.error('Error restoring project:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePermanentDelete = async (appId: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/applications/${appId}/permanent`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: `Administrator (${currentUserRole.toUpperCase()})`,
          userRole: currentUserRole
        })
      });
      if (res.ok) {
        setSelectedForPermanentDelete(null);
        onRefreshData();
      }
    } catch (err) {
      console.error('Error deleting project permanently:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-rose-500 tracking-wider">
              ARCHIVED PROJECTS REPOSITORY
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Soft-Deleted & Archived Projects ({filtered.length})
            </h2>
          </div>
        </div>

        {onClose && (
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search archived projects by ID, Name, or Contract..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
        />
      </div>

      {/* Projects List */}
      {filtered.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 text-xs font-mono">
          No archived projects found in the repository.
        </div>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{item.companyName}</span>
                  <span className="bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 text-[10px] px-2 py-0.5 rounded font-bold">
                    ARCHIVED
                  </span>
                  <span className="text-slate-400 text-[11px]">{item.id}</span>
                </div>
                <div className="text-slate-500 text-[11px] mt-1 flex items-center gap-3">
                  <span>Country: {item.legalCountry}</span>
                  <span>•</span>
                  <span>Blockchain: {item.blockchain}</span>
                  <span>•</span>
                  <span>Original Stage: {item.stage}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRestore(item.id)}
                  disabled={isProcessing}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Project</span>
                </button>

                {(currentUserRole === 'admin' || currentUserRole === 'pm') && (
                  <button
                    onClick={() => setSelectedForPermanentDelete(item)}
                    className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center gap-1 border border-rose-500/30 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Permanent Delete</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Permanent Delete Confirmation Modal */}
      {selectedForPermanentDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-rose-500/50 shadow-2xl max-w-md w-full space-y-4 font-sans">
            <div className="flex items-center gap-3 text-rose-500">
              <ShieldAlert className="w-8 h-8" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">PERMANENT DELETION WARNING</h3>
                <span className="text-xs text-rose-500 font-mono font-bold">IRREVERSIBLE ACTION</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-mono">
              Are you sure you want to PERMANENTLY delete project <strong>{selectedForPermanentDelete.companyName}</strong> ({selectedForPermanentDelete.id}) from Firestore? This record will be permanently wiped from the database.
            </p>

            <div className="flex justify-end gap-2 pt-2 font-mono text-xs">
              <button
                onClick={() => setSelectedForPermanentDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePermanentDelete(selectedForPermanentDelete.id)}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 shadow"
              >
                {isProcessing ? 'Deleting...' : 'PERMANENTLY DELETE'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
