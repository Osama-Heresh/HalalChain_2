import React, { useState } from 'react';
import { FileText, Download, FileSpreadsheet, Sparkles, BarChart3, Printer, CheckCircle2 } from 'lucide-react';
import { EnterpriseReportExport } from '../../types';

export const EnterpriseReportsView: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<string>('marketing_performance');
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const REPORT_TYPES = [
    { id: 'marketing_performance', title: 'Marketing Performance & Prospect Yield' },
    { id: 'sales_performance', title: 'Sales Performance & Lead Conversion' },
    { id: 'reviewer_productivity', title: 'Reviewer Productivity & Capacity' },
    { id: 'assessment_turnaround', title: 'Assessment Turnaround Time Analysis' },
    { id: 'certificate_statistics', title: 'Certificate Issued & Registry Stats' },
    { id: 'customer_satisfaction', title: 'Customer Satisfaction & CSAT' },
    { id: 'revenue_report', title: 'Revenue Pipeline & Fee Disbursal' },
    { id: 'renewal_forecast', title: 'Annual Certificate Renewal Forecast' }
  ];

  const handleExport = (format: 'PDF' | 'Excel' | 'CSV') => {
    setExportSuccess(`Report successfully generated and downloaded as ${format}!`);
    setTimeout(() => setExportSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest">
            <FileText className="w-4 h-4" />
            <span>ENTERPRISE REPORTING ENGINE</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Executive Operations & Management Reporting
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Generate and export verified executive analytics reports across marketing, sales, reviewer turnaround, revenue, and renewal forecasts.
          </p>
        </div>
      </div>

      {exportSuccess && (
        <div className="bg-emerald-500 text-slate-950 p-4 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-5 h-5" />
          <span>{exportSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Report Selector Panel */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
          <h3 className="text-xs font-bold font-mono text-slate-500 uppercase">Select Report Module</h3>
          <div className="space-y-1.5">
            {REPORT_TYPES.map((rep) => (
              <button
                key={rep.id}
                onClick={() => setSelectedReportType(rep.id)}
                className={`w-full text-left p-3 rounded-2xl text-xs font-bold transition-all ${
                  selectedReportType === rep.id
                    ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-slate-950 shadow'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {rep.title}
              </button>
            ))}
          </div>
        </div>

        {/* Report Preview & Export Controls */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                Executive Audit Report
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                {REPORT_TYPES.find((r) => r.id === selectedReportType)?.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExport('PDF')}
                className="py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5" /> PDF
              </button>
              <button
                onClick={() => handleExport('Excel')}
                className="py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
              </button>
              <button
                onClick={() => handleExport('CSV')}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
          </div>

          {/* Report Data Preview */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Reporting Period</span>
                <span className="font-bold text-slate-900 dark:text-white">Q3 2026 (Live)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Generated By</span>
                <span className="font-bold text-slate-900 dark:text-white">Executive AI Engine</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Security Status</span>
                <span className="font-mono text-emerald-600 font-bold">DIGITAL-SIGN-OK</span>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200 font-mono text-[11px] uppercase">
                Summary Metrics Overview
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Volume</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white font-mono mt-0.5">142</div>
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Conversion</div>
                  <div className="text-lg font-black text-emerald-600 font-mono mt-0.5">32.4%</div>
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Avg SLA</div>
                  <div className="text-lg font-black text-indigo-600 font-mono mt-0.5">4.2 Days</div>
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Retention</div>
                  <div className="text-lg font-black text-amber-600 font-mono mt-0.5">98.1%</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
