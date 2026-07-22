import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, ArrowRight, ShieldCheck, Zap, Crown } from 'lucide-react';

interface PricingViewProps {
  onApplyPackage: (pkgName: string) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onApplyPackage }) => {
  const { t } = useLanguage();

  const packages = [
    {
      name: 'Starter',
      badge: 'Utility Tokens / dApps',
      price: '$4,500',
      period: 'USD per assessment',
      renewal: 'Annual Renewal: $1,200/yr',
      completion: '10 Business Days SLA',
      icon: Zap,
      featured: false,
      features: [
        'Sharia Compliance Screening Certificate',
        'Centralized AI Whitepaper Extraction',
        'Basic Smart Contract Bytecode Scan',
        'Business Revenue & Utility Audit',
        'Halal Web3 Registry Listing',
        'Downloadable Digital Certificate (PDF)',
        '1 Clarification Cycle Included'
      ]
    },
    {
      name: 'Professional',
      badge: 'DeFi / L1 & L2 Ecosystems',
      price: '$9,800',
      period: 'USD per assessment',
      renewal: 'Annual Renewal: $2,500/yr',
      completion: '7 Business Days Express SLA',
      icon: ShieldCheck,
      featured: true,
      features: [
        'Sharia Compliance + Governance Certificate',
        'Deep Bytecode & Privileged Function Audit',
        'Tokenomics & Yield Sustainability Analysis',
        'Senior Scholar Review Board Assessment',
        'AAOIFI & HalalChain Standard v2.1 Compliance',
        'Priority Technical Remediation Guidance',
        '3 Clarification Cycles Included',
        'Verification QR Code & Blockchain Hash'
      ]
    },
    {
      name: 'Enterprise',
      badge: 'RWA / Sukuk / Institutional',
      price: '$19,500',
      period: 'USD per assessment',
      renewal: 'Annual Renewal: $4,500/yr',
      completion: '5 Business Days Priority SLA',
      icon: Crown,
      featured: false,
      features: [
        'Full Institutional Sharia Certification Package',
        'Custom Smart Contract Bytecode & Proxy Audit',
        'RWA Physical Reserve & Vault Audit Review',
        'Dedicated Senior Scholar Consultations',
        'Continuous Real-Time Contract Upgrade Monitoring',
        'Unlimited Clarification Requests',
        'Custom API Access to Verification Ledger',
        '24/7 Dedicated Operations PM Support'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900">
          Transparent Corporate Certification Pricing
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Standardized pricing tiers with transparent deliverables, renewal fees, and SLA guarantees for crypto projects worldwide.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {packages.map((pkg) => {
          const IconComponent = pkg.icon;
          return (
            <div
              key={pkg.name}
              className={`rounded-3xl p-8 transition-all flex flex-col justify-between relative ${
                pkg.featured
                  ? 'bg-[#0B132B] text-white border-2 border-amber-500 shadow-2xl scale-105'
                  : 'bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              {pkg.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-bold text-[10px] uppercase font-mono px-4 py-1 rounded-full shadow-md">
                  Most Popular for Web3 Projects
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
                      {pkg.badge}
                    </span>
                    <IconComponent
                      className={`w-6 h-6 ${pkg.featured ? 'text-amber-400' : 'text-slate-400'}`}
                    />
                  </div>
                  <h3 className="text-2xl font-bold font-serif">{pkg.name}</h3>
                </div>

                <div className="space-y-1">
                  <div className="text-4xl font-bold font-serif">{pkg.price}</div>
                  <div className={`text-xs ${pkg.featured ? 'text-slate-300' : 'text-slate-500'}`}>
                    {pkg.period}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 pt-1 font-semibold">
                    {pkg.renewal} • {pkg.completion}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200/20">
                  <span className={`text-xs font-mono font-bold uppercase ${pkg.featured ? 'text-amber-300' : 'text-slate-500'}`}>
                    Included Scope:
                  </span>
                  <ul className="space-y-2.5 text-xs">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                            pkg.featured ? 'text-emerald-400' : 'text-emerald-600'
                          }`}
                        />
                        <span className={pkg.featured ? 'text-slate-200' : 'text-slate-700'}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onApplyPackage(pkg.name)}
                  className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    pkg.featured
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-xl shadow-amber-500/20'
                      : 'bg-[#0B132B] text-amber-400 hover:bg-[#1C2541]'
                  }`}
                >
                  <span>Select {pkg.name} Package</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
