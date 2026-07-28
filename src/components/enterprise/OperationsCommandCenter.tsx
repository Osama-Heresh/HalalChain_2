import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Building2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  DollarSign,
  CheckCircle2,
  XCircle,
  FileText,
  BarChart3,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  UserCheck,
  RefreshCw,
  Bell
} from 'lucide-react';
import { OperationsKPIOverview, WorkloadManagementEntry, SystemAlertItem } from '../../types';

interface OperationsCommandCenterProps {
  onFilterClick?: (filterType: string) => void;
}

export const OperationsCommandCenter: React.FC<OperationsCommandCenterProps> = ({ onFilterClick }) => {
  const [kpis, setKpis] = useState<OperationsKPIOverview>({
    totalProspects: 142,
    neverContacted: 38,
    contacted: 64,
    waitingForReply: 28,
    positiveResponses: 22,
    negativeResponses: 4,
    qualifiedLeads: 18,
    activeCustomers: 26,
    projectsInProgress: 14,
    projectsWaitingReview: 6,
    certificatesIssued: 42,
    certificatesExpiringSoon: 5,
    projectsBlocked: 2,
    averageAssessmentDays: 4.2,
    averageAiConfidencePct: 96,
    employeeUtilizationPct: 84,
    departmentWorkloadPct: 78,
    revenuePipelineUSD: 1850000,
    upcomingRenewalsCount: 8
  });

  const [alerts, setAlerts] = useState<SystemAlertItem[]>([]);
  const [workloads, setWorkloads] = useState<WorkloadManagementEntry[]>([
    {
      employeeId: 'EMP-101',
      employeeName: 'Dr. Zayd Al-Mansoor',
      role: 'Shariah Scholar Lead',
      currentAssignmentsCount: 4,
      estimatedRemainingHours: 18,
      weeklyCapacityHours: 40,
      capacityUtilizationPct: 45,
      assignedProjects: [
        { projectId: 'APP-101', projectName: 'Haqq Network', deadline: '2026-08-05', stage: 'Scholar Review' },
        { projectId: 'APP-104', projectName: 'Ethena Yield', deadline: '2026-08-10', stage: 'Scholar Review' }
      ]
    },
    {
      employeeId: 'EMP-102',
      employeeName: 'Tariq Al-Hashimi',
      role: 'Senior Smart Contract Auditor',
      currentAssignmentsCount: 6,
      estimatedRemainingHours: 36,
      weeklyCapacityHours: 40,
      capacityUtilizationPct: 90,
      assignedProjects: [
        { projectId: 'APP-102', projectName: 'Islamic Coin Protocol', deadline: '2026-08-02', stage: 'Technical Review' },
        { projectId: 'APP-103', projectName: 'Halal Pay', deadline: '2026-08-04', stage: 'Technical Review' }
      ]
    },
    {
      employeeId: 'EMP-103',
      employeeName: 'Aisha Al-Kindi',
      role: 'Islamic Finance Analyst',
      currentAssignmentsCount: 3,
      estimatedRemainingHours: 14,
      weeklyCapacityHours: 40,
      capacityUtilizationPct: 35,
      assignedProjects: [
        { projectId: 'APP-105', projectName: 'Suku DeFi', deadline: '2026-08-12', stage: 'Business Review' }
      ]
    }
  ]);

  const [activeKpiFilter, setActiveKpiFilter] = useState<string | null>(null);
  const [reassignModalOpen, setReassignModalOpen] = useState<boolean>(false);
  const [selectedWorker, setSelectedWorker] = useState<WorkloadManagementEntry | null>(null);

  const fetchCommandData = async () => {
    try {
      const res = await fetch('/api/alerts');
      if (res.ok) {
        const alertData = await res.json();
        setAlerts(alertData);
      }
    } catch (e) {
      console.warn('Alerts fetch error:', e);
    }
  };

  useEffect(() => {
    fetchCommandData();
  }, []);

  const handleKpiClick = (filterKey: string) => {
    setActiveKpiFilter(filterKey);
    if (onFilterClick) onFilterClick(filterKey);
  };

  return (
    <div className="space-y-6">
      
      {/* General Manager Command Center Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest">
            <BarChart3 className="w-4 h-4" />
            <span>EXECUTIVE COMMAND CENTER</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            General Manager Operations Dashboard
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Real-time enterprise operational KPIs, reviewer capacity workload balancing, and proactive risk alerts.
          </p>
        </div>

        <button
          onClick={fetchCommandData}
          className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition-all"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* 19 INTERACTIVE CLICKABLE KPI CARDS GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500 uppercase">
          <span>Key Operational Performance Indicators (Click card to filter)</span>
          {activeKpiFilter && (
            <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Active Filter: {activeKpiFilter}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          
          <div
            onClick={() => handleKpiClick('total_prospects')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              activeKpiFilter === 'total_prospects'
                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 shadow-md ring-2 ring-emerald-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Total Prospects</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">{kpis.totalProspects}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Market DB</span>
          </div>

          <div
            onClick={() => handleKpiClick('never_contacted')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              activeKpiFilter === 'never_contacted'
                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 shadow-md ring-2 ring-emerald-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Never Contacted</span>
            <div className="text-2xl font-black text-amber-600 font-mono mt-1">{kpis.neverContacted}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Unreached</span>
          </div>

          <div
            onClick={() => handleKpiClick('contacted')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              activeKpiFilter === 'contacted'
                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 shadow-md ring-2 ring-emerald-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Contacted</span>
            <div className="text-2xl font-black text-indigo-600 font-mono mt-1">{kpis.contacted}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Outreach Sent</span>
          </div>

          <div
            onClick={() => handleKpiClick('waiting_reply')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              activeKpiFilter === 'waiting_reply'
                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 shadow-md ring-2 ring-emerald-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Waiting Reply</span>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-200 font-mono mt-1">{kpis.waitingForReply}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Pending Lead</span>
          </div>

          <div
            onClick={() => handleKpiClick('positive_responses')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              activeKpiFilter === 'positive_responses'
                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 shadow-md ring-2 ring-emerald-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Positive Responses</span>
            <div className="text-2xl font-black text-emerald-600 font-mono mt-1">{kpis.positiveResponses}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">High Intent</span>
          </div>

          <div
            onClick={() => handleKpiClick('qualified_leads')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              activeKpiFilter === 'qualified_leads'
                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 shadow-md ring-2 ring-emerald-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Qualified Leads</span>
            <div className="text-2xl font-black text-emerald-600 font-mono mt-1">{kpis.qualifiedLeads}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Sales Funnel</span>
          </div>

          <div
            onClick={() => handleKpiClick('active_customers')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              activeKpiFilter === 'active_customers'
                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 shadow-md ring-2 ring-emerald-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Active Customers</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">{kpis.activeCustomers}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Paid Clients</span>
          </div>

          <div
            onClick={() => handleKpiClick('in_progress')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              activeKpiFilter === 'in_progress'
                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 shadow-md ring-2 ring-emerald-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Projects In Progress</span>
            <div className="text-2xl font-black text-indigo-600 font-mono mt-1">{kpis.projectsInProgress}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Active Audit</span>
          </div>

          <div
            onClick={() => handleKpiClick('waiting_review')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              activeKpiFilter === 'waiting_review'
                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 shadow-md ring-2 ring-emerald-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Waiting Review</span>
            <div className="text-2xl font-black text-amber-600 font-mono mt-1">{kpis.projectsWaitingReview}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Shariah Board</span>
          </div>

          <div
            onClick={() => handleKpiClick('certs_issued')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              activeKpiFilter === 'certs_issued'
                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 shadow-md ring-2 ring-emerald-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Certificates Issued</span>
            <div className="text-2xl font-black text-emerald-600 font-mono mt-1">{kpis.certificatesIssued}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Public Certified</span>
          </div>

          <div
            onClick={() => handleKpiClick('expiring_soon')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              activeKpiFilter === 'expiring_soon'
                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 shadow-md ring-2 ring-emerald-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Expiring Soon</span>
            <div className="text-2xl font-black text-rose-600 font-mono mt-1">{kpis.certificatesExpiringSoon}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">30-day renewal</span>
          </div>

          <div
            onClick={() => handleKpiClick('projects_blocked')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              activeKpiFilter === 'projects_blocked'
                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 shadow-md ring-2 ring-emerald-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Projects Blocked</span>
            <div className="text-2xl font-black text-rose-600 font-mono mt-1">{kpis.projectsBlocked}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Requires Action</span>
          </div>

          <div
            onClick={() => handleKpiClick('avg_time')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              activeKpiFilter === 'avg_time'
                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 shadow-md ring-2 ring-emerald-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Avg Assessment Time</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">{kpis.averageAssessmentDays}d</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Turnaround</span>
          </div>

          <div
            onClick={() => handleKpiClick('revenue_pipeline')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              activeKpiFilter === 'revenue_pipeline'
                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 shadow-md ring-2 ring-emerald-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Revenue Pipeline</span>
            <div className="text-xl font-black text-emerald-600 font-mono mt-1">${(kpis.revenuePipelineUSD / 1000000).toFixed(2)}M</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Shariah Fees</span>
          </div>

          <div
            onClick={() => handleKpiClick('renewals')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              activeKpiFilter === 'renewals'
                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 shadow-md ring-2 ring-emerald-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Upcoming Renewals</span>
            <div className="text-2xl font-black text-amber-600 font-mono mt-1">{kpis.upcomingRenewalsCount}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Annual Retainer</span>
          </div>

        </div>
      </div>

      {/* WORKLOAD MANAGEMENT & BALANCER */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-600 uppercase">REVIEWER WORKLOAD BALANCER</span>
            <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              Team Capacity & Task Distribution
            </h2>
          </div>
        </div>

        <div className="space-y-3">
          {workloads.map((w) => (
            <div key={w.employeeId} className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 text-indigo-600">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-sm">{w.employeeName}</div>
                  <div className="text-xs text-slate-500">{w.role}</div>
                </div>
              </div>

              <div className="flex-1 w-full max-w-md space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Capacity Utilization</span>
                  <span className={`font-bold ${w.capacityUtilizationPct > 80 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {w.capacityUtilizationPct}% ({w.estimatedRemainingHours} hrs remaining)
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${w.capacityUtilizationPct > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${w.capacityUtilizationPct}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedWorker(w);
                  setReassignModalOpen(true);
                }}
                className="py-2 px-3.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow"
              >
                Reassign Work
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SYSTEM ALERTS FEED */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-mono font-bold text-slate-500 uppercase">REAL-TIME AUTOMATIC ALERTS FEED</span>
          </div>
          <span className="text-xs text-slate-400">{alerts.length} active alerts</span>
        </div>

        <div className="space-y-2">
          {alerts.map((alt) => (
            <div
              key={alt.id}
              className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 text-xs ${
                alt.severity === 'high'
                  ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-200'
                  : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 mt-0.5 text-rose-600 shrink-0" />
                <div>
                  <div className="font-extrabold">{alt.projectName}</div>
                  <div className="text-[11px] opacity-90">{alt.message}</div>
                </div>
              </div>

              <span className="font-mono text-[10px] opacity-70 shrink-0">
                Assigned: {alt.assignedTo}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
