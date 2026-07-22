import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Code, Coins, Eye, Lock, RefreshCw, Terminal, CheckCircle2, ArrowRight } from 'lucide-react';

interface ServicesViewProps {
  onApplyService: (serviceName: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onApplyService }) => {
  const { t } = useLanguage();

  const services = [
    {
      id: 'sharia_cert',
      title: 'Sharia Compliance Certificate',
      icon: ShieldCheck,
      purpose: 'Complete end-to-end Sharia screening for L1/L2 blockchains, cryptocurrencies, and utility tokens.',
      scope: ['Whitepaper & Tokenomics Review', 'Revenue & Yield Model Screening', 'Smart Contract Bytecode Analysis', 'Scholar Review Panel'],
      deliverables: ['Digital Sharia Certificate', 'Executive Assessment Report', 'Public Halal Registry Listing'],
      timeline: '10-14 Business Days',
      price: 'From $4,500 USD'
    },
    {
      id: 'sharia_gov',
      title: 'Sharia Governance Certificate',
      icon: Eye,
      purpose: 'Ongoing Sharia supervisory framework for DAOs, decentralized treasuries, and DeFi pools.',
      scope: ['DAO Governance Voting Rules', 'Treasury Allocation Audits', 'Quarterly Compliance Reviews', 'Emergency Circuit Breaker Protocols'],
      deliverables: ['Sharia Governance Badge', 'Quarterly Advisory Reports', 'Board Meeting Minutes'],
      timeline: 'Annual Subscription',
      price: 'From $9,800 USD/yr'
    },
    {
      id: 'smart_contract',
      title: 'Smart Contract Technical Assessment',
      icon: Code,
      purpose: 'Deep bytecode and source code inspection of Ethereum, Solana, Cosmos, and MOVE smart contracts.',
      scope: ['Admin Privilege Risk Matrix', 'Minting / Burning / Pausing Checks', 'Flash Loan Dependency Scan', 'Reentrancy & Logic Audits'],
      deliverables: ['Technical Security Report', 'Bytecode Verification Hash', 'Vulnerability Remediation Guide'],
      timeline: '5-7 Business Days',
      price: 'From $3,500 USD'
    },
    {
      id: 'tokenomics',
      title: 'Tokenomics Sustainability Assessment',
      icon: Coins,
      purpose: 'Economic evaluation of token distribution, vesting schedules, staking yields, and inflationary risks.',
      scope: ['Inflation / Deflation Dynamics', 'Staking Yield Mechanics', 'Liquidity Pool Depth Analysis', 'Speculative Risk Score'],
      deliverables: ['Tokenomics Sustainability Rating', 'Financial Model Audit', 'Yield Risk Matrix'],
      timeline: '5 Business Days',
      price: 'From $2,800 USD'
    },
    {
      id: 'annual_monitoring',
      title: 'Annual Compliance Monitoring',
      icon: RefreshCw,
      purpose: 'Continuous monitoring of smart contract upgrades, whitepaper amendments, and governance changes.',
      scope: ['Real-time Contract Upgrade Alerts', 'Semi-Annual Re-audits', 'Automated Registry Renewal', 'Priority Scholar Consultation'],
      deliverables: ['Annual Renewal Certificate', 'Continuous Monitoring Dashboard', 'Alert History Logs'],
      timeline: 'Continuous (12 Months)',
      price: 'From $1,500 USD/yr'
    },
    {
      id: 'script_assessment',
      title: 'Halal Web3 Script Assessment',
      icon: Terminal,
      purpose: 'Rapid review of automated trading bots, dApp frontends, and smart contract integration scripts.',
      scope: ['Frontend Integration Safety', 'Automated Trade Route Screening', 'Prohibited Industry Filtering', 'API Security Check'],
      deliverables: ['Script Approval Stamp', 'Integration Certificate', 'API Access Key'],
      timeline: '3 Business Days',
      price: 'From $1,800 USD'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900">
          {t('services.title')}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          {t('services.subtitle')}
        </p>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => {
          const IconComp = service.icon;
          return (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 flex items-center justify-center">
                  <IconComp className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{service.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{service.purpose}</p>
                </div>

                {/* Scope */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Scope of Work
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {service.scope.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Meta details */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">TIMELINE</span>
                    <span className="font-semibold text-slate-800">{service.timeline}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">ESTIMATED FEE</span>
                    <span className="font-semibold text-amber-700">{service.price}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onApplyService(service.title)}
                className="w-full py-2.5 rounded-xl bg-[#0B132B] text-amber-400 font-semibold text-xs hover:bg-[#1C2541] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
