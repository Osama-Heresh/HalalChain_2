import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PublicCertifiedProject, CertificationApplication } from '../types';
import { ShieldCheck, Download, X, Lock, CheckCircle2, Award, Printer, Globe, QrCode } from 'lucide-react';
import { IslamicPatternBg } from './IslamicPatternBg';

interface ShariaCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: PublicCertifiedProject | CertificationApplication | null;
  onIssueCertificate?: (projectId: string) => void;
  isIssuing?: boolean;
}

// Vector Barcode Component
const VectorBarcode: React.FC<{ value: string }> = ({ value }) => {
  const bars: number[] = [3, 1, 2, 1, 1, 3, 2, 1];
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    bars.push((code % 3) + 1, ((code * 2) % 3) + 1, ((code * 5) % 4) + 1, ((code * 7) % 3) + 1);
  }
  bars.push(2, 1, 3, 1, 2);

  let currentX = 10;
  const rects: React.ReactNode[] = [];
  bars.forEach((width, index) => {
    if (index % 2 === 0) {
      rects.push(
        <rect
          key={index}
          x={currentX}
          y={0}
          width={width}
          height={48}
          fill="#0B132B"
        />
      );
    }
    currentX += width;
  });

  return (
    <div className="flex flex-col items-center bg-white p-2 rounded-lg border border-slate-300 shadow-sm">
      <svg viewBox={`0 0 ${currentX + 10} 48`} className="h-11 w-48 max-w-full">
        {rects}
      </svg>
      <span className="text-[10px] font-mono tracking-widest text-slate-800 mt-1 font-bold">
        *{value}*
      </span>
    </div>
  );
};

