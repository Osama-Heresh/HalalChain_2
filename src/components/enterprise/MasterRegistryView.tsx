import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  Plus,
  ShieldCheck,
  Building2,
  Globe,
  ExternalLink,
  Layers,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Filter,
  FileCheck2
} from 'lucide-react';
import { MasterProjectRecord, LifecycleStageEnum, DuplicateMatchDetail, CertificationApplication } from '../../types';
import { DuplicateDetectionModal } from './DuplicateDetectionModal';
import { ProjectDossierModal } from './ProjectDossierModal';

interface MasterRegistryViewProps {
  onSelectProject?: (projectId: string) => void;
}

export const MasterRegistryView: React.FC<MasterRegistryViewProps> = ({ onSelectProject }) => {
  const [projects, setProjects] = useState<MasterProjectRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');

  // Dossier Modal State
  const [dossierProject, setDossierProject] = useState<CertificationApplication | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);

  // New Project Form Modal State
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newTokenSymbol, setNewTokenSymbol] = useState<string>('');
  const [newCompanyName, setNewCompanyName] = useState<string>('');
  const [newWebsite, setNewWebsite] = useState<string>('');
  const [newCmcId, setNewCmcId] = useState<string>('');
  const [newGeckoId, setNewGeckoId] = useState<string>('');
  const [newContract, setNewContract] = useState<string>('');
  const [newCountry, setNewCountry] = useState<string>('United Arab Emirates');

  // Duplicate Check Modal State
  const [duplicateModalOpen, setDuplicateModalOpen] = useState<boolean>(false);
  const [duplicateMatches, setDuplicateMatches] = useState<DuplicateMatchDetail[]>([]);
  const [duplicateExistingRecord, setDuplicateExistingRecord] = useState<MasterProjectRecord | undefined>(undefined);

  const fetchMasterProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/master-registry');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.warn('Master registry fetch fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterProjects();
  }, []);

  const handleCreateProjectClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName || !newTokenSymbol) return;

    // Run Automatic Duplicate Check
    try {
      const checkRes = await fetch('/api/duplicate-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: newProjectName,
          tokenSymbol: newTokenSymbol,
          coinMarketCapId: newCmcId || undefined,
          coinGeckoId: newGeckoId || undefined,
          contractAddress: newContract || undefined,
          website: newWebsite || undefined
        })
      });

      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.isDuplicate) {
          setDuplicateMatches(checkData.matches);
          setDuplicateExistingRecord(checkData.existingRecord);
          setDuplicateModalOpen(true);
          return;
        }
      }
    } catch (e) {
      console.warn('Duplicate check error:', e);
    }

    // No duplicate found -> Save new Master Record
    const nextNum = projects.length + 1;
    const hcId = `HC-2026-${String(nextNum).padStart(6, '0')}`;
    const newRecord: MasterProjectRecord = {
      id: hcId,
      projectId: `APP-${Date.now().toString().slice(-4)}`,
      projectName: newProjectName,
      tokenSymbol: newTokenSymbol.toUpperCase(),
      coinMarketCapId: newCmcId || undefined,
      coinGeckoId: newGeckoId || undefined,
      contractAddress: newContract || `0x${Math.random().toString(16).substring(2, 42)}`,
      officialWebsite: newWebsite || 'https://official.io',
      companyName: newCompanyName || `${newProjectName} Inc.`,
      country: newCountry,
      city: 'Dubai',
      currentStatus: 'Shariah Assessment Initiated',
      lifecycleStage: 'Prospect',
      certificateStatus: 'Pending',
      assessmentVersion: 'v2.4 Enterprise',
      lastAssessmentDate: new Date().toISOString().split('T')[0],
      renewalDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      assignedTeams: ['Shariah Board Audit Group 1'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const saveRes = await fetch('/api/master-registry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      });
      if (saveRes.ok) {
        const saved = await saveRes.json();
        setProjects((prev) => [saved, ...prev]);
        setIsAddingNew(false);
        resetForm();
      }
    } catch (e) {
      console.error('Error saving new master project:', e);
    }
  };

  const resetForm = () => {
    setNewProjectName('');
    setNewTokenSymbol('');
    setNewCompanyName('');
    setNewWebsite('');
    setNewCmcId('');
    setNewGeckoId('');
    setNewContract('');
  };

  const filteredProjects = projects.filter((p) => {
    const matchesQuery =
      p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tokenSymbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'ALL' || p.lifecycleStage === stageFilter;
    return matchesQuery && matchesStage;
  });

  const LIFECYCLE_STAGES: LifecycleStageEnum[] = [
    'Prospect',
    'Marketing',
    'Sales',
    'Customer',
    'Assessment',
    'Technical Review',
    'Business Review',
    'Scholar Review',
    'QA Review',
    'Certificate Issued',
    'Public Registry',
    'Annual Monitoring',
    'Renewal'
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest">
            <Database className="w-4 h-4" />
            <span>GLOBAL MASTER REGISTRY</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Master Project Registry & Lifecycle Engine
          </h1>
          <p className="text-slate-400 text-xs mt-1 max-w-2xl">
            Every cryptocurrency or token exists strictly once with a unique HalalChain ID (<span className="font-mono text-emerald-400">HC-2026-XXXXXX</span>).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMasterProjects}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition-all"
            title="Refresh Master Registry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsAddingNew(true)}
            className="py-3 px-5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Master Project</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by HalalChain ID (HC-2026-...), Project Name, Symbol, or Company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="py-2.5 px-3 text-xs bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none text-slate-900 dark:text-white font-bold"
          >
            <option value="ALL">All Lifecycle Stages</option>
            {LIFECYCLE_STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Master Projects Table / Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-mono text-slate-500 border-b border-slate-200 dark:border-slate-700 uppercase">
                <th className="py-3.5 px-4 font-bold">HalalChain ID</th>
                <th className="py-3.5 px-4 font-bold">Project & Token</th>
                <th className="py-3.5 px-4 font-bold">Company & Country</th>
                <th className="py-3.5 px-4 font-bold">Lifecycle Stage</th>
                <th className="py-3.5 px-4 font-bold">Cert Status</th>
                <th className="py-3.5 px-4 font-bold">Assigned Teams</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredProjects.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {item.id}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{item.projectName}</span>
                      <span className="bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                        {item.tokenSymbol}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      {item.officialWebsite && (
                        <a href={item.officialWebsite} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                          <Globe className="w-3 h-3" /> Website
                        </a>
                      )}
                      {item.contractAddress && (
                        <span className="font-mono text-[10px] truncate max-w-[120px]">
                          {item.contractAddress.substring(0, 8)}...
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{item.companyName}</div>
                    <div className="text-[11px] text-slate-500">{item.country}</div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      <Layers className="w-3 h-3 text-indigo-500" />
                      {item.lifecycleStage}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold ${
                      item.certificateStatus === 'Active'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200'
                    }`}>
                      <ShieldCheck className="w-3 h-3" />
                      {item.certificateStatus}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                    {item.assignedTeams ? item.assignedTeams.join(', ') : 'Shariah Audit Group'}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => {
                        const appObj: CertificationApplication = {
                          id: item.projectId,
                          companyName: item.projectName,
                          representativeName: item.companyName,
                          officialEmail: `contact@${item.projectName.toLowerCase().replace(/\s+/g, '')}.io`,
                          legalCountry: item.country,
                          blockchain: 'Ethereum Mainnet',
                          contractAddress: item.contractAddress || '0x71C...3902',
                          whitepaperUrl: item.whitepaperUrl || 'https://halalchain.io/whitepaper.pdf',
                          websiteUrl: item.officialWebsite || 'https://halalchain.io',
                          cmcUrl: item.coinMarketCapId ? `https://coinmarketcap.com/currencies/${item.coinMarketCapId}` : undefined,
                          projectDescription: `${item.projectName} (${item.tokenSymbol}) master enterprise project record registered under HalalChain Sharia Governance framework.`,
                          packageType: 'Enterprise',
                          totalFee: 19500,
                          depositAmount: 9750,
                          depositPaid: true,
                          depositTxHash: '0x98f...a12',
                          stage: item.lifecycleStage === 'CERTIFIED' ? 'published_registry' : 'technical_review',
                          priority: 'High',
                          submittedAt: item.registeredDate,
                          targetCompletionDate: '2026-08-30',
                          isArchived: item.isArchived,
                          archiveReason: item.archiveReason,
                          archivedAt: item.archivedAt,
                          assignedReviewers: {
                            tech_auditor: 'Dr. Ziyad Al-Hassan',
                            scholar: 'Sheikh Dr. Ibrahim Al-Kuwaiti',
                            business_analyst: 'Amina Mansour',
                            qa_officer: 'Tariq Al-Mansoor'
                          }
                        };
                        setDossierProject(appObj);
                        setIsDossierOpen(true);
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-black text-amber-400 font-bold rounded-xl text-xs transition-all shadow border border-amber-500/30 cursor-pointer"
                    >
                      View Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Project Registration Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full p-6 space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-500" />
              Register New Master Project Record
            </h2>
            <form onSubmit={handleCreateProjectClick} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Haqq Network"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Token Symbol *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ISLM"
                    value={newTokenSymbol}
                    onChange={(e) => setNewTokenSymbol(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border text-slate-900 dark:text-white uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Haqq Association"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Official Website</label>
                  <input
                    type="url"
                    placeholder="https://haqq.network"
                    value={newWebsite}
                    onChange={(e) => setNewWebsite(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">CoinMarketCap Slug / ID</label>
                  <input
                    type="text"
                    placeholder="islamic-coin"
                    value={newCmcId}
                    onChange={(e) => setNewCmcId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">CoinGecko ID</label>
                  <input
                    type="text"
                    placeholder="islamic-coin"
                    value={newGeckoId}
                    onChange={(e) => setNewGeckoId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Smart Contract Address</label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={newContract}
                  onChange={(e) => setNewContract(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow"
                >
                  Check Duplicates & Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Duplicate Protection Modal */}
      <DuplicateDetectionModal
        isOpen={duplicateModalOpen}
        matches={duplicateMatches}
        existingRecord={duplicateExistingRecord}
        onClose={() => setDuplicateModalOpen(false)}
        onOpenExisting={(rec) => {
          setDuplicateModalOpen(false);
          setIsAddingNew(false);
          if (onSelectProject) onSelectProject(rec.projectId);
        }}
        onCreateNewVersion={(rec) => {
          setDuplicateModalOpen(false);
          setIsAddingNew(false);
          alert(`New assessment version created under Master Record ${rec.id}`);
        }}
      />

      {/* Project Dossier Modal */}
      {isDossierOpen && dossierProject && (
        <ProjectDossierModal
          project={dossierProject}
          onClose={() => setIsDossierOpen(false)}
          onRefreshData={fetchMasterProjects}
        />
      )}
    </div>
  );
};
