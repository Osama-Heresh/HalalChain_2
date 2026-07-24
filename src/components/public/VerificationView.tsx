import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PublicCertifiedProject } from '../../types';
import { Search, Lock, ShieldCheck, CheckCircle2, FileText, Share2, Download, AlertCircle, Award } from 'lucide-react';
import { ShariaCertificateModal } from '../ShariaCertificateModal';

interface VerificationViewProps {
  initialQuery?: string;
}

export const VerificationView: React.FC<VerificationViewProps> = ({ initialQuery = '' }) => {
  const { t, dir, lang } = useLanguage();
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [verifiedProject, setVerifiedProject] = useState<PublicCertifiedProject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleVerify(initialQuery);
    }
  }, [initialQuery]);

  const handleVerify = async (certQuery: string) => {
    if (!certQuery.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    setVerifiedProject(null);

    try {
      const res = await fetch(`/api/certificates/verify/${encodeURIComponent(certQuery.trim())}`);
      const data = await res.json();
      if (res.ok && data.verified) {
        setVerifiedProject(data.project);
      } else {
        setErrorMsg(
          data.message || (lang === 'ar' ? 'الشهادة غير موجودة في سجل حلال تشين™.' : 'Certificate not found in HalalChain™ registry.')
        );
      }
    } catch (err) {
      setErrorMsg(lang === 'ar' ? 'تعذر الاتصال بدفتر سجل التحقق.' : 'Failed to connect to verification ledger.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-mono font-medium border border-amber-500/20">
          <Lock className="w-4 h-4 text-amber-600" />
          <span>{lang === 'ar' ? 'التحقق المشفر من صحة الشهادات' : 'Cryptographic Certificate Verification'}</span>
        </div>
        <h1 className="text-3xl font-bold font-serif text-slate-900">{t('verify.title')}</h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">{t('verify.subtitle')}</p>
      </div>

      {/* Input Box */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 rtl:right-4 rtl:left-auto" />
            <input
              type="text"
              placeholder={t('verify.placeholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 rtl:pr-12 rtl:pl-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:border-amber-500 shadow-inner"
            />
          </div>
          <button
            onClick={() => handleVerify(query)}
            disabled={loading}
            className="px-8 py-3.5 rounded-2xl bg-[#0B132B] text-amber-400 font-bold text-xs hover:bg-[#1C2541] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md whitespace-nowrap"
          >
            {loading ? (lang === 'ar' ? 'جاري فحص السجل...' : 'Verifying Ledger...') : t('verify.button')}
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-400 text-center">
          {lang === 'ar' ? 'شهادات تجريبية للاختبار:' : 'Sample Test Certs:'}{' '}
          <span className="text-amber-700 font-semibold cursor-pointer underline hover:text-amber-800" onClick={() => { setQuery('HC-CERT-2026-8801'); handleVerify('HC-CERT-2026-8801'); }}>HC-CERT-2026-8801</span>, <span className="text-amber-700 font-semibold cursor-pointer underline hover:text-amber-800" onClick={() => { setQuery('HC-CERT-2026-8802'); handleVerify('HC-CERT-2026-8802'); }}>HC-CERT-2026-8802</span>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Verified Certificate Result Display */}
      {verifiedProject && (
        <div className="bg-[#0B132B] text-white p-8 rounded-3xl border-2 border-amber-500 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <img
                src={verifiedProject.logoUrl}
                alt={verifiedProject.name}
                className="w-14 h-14 rounded-2xl object-cover border border-amber-500/40 shadow-lg"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold font-serif text-white">{verifiedProject.name}</h2>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                    {verifiedProject.symbol}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono mt-0.5">{verifiedProject.blockchain} • {verifiedProject.category}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setShowCertModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <Award className="w-4 h-4" />
                <span>{lang === 'ar' ? 'عرض الشهادة بالباركوود' : 'View Certificate (Barcode)'}</span>
              </button>

              <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-xl border border-emerald-500/40 text-xs font-mono font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ar' ? 'معتمدة وموثقة رسمياً' : 'OFFICIALLY VERIFIED'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono bg-[#1C2541] p-6 rounded-2xl border border-amber-500/20">
            <div className="space-y-2">
              <div className="text-slate-400 uppercase text-[10px]">{lang === 'ar' ? 'رقم الشهادة' : 'Certificate Number'}</div>
              <div className="text-amber-400 font-bold text-sm">{verifiedProject.certificateNumber}</div>
            </div>
            <div className="space-y-2">
              <div className="text-slate-400 uppercase text-[10px]">{lang === 'ar' ? 'نوع الشهادة' : 'Certificate Type'}</div>
              <div className="text-white font-semibold">{verifiedProject.certificateType}</div>
            </div>
            <div className="space-y-2">
              <div className="text-slate-400 uppercase text-[10px]">{lang === 'ar' ? 'تاريخ الإصدار / الانتهاء' : 'Issue / Expiry Date'}</div>
              <div className="text-white">{verifiedProject.issueDate} — {verifiedProject.expiryDate}</div>
            </div>
            <div className="space-y-2">
              <div className="text-slate-400 uppercase text-[10px]">{lang === 'ar' ? 'تقييم درجة المخاطر' : 'Risk Assessment Rating'}</div>
              <div className="text-emerald-400 font-bold">{verifiedProject.riskRating}</div>
            </div>
          </div>

          {/* Sharia Statement Summary */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
              {lang === 'ar' ? 'ملخص تقييم الهيئة الشرعية الرسمية' : 'Official Sharia Board Assessment Summary'}
            </span>
            <div className="text-xs text-slate-200 bg-[#1C2541]/80 p-4 rounded-xl border border-white/10 leading-relaxed">
              {dir === 'rtl' ? verifiedProject.shariaSummaryAr : verifiedProject.shariaSummaryEn}
            </div>
          </div>

          {/* Scholar Signatures */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              {lang === 'ar' ? 'توقيعات العلماء الشرعيين المعتمدين' : 'Authorized Sharia Scholar Signatures'}
            </span>
            <div className="flex flex-wrap gap-2">
              {verifiedProject.scholarSignatures.map((sig, idx) => (
                <span
                  key={idx}
                  className="text-xs font-serif italic text-amber-200 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg"
                >
                  ✓ {sig}
                </span>
              ))}
            </div>
          </div>

          {/* Cryptographic Ledger Hash */}
          <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/20 text-[10px] font-mono text-slate-400 space-y-1">
            <div className="text-amber-400 font-bold uppercase">
              {lang === 'ar' ? 'التوقيع المشفر SHA-256 للتحقق في السجل:' : 'Ledger SHA-256 Verification Hash:'}
            </div>
            <div className="break-all text-slate-300 font-semibold">{verifiedProject.verificationHash}</div>
          </div>
        </div>
      )}

      {/* Sharia Certificate Modal */}
      <ShariaCertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        project={verifiedProject}
      />
    </div>
  );
};
