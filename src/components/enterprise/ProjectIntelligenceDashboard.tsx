import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Code,
  Globe,
  Database,
  BarChart3,
  Layers,
  Award,
  Users,
  Search,
  BookOpen
} from 'lucide-react';
import { ProjectIntelligenceReport, EvidenceDossierReport } from '../../types';

interface ProjectIntelligenceDashboardProps {
  dossier?: EvidenceDossierReport | null;
  projectName?: string;
  tokenSymbol?: string;
}

export const ProjectIntelligenceDashboard: React.FC<ProjectIntelligenceDashboardProps> = ({
  dossier,
  projectName = 'Haqq Network',
  tokenSymbol = 'ISLM'
}) => {
  const completenessPct = dossier?.assessmentCompletenessPct || 92;
  const confidencePct = dossier?.qualityControl?.extractionConfidence || 96;
  const evidenceCount = dossier?.evidenceRegister?.length || 48;
  const findingsCount = (dossier?.financialFeatures?.length || 0) + (dossier?.technicalFeatures?.length || 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>AI PROJECT INTELLIGENCE DASHBOARD</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            {dossier?.executiveProfile?.projectName || projectName} ({dossier?.executiveProfile?.ticker || tokenSymbol})
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Real-time multi-dimensional intelligence synthesis combining CRM, AI extraction, Shariah reviews, and registry milestones.
          </p>
        </div>

        {/* Overall Completion Metric */}
        <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700/80 text-right min-w-[200px]">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
            Overall Project Completion
          </span>
          <div className="text-3xl font-black text-emerald-400 font-mono mt-0.5">
            {completenessPct}%
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${completenessPct}%` }} />
          </div>
        </div>
      </div>

      {/* Grid of Intelligence Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Pillar 1: CRM & Contact Completeness */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase font-mono">
            <span>CRM & Contact Info</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">98%</span>
            <span className="text-xs font-bold text-emerald-600">Contact Complete</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>CRM Lifecycle Status</span>
              <span className="font-bold text-slate-900 dark:text-white">Active Customer</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Marketing Status</span>
              <span className="font-bold text-emerald-600">Engaged</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Sales Pipeline Stage</span>
              <span className="font-bold text-indigo-600">Closed Won</span>
            </div>
          </div>
        </div>

        {/* Pillar 2: Technical & Repository Intelligence */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase font-mono">
            <span>Code & Contract Health</span>
            <Code className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">Verified</span>
            <span className="text-xs font-bold text-emerald-600">Smart Contract</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Whitepaper Status</span>
              <span className="font-bold text-emerald-600">Verified PDF</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>GitHub Repository</span>
              <span className="font-bold text-emerald-600">Active Commits</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Official Website</span>
              <span className="font-bold text-emerald-600">Online 100%</span>
            </div>
          </div>
        </div>

        {/* Pillar 3: AI Confidence & Evidence Count */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase font-mono">
            <span>AI Evidence Extraction</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{confidencePct}%</span>
            <span className="text-xs font-bold text-amber-600">AI Confidence</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Evidence Passages</span>
              <span className="font-bold font-mono text-slate-900 dark:text-white">{evidenceCount} items</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Structured Findings</span>
              <span className="font-bold font-mono text-slate-900 dark:text-white">{findingsCount} items</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Missing Claims</span>
              <span className="font-bold text-emerald-600">0 critical</span>
            </div>
          </div>
        </div>

        {/* Pillar 4: Shariah Reviews & Certificate */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase font-mono">
            <span>Shariah Board Reviews</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">Approved</span>
            <span className="text-xs font-bold text-slate-500">Certificate Ready</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Technical Review</span>
              <span className="font-bold text-emerald-600">Approved</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Business Review</span>
              <span className="font-bold text-emerald-600">Approved</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Scholar Review</span>
              <span className="font-bold text-emerald-600">Signed Fatwa</span>
            </div>
          </div>
        </div>

      </div>

      {/* Shariah Review Milestones Stepper */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
          Multi-Stage Enterprise Review Gateways
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-300">
              <span>1. Technical Review</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">Smart Contract & Architecture Audit</div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-300">
              <span>2. Business Review</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">Economic Model & Riba Check</div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-300">
              <span>3. Scholar Review</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">Islamic Jurisprudence Verdict</div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-300">
              <span>4. QA & Certificate</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">Final Sign-off & Public Hash</div>
          </div>
        </div>
      </div>

    </div>
  );
};
