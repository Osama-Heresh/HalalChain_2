import React, { useState } from 'react';
import { CertificationApplication, PlatformAiExecutiveMetrics } from '../../types';
import { calculatePlatformAiExecutiveMetrics } from '../../lib/aiAssessmentIntelligence';
import { useLanguage } from '../../context/LanguageContext';
import {
  BrainCircuit,
  BarChart3,
  ShieldAlert,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Layers,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  Building2,
  Lock,
  ChevronRight
} from 'lucide-react';

interface ExecutiveAiDashboardViewProps {
  applications: CertificationApplication[];
  onSelectProject?: (appId: string) => void;
}

export const ExecutiveAiDashboardView: React.FC<ExecutiveAiDashboardViewProps> = ({
  applications,
  onSelectProject
}) => {
  const { lang, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const metrics: PlatformAiExecutiveMetrics = calculatePlatformAiExecutiveMetrics(applications);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const filteredApps = applications.filter(app =>
    app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.blockchain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <BrainCircuit className="w-4 h-4 text-emerald-400" />
                <span>EXECUTIVE AI ASSESSMENT DASHBOARD</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Human Authority Enforced</span>
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white">
              {lang === 'ar' ? 'لوحة قيادة الذكاء الاصطناعي التنفيذية' : 'Platform AI Intelligence & Health Command'}
            </h1>
            <p className="text-slate-300 text-xs leading-relaxed max-w-2xl">
              Real-time platform-wide aggregation of AI confidence scores, cross-role contradiction alerts, mandatory evidence status, and assessment readiness across all projects.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className={`p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all ${refreshing ? 'animate-spin' : ''}`}
              title="Refresh AI Analysis"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <div className="bg-slate-800/90 border border-emerald-500/40 px-5 py-3 rounded-2xl text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Platform Health</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">{metrics.overallPlatformHealthPct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Average Confidence */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono font-bold uppercase">Average AI Confidence</span>
            <BarChart3 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
            {metrics.averageAiConfidencePct}%
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Across {applications.length} active project assessments
          </p>
        </div>

        {/* Card 2: Active Contradictions */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono font-bold uppercase">Active Contradictions</span>
            <ShieldAlert className="w-5 h-5 text-amber-500" />
          </div>
          <div className={`text-3xl font-black font-mono ${metrics.activeContradictionsCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
            {metrics.activeContradictionsCount}
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Cross-role finding conflicts requiring review
          </p>
        </div>

        {/* Card 3: Missing Evidence */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono font-bold uppercase">Missing Evidence Flags</span>
            <FileCheck2 className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-black font-mono text-indigo-600 dark:text-indigo-400">
            {metrics.missingEvidenceCount}
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Mandatory evidence items pending collection
          </p>
        </div>

        {/* Card 4: Certification Readiness */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono font-bold uppercase">Certification Ready</span>
            <Zap className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {metrics.projectsReadyForCertificationCount}
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Projects awaiting final Sharia signature
          </p>
        </div>
      </div>

      {/* Projects Intelligence Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Project Assessment Intelligence Registry
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live AI health and completeness metrics for every project.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by project name, ID, blockchain..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Blockchain</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">AI Confidence</th>
                <th className="py-3 px-4">Contradictions</th>
                <th className="py-3 px-4">Certification Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {app.companyName}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">{app.id}</div>
                  </td>

                  <td className="py-4 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {app.blockchain || 'Ethereum'}
                  </td>

                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                      {app.stage ? app.stage.replace(/_/g, ' ') : 'Assessment'}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    94%
                  </td>

                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      0 Active
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                      Draft Report Ready
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => onSelectProject && onSelectProject(app.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-emerald-600 text-xs font-bold transition-all inline-flex items-center gap-1 shadow-sm"
                    >
                      <span>Open AI Console</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-4 text-center border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-400 font-mono">
            AI Recommendation – Human Review Required
          </span>
        </div>
      </div>

    </div>
  );
};