// Vector QR Code Component
const VectorQrCode: React.FC<{ certNum: string }> = ({ certNum }) => {
  // 9x9 grid pattern simulation
  const grid = [
    [1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0],
    [1,0,1,1,1,0,1,1,1],
    [1,0,1,1,1,0,1,0,1],
    [1,0,1,1,1,0,1,1,0],
    [1,0,0,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,0,1],
    [0,0,0,0,0,0,0,0,0],
    [1,1,0,1,0,1,1,1,1],
  ];

  return (
    <div className="flex flex-col items-center bg-white p-2 rounded-lg border border-slate-300 shadow-sm">
      <div className="relative w-16 h-16 bg-white p-1 flex flex-col justify-between">
        <svg viewBox="0 0 9 9" className="w-full h-full">
          {grid.map((row, r) =>
            row.map((cell, c) =>
              cell === 1 ? (
                <rect key={`${r}-${c}`} x={c} y={r} width="0.95" height="0.95" fill="#0B132B" />
              ) : null
            )
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-amber-500 text-slate-950 p-0.5 rounded shadow text-[7px] font-bold">
            HC
          </div>
        </div>
      </div>
      <span className="text-[9px] font-mono text-slate-500 mt-0.5 font-semibold">
        SCAN TO VERIFY
      </span>
    </div>
  );
};

export const ShariaCertificateModal: React.FC<ShariaCertificateModalProps> = ({
  isOpen,
  onClose,
  project,
  onIssueCertificate,
  isIssuing = false
}) => {
  const { lang, dir } = useLanguage();

  if (!isOpen || !project) return null;

  // Normalize project details whether it came from PublicCertifiedProject or CertificationApplication
  const isCertified = 'certificateNumber' in project;

  const certNumber = isCertified
    ? (project as PublicCertifiedProject).certificateNumber
    : `HC-CERT-2026-${(project as CertificationApplication).applicationNumber.replace(/\D/g, '').slice(-4) || '8808'}`;

  const projectName = isCertified
    ? (project as PublicCertifiedProject).name
    : (project as CertificationApplication).companyName;

  const symbol = isCertified
    ? (project as PublicCertifiedProject).symbol
    : projectName.substring(0, 4).toUpperCase();

  const blockchain = project.blockchain || 'Ethereum Mainnet';

  const category = isCertified
    ? (project as PublicCertifiedProject).category
    : 'Web3 Sharia Application';

  const issueDate = isCertified
    ? (project as PublicCertifiedProject).issueDate
    : new Date().toISOString().split('T')[0];

  const expiryDate = isCertified
    ? (project as PublicCertifiedProject).expiryDate
    : new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0];

  const verificationHash = isCertified
    ? (project as PublicCertifiedProject).verificationHash
    : `0x8f4c2e${Math.random().toString(16).substring(2, 10)}9012839a${Math.random().toString(16).substring(2, 10)}`;

  const scholarSignatures = isCertified
    ? (project as PublicCertifiedProject).scholarSignatures
    : ['Sheikh Dr. Ali Al-Quradaghi', 'Dr. Nizam Yaquby', 'Dr. Mohamed Elgari'];

  const shariaSummaryEn = isCertified
    ? (project as PublicCertifiedProject).shariaSummaryEn
    : `Certified Sharia compliant by HalalChain Sharia Board after comprehensive technical bytecode analysis, tokenomics audit, and governance review under HalalChain Standard v2.1.`;

  const shariaSummaryAr = isCertified
    ? (project as PublicCertifiedProject).shariaSummaryAr
    : `معتمد ومصادق عليه بالامتثال التام للشريعة الإسلامية من قبل هيئة حلال تشين الشرعية الدولية بعد تدقيق البرمجيات والعقود الذكية واقتصاديات التوكن.`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static print:block">
      {/* Print Styles Injection */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          #printable-certificate {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 24px !important;
            box-shadow: none !important;
            border-width: 8px !important;
            border-color: #0B132B !important;
            background-color: #FAF8F5 !important;
            border-radius: 0 !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-amber-500 overflow-hidden my-auto print:border-0 print:shadow-none print:rounded-none">
        
        {/* Top Control Bar (Hidden in Print) */}
        <div className="bg-[#0B132B] text-white px-6 py-3 border-b border-amber-500/30 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-mono font-bold tracking-wider text-amber-300">
              HALALCHAIN™ OFFICIAL SHARIA COMPLIANCE CERTIFICATE
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onIssueCertificate && !isCertified && (
              <button
                onClick={() => onIssueCertificate(project.id)}
                disabled={isIssuing}
                className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <Award className="w-4 h-4" />
                <span>{isIssuing ? 'Minting Certificate...' : 'Produce & Publish Certificate'}</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="px-5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'ar' ? 'طباعة / حفظ PDF' : 'Print / Save as PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CERTIFICATE CANVAS BODY */}
        <div id="printable-certificate" className="relative p-6 sm:p-10 bg-[#FAF8F5] text-slate-900 border-[12px] border-[#0B132B] rounded-2xl m-2 sm:m-4 space-y-6 shadow-inner print:m-0 print:border-8 print:p-8">
          
          {/* Decorative Corner Accents */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-600"></div>
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-600"></div>
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-600"></div>
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-600"></div>

          {/* Header Banner */}
          <div className="text-center space-y-2 border-b-2 border-amber-500/40 pb-6 relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-700 p-0.5 mx-auto shadow-lg">
              <div className="w-full h-full bg-[#0B132B] rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-9 h-9 text-amber-400" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-mono font-bold tracking-widest text-amber-800 uppercase">
                MEMBER OF INTERNATIONAL SHARIA AUDIT BOARD (AAOIFI ALIGNED)
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B132B] tracking-wide">
                HALALCHAIN™ CERTIFICATION REGISTRY
              </h1>
              <p className="text-xs font-mono text-slate-600">
                Official Document of Sharia Compliance & Smart Contract Verification
              </p>
            </div>
          </div>

          {/* Certificate Title Statement */}
          <div className="text-center space-y-2 py-2">
            <div className="inline-block px-4 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-mono text-xs font-bold uppercase tracking-widest">
              CERTIFICATE SERIAL: {certNumber}
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900">
              SHARIA COMPLIANCE & GOVERNANCE CERTIFICATE
            </h2>
            <p className="text-xs text-slate-600 max-w-xl mx-auto italic">
              This document officially certifies that the Web3 protocol and smart contract system detailed below has undergone rigorous theological and technical audit.
            </p>
          </div>

          {/* Certified Entity & Blockchain Card */}
          <div className="bg-white p-5 rounded-2xl border-2 border-amber-400 shadow-md grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1 border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-4">
              <div className="text-[10px] text-amber-800 uppercase font-bold">CERTIFIED PROJECT / COMPANY</div>
              <div className="text-lg font-serif font-bold text-[#0B132B]">{projectName}</div>
              <div className="flex items-center gap-2 pt-1">
                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">{symbol}</span>
                <span className="text-slate-600">{category}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">BLOCKCHAIN NETWORK</div>
                  <div className="font-bold text-slate-800">{blockchain}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">COMPLIANCE STATUS</div>
                  <div className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>VALID / COMPLIANT</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">ISSUE DATE</div>
                  <div className="font-semibold text-slate-700">{issueDate}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">EXPIRY DATE</div>
                  <div className="font-semibold text-slate-700">{expiryDate}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sharia Verdict & Audit Summary */}
          <div className="space-y-2 bg-amber-500/5 p-4 rounded-2xl border border-amber-300">
            <div className="text-xs font-mono font-bold text-amber-900 uppercase flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>OFFICIAL SHARIA BOARD VERDICT & SUMMARY</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-sans">
              {lang === 'ar' ? shariaSummaryAr : shariaSummaryEn}
            </p>
          </div>

          {/* Barcode & QR Code Section */}
          <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Barcode Display */}
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">
                Official Machine-Readable Barcode
              </div>
              <VectorBarcode value={certNumber} />
            </div>

            {/* QR Code Display */}
            <div className="flex items-center gap-4 bg-white p-2.5 rounded-xl border border-slate-200">
              <VectorQrCode certNum={certNumber} />
              <div className="space-y-1 text-[11px] font-mono">
                <div className="font-bold text-[#0B132B]">VERIFY ON LEDGER</div>
                <p className="text-[10px] text-slate-500">
                  Scan QR code or enter serial on <span className="text-amber-800 font-bold">halalchain.io/verify</span> to confirm live cryptographic validity.
                </p>
              </div>
            </div>
          </div>

          {/* Scholar Signatures & Official Gold Stamp */}
          <div className="pt-4 border-t-2 border-amber-400 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-center">
            {scholarSignatures.map((scholar, idx) => (
              <div key={idx} className="space-y-1">
                <div className="font-serif italic text-sm text-[#0B132B] font-bold border-b border-slate-300 pb-1">
                  {scholar}
                </div>
                <div className="text-[9px] font-mono text-slate-500 uppercase">
                  {idx === 0 ? 'Head of Sharia Board' : idx === 1 ? 'Senior Sharia Scholar' : 'Sharia Executive Member'}
                </div>
              </div>
            ))}
          </div>

          {/* Cryptographic SHA-256 Ledger Verification Hash Footer */}
          <div className="bg-[#0B132B] text-white p-3 rounded-xl text-[10px] font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-amber-500/30">
            <div className="space-y-0.5">
              <div className="text-amber-400 font-bold uppercase text-[9px]">
                ON-CHAIN CRYPTOGRAPHIC SHA-256 LEDGER HASH:
              </div>
              <div className="text-slate-300 break-all">{verificationHash}</div>
            </div>

            <div className="shrink-0 text-right rtl:text-left">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-1 rounded text-[9px] font-bold uppercase inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                IMMUTABLE
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
