import React, { useState, useEffect } from 'react';
import {
  Globe,
  Languages,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  BookOpen,
  ShieldCheck,
  Filter,
  Check,
  X,
  Edit,
  Save,
  RefreshCw,
  Award,
  Layers,
  FileText
} from 'lucide-react';
import {
  MultilingualTextRecord,
  TranslationStatus,
  AaoifiStandardReference,
  DomainTermGlossaryItem
} from '../../types';
import {
  getMultilingualRecords,
  saveMultilingualRecord,
  searchMultilingualRecords,
  getAaoifiStandardsCatalog,
  getDomainGlossary,
  translateContent
} from '../../lib/multilingualService';
import { MultilingualTextEditor } from '../common/MultilingualTextEditor';
import { BilingualReportViewer } from '../common/BilingualReportViewer';

export const MultilingualCollaborationConsole: React.FC = () => {
  const [records, setRecords] = useState<MultilingualTextRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'queue' | 'author' | 'aaoifi' | 'glossary' | 'report_preview'>('queue');
  
  const [selectedRecord, setSelectedRecord] = useState<MultilingualTextRecord | null>(null);
  const [editEnText, setEditEnText] = useState<string>('');
  const [editArText, setEditArText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const aaoifiCatalog = getAaoifiStandardsCatalog();
  const glossaryList = getDomainGlossary();

  // Load records
  const loadData = async () => {
    setIsProcessing(true);
    try {
      const data = await getMultilingualRecords();
      setRecords(data);
    } catch (e) {
      console.error('Error loading multilingual records:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered records
  const filteredRecords = searchMultilingualRecords(
    records.filter((r) => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'awaiting') return r.translationStatus === 'Awaiting Verification' || r.translationStatus === 'AI Generated';
      if (statusFilter === 'verified') return r.translationStatus === 'Verified';
      return r.translationStatus === statusFilter;
    }),
    searchQuery
  );

  // Compute KPIs
  const totalRecordsCount = records.length;
  const verifiedCount = records.filter((r) => r.translationStatus === 'Verified').length;
  const pendingCount = records.filter((r) => r.translationStatus === 'Awaiting Verification' || r.translationStatus === 'AI Generated').length;
  const avgConfidence = records.length > 0 ? Math.round((records.reduce((acc, r) => acc + (r.translationConfidence || 0.95), 0) / records.length) * 100) : 98;

  // Verify Record
  const handleVerify = async (record: MultilingualTextRecord, newStatus: TranslationStatus = 'Verified') => {
    setIsProcessing(true);
    const updated: MultilingualTextRecord = {
      ...record,
      translations: {
        en: editEnText || record.translations.en,
        ar: editArText || record.translations.ar
      },
      translationStatus: newStatus,
      verifiedBy: 'Senior Sharia Scholar & Lead Technical Auditor',
      verificationDate: new Date().toISOString().split('T')[0]
    };

    const saved = await saveMultilingualRecord(updated);
    setRecords((prev) => prev.map((r) => (r.id === saved.id ? saved : r)));
    setSelectedRecord(saved);
    setIsProcessing(false);
    setSuccessMsg(`Record ${saved.id} marked as ${newStatus}!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* EXECUTIVE HUB HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl border border-indigo-900/50 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                Enterprise Engine v3.0
              </span>
              <span className="text-xs font-mono text-slate-400">Arabic • English Bilingual Collaboration</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mt-1 flex items-center gap-2">
              <Globe className="w-7 h-7 text-indigo-400" />
              <span>Multilingual Collaboration Engine</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Preserving author original text while generating high-confidence AI translations for Sharia Scholars, Business Analysts, and Technical Auditors with zero terminology loss.
            </p>
          </div>

          <button
            onClick={loadData}
            disabled={isProcessing}
            className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-lg transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>Sync DB Records</span>
          </button>
        </div>

        {/* METRICS COUNTER GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 relative z-10">
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-indigo-900/50">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Total Text Records</div>
            <div className="text-2xl font-black font-mono text-white mt-1">{totalRecordsCount}</div>
            <span className="text-[10px] font-mono text-indigo-400">Preserved in DB</span>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-2xl border border-indigo-900/50">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Verified Translations</div>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-1">{verifiedCount}</div>
            <span className="text-[10px] font-mono text-emerald-500">Scholar Approved</span>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-2xl border border-indigo-900/50">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Verification Queue</div>
            <div className="text-2xl font-black font-mono text-amber-400 mt-1">{pendingCount}</div>
            <span className="text-[10px] font-mono text-amber-500">Awaiting Signoff</span>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-2xl border border-indigo-900/50">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">AI Term Accuracy</div>
            <div className="text-2xl font-black font-mono text-indigo-300 mt-1">{avgConfidence}%</div>
            <span className="text-[10px] font-mono text-indigo-400">Islamic & Web3 Term Protected</span>
          </div>
        </div>

      </div>

      {successMsg && (
        <div className="bg-emerald-500 text-slate-950 p-4 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-md">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 gap-1 text-xs font-bold font-mono">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'queue' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-500'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Translation Verification Queue ({pendingCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('author')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'author' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-500'
          }`}
        >
          <Languages className="w-3.5 h-3.5" />
          <span>Interactive Authoring Sandbox</span>
        </button>

        <button
          onClick={() => setActiveTab('aaoifi')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'aaoifi' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-500'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>AAOIFI Reference Library ({aaoifiCatalog.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('glossary')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'glossary' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-500'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Terminology Protection Glossary</span>
        </button>

        <button
          onClick={() => setActiveTab('report_preview')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'report_preview' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-500'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Bilingual Report & Certificate Preview</span>
        </button>
      </div>

      {/* TAB 1: TRANSLATION VERIFICATION QUEUE & CROSS-LANG SEARCH */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          
          {/* SEARCH & FILTER BAR */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Cross-Language Search Field */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cross-language search (e.g., 'ربا', 'Riba', 'Smart Contract')..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-sans text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-2 text-xs font-mono font-bold">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
              <span className="text-slate-400">Filter:</span>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg ${statusFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('awaiting')}
                className={`px-2.5 py-1 rounded-lg ${statusFilter === 'awaiting' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
              >
                Pending Review
              </button>
              <button
                onClick={() => setStatusFilter('verified')}
                className={`px-2.5 py-1 rounded-lg ${statusFilter === 'verified' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
              >
                Verified
              </button>
            </div>

          </div>

          {/* RECORDS LIST AND SIDE-BY-SIDE VERIFICATION PANEL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Records List (Left Column) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-mono font-bold text-slate-500 uppercase flex justify-between items-center px-1">
                <span>Translated Records ({filteredRecords.length})</span>
                <span>Select to Review</span>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredRecords.map((r) => {
                  const isSelected = selectedRecord?.id === r.id;
                  const isVerified = r.translationStatus === 'Verified';

                  return (
                    <div
                      key={r.id}
                      onClick={() => {
                        setSelectedRecord(r);
                        setEditEnText(r.translations.en || '');
                        setEditArText(r.translations.ar || '');
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded">
                          {r.fieldKey.replace('_', ' ').toUpperCase()}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            isVerified
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {r.translationStatus}
                        </span>
                      </div>

                      <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {r.entityName || r.entityId}
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 italic font-sans" dir={r.originalLanguage === 'ar' ? 'rtl' : 'ltr'}>
                        "{r.originalText}"
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span>Author: {r.originalLanguage === 'ar' ? 'Scholar (Arabic)' : 'Auditor (English)'}</span>
                        <span>Confidence: {Math.round((r.translationConfidence || 0.95) * 100)}%</span>
                      </div>
                    </div>
                  );
                })}

                {filteredRecords.length === 0 && (
                  <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                    No matching records found for "{searchQuery}".
                  </div>
                )}
              </div>
            </div>

            {/* Side-by-Side Reviewer Verification Editor (Right Column) */}
            <div className="lg:col-span-7">
              {selectedRecord ? (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 sticky top-6">
                  
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                        Record #{selectedRecord.id} • {selectedRecord.fieldKey}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {selectedRecord.entityName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVerify(selectedRecord, 'Verified')}
                        disabled={isProcessing}
                        className="py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                      >
                        <Check className="w-4 h-4" /> Verify Translation
                      </button>
                      <button
                        onClick={() => handleVerify(selectedRecord, 'Rejected')}
                        disabled={isProcessing}
                        className="py-1.5 px-3 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-xs rounded-xl flex items-center gap-1.5"
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>

                  {/* Original Author Text */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                      Author Original Text (Preserved in DB - {selectedRecord.originalLanguage === 'ar' ? 'العربية' : 'English'})
                    </span>
                    <p
                      dir={selectedRecord.originalLanguage === 'ar' ? 'rtl' : 'ltr'}
                      className="text-xs text-slate-900 dark:text-white leading-relaxed font-sans"
                    >
                      {selectedRecord.originalText}
                    </p>
                  </div>

                  {/* Editable AI Translations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* English Version */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                        <span>English Translation</span>
                        <span className="text-[10px] font-mono text-slate-400">LTR</span>
                      </label>
                      <textarea
                        rows={6}
                        value={editEnText}
                        onChange={(e) => setEditEnText(e.target.value)}
                        dir="ltr"
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                      />
                    </div>

                    {/* Arabic Version */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                        <span>الترجمة العربية الشرعية</span>
                        <span className="text-[10px] font-mono text-slate-400">RTL</span>
                      </label>
                      <textarea
                        rows={6}
                        value={editArText}
                        onChange={(e) => setEditArText(e.target.value)}
                        dir="rtl"
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans text-right"
                      />
                    </div>

                  </div>

                  {/* Verification Metadata */}
                  <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-2xl text-[11px] font-mono text-slate-500 space-y-1">
                    <div>Status: <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedRecord.translationStatus}</span></div>
                    <div>Generated By: {selectedRecord.generatedBy} on {selectedRecord.translationGeneratedDate}</div>
                    {selectedRecord.verifiedBy && (
                      <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                        Verified By: {selectedRecord.verifiedBy} ({selectedRecord.verificationDate})
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs space-y-2">
                  <Globe className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="font-bold">Select a record from the queue to verify or edit side-by-side translations.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: INTERACTIVE AUTHORING SANDBOX */}
      {activeTab === 'author' && (
        <div className="space-y-6">
          <MultilingualTextEditor
            fieldKey="scholar_opinion"
            fieldLabel="Sharia Scholar & Auditor Multilingual Authoring Suite"
            entityId="APP-2026-001"
            entityName="Islamic Coin (ISLM) Network"
            authorRole="scholar"
            onSaveRecord={(saved) => {
              setRecords((prev) => [saved, ...prev.filter((r) => r.id !== saved.id)]);
              setSuccessMsg(`New entry saved to database! ID: ${saved.id}`);
              setTimeout(() => setSuccessMsg(null), 3000);
            }}
          />
        </div>
      )}

      {/* TAB 3: AAOIFI STANDARDS LIBRARY */}
      {activeTab === 'aaoifi' && (
        <div className="space-y-4">
          <div className="text-xs font-mono font-bold text-slate-500 uppercase">
            Official AAOIFI Sharia Standards Library ({aaoifiCatalog.length})
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aaoifiCatalog.map((std) => (
              <div key={std.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded">
                      {std.category}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                      {std.standardNumber}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400 font-bold">{std.sectionCode}</span>
                </div>

                <div className="grid grid-cols-1 gap-3 text-xs leading-relaxed">
                  <div dir="rtl" className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-right">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                      النص العربي المعتمد من هيئة الأيوفي
                    </span>
                    <p className="font-sans text-slate-900 dark:text-slate-100">{std.arabicText}</p>
                  </div>

                  <div dir="ltr" className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-mono font-bold text-slate-500 block mb-1">
                      Official English Standard Text
                    </span>
                    <p className="font-sans text-slate-800 dark:text-slate-200">{std.officialEnglishText}</p>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl text-xs space-y-1">
                  <div className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>HalalChain Web3 Audit Guidance</span>
                  </div>
                  <p className="text-indigo-800 dark:text-indigo-300 text-[11px]">{std.internalExplanationEn}</p>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TERMINOLOGY PROTECTION GLOSSARY */}
      {activeTab === 'glossary' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Canonical Islamic & Web3 Terminology Protection Glossary
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                AI translation engine strictly enforces these terms across Arabic and English to eliminate literal mistranslation errors.
              </p>
            </div>
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-mono font-bold text-slate-400 uppercase">
                  <th className="py-2 px-3">Canonical Term</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3">English Protected Equivalent</th>
                  <th className="py-2 px-3 text-right">المرادف العربي الشرعي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {glossaryList.map((g, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-3 font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                      {g.term}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px] font-bold">
                        {g.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-800 dark:text-slate-200 font-semibold">
                      {g.en}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-900 dark:text-slate-100 font-extrabold font-sans" dir="rtl">
                      {g.ar}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: BILINGUAL REPORT & CERTIFICATE PREVIEW */}
      {activeTab === 'report_preview' && (
        <div className="space-y-8">
          
          <BilingualReportViewer
            reportNumber="HC-EXEC-REP-2026-001"
            entityName="Islamic Coin (ISLM) & Sovereign Sukuk Chain"
            reportTitleEn="HalalChain Enterprise Multilingual Audit Report"
            reportTitleAr="تقرير التدقيق التنفيذي المزدوج - هلال تشين"
            reportSubtitleEn="Comprehensive Sharia & Smart Contract Assessment"
            reportSubtitleAr="التقييم الشامل للعقود الذكية والتوافق مع الشريعة الإسلامية"
            kpis={[
              { labelEn: 'Sharia Decision', labelAr: 'القرار الشرعي', value: 'HALAL' },
              { labelEn: 'AAOIFI Standards', labelAr: 'معايير الأيوفي المستوفاة', value: '4 Standards' },
              { labelEn: 'Smart Contract Audit', labelAr: 'فحص الشفيرة البرمجية', value: 'Passed (0 High Vulnerabilities)' },
              { labelEn: 'Audit Status', labelAr: 'حالة الاعتماد', value: 'Certified' }
            ]}
            sections={[
              {
                titleEn: '1. Executive Sharia Board Ruling',
                titleAr: '١. قرار هيئة الرقابة الشرعية العالمية',
                contentEn: 'After examining the token architecture and smart contract code, the Sharia Supervisory Board confirms that reward distribution is conducted through an authentic Mudarabah profit-sharing framework without interest (Riba) or excessive ambiguity (Gharar).',
                contentAr: 'بعد فحص بنية الرمز المشفر وعقود البرمجة الذكية، تؤكد هيئة الرقابة الشرعية أن توزيع العوائد يتم وفق عقد المضاربة الشرعي الخالي تماماً من الربا والغرر الفاحش.',
                aaoifiRefs: ['AAOIFI-21', 'AAOIFI-46']
              },
              {
                titleEn: '2. Smart Contract & Tokenomics Security Findings',
                titleAr: '٢. نتائج فحص العقود الذكية واقتصاد الرموز المشفرة',
                contentEn: 'Automated bytecode inspection confirmed zero reentrancy risks, proxy upgradeability secured by a 4-of-7 multi-sig wallet, and 100% liquidity lockup in the protocol vault.',
                contentAr: 'أكد الفحص الآلي للشفيرة خلو العقد من ثغرات إعادة الدخول (Reentrancy)، وحماية الترقية عبر محفظة متعددة التوقيعات بنسبة 4 من 7، مع حجز السيولة بنسبة 100%.',
                aaoifiRefs: ['AAOIFI-08']
              }
            ]}
          />

        </div>
      )}

    </div>
  );
};
