import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Lock, Award, FileText, Globe } from 'lucide-react';
import { GoldFiligreeLine } from './IslamicPatternBg';

interface FooterProps {
  setPublicSubView?: (subView: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ setPublicSubView }) => {
  const { t, lang } = useLanguage();

  const handleNav = (sub: string) => {
    if (setPublicSubView) {
      setPublicSubView(sub);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0B132B] text-slate-300 border-t border-amber-500/20 pt-12 pb-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-lg font-bold text-white font-serif">
                  HALAL<span className="text-amber-400">CHAIN</span>
                </span>
                <p className="text-[10px] text-amber-300/80 font-mono uppercase">{t('app.tagline')}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Global independent Sharia & technical assessment authority for Web3 ecosystems, smart contracts, and decentralized finance.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg w-fit">
              <Lock className="w-3.5 h-3.5" />
              <span>Immutable Ledger Verified</span>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider font-mono mb-3">
              Certification Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li onClick={() => handleNav('services')} className="hover:text-white transition-colors cursor-pointer">Sharia Compliance Certificate</li>
              <li onClick={() => handleNav('services')} className="hover:text-white transition-colors cursor-pointer">Sharia Governance Certificate</li>
              <li onClick={() => handleNav('services')} className="hover:text-white transition-colors cursor-pointer">Smart Contract Bytecode Audit</li>
              <li onClick={() => handleNav('pricing')} className="hover:text-white transition-colors cursor-pointer">Tokenomics Sustainability Review</li>
              <li onClick={() => handleNav('pricing')} className="hover:text-white transition-colors cursor-pointer">Annual Compliance Re-certification</li>
            </ul>
          </div>

          {/* Public Registry & Verification */}
          <div>
            <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider font-mono mb-3">
              Public Registry & Experts
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li onClick={() => handleNav('registry')} className="hover:text-white transition-colors cursor-pointer">
                {lang === 'ar' ? 'تصفح السجل الشرعي' : 'Browse Halal Web3 Registry'}
              </li>
              <li onClick={() => handleNav('verify')} className="hover:text-white transition-colors cursor-pointer">
                {lang === 'ar' ? 'التحقق من صحة الشهادة' : 'Verify Certificate Hash'}
              </li>
              <li onClick={() => handleNav('resources')} className="hover:text-white transition-colors cursor-pointer">
                {lang === 'ar' ? 'معايير حلال تشين v2.1' : 'HalalChain Standard v2.1 Docs'}
              </li>
              <li onClick={() => handleNav('join_team')} className="hover:text-amber-300 font-bold text-amber-400/90 transition-colors cursor-pointer flex items-center gap-1">
                <span>{lang === 'ar' ? '🤝 انضم لفريق التقييم الشرعي والفني' : '🤝 Join Expert Evaluation Team'}</span>
              </li>
            </ul>
          </div>

          {/* Sharia Governance Note */}
          <div>
            <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider font-mono mb-3">
              Sharia Advisory Board
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              All assessments strictly adhere to AAOIFI Sharia Standards and HalalChain Methodology v2.1.
            </p>
            <div className="bg-[#1C2541] p-3 rounded-lg border border-amber-500/20 text-[11px] text-slate-300">
              <span className="text-amber-400 font-semibold block mb-1">Official Disclaimer:</span>
              {t('sharia.disclaimer')}
            </div>
          </div>
        </div>

        <GoldFiligreeLine className="my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 HalalChain™ Enterprise Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span onClick={() => handleNav('resources')} className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
            <span onClick={() => handleNav('resources')} className="hover:text-slate-200 cursor-pointer">Terms of Service</span>
            <span onClick={() => handleNav('methodology')} className="hover:text-slate-200 cursor-pointer">Security Standards</span>
            <span onClick={() => handleNav('apply')} className="hover:text-slate-200 cursor-pointer">Contact Us</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
