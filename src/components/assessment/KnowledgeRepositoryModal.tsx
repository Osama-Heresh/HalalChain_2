import React, { useState, useEffect } from 'react';
import { KnowledgeRepositoryFinding } from '../../types';
import {
  X,
  Database,
  Search,
  Filter,
  CheckCircle2,
  BookOpen,
  Tag,
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';

interface KnowledgeRepositoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFinding?: (finding: KnowledgeRepositoryFinding) => void;
}

export const KnowledgeRepositoryModal: React.FC<KnowledgeRepositoryModalProps> = ({
  isOpen,
  onClose,
  onSelectFinding
}) => {
  const [findings, setFindings] = useState<KnowledgeRepositoryFinding[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    if (isOpen) {
      fetchKnowledgeRepository();
    }
  }, [isOpen]);

  const fetchKnowledgeRepository = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/knowledge-repository');
      if (res.ok) {
        const data = await res.json();
        setFindings(data || []);
      }
    } catch (err) {
      console.error('Error fetching knowledge repository:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const categories = ['ALL', 'Layer 1', 'Layer 2', 'Infrastructure', 'DEX', 'RWA', 'AI', 'Gaming'];

  const filteredFindings = findings.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.projectName?.toLowerCase().includes(q) ||
      item.findingTopic?.toLowerCase().includes(q) ||
      item.extractedStatement?.toLowerCase().includes(q) ||
      item.sourceDocument?.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col h-[85vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wide">
                  HalalChain™ Firestore DB
                </span>
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs text-slate-300 font-medium">{findings.length} Verified Records</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Sharia & Technical Knowledge Repository
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search findings by project, section, or quote keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Repository Items List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {isLoading ? (
            <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-medium">Loading Firestore Knowledge Repository...</p>
            </div>
          ) : filteredFindings.length === 0 ? (
            <div className="py-16 text-center text-slate-500 dark:text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm font-semibold">No Knowledge Repository items match your filter.</p>
              <p className="text-xs text-slate-400 mt-1">
                Run the AI Extraction Engine on a project to automatically index verified findings.
              </p>
            </div>
          ) : (
            filteredFindings.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectFinding && onSelectFinding(item)}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-emerald-500/50 transition-all cursor-pointer shadow-sm group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      {item.projectName}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400">• {item.findingTopic}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                    <Sparkles className="w-3 h-3" />
                    <span>{item.confidenceScore}% Confidence</span>
                  </div>
                </div>

                <p className="text-xs font-serif italic text-slate-700 dark:text-slate-300 bg-amber-500/5 p-2.5 rounded-lg border-l-2 border-amber-500/60 mb-2">
                  "{item.extractedStatement || item.supportingQuote}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      {item.sourceDocument} {item.pageNumber ? `(Page ${item.pageNumber})` : ''}
                    </span>
                    <span>Approved by: {item.approvedBy}</span>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 group-hover:underline font-semibold">
                    View Record Details &rarr;
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <span>Synced with HalalChain Firestore Collection `knowledgeRepository`</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
          >
            Close Repository
          </button>
        </div>
      </div>
    </div>
  );
};
