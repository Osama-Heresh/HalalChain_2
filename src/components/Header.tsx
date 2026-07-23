import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PlatformTab, UserRole } from '../types';
import { ShieldCheck, Globe, User, Briefcase, BarChart3, ChevronDown, Menu, X } from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const publicNavItems = [
    { id: 'home', labelKey: 'public.home' },
    { id: 'services', labelKey: 'public.services' },
    { id: 'methodology', labelKey: 'public.methodology' },
    { id: 'pricing', labelKey: 'public.pricing' },
    { id: 'registry', labelKey: 'public.registry' },
    { id: 'verify', labelKey: 'public.verify' },
    { id: 'resources', labelKey: 'public.resources' },
    { id: 'apply', labelKey: 'public.apply' },
    { id: 'join_team', labelKey: 'public.joinTeam' }
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
        <div className="flex items-center justify-between h-16 border-b border-white/10 gap-2">
          {/* Brand Logo & Tagline */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
            onClick={() => {
              setActivePlatform('public');
              setActivePublicTab('home');
              setMobileMenuOpen(false);
            }}
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-amber-400 via-amber-600 to-amber-700 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0B132B] rounded-[7px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-serif">
                  HALAL<span className="text-amber-400">CHAIN</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  PROD v2.1
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-amber-300/80 tracking-widest font-mono uppercase truncate max-w-[160px] sm:max-w-none">
                {t('app.tagline')}
              </p>
            </div>
          </div>

          {/* Desktop Platform Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#1C2541]/80 p-1.5 rounded-xl border border-white/10">
            <button
              onClick={() => setActivePlatform('public')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePlatform === 'exec'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              {t('nav.exec')}
            </button>
          </nav>

          {/* Right Actions: Language Switcher, Role Selector, & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Role Switcher Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-[#1C2541] border border-amber-500/30 text-amber-300 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs cursor-pointer hover:border-amber-400 transition-colors">
                <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="max-w-[100px] sm:max-w-none truncate font-mono text-[11px] sm:text-xs">
                  {rolesList.find((r) => r.role === currentUserRole)?.name.split(' ')[0] || currentUserRole}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
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

            {/* Unified Notification Center */}
            <NotificationCenter onNavigateTab={setActivePlatform} />

            {/* Language Switcher Button */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg border border-amber-500/30 bg-[#1C2541] text-amber-300 hover:text-white hover:border-amber-400 transition-all text-xs font-mono"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{lang === 'en' ? 'AR' : 'EN'}</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-amber-500/30 bg-[#1C2541] text-amber-400 hover:bg-white/10 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 px-2 border-b border-white/10 space-y-3 bg-[#0B132B]/95">
            <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider px-2">
              Select Platform View:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setActivePlatform('public');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all ${
                  activePlatform === 'public'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-[#1C2541] text-slate-200 border border-white/10'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>{t('nav.public')}</span>
              </button>
              <button
                onClick={() => {
                  setActivePlatform('customer');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all ${
                  activePlatform === 'customer'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-[#1C2541] text-slate-200 border border-white/10'
                }`}
              >
                <User className="w-4 h-4" />
                <span>{t('nav.customer')}</span>
              </button>
              <button
                onClick={() => {
                  setActivePlatform('ops');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all ${
                  activePlatform === 'ops'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-[#1C2541] text-slate-200 border border-white/10'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>{t('nav.ops')}</span>
              </button>
              <button
                onClick={() => {
                  setActivePlatform('exec');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all ${
                  activePlatform === 'exec'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-[#1C2541] text-slate-200 border border-white/10'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>{t('nav.exec')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Sub-Navigation Bar for Public Website */}
        {activePlatform === 'public' && (
          <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none text-xs border-t border-white/5 touch-pan-x">
            {publicNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePublicTab(item.id)}
                className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap font-medium cursor-pointer ${
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
