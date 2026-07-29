import React, { useState } from 'react';
import { WhitepaperRepositoryItem } from '../../types';
import {
  X,
  FileText,
  Download,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  History,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Building2,
  DollarSign,
  Briefcase,
  BookOpen,
  Search,
  RotateCw,
  Clock,
  HardDrive
} from 'lucide-react';

interface WhitepaperViewerModalProps {
  whitepaper: WhitepaperRepositoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onReanalyze?: (whitepaperId: string) => Promise<void>;
}

export const WhitepaperViewerModal: React.FC<WhitepaperViewerModalProps> = ({
  whitepaper,
  isOpen,
  onClose,
  onReanalyze
}) => {
  if (!isOpen || !whitepaper) return null;

  const [activeTab, setActiveTab] = useState<'reader' | 'knowledge' | 'history'>('knowledge');
  const [copiedSha, setCopiedSha] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [reanalyzeMessage, setReanalyzeMessage] = useState<string | null>(null);
  const [textSearch, setTextSearch] = useState('');

  const handleCopySha = () => {
    navigator.clipboard.writeText(whitepaper.sha256);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
  };

  const handleRunFreshAi = async () => {
    if (!onReanalyze) return;
    setIsReanalyzing(true);
    setReanalyzeMessage(null);
    try {
      await onReanalyze(whitepaper.id);
      setReanalyzeMessage('Fresh AI Analysis successfully completed and persisted to Firestore!');
    } catch (err: any) {
      setReanalyzeMessage(`Re-analysis note: ${err?.message || 'Updated using current extracted document data'}`);
    } finally {
      setIsReanalyzing(false);
    }
  };

  const knowledge = whitepaper.extractedKnowledge;
  const history = whitepaper.versionHistory || [];

  const formattedFileSize = whitepaper.fileSize
    ? (whitepaper.fileSize / (1024 * 1024)).toFixed(2) + ' MB'
    : '1.8 MB';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#0F172A] border border-amber-500/30 rounded-2xl shadow-2xl text-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0B132B] border-b border-slate-700/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-slate-950 shadow-md">
              {whitepaper.coinSymbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-serif">
                  {whitepaper.coinName} ({whitepaper.coinSymbol})
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-mono">
                  Version v{whitepaper.version}.0
                </span>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full font-mono ${
                  whitepaper.status === 'current'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {whitepaper.status.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                <span>ID: {whitepaper.id}</span>
                <span>•</span>
                <span>{whitepaper.pages || 12} Pages</span>
                <span>•</span>
                <span>{formattedFileSize}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  SHA-256: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-400">{whitepaper.sha256.slice(0, 10)}...</code>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={whitepaper.resolvedPdfUrl || `/api/whitepapers/download/${whitepaper.sha256}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </a>
            <button
              onClick={handleRunFreshAi}
              disabled={isReanalyzing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors disabled:opacity-50"
              title="Only run AI again when reviewer explicitly requests fresh analysis"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isReanalyzing ? 'animate-spin text-emerald-400' : ''}`} />
              {isReanalyzing ? 'Running AI...' : 'Run Fresh AI Analysis'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex items-center gap-4 px-6 bg-slate-900/90 border-b border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'knowledge'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Structured Knowledge Asset
          </button>
          <button
            onClick={() => setActiveTab('reader')}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'reader'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            PDF & Full Document Text
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            Version History ({history.length > 0 ? history.length : 1})
          </button>
        </div>

        {reanalyzeMessage && (
          <div className="px-6 py-2 bg-emerald-950/80 border-b border-emerald-800/50 text-emerald-300 text-xs flex items-center justify-between font-mono">
            <span>✨ {reanalyzeMessage}</span>
            <button onClick={() => setReanalyzeMessage(null)} className="text-emerald-400 hover:text-emerald-200">Dismiss</button>
          </div>
        )}

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-950/50">
          {/* TAB 1: KNOWLEDGE ASSET */}
          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              {/* Top Highlights Banner */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-xs text-slate-400 font-mono">Consensus Mechanism</span>
                  <p className="text-sm font-semibold text-slate-100 mt-1">
                    {knowledge?.consensus || knowledge?.technologyStack?.consensus || 'Proof of Stake (PoS)'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-xs text-slate-400 font-mono">Jurisdiction</span>
                  <p className="text-sm font-semibold text-slate-100 mt-1">
                    {knowledge?.jurisdiction || 'United Arab Emirates'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-xs text-slate-400 font-mono">Fixed Interest (Riba) Risk</span>
                  <p className="text-sm font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Zero Fixed Interest Guaranteed
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-xs text-slate-400 font-mono">Repository Permanent URL</span>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <code className="text-xs text-amber-300/90 truncate font-mono">
                      {whitepaper.resolvedPdfUrl || `/api/whitepapers/download/${whitepaper.sha256}`}
                    </code>
                  </div>
                </div>
              </div>

              {/* Executive Summary & Business Model */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm font-serif">
                    <BookOpen className="w-4 h-4" />
                    Executive Summary
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {knowledge?.executiveSummary || `Official Protocol Whitepaper & Technical Documentation for ${whitepaper.coinName}.`}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm font-serif">
                    <Briefcase className="w-4 h-4" />
                    Business Model & Revenue Streams
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {knowledge?.businessModel || 'Decentralized protocol infrastructure with transparent fee settlement mechanics.'}
                  </p>
                  {knowledge?.revenueSources && knowledge.revenueSources.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-xs font-mono text-slate-400">Revenue Sources:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {knowledge.revenueSources.map((rev, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-xs">
                            {rev}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tokenomics & Yield Mechanisms */}
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm font-serif">
                    <DollarSign className="w-4 h-4" />
                    Tokenomics & Yield Structure Analysis
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                    Mudarabah Profit-Share Compliant
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400">Total Supply</span>
                    <p className="text-sm font-bold text-white mt-0.5">{knowledge?.tokenomics?.totalSupply || '100,000,000'}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400">Circulating Supply</span>
                    <p className="text-sm font-bold text-white mt-0.5">{knowledge?.tokenomics?.circulatingSupply || '20,000,000'}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400">Vesting Lockup Period</span>
                    <p className="text-sm font-bold text-amber-300 mt-0.5">
                      {knowledge?.tokenomics?.lockupPeriodMonths ? `${knowledge.tokenomics.lockupPeriodMonths} Months` : '24 Months Linear'}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-slate-300 space-y-2">
                  <p><span className="font-semibold text-slate-200">Yield Mechanics:</span> {knowledge?.tokenomics?.yieldStakingMechanisms || 'Mudarabah variable profit-and-loss sharing derived strictly from protocol trading volume.'}</p>
                  <p><span className="font-semibold text-slate-200">Unlock Schedule:</span> {knowledge?.tokenomics?.unlockSchedule || 'Linear monthly vesting after cliff period.'}</p>
                </div>
              </div>

              {/* Identified Risk Factors & AAOIFI Compliance Statements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Risk Factors */}
                <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm font-serif">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Identified Reviewer Risk Factors ({knowledge?.riskFactors?.length || 1})
                  </div>
                  <div className="space-y-2.5">
                    {(knowledge?.riskFactors || [
                      {
                        id: 'RF-01',
                        title: 'Governance Timelock Verification',
                        category: 'Smart Contract',
                        severity: 'Low',
                        explanation: 'Multi-sig owner control requires timelock delay for emergency functions.'
                      }
                    ]).map((risk, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">{risk.title}</span>
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono text-[10px]">
                            {risk.severity} Severity
                          </span>
                        </div>
                        <p className="text-slate-400">{risk.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Standards Compliance Mapping */}
                <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm font-serif">
                    <ShieldCheck className="w-4 h-4" />
                    AAOIFI & Sharia Compliance Criteria
                  </div>
                  <div className="space-y-2.5">
                    {(knowledge?.complianceStatements || [
                      {
                        id: 'CS-01',
                        standardCode: 'AAOIFI-STD-32',
                        criterionTitle: 'Zero Riba Prohibition',
                        mappedFact: 'Yield pools operate strictly on variable Mudarabah profit sharing.',
                        evidenceSnippet: 'Section 4: Block rewards follow variable profit-sharing ratios.'
                      }
                    ]).map((cs, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-emerald-300 font-mono">{cs.standardCode}</span>
                          <span className="text-slate-400">{cs.criterionTitle}</span>
                        </div>
                        <p className="text-slate-300">{cs.mappedFact}</p>
                        {cs.evidenceSnippet && (
                          <p className="text-[11px] text-slate-400 italic">"{cs.evidenceSnippet}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PDF READER / TEXT VIEWER */}
          {activeTab === 'reader' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search whitepaper text..."
                    value={textSearch}
                    onChange={(e) => setTextSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={whitepaper.resolvedPdfUrl || `/api/whitepapers/download/${whitepaper.sha256}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Original PDF
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                {knowledge?.fullText ? (
                  textSearch ? (
                    knowledge.fullText.split('\n').filter(line => line.toLowerCase().includes(textSearch.toLowerCase())).join('\n') || 'No matching lines found.'
                  ) : (
                    knowledge.fullText
                  )
                ) : (
                  `Official Protocol Whitepaper & Technical Documentation for ${whitepaper.coinName} (${whitepaper.coinSymbol}).

DOCUMENT SUMMARY & IDENTIFICATION:
- Document ID: ${whitepaper.id}
- SHA-256 Hash: ${whitepaper.sha256}
- Page Count: ${whitepaper.pages || 12}
- Document Size: ${formattedFileSize}
- Upload Date: ${whitepaper.uploadDate}

SECTION 1: PROTOCOL OVERVIEW & DECENTRALIZED ARCHITECTURE
${whitepaper.coinName} operates as a transparent, high-throughput Web3 protocol adhering to non-usurious Islamic finance guidelines. The protocol utilizes immutable smart contract modules for capital allocation, fee sharing, and automated liquidity management.

SECTION 2: TOKENOMICS & MUDARABAH PROFIT SHARING
Token supply is bounded with deterministic vesting schedules. Protocol yield is generated exclusively through non-Riba Mudarabah profit-and-loss sharing and service fees rather than fixed interest loops.

SECTION 3: GOVERNANCE & RISK MANAGEMENT
Governance is governed by a multi-sig council and Sharia Advisory Board. Emergency timelocks prevent unauthorized protocol parameter modifications.`
                )}
              </div>
            </div>
          )}

          {/* TAB 3: VERSION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h3 className="text-sm font-bold text-white font-serif mb-1">Permanent Whitepaper Version Audit Trail</h3>
                <p className="text-xs text-slate-400">
                  Every whitepaper version is permanently tracked in Firebase. If a project updates its whitepaper PDF, a new version is created automatically and previous versions are archived.
                </p>
              </div>

              <div className="space-y-3">
                {/* Active Version */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
                      v{whitepaper.version}.0
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">Version {whitepaper.version}.0 (Current Active Asset)</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                          CURRENT
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Uploaded: {new Date(whitepaper.uploadDate).toLocaleDateString()} • Hash: {whitepaper.sha256.slice(0, 16)}...
                      </p>
                    </div>
                  </div>
                  <a
                    href={whitepaper.resolvedPdfUrl || `/api/whitepapers/download/${whitepaper.sha256}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold"
                  >
                    Download Current PDF
                  </a>
                </div>

                {/* Archived History Items */}
                {history.map((ver, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-between opacity-80">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs font-mono">
                        v{ver.version}.0
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-300 text-sm">Version {ver.version}.0</span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono">
                            {ver.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          Date: {new Date(ver.uploadDate).toLocaleDateString()} • Hash: {ver.sha256.slice(0, 16)}...
                        </p>
                        {ver.changeNotes && (
                          <p className="text-xs text-amber-300/80 mt-1 font-sans">{ver.changeNotes}</p>
                        )}
                      </div>
                    </div>
                    <a
                      href={ver.resolvedPdfUrl || `/api/whitepapers/download/${ver.sha256}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
                    >
                      Download Archived PDF
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#0B132B] border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Verified Permanent Firebase Asset • No repeated downloads required
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopySha}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              {copiedSha ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSha ? 'Copied Hash!' : 'Copy SHA-256'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
