import React, { useState } from 'react';
import {
  Globe,
  Printer,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  BookOpen,
  ShieldCheck,
  Award,
  Sparkles,
  Layers
} from 'lucide-react';
import { MultilingualTextRecord, ReportDisplayLanguage } from '../../types';
import { exportReport } from '../../lib/reportEngine';

interface BilingualReportSection {
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  aaoifiRefs?: string[];
  status?: string;
}

interface BilingualReportViewerProps {
  reportTitleEn: string;
  reportTitleAr: string;
  reportSubtitleEn: string;
  reportSubtitleAr: string;
  reportNumber: string;
  entityName: string;
  sections: BilingualReportSection[];
  kpis?: Array<{ labelEn: string; labelAr: string; value: string }>;
  defaultLang?: ReportDisplayLanguage;
  onExportPdf?: () => void;
}

export const BilingualReportViewer: React.FC<BilingualReportViewerProps> = ({
  reportTitleEn,
  reportTitleAr,
  reportSubtitleEn,
  reportSubtitleAr,
  reportNumber,
  entityName,
  sections,
  kpis = [],
  defaultLang = 'bilingual',
  onExportPdf
}) => {
  const [displayLang, setDisplayLang] = useState<ReportDisplayLanguage>(defaultLang);

  const isBilingual = displayLang === 'bilingual';
  const isArabicOnly = displayLang === 'ar';
  const isEnglishOnly = displayLang === 'en';

  const handleExport = async (format: 'PDF' | 'Excel' | 'CSV') => {
    try {
      const opts = {
        reportTitle: isArabicOnly ? reportTitleAr : reportTitleEn,
        reportSubtitle: isArabicOnly ? reportSubtitleAr : reportSubtitleEn,
        reportNumber,
        generatedBy: 'HALALCHAIN™ Enterprise Multilingual Engine',
        format,
        summaryMetrics: kpis.map((k) => ({
          label: isArabicOnly ? k.labelAr : k.labelEn,
          value: k.value
        })),
        sections: sections.map((s) => ({
          title: isArabicOnly ? s.titleAr : isEnglishOnly ? s.titleEn : `${s.titleEn} / ${s.titleAr}`,
          content: isArabicOnly
            ? s.contentAr
            : isEnglishOnly
            ? s.contentEn
            : `ENGLISH:\n${s.contentEn}\n\nالعربية:\n${s.contentAr}`
        }))
      };

      await exportReport(opts);
    } catch (e) {
      console.error('Bilingual report export error:', e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Language Selection Bar & Print Actions */}
      <div className="bg-slate-900 text-white p-4 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Language Selector Buttons */}
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400 ml-1" />
          <span className="text-xs font-bold font-mono text-slate-400 uppercase">Report Display Language:</span>
          
          <div className="flex items-center bg-slate-800 p-1 rounded-2xl border border-slate-700 text-xs font-bold font-mono">
            <button
              type="button"
              onClick={() => setDisplayLang('en')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                isEnglishOnly ? 'bg-emerald-600 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              English (LTR)
            </button>
            <button
              type="button"
              onClick={() => setDisplayLang('ar')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                isArabicOnly ? 'bg-emerald-600 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              العربية (RTL)
            </button>
            <button
              type="button"
              onClick={() => setDisplayLang('bilingual')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                isBilingual ? 'bg-emerald-600 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Side-by-Side (Bilingual)
            </button>
          </div>
        </div>

        {/* Printable Exports */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => (onExportPdf ? onExportPdf() : handleExport('PDF'))}
            className="py-2 px-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
          >
            <Printer className="w-3.5 h-3.5" /> Export PDF
          </button>
          <button
            onClick={() => handleExport('Excel')}
            className="py-2 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Export Excel
          </button>
        </div>

      </div>

      {/* REPORT CONTENT CANVAS */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
        
        {/* Report Header Block */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                {reportNumber}
              </span>
              <span className="text-xs font-mono text-slate-400">{entityName}</span>
            </div>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md">
              Synchronized Multilingual Audit
            </span>
          </div>

          <div className="pt-2">
            {isBilingual ? (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {reportTitleEn}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">{reportSubtitleEn}</p>
                </div>
                <div dir="rtl" className="text-right">
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {reportTitleAr}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">{reportSubtitleAr}</p>
                </div>
              </div>
            ) : isArabicOnly ? (
              <div dir="rtl" className="text-right">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {reportTitleAr}
                </h1>
                <p className="text-xs text-slate-500 mt-1">{reportSubtitleAr}</p>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {reportTitleEn}
                </h1>
                <p className="text-xs text-slate-500 mt-1">{reportSubtitleEn}</p>
              </div>
            )}
          </div>
        </div>

        {/* SUMMARY KPIS GRID */}
        {kpis.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {kpis.map((kpi, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold font-mono text-slate-400 uppercase block">
                  {isArabicOnly ? kpi.labelAr : isEnglishOnly ? kpi.labelEn : `${kpi.labelEn} / ${kpi.labelAr}`}
                </span>
                <div className="text-lg font-black font-mono text-slate-900 dark:text-white mt-1">
                  {kpi.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SECTION BY SECTION MULTILINGUAL AUDIT FINDINGS */}
        <div className="space-y-6">
          {sections.map((sec, idx) => (
            <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              
              {/* Section Header */}
              {isBilingual ? (
                <div className="grid grid-cols-2 gap-6 border-b border-slate-200 dark:border-slate-700 pb-3">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase font-mono">
                    {sec.titleEn}
                  </h3>
                  <h3 dir="rtl" className="font-extrabold text-sm text-slate-900 dark:text-white uppercase font-mono text-right">
                    {sec.titleAr}
                  </h3>
                </div>
              ) : (
                <div dir={isArabicOnly ? 'rtl' : 'ltr'} className={`border-b border-slate-200 dark:border-slate-700 pb-3 ${isArabicOnly ? 'text-right' : 'text-left'}`}>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase font-mono">
                    {isArabicOnly ? sec.titleAr : sec.titleEn}
                  </h3>
                </div>
              )}

              {/* Section Content */}
              {isBilingual ? (
                <div className="grid grid-cols-2 gap-6 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
                  <div className="whitespace-pre-wrap font-sans pr-2">
                    {sec.contentEn}
                  </div>
                  <div dir="rtl" className="whitespace-pre-wrap font-sans text-right pl-2 border-r border-slate-200 dark:border-slate-700">
                    {sec.contentAr}
                  </div>
                </div>
              ) : (
                <div
                  dir={isArabicOnly ? 'rtl' : 'ltr'}
                  className={`text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans ${
                    isArabicOnly ? 'text-right' : 'text-left'
                  }`}
                >
                  {isArabicOnly ? sec.contentAr : sec.contentEn}
                </div>
              )}

              {/* AAOIFI Citations */}
              {sec.aaoifiRefs && sec.aaoifiRefs.length > 0 && (
                <div className="pt-2 flex items-center gap-2 text-[10px] font-mono">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-slate-400 font-bold uppercase">AAOIFI Sharia References:</span>
                  {sec.aaoifiRefs.map((r) => (
                    <span key={r} className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded font-bold">
                      {r}
                    </span>
                  ))}
                </div>
              )}

            </div>
          ))}
        </div>

        {/* Footer Seal */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            Official Sharia & Technical Certification Audit • HALALCHAIN™
          </div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Cryptographically Verified & Immutable Record</span>
          </div>
        </div>

      </div>

    </div>
  );
};
