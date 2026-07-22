import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PlatformTab, UserRole } from '../types';
import { ShieldCheck, Globe, User, Briefcase, BarChart3, ChevronDown } from 'lucide-react';

interface HeaderProps {
  activePlatform: PlatformTab;
  setActivePlatform: (p: PlatformTab) => void;
  activePublicTab: string;
  setActivePublicTab: (tab: string) => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (r: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePlatform,
  setActivePlatform,
  activePublicTab,
  setActivePublicTab,
  currentUserRole,
  setCurrentUserRole
}) => {
  const { lang, toggleLang, t } = useLanguage();

  const publicNavItems = [
    { id: 'home', labelKey: 'public.home' },
    { id: 'services', labelKey: 'public.services' },
    { id: 'methodology', labelKey: 'public.methodology' },
    { id: 'pricing', labelKey: 'public.pricing' },
    { id: 'registry', labelKey: 'public.registry' },
    { id: 'verify', labelKey: 'public.verify' },
    { id: 'resources', labelKey: 'public.resources' },
    { id: 'apply', labelKey: 'public.apply' }
  ];

  const rolesList: { role: UserRole; name: string }[] = [
    { role: 'customer', name: 'Customer (Applicant)' },
    { role: 'marketing', name: 'Marketing Specialist' },
    { role: 'sales', name: 'Sales Executive' },
    { role: 'pm', name: 'Project Manager' },
    { role: 'tech_auditor', name: 'Blockchain Tech Auditor' },
    { role: 'business_analyst', name: 'Business Analyst' },
    { role: 'scholar', name: 'Senior Sharia Scholar' },
    { role: 'qa', name: 'Quality Assurance Officer' },
    { role: 'finance', name: 'Finance Officer' },
    { role: 'exec', name: 'Executive Leader' },
    { role: 'admin', name: 'System Administrator' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B132B]/95 backdrop-blur-md border-b border-amber-500/20 text-white shadow-xl">
      {/* Top Bar with Platform Selector & Global Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-white/10">
          {/* Brand Logo & Tagline */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              setActivePlatform('public');
              setActivePublicTab('home');
            }}
          >
            <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 via-amber-600 to-amber-700 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0B132B] rounded-[7px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white font-serif">
                  HALAL<span className="text-amber-400">CHAIN</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  PROD v2.1
                </span>
              </div>
              <p className="text-[10px] text-amber-300/80 tracking-widest font-mono uppercase">
                {t('app.tagline')}
              </p>
            </div>
          </div>

          {/* Platform Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#1C2541]/80 p-1.5 rounded-xl border border-white/10">
            <button
              onClick={() => setActivePlatform('public')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePlatform === 'public'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              {t('nav.public')}
            </button>
            <button
              onClick={() => setActivePlatform('customer')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePlatform === 'customer'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              {t('nav.customer')}
            </button>
            <button
              onClick={() => setActivePlatform('ops')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePlatform === 'ops'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              {t('nav.ops')}
            </button>
            <button
              onClick={() => setActivePlatform('exec')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePlatform === 'exec'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              {t('nav.exec')}
            </button>
          </nav>

          {/* Language Switcher & Role Selector */}
          <div className="flex items-center gap-3">
            {/* Role Switcher Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-2 bg-[#1C2541] border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-lg text-xs cursor-pointer hover:border-amber-400 transition-colors">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline font-mono">
                  {rolesList.find((r) => r.role === currentUserRole)?.name || currentUserRole}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <div className="absolute right-0 top-full mt-1 w-60 bg-[#1C2541] border border-amber-500/30 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50">
                <div className="text-[10px] uppercase font-mono text-slate-400 px-2 py-1 mb-1 border-b border-white/10">
                  Switch User / Employee Role
                </div>
                {rolesList.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => setCurrentUserRole(r.role)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      currentUserRole === r.role
                        ? 'bg-amber-500/20 text-amber-300 font-semibold'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {r.name}
                    {currentUserRole === r.role && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Switcher Button */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-[#1C2541] text-amber-300 hover:text-white hover:border-amber-400 transition-all text-xs font-mono"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Bar for Public Website */}
        {activePlatform === 'public' && (
          <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none text-xs border-t border-white/5">
            {publicNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePublicTab(item.id)}
                className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap font-medium ${
                  activePublicTab === item.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {t(item.labelKey)}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
