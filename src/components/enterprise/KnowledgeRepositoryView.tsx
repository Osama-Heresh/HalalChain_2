import React, { useState, useEffect } from 'react';
import { Search, Database, BookOpen, Tag, ShieldCheck, Filter, FileText } from 'lucide-react';
import { KnowledgeRepositoryFinding } from '../../types';

export const KnowledgeRepositoryView: React.FC = () => {
  const [findings, setFindings] = useState<KnowledgeRepositoryFinding[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const fetchFindings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/knowledge-repository');
      if (res.ok) {
        const data = await res.json();
        setFindings(data);
      }
    } catch (e) {
      console.warn('Knowledge repository fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFindings();
  }, []);

  const findingsList = Array.isArray(findings) ? findings : [];
  const filtered = findingsList.filter((f) => {
    if (!f) return false;
    const matchesQuery =
      (f.projectName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.findingTopic || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.extractedStatement || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || f.category === categoryFilter;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-widest">
            <Database className="w-4 h-4" />
            <span>KNOWLEDGE REPOSITORY</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Historical Shariah Findings Repository
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Search approved historical findings, evidence extracts, risk indicators, and scholar verdicts across all evaluated protocols.
          </p>
        </div>

        <div className="bg-amber-950/80 border border-amber-800/80 p-3 rounded-2xl text-[11px] text-amber-200 font-bold max-w-xs">
          ⚠️ Reference Only: Historical repository data is for benchmarking and reference. It never replaces the live assessment.
        </div>
      </div>

      {/* Search Bar & Category Filter */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by project, topic, quote, blockchain, token utility, governance, or risk indicator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="py-2.5 px-3 text-xs bg-slate-50 dark:bg-slate-800 rounded-2xl border text-slate-900 dark:text-white font-bold"
        >
          <option value="ALL">All Categories</option>
          <option value="DeFi">DeFi & Yield</option>
          <option value="Infrastructure">Blockchain Infrastructure</option>
          <option value="Payment">Payment & Tokens</option>
          <option value="Governance">Governance & DAO</option>
        </select>
      </div>

      {/* Findings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {item.category}
                </span>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-1">
                  {item.findingTopic}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">{item.projectName}</span>
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 italic">
              "{item.supportingQuote || item.extractedStatement}"
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
              <span>Source: {item.sourceDocument} (p. {item.pageNumber || 1})</span>
              <span className="text-emerald-600 font-bold">Approved by {item.approvedBy}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
