import React, { useState } from 'react';
import {
  Building2,
  User,
  ShieldCheck,
  FileCheck,
  Globe,
  Mail,
  Phone,
  Send,
  ExternalLink,
  Edit3,
  Save,
  X,
  CheckCircle2,
  Cpu,
  Sparkles,
  Share2,
  Hash,
  Award,
  BookOpen
} from 'lucide-react';
import { CertificationApplication } from '../../types';

interface Customer360ProfileViewProps {
  project: CertificationApplication;
  onUpdateProject?: (updated: CertificationApplication) => void;
  lang?: 'en' | 'ar' | 'side-by-side';
}

export const Customer360ProfileView: React.FC<Customer360ProfileViewProps> = ({
  project,
  onUpdateProject,
  lang = 'en'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Form state
  const [companyName, setCompanyName] = useState(project.companyName || '');
  const [projectSymbol, setProjectSymbol] = useState(project.projectSymbol || 'PACTG');
  const [blockchain, setBlockchain] = useState(project.blockchain || 'Ethereum Mainnet');
  const [legalCountry, setLegalCountry] = useState(project.legalCountry || 'United Arab Emirates');
  const [websiteUrl, setWebsiteUrl] = useState(project.websiteUrl || '');
  const [cmcUrl, setCmcUrl] = useState(project.cmcUrl || '');
  const [coingeckoUrl, setCoingeckoUrl] = useState(project.coingeckoUrl || '');

  // Contact
  const [representativeName, setRepresentativeName] = useState(project.representativeName || '');
  const [repPosition, setRepPosition] = useState('Chief Executive Officer');
  const [officialEmail, setOfficialEmail] = useState(project.officialEmail || '');
  const [phone, setPhone] = useState(project.phone || '+971 4 800 4252');
  const [telegram, setTelegram] = useState(project.telegram || '');
  const [xHandle, setXHandle] = useState(project.xHandle || '');
  const [discord, setDiscord] = useState('https://discord.gg/' + (project.projectSymbol || 'halal').toLowerCase());
  const [linkedIn, setLinkedIn] = useState('https://linkedin.com/company/' + (project.companyName || 'halal').toLowerCase().replace(/\s+/g, '-'));

  // Contract & Whitepaper
  const [contractAddress, setContractAddress] = useState(project.contractAddress || '0x0000000000000000000000000000000000000000');
  const [whitepaperUrl, setWhitepaperUrl] = useState(project.whitepaperUrl || '');

  const isRtl = lang === 'ar';
  const showDual = lang === 'side-by-side';

  const handleSave = async () => {
    setIsSaving(true);
    const updatedApp: CertificationApplication = {
      ...project,
      companyName,
      projectSymbol,
      blockchain,
      legalCountry,
      websiteUrl,
      cmcUrl,
      coingeckoUrl,
      representativeName,
      officialEmail,
      phone,
      telegram,
      xHandle,
      contractAddress,
      whitepaperUrl
    };

    try {
      const res = await fetch(`/api/applications/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedApp)
      });
      if (res.ok && onUpdateProject) {
        onUpdateProject(updatedApp);
      }
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 4000);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating customer 360 profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'published_registry':
        return 'Certified & Published in Master Registry';
      case 'certificate_generation':
        return 'Certificate Ready for Issuance';
      case 'quality_assurance':
        return 'QA Audit Sign-Off';
      case 'scholar_review':
        return 'Sharia Board Review';
      case 'business_review':
        return 'Business & Tokenomics Review';
      case 'technical_review':
        return 'Smart Contract Security Review';
      case 'ai_assessment':
        return 'AI Knowledge Extraction';
      case 'waiting_deposit':
        return 'Awaiting Initial Deposit';
      default:
        return stage.replace(/_/g, ' ').toUpperCase();
    }
  };

  return (
    <div className={`space-y-6 ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Customer 360 Record • ID: {project.id}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-200 dark:border-emerald-800">
              Single Source of Truth
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2 font-serif">
            {project.companyName} {project.projectSymbol ? `(${project.projectSymbol})` : ''}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Synchronized with CRM, Assessment Engine, Smart Project Wizard, Certificates & Registry
          </p>
        </div>

        <div className="flex items-center gap-2">
          {syncSuccess && (
            <div className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Synchronized Across All Modules!</span>
            </div>
          )}

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Customer Profile</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving & Syncing...' : 'Save & Sync All'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid of 4 Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SECTION 1: COMPANY INFORMATION */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase font-mono">
              <Building2 className="w-4 h-4" />
              <span>1. Company & Project Identity</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Public & Market Identifiers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Company Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-indigo-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              ) : (
                <div className="font-bold text-slate-900 dark:text-white">{companyName}</div>
              )}
            </div>

            <div>
              <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Token Symbol / Ticker</label>
              {isEditing ? (
                <input
                  type="text"
                  value={projectSymbol}
                  onChange={(e) => setProjectSymbol(e.target.value)}
                  className="w-full p-2 rounded-xl border border-indigo-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              ) : (
                <div className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-lg inline-block border border-indigo-200 dark:border-indigo-800">
                  {projectSymbol}
                </div>
              )}
            </div>

            <div>
              <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Blockchain Network</label>
              {isEditing ? (
                <input
                  type="text"
                  value={blockchain}
                  onChange={(e) => setBlockchain(e.target.value)}
                  className="w-full p-2 rounded-xl border border-indigo-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              ) : (
                <div className="font-bold text-slate-900 dark:text-white">{blockchain}</div>
              )}
            </div>

            <div>
              <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Legal Jurisdiction</label>
              {isEditing ? (
                <input
                  type="text"
                  value={legalCountry}
                  onChange={(e) => setLegalCountry(e.target.value)}
                  className="w-full p-2 rounded-xl border border-indigo-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              ) : (
                <div className="font-bold text-slate-900 dark:text-white">{legalCountry}</div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Official Website</label>
              {isEditing ? (
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full p-2 rounded-xl border border-indigo-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              ) : (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center gap-1"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{websiteUrl}</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
            </div>

            <div>
              <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">CoinMarketCap Link</label>
              {isEditing ? (
                <input
                  type="text"
                  value={cmcUrl}
                  onChange={(e) => setCmcUrl(e.target.value)}
                  className="w-full p-2 rounded-xl border border-indigo-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              ) : cmcUrl ? (
                <a href={cmcUrl} target="_blank" rel="noreferrer" className="text-amber-600 dark:text-amber-400 hover:underline font-bold flex items-center gap-1">
                  <span>CMC Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-slate-400 italic">Not Linked</span>
              )}
            </div>

            <div>
              <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">CoinGecko Link</label>
              {isEditing ? (
                <input
                  type="text"
                  value={coingeckoUrl}
                  onChange={(e) => setCoingeckoUrl(e.target.value)}
                  className="w-full p-2 rounded-xl border border-indigo-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              ) : coingeckoUrl ? (
                <a href={coingeckoUrl} target="_blank" rel="noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1">
                  <span>CoinGecko Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-slate-400 italic">Not Linked</span>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: CONTACTS & COMMUNICATION ACCESS */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase font-mono">
              <User className="w-4 h-4" />
              <span>2. Verified Contacts & Reps</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Direct Communication Handles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Primary Representative</label>
              {isEditing ? (
                <input
                  type="text"
                  value={representativeName}
                  onChange={(e) => setRepresentativeName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-indigo-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              ) : (
                <div className="font-bold text-slate-900 dark:text-white">{representativeName}</div>
              )}
            </div>

            <div>
              <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Position / Title</label>
              {isEditing ? (
                <input
                  type="text"
                  value={repPosition}
                  onChange={(e) => setRepPosition(e.target.value)}
                  className="w-full p-2 rounded-xl border border-indigo-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              ) : (
                <div className="font-bold text-slate-700 dark:text-slate-300">{repPosition}</div>
              )}
            </div>

            <div>
              <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Official Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={officialEmail}
                  onChange={(e) => setOfficialEmail(e.target.value)}
                  className="w-full p-2 rounded-xl border border-indigo-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              ) : (
                <a href={`mailto:${officialEmail}`} className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{officialEmail}</span>
                </a>
              )}
            </div>

            <div>
              <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 rounded-xl border border-indigo-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              ) : (
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{phone}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Telegram Handle</label>
              {isEditing ? (
                <input
                  type="text"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  className="w-full p-2 rounded-xl border border-indigo-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              ) : telegram ? (
                <a href={telegram.startsWith('http') ? telegram : `https://t.me/${telegram.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-sky-600 dark:text-sky-400 hover:underline font-bold flex items-center gap-1">
                  <Send className="w-3.5 h-3.5" />
                  <span>{telegram}</span>
                </a>
              ) : (
                <span className="text-slate-400 italic">Not Provided</span>
              )}
            </div>

            <div>
              <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">X (Twitter)</label>
              {isEditing ? (
                <input
                  type="text"
                  value={xHandle}
                  onChange={(e) => setXHandle(e.target.value)}
                  className="w-full p-2 rounded-xl border border-indigo-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              ) : xHandle ? (
                <a href={xHandle.startsWith('http') ? xHandle : `https://x.com/${xHandle.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-slate-900 dark:text-slate-100 hover:underline font-bold">
                  {xHandle}
                </a>
              ) : (
                <span className="text-slate-400 italic">Not Provided</span>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: PROJECT & WORKFLOW ASSIGNMENTS */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>3. Project & Audit Assignments</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">HalalChain Audit Team</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Current Stage:</span>
              <span className="font-extrabold text-amber-600 dark:text-amber-400 uppercase bg-amber-50 dark:bg-amber-950 px-2.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                {getStageLabel(project.stage)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Package Tier:</span>
              <span className="font-bold text-slate-900 dark:text-white">{project.packageType} Service Level</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Target SLA Date:</span>
              <span className="font-bold text-amber-700 dark:text-amber-300">{project.targetCompletionDate}</span>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Assigned Specialist Reviewers</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 block">Lead Scholar:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{project.assignedReviewers?.scholar || 'Sheikh Dr. Ibrahim Al-Kuwaiti'}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 block">Technical Auditor:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{project.assignedReviewers?.tech_auditor || 'Dr. Ziyad Al-Hassan'}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 block">Business Analyst:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{project.assignedReviewers?.business_analyst || 'Tariq Al-Mansoor'}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 block">QA Officer:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{project.assignedReviewers?.qa || 'Elena Rostova'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: ASSESSMENT & EVIDENCE SUMMARY */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase font-mono">
              <Cpu className="w-4 h-4" />
              <span>4. Assessment & AI Intelligence</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Evidence Verification</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between items-center p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-slate-900 dark:text-white">AI Engine Confidence:</span>
              </div>
              <span className="text-base font-black text-amber-600 dark:text-amber-400">94.8% High Confidence</span>
            </div>

            <div>
              <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Smart Contract Bytecode Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  className="w-full p-2 rounded-xl border border-indigo-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px]"
                />
              ) : (
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200 truncate">
                  {contractAddress}
                </div>
              )}
            </div>

            <div>
              <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Whitepaper Source Document</label>
              {isEditing ? (
                <input
                  type="text"
                  value={whitepaperUrl}
                  onChange={(e) => setWhitepaperUrl(e.target.value)}
                  className="w-full p-2 rounded-xl border border-indigo-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px]"
                />
              ) : (
                <a href={whitepaperUrl} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="truncate">{whitepaperUrl}</span>
                </a>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800">
              <span>Deposit Paid: <strong className={project.depositPaid ? 'text-emerald-600' : 'text-rose-600'}>{project.depositPaid ? 'YES ✓' : 'NO ✕'}</strong></span>
              <span>Final Fee Paid: <strong className={project.finalPaid ? 'text-emerald-600' : 'text-rose-600'}>{project.finalPaid ? 'YES ✓' : 'NO ✕'}</strong></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
