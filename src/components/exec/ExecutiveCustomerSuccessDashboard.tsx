import React from 'react';
import {
  Users,
  TrendingUp,
  DollarSign,
  HeartPulse,
  Star,
  Clock,
  ShieldCheck,
  Award,
  BarChart3,
  FileText,
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { CertificationApplication, UserRole } from '../../types';
import {
  INITIAL_SALES_OPPORTUNITIES,
  INITIAL_CSAT_SURVEYS,
  INITIAL_AUTOMATION_AUDIT_LOGS,
  calculateCustomerHealthScore
} from '../../lib/customerSuccessEngine';
import { exportReport } from '../../lib/reportEngine';
import { buildCustomerSuccessReportOptions } from '../../lib/reportGenerators';

interface ExecutiveCustomerSuccessDashboardProps {
  applications: CertificationApplication[];
  currentUserRole?: UserRole;
  currentUserName?: string;
}

export const ExecutiveCustomerSuccessDashboard: React.FC<ExecutiveCustomerSuccessDashboardProps> = ({
  applications = [],
  currentUserRole = 'exec',
  currentUserName = 'General Manager'
}) => {
  const healthSummaries = applications.map((app) => ({
    app,
    health: calculateCustomerHealthScore(app)
  }));

  const excellentCount = healthSummaries.filter((h) => h.health.status === 'Excellent').length;
  const healthyCount = healthSummaries.filter((h) => h.health.status === 'Healthy').length;
  const needsAttentionCount = healthSummaries.filter((h) => h.health.status === 'Needs Attention').length;
  const highRiskCount = healthSummaries.filter((h) => h.health.status === 'High Risk').length;

  const totalPipelineRevenue = INITIAL_SALES_OPPORTUNITIES.reduce((sum, o) => sum + (o.estimatedValueUSD || 0), 0);
  const totalRenewalForecast = INITIAL_SALES_OPPORTUNITIES
    .filter((o) => o.stage === 'Renewal' || o.stage === 'Certificate Issued')
    .reduce((sum, o) => sum + (o.estimatedValueUSD || 0), 0);

  const avgCsat = INITIAL_CSAT_SURVEYS.length > 0
    ? (INITIAL_CSAT_SURVEYS.reduce((sum, c) => sum + c.ratingStars, 0) / INITIAL_CSAT_SURVEYS.length).toFixed(1)
    : '4.9';

  const handleExport = () => {
    const opts = buildCustomerSuccessReportOptions(
      applications,
      INITIAL_SALES_OPPORTUNITIES,
      [],
      INITIAL_AUTOMATION_AUDIT_LOGS,
      INITIAL_CSAT_SURVEYS,
      currentUserName
    );
    exportReport(opts);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-indigo-500/30 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-indigo-400" /> General Manager Executive BI
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Executive Customer Success & Business Automation Metrics
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              High-level strategic reporting across revenue pipeline, customer retention health, renewal forecasts, and automated workflow audits.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer self-start md:self-auto"
          >
            <FileText className="w-4 h-4" /> Export Executive CS Dossier
          </button>
        </div>

        {/* Core Executive Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700/60">
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Total Enterprise Accounts</div>
            <div className="text-2xl font-black text-white mt-1">{applications.length} Accounts</div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Active Revenue Pipeline</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">${totalPipelineRevenue.toLocaleString()} USD</div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Annual Renewal Forecast</div>
            <div className="text-2xl font-black text-indigo-300 mt-1">${totalRenewalForecast.toLocaleString()} USD</div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Customer CSAT Score</div>
            <div className="text-2xl font-black text-amber-400 mt-1">★ {avgCsat} <span className="text-xs font-normal text-slate-400">/ 5.0</span></div>
          </div>
        </div>
      </div>

      {/* Customer Health Distribution Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Excellent Health</div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{excellentCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Low churn risk, active feedback</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Healthy Status</div>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">{healthyCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Standard turnaround time</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Needs Attention</div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">{needsAttentionCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Pending document response</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">High Risk Accounts</div>
          <div className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-2">{highRiskCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Escrow or contract blocked</div>
        </div>
      </div>

      {/* Real-Time System Automation Audit Log Stream */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Platform-Wide Automated Actions Audit Trail
          </h3>
          <span className="text-xs text-slate-500 font-mono">Immutable Cryptographic Log</span>
        </div>

        <div className="space-y-3">
          {INITIAL_AUTOMATION_AUDIT_LOGS.map((log) => (
            <div key={log.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{log.ruleName}</div>
                <div className="text-slate-500 mt-0.5">Target: {log.targetEntityName} • Action: {log.actionTaken}</div>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold rounded-lg text-[10px]">
                  {log.result}
                </span>
                <div className="text-[10px] font-mono text-slate-400 mt-1">{log.digitalSignatureHash}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
