import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AiConfig, AiServiceLog, RemoteEmployee, QuestionLibraryItem } from '../../types';
import {
  safeFetch,
  getLocalAiConfig,
  getLocalAiLogs,
  getLocalEmployees,
  getLocalQuestions
} from '../../lib/api';
import {
  INITIAL_AI_CONFIG,
  INITIAL_AI_LOGS,
  INITIAL_REMOTE_EMPLOYEES,
  INITIAL_QUESTIONS_LIBRARY
} from '../../data/mockData';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  Users,
  Settings,
  DollarSign,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Database,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  RefreshCw,
  Server
} from 'lucide-react';
import { IslamicPatternBg } from '../IslamicPatternBg';
import { ScrollableTabNav } from '../common/ScrollableTabNav';
import { CompanyWalletView } from './CompanyWalletView';
import { RbacAdminConsole } from './RbacAdminConsole';
import { MultilingualCollaborationConsole } from '../enterprise/MultilingualCollaborationConsole';
import { Globe, Languages } from 'lucide-react';
import { useRbac } from '../../context/RbacContext';

interface ExecPlatformViewProps {
  systemMode?: 'demo' | 'production';
  onModeChange?: (newMode: 'demo' | 'production') => void;
}

export const ExecPlatformView: React.FC<ExecPlatformViewProps> = ({
  systemMode: propSystemMode,
  onModeChange
}) => {
  const { t } = useLanguage();
  const { hasTabAccess } = useRbac();
  const [activeExecTab, setActiveExecTab] = useState<'bi' | 'company_wallet' | 'ai_config' | 'workforce' | 'sys_admin' | 'rbac_admin' | 'multilingual'>('bi');

  const [aiConfig, setAiConfig] = useState<AiConfig | null>(() => getLocalAiConfig());
  const [aiLogs, setAiLogs] = useState<AiServiceLog[]>(() => getLocalAiLogs());
  const [employees, setEmployees] = useState<RemoteEmployee[]>(() => getLocalEmployees());
  const [questions, setQuestions] = useState<QuestionLibraryItem[]>(() => getLocalQuestions());

  const [currentMode, setCurrentMode] = useState<'demo' | 'production'>(propSystemMode || 'demo');
  const [isUpdatingMode, setIsUpdatingMode] = useState(false);
  const [modeMessage, setModeMessage] = useState<string | null>(null);

  useEffect(() => {
    if (propSystemMode) {
      setCurrentMode(propSystemMode);
    }
  }, [propSystemMode]);

  const loadMode = async () => {
    try {
      const res = await fetch('/api/system/mode');
      if (res.ok) {
        const data = await res.json();
        if (data && data.mode) {
          setCurrentMode(data.mode);
        }
      }
    } catch (e) {
      console.warn('Unable to load mode setting', e);
    }
  };

  useEffect(() => {
    loadMode();

    safeFetch('/api/ai/config', 'ai_config', INITIAL_AI_CONFIG)
      .then((data) => setAiConfig(data))
      .catch(() => setAiConfig(getLocalAiConfig()));

    safeFetch('/api/ai/logs', 'ai_logs', INITIAL_AI_LOGS)
      .then((data) => setAiLogs(data))
      .catch(() => setAiLogs(getLocalAiLogs()));

    safeFetch('/api/employees', 'employees', INITIAL_REMOTE_EMPLOYEES)
      .then((data) => setEmployees(data))
      .catch(() => setEmployees(getLocalEmployees()));

    safeFetch('/api/questions-library', 'questions', INITIAL_QUESTIONS_LIBRARY)
      .then((data) => setQuestions(data))
      .catch(() => setQuestions(getLocalQuestions()));
  }, []);

  const handleToggleMode = async (targetMode: 'demo' | 'production') => {
    if (targetMode === currentMode) return;
    setIsUpdatingMode(true);
    setModeMessage(null);
    try {
      const res = await fetch('/api/system/mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: targetMode })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentMode(data.mode);
        setModeMessage(`Operating mode successfully updated to ${data.mode.toUpperCase()} MODE in Firebase Firestore.`);
        if (onModeChange) {
          onModeChange(data.mode);
        }
      } else {
        setModeMessage('Failed to update system mode in Firebase.');
      }
    } catch (err: any) {
      setModeMessage(`Error updating mode: ${err.message || 'Network error'}`);
    } finally {
      setIsUpdatingMode(false);
    }
  };

  const handleSaveAiConfig = async (updatedConfig: Partial<AiConfig>) => {
    try {
      const res = await fetch('/api/ai/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConfig)
      });
      const data = await res.json();
      if (res.ok) {
        setAiConfig(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalTokensUsed = aiLogs.reduce((acc, log) => acc + log.tokenUsage.totalTokens, 0);
  const totalAiCost = aiLogs.reduce((acc, log) => acc + log.estimatedCostUsd, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      {/* Header Banner */}
      <div className="bg-[#0B132B] text-white p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <IslamicPatternBg />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono border border-amber-500/30">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Executive Management Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif">HALALCHAIN™ Executive Dashboard & AI Service Console</h1>
          <p className="text-xs text-slate-300 font-mono">Real-time business intelligence, AI token consumption meters, and global remote workforce management.</p>
        </div>

        {/* Dynamic Mode Badge in Banner */}
        <div className="relative z-10 bg-[#1C2541]/90 p-4 rounded-2xl border border-amber-500/30 flex items-center gap-4">
          <Database className={`w-8 h-8 ${currentMode === 'demo' ? 'text-amber-400' : 'text-emerald-400'}`} />
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">System Operating Mode</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-sm font-bold font-mono px-2.5 py-0.5 rounded-full ${
                currentMode === 'demo' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {currentMode === 'demo' ? 'DEMO MODE' : 'PRODUCTION MODE'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ScrollableTabNav className="border-b border-slate-200 pb-2 text-xs font-mono" variant="light">
        {hasTabAccess('exec_platform', 'bi') && (
          <button
            onClick={() => setActiveExecTab('bi')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold whitespace-nowrap ${
              activeExecTab === 'bi' ? 'bg-[#0B132B] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Executive BI Analytics
          </button>
        )}

        {hasTabAccess('exec_platform', 'company_wallet') && (
          <button
            onClick={() => setActiveExecTab('company_wallet')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold whitespace-nowrap flex items-center gap-1.5 ${
              activeExecTab === 'company_wallet' ? 'bg-[#0B132B] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            <span>Company Wallet & Payouts</span>
          </button>
        )}

        {hasTabAccess('exec_platform', 'ai_config') && (
          <button
            onClick={() => setActiveExecTab('ai_config')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold whitespace-nowrap flex items-center gap-1.5 ${
              activeExecTab === 'ai_config' ? 'bg-[#0B132B] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Centralized AI Infrastructure Layer</span>
          </button>
        )}

        {hasTabAccess('exec_platform', 'workforce') && (
          <button
            onClick={() => setActiveExecTab('workforce')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold whitespace-nowrap ${
              activeExecTab === 'workforce' ? 'bg-[#0B132B] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Global Remote Workforce ({employees.length})
          </button>
        )}

        {hasTabAccess('exec_platform', 'sys_admin') && (
          <button
            onClick={() => setActiveExecTab('sys_admin')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold whitespace-nowrap flex items-center gap-1.5 ${
              activeExecTab === 'sys_admin' ? 'bg-[#0B132B] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span>Firebase Database & System Admin</span>
          </button>
        )}

        {hasTabAccess('exec_platform', 'rbac_admin') && (
          <button
            onClick={() => setActiveExecTab('rbac_admin')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold whitespace-nowrap flex items-center gap-1.5 ${
              activeExecTab === 'rbac_admin' ? 'bg-[#0B132B] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>RBAC & Access Control</span>
          </button>
        )}

        <button
          onClick={() => setActiveExecTab('multilingual')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold whitespace-nowrap flex items-center gap-1.5 ${
            activeExecTab === 'multilingual' ? 'bg-[#0B132B] text-amber-400 shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <span>Multilingual Collaboration Engine</span>
        </button>
      </ScrollableTabNav>

      {/* Multilingual Collaboration Console */}
      {activeExecTab === 'multilingual' && (
        <MultilingualCollaborationConsole />
      )}

      {/* Tab 1: Executive BI */}
      {activeExecTab === 'bi' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs font-mono font-semibold text-slate-500 uppercase">Monthly Revenue</div>
              <div className="text-3xl font-bold font-serif text-slate-900">$85,400 USD</div>
              <p className="text-[11px] text-emerald-600 font-mono font-bold">+14.2% vs previous month</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs font-mono font-semibold text-slate-500 uppercase">Gross Profit Margin</div>
              <div className="text-3xl font-bold font-serif text-emerald-700">78.4%</div>
              <p className="text-[11px] text-slate-500 font-mono">Operating costs: $18,400</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs font-mono font-semibold text-slate-500 uppercase">SLA Compliance Rate</div>
              <div className="text-3xl font-bold font-serif text-amber-700">98.2%</div>
              <p className="text-[11px] text-slate-500 font-mono">Average completion: 8.4 days</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs font-mono font-semibold text-slate-500 uppercase">Customer CSAT</div>
              <div className="text-3xl font-bold font-serif text-amber-700">4.9 / 5.0</div>
              <p className="text-[11px] text-slate-500 font-mono">Based on 64 reviews</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Infrastructure Layer */}
      {activeExecTab === 'ai_config' && (
        <div className="space-y-8">
          <div className="bg-[#0B132B] text-white p-8 rounded-3xl border border-amber-500/30 shadow-2xl space-y-6 relative overflow-hidden">
            <IslamicPatternBg />
            <div className="relative z-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold font-serif text-amber-300">Centralized AI Service Layer Console</h3>
                  <p className="text-xs text-slate-300 font-mono">Configure AI providers, model mappings, and monitor operational costs</p>
                </div>
                <div className="text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl font-bold">
                  Active Provider: {aiConfig?.activeProvider || 'Google Gemini'}
                </div>
              </div>

              {/* AI Token & Cost Meters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                <div className="bg-[#1C2541] p-4 rounded-2xl border border-amber-500/20 space-y-1">
                  <div className="text-slate-400 uppercase text-[10px]">Total AI Token Usage</div>
                  <div className="text-2xl font-bold text-amber-400">{totalTokensUsed.toLocaleString()} Tokens</div>
                </div>
                <div className="bg-[#1C2541] p-4 rounded-2xl border border-amber-500/20 space-y-1">
                  <div className="text-slate-400 uppercase text-[10px]">Estimated Operating Cost</div>
                  <div className="text-2xl font-bold text-emerald-400">${totalAiCost.toFixed(4)} USD</div>
                </div>
                <div className="bg-[#1C2541] p-4 rounded-2xl border border-amber-500/20 space-y-1">
                  <div className="text-slate-400 uppercase text-[10px]">Default Model</div>
                  <div className="text-xl font-bold text-white">{aiConfig?.defaultModel}</div>
                </div>
              </div>

              {/* Model Task Mapping Form */}
              <div className="bg-[#1C2541] p-6 rounded-2xl border border-amber-500/20 space-y-4 font-mono text-xs">
                <h4 className="font-bold text-amber-300 uppercase text-xs">Task Model Assignment Configuration</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300">Whitepaper Analysis Model:</label>
                    <select
                      value={aiConfig?.taskModelMapping?.whitepaper_analysis || 'gemini-3.6-flash'}
                      onChange={(e) =>
                        handleSaveAiConfig({
                          taskModelMapping: {
                            ...aiConfig?.taskModelMapping,
                            whitepaper_analysis: e.target.value
                          }
                        })
                      }
                      className="w-full bg-[#0B132B] text-amber-300 p-2 rounded-xl border border-amber-500/30 focus:outline-none"
                    >
                      <option value="gemini-3.6-flash">gemini-3.6-flash (Fast & Accurate)</option>
                      <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Deep Reasoning)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300">Smart Contract Audit Model:</label>
                    <select
                      value={aiConfig?.taskModelMapping?.smart_contract_audit || 'gemini-3.1-pro-preview'}
                      onChange={(e) =>
                        handleSaveAiConfig({
                          taskModelMapping: {
                            ...aiConfig?.taskModelMapping,
                            smart_contract_audit: e.target.value
                          }
                        })
                      }
                      className="w-full bg-[#0B132B] text-amber-300 p-2 rounded-xl border border-amber-500/30 focus:outline-none"
                    >
                      <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex Code Analysis)</option>
                      <option value="gemini-3.6-flash">gemini-3.6-flash</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AI Request Logs Table */}
              <div className="space-y-3 font-mono text-xs">
                <h4 className="font-bold text-amber-300 uppercase">AI Request Operational Logs</h4>
                <div className="bg-[#1C2541] rounded-2xl border border-amber-500/20 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#0B132B] text-slate-400 border-b border-amber-500/20 text-[10px] uppercase">
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Project</th>
                        <th className="p-3">Feature</th>
                        <th className="p-3">Model</th>
                        <th className="p-3">Tokens</th>
                        <th className="p-3">Est. Cost</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200 text-[11px]">
                      {aiLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="p-3 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                          <td className="p-3 font-bold text-white">{log.project}</td>
                          <td className="p-3">{log.feature}</td>
                          <td className="p-3 text-amber-300">{log.aiModel}</td>
                          <td className="p-3">{log.tokenUsage.totalTokens}</td>
                          <td className="p-3 text-emerald-400">${log.estimatedCostUsd.toFixed(4)}</td>
                          <td className="p-3 font-bold text-emerald-400">{log.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Workforce */}
      {activeExecTab === 'workforce' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-base font-bold font-serif text-slate-900">Global Remote Workforce Management</h3>
              <p className="text-xs text-slate-500 font-mono">Track capacity, skills, and quality ratings across remote experts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
            {employees.map((emp) => (
              <div key={emp.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{emp.name}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{emp.role}</span>
                </div>
                <div className="text-slate-600 text-[11px]">{emp.country} • {emp.timeZone}</div>
                <div className="space-y-1 pt-2 border-t text-[11px]">
                  <div className="flex justify-between">
                    <span>Workload:</span>
                    <span className="font-bold text-slate-900">{emp.currentWorkload}% Capacity</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality Score:</span>
                    <span className="font-bold text-amber-700">{emp.qualityScore} / 100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate:</span>
                    <span className="font-bold text-emerald-700">${emp.hourlyCostUsd}/hr</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: System Admin & Firebase Mode Switcher */}
      {activeExecTab === 'sys_admin' && (
        <div className="space-y-8">
          {/* Firebase Database & System Operating Mode Card */}
          <div className="bg-[#0B132B] text-white p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-xl space-y-6 relative overflow-hidden">
            <IslamicPatternBg />
            <div className="relative z-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono border border-amber-500/30 mb-2">
                    <Database className="w-4 h-4 text-amber-400" />
                    <span>Firebase Firestore Database Control</span>
                  </div>
                  <h3 className="text-xl font-bold font-serif text-amber-300">System Operating Mode Configuration</h3>
                  <p className="text-xs text-slate-300 font-mono">
                    Single administrative configuration setting. Controls whether the platform serves demonstration data or live production data.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-[#1C2541] p-2 rounded-2xl border border-amber-500/30">
                  <button
                    onClick={() => handleToggleMode('demo')}
                    disabled={isUpdatingMode}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      currentMode === 'demo'
                        ? 'bg-amber-500 text-slate-950 shadow-lg'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>1. Demo Mode</span>
                  </button>
                  <button
                    onClick={() => handleToggleMode('production')}
                    disabled={isUpdatingMode}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      currentMode === 'production'
                        ? 'bg-emerald-500 text-slate-950 shadow-lg'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>2. Production Mode</span>
                  </button>
                </div>
              </div>

              {modeMessage && (
                <div className={`p-4 rounded-2xl text-xs font-mono border flex items-center gap-2 ${
                  modeMessage.includes('Error') || modeMessage.includes('Failed')
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{modeMessage}</span>
                </div>
              )}

              {/* Mode Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
                {/* Demo Mode Details */}
                <div className={`p-6 rounded-2xl border space-y-3 transition-all ${
                  currentMode === 'demo'
                    ? 'bg-[#1C2541] border-amber-500/60 shadow-lg'
                    : 'bg-[#1C2541]/40 border-white/10 opacity-70'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-amber-300">Demo Mode</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      currentMode === 'demo' ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {currentMode === 'demo' ? 'CURRENTLY ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300 text-[11px] list-disc list-inside">
                    <li>Stores all sample demonstration records in Firebase Firestore.</li>
                    <li>Records are tagged with <code className="text-amber-300 bg-black/40 px-1 py-0.5 rounded">isDemo: true</code>.</li>
                    <li>Public registry, CRM leads, projects, and work logs show demonstration data.</li>
                    <li>Ideal for executive presentations, investor pitches, and sales demos.</li>
                  </ul>
                </div>

                {/* Production Mode Details */}
                <div className={`p-6 rounded-2xl border space-y-3 transition-all ${
                  currentMode === 'production'
                    ? 'bg-[#1C2541] border-emerald-500/60 shadow-lg'
                    : 'bg-[#1C2541]/40 border-white/10 opacity-70'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-emerald-300">Production Mode</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      currentMode === 'production' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {currentMode === 'production' ? 'CURRENTLY ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300 text-[11px] list-disc list-inside">
                    <li>Strictly ignores all demonstration records (<code className="text-emerald-300 bg-black/40 px-1 py-0.5 rounded">isDemo: false</code>).</li>
                    <li>New customers, applications, projects, and certificates write to production collections.</li>
                    <li>Clean slate for actual enterprise client onboarding and live auditing.</li>
                    <li>Demonstration data remains preserved safely in Firebase for future demo mode toggles.</li>
                  </ul>
                </div>
              </div>

              {/* Firebase Metadata Status */}
              <div className="bg-[#1C2541] p-4 rounded-2xl border border-amber-500/20 text-[11px] font-mono space-y-2 text-slate-300">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-amber-400" />
                    Firebase Firestore Database Target
                  </span>
                  <span className="text-emerald-400 font-bold">CONNECTED & SYNCHRONIZED</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                  <div><span className="text-slate-400">Firebase Project ID:</span> <span className="text-white font-bold">xenodochial-seat-8jlsj</span></div>
                  <div><span className="text-slate-400">Database ID:</span> <span className="text-white font-bold">ai-studio-halalchain-d27f4fd1-12b8-4010-9d51-4d6bc4d97e2d</span></div>
                  <div><span className="text-slate-400">Security Rules:</span> <span className="text-emerald-400 font-bold">firestore.rules (Deployed)</span></div>
                  <div><span className="text-slate-400">Blueprint Schema:</span> <span className="text-amber-300 font-bold">firebase-blueprint.json</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Question Library Editor */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-base font-bold font-serif text-slate-900">System Admin & Question Library Editor</h3>
                <p className="text-xs text-slate-500 font-mono">Configure Sharia methodology questions and framework parameters stored in Firebase</p>
              </div>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {questions.map((q) => (
                <div key={q.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="text-amber-700">{q.category} ({q.id})</span>
                    <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-[10px]">{q.status}</span>
                  </div>
                  <p className="font-semibold text-slate-800">{q.questionEn}</p>
                  <p className="text-slate-600 text-right rtl:text-left">{q.questionAr}</p>
                  <div className="text-[10px] text-slate-500 pt-1 border-t">Required Evidence: {q.evidenceRequired}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Company Wallet */}
      {activeExecTab === 'company_wallet' && (
        <CompanyWalletView />
      )}

      {/* Tab 6: RBAC & Access Control Admin Console */}
      {activeExecTab === 'rbac_admin' && (
        <RbacAdminConsole />
      )}
    </div>
  );
};
