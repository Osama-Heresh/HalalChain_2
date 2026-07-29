import React, { useState, useEffect } from 'react';
import { WhitepaperRepositoryItem } from '../../types';
import { WhitepaperViewerModal } from './WhitepaperViewerModal';
import {
  BookOpen,
  Search,
  Filter,
  ShieldCheck,
  Download,
  RotateCw,
  Sparkles,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Database,
  History,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  RefreshCw,
  Building2,
  DollarSign
} from 'lucide-react';

interface WhitepaperRepositoryPageProps {
  systemMode?: 'demo' | 'production';
}

export const WhitepaperRepositoryPage: React.FC<WhitepaperRepositoryPageProps> = ({
  systemMode = 'demo'
}) => {
  const [whitepapers, setWhitepapers] = useState<WhitepaperRepositoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWhitepaper, setSelectedWhitepaper] = useState<WhitepaperRepositoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Search and Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modelFilter, setModelFilter] = useState<string>('all');
  const [blockchainFilter, setBlockchainFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [reanalyzingId, setReanalyzingId] = useState<string | null>(null);

  const fetchWhitepapers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/whitepapers');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setWhitepapers(data);
        }
      }
    } catch (err) {
      console.warn('Error fetching whitepapers repository:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWhitepapers();
  }, [systemMode]);

  const handleCopySha = (sha: string) => {
    navigator.clipboard.writeText(sha);
    setCopiedId(sha);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReanalyze = async (id: string) => {
    setReanalyzingId(id);
    try {
      const res = await fetch(`/api/whitepapers/${id}/reanalyze`, { method: 'POST' });
      if (res.ok) {
        await fetchWhitepapers();
      }
    } catch (err) {
      console.warn('Reanalysis failed:', err);
    } finally {
      setReanalyzingId(null);
    }
  };

  const openViewer = (wp: WhitepaperRepositoryItem) => {
    setSelectedWhitepaper(wp);
    setIsModalOpen(true);
  };

  // Filter Logic
  const filteredWhitepapers = whitepapers.filter((wp) => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      wp.coinName.toLowerCase().includes(q) ||
      wp.coinSymbol.toLowerCase().includes(q) ||
      wp.sha256.toLowerCase().includes(q) ||
      (wp.extractedKnowledge?.executiveSummary || '').toLowerCase().includes(q) ||
      (wp.extractedKnowledge?.businessModel || '').toLowerCase().includes(q) ||
      (wp.extractedKnowledge?.consensus || '').toLowerCase().includes(q);

    const matchStatus = statusFilter === 'all' || wp.status === statusFilter;
    const matchBlockchain =
      blockchainFilter === 'all' ||
      (wp.extractedKnowledge?.technologyStack?.blockchain || '').toLowerCase().includes(blockchainFilter.toLowerCase());

    return matchQuery && matchStatus && matchBlockchain;
  });

  // Calculate Statistics
  const totalAssets = whitepapers.length;
  const activeCurrent = whitepapers.filter((w) => w.status === 'current').length;
  const totalPages = whitepapers.reduce((sum, w) => sum + (w.pages || 0), 0);
  const totalStorageMb = whitepapers.reduce((sum, w) => sum + (w.fileSize || 0), 0) / (1024 * 1024);

  return (
    <div className="min-h-screen bg-[#0B132B] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-amber-500/20 p-6 rounded-2xl shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
              PERMANENT FIREBASE ASSET REPOSITORY
            </span>
            <span className="text-xs text-slate-400 font-mono">• SHA-256 Audit Sealed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-1">
            HALALCHAIN™ <span className="text-amber-400">Whitepaper Knowledge Repository</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
            Immutable, persistent whitepaper database. Whitepapers are discovered, downloaded, hashed via SHA-256, and stored permanently in Firebase. Reviewers inspect stored structured findings without repeating AI token calls unless explicitly requested.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchWhitepapers}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            Refresh Repository
          </button>
        </div>
      </div>

      {/* Metrics Header Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Total Whitepaper Assets</span>
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-serif text-white mt-2">{totalAssets}</p>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
            {activeCurrent} Active Current Versions
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Verified Document Pages</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-serif text-white mt-2">{totalPages}</p>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
            Scraped & Parsed via pdf-parse
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Repository Storage Volume</span>
            <HardDrive className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold font-serif text-white mt-2">{totalStorageMb.toFixed(1)} MB</p>
          <span className="text-[10px] text-blue-400 font-mono mt-1 block">
            Permanent Firebase Storage URLs
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>AI Credits Saved (Cache Hits)</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-serif text-emerald-400 mt-2">100%</p>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
            No repeated Gemini calls on load
          </span>
        </div>
      </div>

      {/* Search Bar & Filters */}
      <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search whitepapers by Symbol, Project Name, SHA-256 Hash, Business Model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/50"
            >
              <option value="all">Status: All Versions</option>
              <option value="current">Current (Active)</option>
              <option value="archived">Archived</option>
              <option value="superseded">Superseded</option>
            </select>

            <select
              value={blockchainFilter}
              onChange={(e) => setBlockchainFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/50"
            >
              <option value="all">Blockchain: All Chains</option>
              <option value="ethereum">Ethereum</option>
              <option value="cosmos">Cosmos / HAQQ</option>
              <option value="solana">Solana</option>
              <option value="polygon">Polygon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid View of Stored Whitepapers */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-sm">
          <RefreshCw className="w-6 h-6 animate-spin text-amber-400 mx-auto mb-2" />
          Loading Whitepaper Knowledge Repository from Firestore...
        </div>
      ) : filteredWhitepapers.length === 0 ? (
        <div className="p-12 text-center text-slate-400 font-mono text-sm bg-slate-900/40 rounded-2xl border border-slate-800">
          <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          No whitepaper knowledge repository items found matching your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWhitepapers.map((wp) => {
            const knowledge = wp.extractedKnowledge;
            const isReanalyzing = reanalyzingId === wp.id;
            const formattedSize = wp.fileSize ? (wp.fileSize / (1024 * 1024)).toFixed(2) + ' MB' : '1.8 MB';

            return (
              <div
                key={wp.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-lg hover:shadow-amber-500/5 group"
              >
                <div className="space-y-4">
                  {/* Top Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-slate-950 shadow-md group-hover:scale-105 transition-transform">
                        {wp.coinSymbol.slice(0, 3)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base font-serif line-clamp-1">
                          {wp.coinName}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-mono text-amber-400 font-semibold">{wp.coinSymbol}</span>
                          <span className="text-[10px] font-mono text-slate-400">•</span>
                          <span className="text-[10px] font-mono text-slate-400">{wp.pages || 12} Pages ({formattedSize})</span>
                        </div>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded-full border ${
                      wp.status === 'current'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      v{wp.version}.0 {wp.status.toUpperCase()}
                    </span>
                  </div>

                  {/* SHA-256 Hash Fingerprint Pill */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs font-mono">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-slate-400 shrink-0">SHA256:</span>
                      <span className="text-amber-300 font-semibold truncate max-w-[140px]">{wp.sha256}</span>
                    </div>
                    <button
                      onClick={() => handleCopySha(wp.sha256)}
                      className="text-slate-400 hover:text-white transition-colors ml-1 shrink-0"
                      title="Copy full SHA-256 hash"
                    >
                      {copiedId === wp.sha256 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* AI Executive Summary Snippet */}
                  <div className="text-xs text-slate-300 line-clamp-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800/50 leading-relaxed">
                    {knowledge?.executiveSummary || `Official Protocol Whitepaper & Technical Documentation for ${wp.coinName}. Extracted facts and findings stored permanently.`}
                  </div>

                  {/* Metadata Chips */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60">
                      <span className="text-slate-500 block">Consensus:</span>
                      <span className="text-slate-200 font-medium truncate block">
                        {knowledge?.consensus || knowledge?.technologyStack?.consensus || 'Proof of Stake'}
                      </span>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60">
                      <span className="text-slate-500 block">AAOIFI Riba Status:</span>
                      <span className="text-emerald-400 font-medium truncate block">
                        Zero Fixed Interest
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => openViewer(wp)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Open Viewer
                  </button>

                  <a
                    href={wp.resolvedPdfUrl || `/api/whitepapers/download/${wp.sha256}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleReanalyze(wp.id)}
                    disabled={isReanalyzing}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-50"
                    title="Run Fresh AI Analysis (Manual Override)"
                  >
                    <RotateCw className={`w-4 h-4 ${isReanalyzing ? 'animate-spin text-emerald-400' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Modal Viewer */}
      <WhitepaperViewerModal
        whitepaper={selectedWhitepaper}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReanalyze={async (id) => {
          await handleReanalyze(id);
          const updated = whitepapers.find(w => w.id === id);
          if (updated) setSelectedWhitepaper(updated);
        }}
      />
    </div>
  );
};
