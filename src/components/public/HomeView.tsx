import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PublicCertifiedProject } from '../../types';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Lock,
  Cpu,
  FileCheck,
  TrendingUp,
  Scale
} from 'lucide-react';
import { IslamicPatternBg, GoldFiligreeLine } from '../IslamicPatternBg';
import { WhyTrustSection } from './WhyTrustSection';
import { FaqSection } from './FaqSection';

interface HomeViewProps {
  certifiedProjects: PublicCertifiedProject[];
  onNavigate: (tab: string) => void;
  onApplyPackage: (pkg: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  certifiedProjects,
  onNavigate,
  onApplyPackage
}) => {
  const { t, dir } = useLanguage();

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-b from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-3xl border-b border-amber-500/30">
        <IslamicPatternBg />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium shadow-lg backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-serif leading-tight">
            {t('hero.headline')}
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtext')}
          </p>

          <GoldFiligreeLine className="my-6" />

          {/* Call To Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('apply')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-bold text-sm hover:from-amber-400 hover:to-amber-600 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('hero.btn.apply')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('registry')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1C2541] border border-amber-500/40 text-amber-300 font-semibold text-sm hover:bg-white/10 hover:border-amber-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('hero.btn.registry')}</span>
            </button>
            <button
              onClick={() => onNavigate('verify')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold text-sm hover:bg-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>{t('hero.btn.verify')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Key Statistics Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-[#1C2541]/90 border border-amber-500/20 p-8 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-bold text-amber-400 font-serif">140+</div>
            <div className="text-xs text-slate-300 font-medium">{t('stats.projects')}</div>
          </div>
          <div className="text-center space-y-1 border-l border-white/10 rtl:border-r rtl:border-l-0">
            <div className="text-3xl sm:text-4xl font-bold text-emerald-400 font-serif">$2.8B+</div>
            <div className="text-xs text-slate-300 font-medium">{t('stats.tvl')}</div>
          </div>
          <div className="text-center space-y-1 border-l border-white/10 rtl:border-r rtl:border-l-0">
            <div className="text-3xl sm:text-4xl font-bold text-amber-400 font-serif">12</div>
            <div className="text-xs text-slate-300 font-medium">{t('stats.scholars')}</div>
          </div>
          <div className="text-center space-y-1 border-l border-white/10 rtl:border-r rtl:border-l-0">
            <div className="text-3xl sm:text-4xl font-bold text-emerald-400 font-serif">24+</div>
            <div className="text-xs text-slate-300 font-medium">{t('stats.countries')}</div>
          </div>
        </div>
      </section>

      {/* Featured Certified Projects Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md mb-2 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified On-Chain Ledger</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
              Featured Sharia Certified Web3 Projects
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Top cryptocurrencies, RWA gold tokens, and DeFi protocols independently audited by HalalChain™.
            </p>
          </div>
          <button
            onClick={() => onNavigate('registry')}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>View All Public Registry Projects ({certifiedProjects.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifiedProjects.slice(0, 3).map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={project.logoUrl}
                      alt={project.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{project.name}</h3>
                      <span className="text-xs font-mono font-semibold text-slate-500">{project.symbol}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                    {project.riskRating}
                  </span>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {dir === 'rtl' ? project.shariaSummaryAr : project.shariaSummaryEn}
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-500 font-mono">
                  <div className="flex justify-between">
                    <span>Blockchain:</span>
                    <span className="font-semibold text-slate-800">{project.blockchain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cert #:</span>
                    <span className="font-semibold text-amber-700">{project.certificateNumber}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                <button
                  onClick={() => onNavigate('verify')}
                  className="text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Verify Hash</span>
                </button>
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-500 hover:text-slate-900 flex items-center gap-1"
                >
                  <span>Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Trust HalalChain? Section */}
      <WhyTrustSection />

      {/* 4-Step Methodology Highlights */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto border border-amber-500/20 relative overflow-hidden">
        <IslamicPatternBg />
        <div className="relative z-10 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              The HalalChain™ Assessment Process
            </h2>
            <p className="text-sm text-slate-300">
              An evidence-driven methodology combining automated AI analytics, smart contract bytecode verification, business analysis, and senior scholar approval.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#1C2541] p-6 rounded-2xl border border-amber-500/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold">
                01
              </div>
              <h3 className="font-bold text-base text-white">1. AI Data Extraction</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automated crawling of whitepapers, GitHub source code, CoinMarketCap data, and smart contract ABIs into structured database records.
              </p>
            </div>

            <div className="bg-[#1C2541] p-6 rounded-2xl border border-amber-500/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold">
                02
              </div>
              <h3 className="font-bold text-base text-white">2. Technical & Business Audit</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Blockchain technical auditors inspect minting/pausing admin privileges while business analysts evaluate token utility and revenue sources.
              </p>
            </div>

            <div className="bg-[#1C2541] p-6 rounded-2xl border border-amber-500/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold">
                03
              </div>
              <h3 className="font-bold text-base text-white">3. Senior Scholar Review</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sharia scholars review technical findings against AAOIFI and HalalChain™ Sharia Standard v2.1 to issue formal compliance decisions.
              </p>
            </div>

            <div className="bg-[#1C2541] p-6 rounded-2xl border border-amber-500/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold">
                04
              </div>
              <h3 className="font-bold text-base text-white">4. Certificate & Public Registry</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cryptographic certificate generation with QR verification hash published to the immutable public Halal Registry.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => onNavigate('methodology')}
              className="px-6 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Explore Complete 10-Stage Methodology</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <FaqSection />

      {/* Sharia vs Fatwa Distinction Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 font-serif">
                Important Methodology Distinction: Technical Assessment vs Fatwa
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
                HalalChain™ does not issue religious fatwas. HalalChain™ provides independent technical, economic, and Sharia compliance screening supported by documented evidence. Every conclusion is backed by verifiable smart contract bytecode analysis, whitepaper audits, and scholar review.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('resources')}
            className="px-5 py-2.5 rounded-xl bg-amber-700 text-white text-xs font-semibold hover:bg-amber-800 transition-all whitespace-nowrap cursor-pointer"
          >
            Read Whitepaper & Standards
          </button>
        </div>
      </section>
    </div>
  );
};
