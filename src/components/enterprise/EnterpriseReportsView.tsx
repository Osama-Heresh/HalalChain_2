import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  FileSpreadsheet,
  Printer,
  CheckCircle2,
  Filter,
  Search,
  Building2,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  HelpCircle,
  Calendar,
  AlertTriangle,
  Award,
  Users,
  DollarSign,
  Briefcase,
  Layers
} from 'lucide-react';
import { exportReport } from '../../lib/reportEngine';
import {
  ENTERPRISE_REPORT_DEFINITIONS,
  generateDedicatedReportData,
  DedicatedReportData
} from '../../lib/reportDataGenerators';

export const EnterpriseReportsView: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<string>('executive_summary');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Q3 2026');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Generate dedicated report dataset based on selected report type & period
  const reportData: DedicatedReportData = useMemo(() => {
    return generateDedicatedReportData(selectedReportType, selectedPeriod, searchTerm);
  }, [selectedReportType, selectedPeriod, searchTerm]);

  const handleExport = async (format: 'PDF' | 'Excel' | 'CSV' | 'Print') => {
    setIsExporting(true);
    try {
      const opts = { ...reportData.exportOptions, format };
      await exportReport(opts);
      setExportSuccess(`Report successfully generated and exported as ${format}!`);
      setTimeout(() => setExportSuccess(null), 4000);
    } catch (err: any) {
      console.error('Export error:', err);
      alert(`Export error: ${err.message || 'Failed to export'}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Group report definitions by category
  const categories = useMemo(() => {
    const map: Record<string, typeof ENTERPRISE_REPORT_DEFINITIONS> = {};
    ENTERPRISE_REPORT_DEFINITIONS.forEach((rep) => {
      if (!map[rep.category]) map[rep.category] = [];
      (map[rep.category] as any).push(rep);
    });
    return map as Record<string, typeof ENTERPRISE_REPORT_DEFINITIONS>;
  }, []);

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
            Independent dynamic reporting templates with module-specific KPIs, real-time analytics charts, and verified audit export options.
          </p>
        </div>

        {/* Global Period Selector & Quick Print */}
        <div className="flex items-center gap-2 bg-slate-800/90 p-2 rounded-2xl border border-slate-700">
          <Calendar className="w-4 h-4 text-emerald-400 ml-1" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-transparent text-xs font-bold text-white focus:outline-none pr-2 cursor-pointer font-mono"
          >
            <option value="Q3 2026" className="bg-slate-900">Q3 2026 (Live)</option>
            <option value="Q2 2026" className="bg-slate-900">Q2 2026</option>
            <option value="YTD 2026" className="bg-slate-900">Year-to-Date 2026</option>
            <option value="All Time" className="bg-slate-900">All Time Historical</option>
          </select>
        </div>
      </div>

      {exportSuccess && (
        <div className="bg-emerald-500 text-slate-950 p-4 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-5 h-5" />
          <span>{exportSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Nav Report Selector Panel */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold font-mono text-slate-500 uppercase">Report Catalog (11)</h3>
            <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
              Verified
            </span>
          </div>

          <div className="space-y-4 max-h-[750px] overflow-y-auto pr-1">
            {Object.entries(categories).map(([catName, reps]) => (
              <div key={catName} className="space-y-1">
                <div className="text-[10px] font-extrabold font-mono text-slate-400 uppercase tracking-wider px-1 pt-1">
                  {catName}
                </div>
                {(reps as any[]).map((rep) => {
                  const isSelected = selectedReportType === rep.id;
                  return (
                    <button
                      key={rep.id}
                      onClick={() => setSelectedReportType(rep.id)}
                      className={`w-full text-left p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-slate-950 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="truncate font-bold">{rep.title}</div>
                      </div>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right Report Content & Visual Analytics Panel */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          
          {/* Top Report Title & Export Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                  {reportData.reportNumber}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {selectedPeriod} • Generated Live
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1.5">
                {reportData.reportTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {reportData.reportSubtitle}
              </p>
            </div>

            {/* Dedicated Export Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleExport('PDF')}
                disabled={isExporting}
                className="py-2 px-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all"
              >
                <Printer className="w-3.5 h-3.5" /> PDF
              </button>
              <button
                onClick={() => handleExport('Excel')}
                disabled={isExporting}
                className="py-2 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
              </button>
              <button
                onClick={() => handleExport('CSV')}
                disabled={isExporting}
                className="py-2 px-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
          </div>

          {/* DEDICATED REPORT KPIS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {reportData.kpis.map((kpi, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block font-mono">
                    {kpi.label}
                  </span>
                  <div className="text-lg font-black text-slate-900 dark:text-white font-mono mt-1">
                    {kpi.value}
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px]">
                  {kpi.change && (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {kpi.change}
                    </span>
                  )}
                  {kpi.badge && (
                    <span className={`px-1.5 py-0.5 font-bold rounded ${kpi.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                      {kpi.badge}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* DEDICATED GRAPHICAL CHARTS / ANALYTICS VISUALIZERS */}
          {reportData.charts && reportData.charts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportData.charts.map((chart, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono uppercase">
                      {chart.title}
                    </span>
                    <BarChart3 className="w-4 h-4 text-emerald-500" />
                  </div>

                  <div className="space-y-2 pt-1">
                    {chart.items.map((item, i) => {
                      const maxValue = Math.max(...chart.items.map((it) => it.value), 1);
                      const pct = Math.round((item.value / maxValue) * 100);
                      return (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-medium text-slate-700 dark:text-slate-300 font-mono">
                            <span>{item.label}</span>
                            <span className="font-bold">{typeof item.value === 'number' ? item.value.toLocaleString() : item.value}</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: item.color || '#059669'
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DEDICATED REPORT DATA TABLES */}
          {reportData.tables && reportData.tables.map((table, tIdx) => (
            <div key={tIdx} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  {table.title}
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  {table.rows.length} Verified Records
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-slate-700">
                      {table.columns.map((col) => (
                        <th key={col.key} className="p-3">
                          {col.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-slate-800 dark:text-slate-200">
                    {table.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                        {table.columns.map((col) => (
                          <td key={col.key} className="p-3 truncate max-w-[200px]">
                            {row[col.key] || '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* EXECUTIVE RECOMMENDATIONS & TAKEAWAYS */}
          {reportData.recommendations && reportData.recommendations.length > 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-xs font-mono uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Executive Findings & Actionable Recommendations</span>
              </div>
              <ul className="list-disc list-inside text-xs text-emerald-950 dark:text-emerald-200 space-y-1 pl-1 font-medium">
                {reportData.recommendations.map((rec, rIdx) => (
                  <li key={rIdx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
