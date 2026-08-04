import React, { useState } from 'react';
import {
  Award,
  Globe,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  QrCode,
  Printer,
  Sparkles
} from 'lucide-react';
import { ReportDisplayLanguage } from '../../types';

interface BilingualCertificateCardProps {
  certificateNumber: string;
  projectName: string;
  projectSymbol: string;
  issuedDate: string;
  expiryDate: string;
  blockchain: string;
  contractAddress: string;
  shariaBoardOpinionEn: string;
  shariaBoardOpinionAr: string;
  aaoifiStandardsList: string[];
  scholarSignatureName: string;
  scholarSignatureTitle: string;
}

export const BilingualCertificateCard: React.FC<BilingualCertificateCardProps> = ({
  certificateNumber,
  projectName,
  projectSymbol,
  issuedDate,
  expiryDate,
  blockchain,
  contractAddress,
  shariaBoardOpinionEn,
  shariaBoardOpinionAr,
  aaoifiStandardsList,
  scholarSignatureName,
  scholarSignatureTitle
}) => {
  const [certLang, setCertLang] = useState<ReportDisplayLanguage>('bilingual');

  const isBilingual = certLang === 'bilingual';
  const isArabicOnly = certLang === 'ar';
  const isEnglishOnly = certLang === 'en';

  return (
    <div className="space-y-4">
      
      {/* Cert Controls */}
      <div className="flex items-center justify-between bg-slate-900 text-white p-3.5 rounded-2xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-400 ml-1" />
          <span className="font-mono font-bold text-slate-400">Certificate Format:</span>
          <div className="flex bg-slate-800 p-0.5 rounded-xl border border-slate-700 font-mono font-bold">
            <button
              onClick={() => setCertLang('en')}
              className={`px-2.5 py-1 rounded-lg ${isEnglishOnly ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'}`}
            >
              English
            </button>
            <button
              onClick={() => setCertLang('ar')}
              className={`px-2.5 py-1 rounded-lg ${isArabicOnly ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'}`}
            >
              العربية
            </button>
            <button
              onClick={() => setCertLang('bilingual')}
              className={`px-2.5 py-1 rounded-lg ${isBilingual ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'}`}
            >
              Side-by-Side (Bilingual)
            </button>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Certificate</span>
        </button>
      </div>

      {/* GOLDEN ISLAMIC CERTIFICATE FRAME */}
      <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white border-2 border-amber-500/40 shadow-2xl space-y-8 overflow-hidden">
        
        {/* Subtle Watermark */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <Award className="w-96 h-96 text-amber-400" />
        </div>

        {/* Certificate Header Banner */}
        <div className="text-center space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
            <Award className="w-4 h-4" />
            <span>HALALCHAIN™ Global Accreditation</span>
          </div>

          {isBilingual ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="text-left border-r border-amber-500/20 pr-4">
                <h2 className="text-xl md:text-2xl font-black text-amber-300 font-serif tracking-tight">
                  SHARIA COMPLIANCE CERTIFICATE
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-1">Official Executive Accreditation</p>
              </div>
              <div dir="rtl" className="text-right pl-4">
                <h2 className="text-xl md:text-2xl font-black text-amber-300 font-serif tracking-tight">
                  شهادة التوافق مع الشريعة الإسلامية
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-1">اعتماد هيئة الرقابة الشرعية العالمية</p>
              </div>
            </div>
          ) : isArabicOnly ? (
            <div dir="rtl" className="text-center space-y-1">
              <h2 className="text-2xl md:text-3xl font-black text-amber-300 font-serif">
                شهادة التوافق مع الشريعة الإسلامية
              </h2>
              <p className="text-xs font-mono text-slate-400">اعتماد هيئة الرقابة الشرعية العالمية</p>
            </div>
          ) : (
            <div className="text-center space-y-1">
              <h2 className="text-2xl md:text-3xl font-black text-amber-300 font-serif">
                SHARIA COMPLIANCE CERTIFICATE
              </h2>
              <p className="text-xs font-mono text-slate-400">Official Executive Accreditation</p>
            </div>
          )}
        </div>

        {/* Project Name & Certificate ID */}
        <div className="bg-amber-500/5 p-6 rounded-2xl border border-amber-500/20 text-center space-y-2 relative z-10">
          <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-widest block">
            Accredited Project Entity
          </span>
          <div className="text-3xl font-black text-white font-serif tracking-wide">
            {projectName} <span className="text-amber-400 text-xl font-mono">({projectSymbol})</span>
          </div>
          <div className="text-xs font-mono text-slate-400 pt-1">
            Certificate ID: <span className="text-amber-300 font-bold">{certificateNumber}</span> • Blockchain: <span className="text-slate-200">{blockchain}</span>
          </div>
        </div>

        {/* Sharia Opinion Body */}
        <div className="space-y-4 relative z-10">
          {isBilingual ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block">
                  Sharia Supervisory Board Ruling (English)
                </span>
                <p className="text-slate-200 font-sans">{shariaBoardOpinionEn}</p>
              </div>
              <div dir="rtl" className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2 text-right">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block">
                  قرار هيئة الرقابة الشرعية (العربية)
                </span>
                <p className="text-slate-200 font-sans">{shariaBoardOpinionAr}</p>
              </div>
            </div>
          ) : isArabicOnly ? (
            <div dir="rtl" className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 text-right space-y-2 text-xs leading-relaxed">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block">
                قرار هيئة الرقابة الشرعية
              </span>
              <p className="text-slate-200 font-sans">{shariaBoardOpinionAr}</p>
            </div>
          ) : (
            <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2 text-xs leading-relaxed">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block">
                Sharia Supervisory Board Ruling
              </span>
              <p className="text-slate-200 font-sans">{shariaBoardOpinionEn}</p>
            </div>
          )}
        </div>

        {/* AAOIFI Alignment Badges */}
        <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono relative z-10">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <BookOpen className="w-4 h-4" />
            <span>AAOIFI Standards Compliance:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {aaoifiStandardsList.map((std) => (
              <span key={std} className="px-2.5 py-1 bg-amber-500/10 text-amber-300 rounded-lg border border-amber-500/30 text-[11px] font-bold">
                {std}
              </span>
            ))}
          </div>
        </div>

        {/* Certificate Signatures & QR Verification */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-amber-500/20 text-xs font-mono relative z-10">
          
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Issuance & Validity</span>
            <div className="text-slate-200 font-bold">Issued: {issuedDate}</div>
            <div className="text-amber-400 font-bold">Valid Until: {expiryDate}</div>
          </div>

          <div className="space-y-1 text-center border-x border-slate-800 px-2">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Sharia Supervisory Board Scholar</span>
            <div className="text-amber-300 font-extrabold font-serif text-sm">{scholarSignatureName}</div>
            <div className="text-slate-400 text-[10px]">{scholarSignatureTitle}</div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <div className="p-2 bg-white rounded-xl shadow">
              <QrCode className="w-12 h-12 text-slate-900" />
            </div>
            <div className="text-right text-[10px] space-y-0.5 text-slate-400">
              <span className="text-emerald-400 font-bold block">✓ On-Chain Verified</span>
              <span>HALALCHAIN-AUTH</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
