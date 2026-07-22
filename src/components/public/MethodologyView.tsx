import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Cpu, Code, Coins, Users, CheckCircle2, FileText, Lock, Award, Search } from 'lucide-react';
import { IslamicPatternBg, GoldFiligreeLine } from '../IslamicPatternBg';

export const MethodologyView: React.FC = () => {
  const { t } = useLanguage();
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      num: '01',
      title: 'Customer Online Application',
      role: 'Customer Portal',
      desc: 'Applicant submits CoinMarketCap/CoinGecko link, whitepaper URL, verified GitHub repo, smart contract addresses, and company KYC profile.'
    },
    {
      num: '02',
      title: 'Centralized AI Automated Collection',
      role: 'Central AI Layer',
      desc: 'HalalChain AI engine auto-crawls documentation, parses whitepaper sections, indexes tokenomics, and scans smart contract bytecode.'
    },
    {
      num: '03',
      title: 'Whitepaper & Business Model Review',
      role: 'Business Analyst',
      desc: 'Deep audit of core business activities, revenue streams, real-world utility, and potential indirect usury or gambling dependencies.'
    },
    {
      num: '04',
      title: 'Smart Contract Bytecode Audit',
      role: 'Technical Auditor',
      desc: 'Inspection of owner privileges (mint, burn, pause, blacklist), fee collector distribution, flash loan vulnerabilities, and proxy upgradeability.'
    },
    {
      num: '05',
      title: 'Tokenomics & Staking Assessment',
      role: 'Financial Analyst',
      desc: 'Evaluation of staking yield mechanisms to verify Mudarabah / Wakalah risk-sharing model vs fixed interest returns.'
    },
    {
      num: '06',
      title: 'Clarification & Evidence Request',
      role: 'In-Platform Communication',
      desc: 'If discrepancies or ambiguities exist, formal structured clarification requests are sent to the customer with full audit logging.'
    },
    {
      num: '07',
      title: 'Senior Scholar Review Panel',
      role: 'Sharia Scholar Board',
      desc: 'Senior Sharia scholars review technical & business findings against AAOIFI Sharia Standards and HalalChain Standard v2.1 to issue formal judgments.'
    },
    {
      num: '08',
      title: 'Quality Assurance Sign-Off',
      role: 'QA Officer',
      desc: 'Independent QA verification ensuring all mandatory evidence, approvals, and legal checklists are complete without missing disclosures.'
    },
    {
      num: '09',
      title: 'Finance & Payment Gate Lock',
      role: 'Finance Officer',
      desc: 'Finance verifies final invoice settlement. System automatically blocks certificate release if unpaid invoices remain.'
    },
    {
      num: '10',
      title: 'Digital Certificate & Public Registry',
      role: 'Blockchain Ledger',
      desc: 'Cryptographic certificate generated with QR code and SHA-256 verification hash, published directly to the public Halal Web3 Registry.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-mono font-medium border border-amber-500/20">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>HalalChain Methodology Standard v2.1</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900">
          Transparent 10-Stage Sharia Assessment Methodology
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Every certificate issued by HalalChain is supported by verifiable technical bytecode evidence, whitepaper analysis, and scholar board sign-off.
        </p>
      </div>

      {/* Interactive Timeline Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Stage Buttons List */}
          <div className="lg:col-span-5 space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {stages.map((stage, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStage(idx)}
                className={`w-full text-left p-3.5 rounded-xl transition-all border flex items-center justify-between cursor-pointer ${
                  activeStage === idx
                    ? 'bg-[#0B132B] text-white border-amber-500 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center ${
                      activeStage === idx ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {stage.num}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">{stage.title}</h4>
                    <span className="text-[10px] opacity-75 font-mono">{stage.role}</span>
                  </div>
                </div>
                {activeStage === idx && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>
            ))}
          </div>

          {/* Active Stage Detail Display Box */}
          <div className="lg:col-span-7 bg-[#0B132B] text-white p-8 rounded-2xl border border-amber-500/30 relative overflow-hidden min-h-[380px] flex flex-col justify-between">
            <IslamicPatternBg />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-3xl font-serif font-bold text-amber-400">
                  STAGE {stages[activeStage].num}
                </span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                  {stages[activeStage].role}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold font-serif text-white">
                  {stages[activeStage].title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {stages[activeStage].desc}
                </p>
              </div>

              <div className="bg-[#1C2541] p-4 rounded-xl border border-amber-500/20 text-xs text-slate-300 space-y-2">
                <span className="text-amber-400 font-mono font-bold block uppercase text-[10px] tracking-wider">
                  Audit Trail Guarantee:
                </span>
                <p>
                  Every action in this stage is digitally signed and permanently recorded in the system audit log with user identity, timestamp, and IP address.
                </p>
              </div>
            </div>

            <div className="relative z-10 pt-4 flex items-center justify-between text-xs font-mono text-amber-300/80">
              <span>Standard v2.1 Compliant</span>
              <span>HalalChain Audit Ledger</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
