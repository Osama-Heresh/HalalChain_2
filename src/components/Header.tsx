import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useRbac } from '../context/RbacContext';
import { PlatformTab, UserRole } from '../types';
import { ShieldCheck, Globe, User, Briefcase, BarChart3, ChevronDown, Menu, X, KeyRound, LogOut, Sparkles } from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';
import { ScrollableTabNav } from './common/ScrollableTabNav';

interface HeaderProps {
  activePlatform: PlatformTab;
  setActivePlatform: (p: PlatformTab) => void;
  activePublicTab: string;
  setActivePublicTab: (tab: string) => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (r: UserRole) => void;
  systemMode?: 'demo' | 'production';
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePlatform,
  setActivePlatform,
  activePublicTab,
  setActivePublicTab,
  currentUserRole,
  setCurrentUserRole,
  systemMode = 'demo',
  onOpenAuthModal
}) => {
  const { lang, toggleLang, t } = useLanguage();
  const { currentUser, openAuthModal, logout, updateCurrentRole } = useAuth();
  const { hasPlatformAccess } = useRbac();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const rolesList: { role: UserRole; name: string }[] = [
    { role: 'exec', name: 'General Manager (Exec)' },
    { role: 'sales', name: 'Sales Manager' },
    { role: 'pm', name: 'Project Manager' },
    { role: 'tech_auditor', name: 'Technical Reviewer' },
    { role: 'business_analyst', name: 'Business Reviewer' },
    { role: 'scholar', name: 'Sharia Scholar' },
    { role: 'qa', name: 'Quality Assurance' },
    { role: 'finance', name: 'Finance Officer' },
    { role: 'customer', name: 'Customer / Applicant' }
  ];

  const publicNavItems = [
    { id: 'home', labelKey: 'public.home' },
    { id: 'services', labelKey: 'public.services' },
    { id: 'methodology', labelKey: 'public.methodology' },
    { id: 'pricing', labelKey: 'public.pricing' },
    { id: 'registry', labelKey: 'public.registry' },
    { id: 'verify', labelKey: 'public.verify' },
    { id: 'whitepaper_repository', labelKey: 'Whitepaper Repository' },
    { id: 'resources', labelKey: 'public.resources' },
    { id: 'apply', labelKey: 'public.apply' },
    { id: 'join_team', labelKey: 'public.joinTeam' }
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
                  HALAL<span className="text-amber-400">CHAIN</span>™
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  PROD v2.1
                </span>
                <span className={`text-[9px] sm:text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded border font-mono ${
                  systemMode === 'demo'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {systemMode === 'demo' ? 'DEMO MODE' : 'PRODUCTION MODE'}
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-amber-300/80 tracking-widest font-mono uppercase truncate max-w-[160px] sm:max-w-none">
                {t('app.tagline')}
              </p>
            </div>
          </div>

          {/* Desktop Platform Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#1C2541]/80 p-1.5 rounded-xl border border-white/10">
            {hasPlatformAccess('public_website') && (
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
            )}

            {hasPlatformAccess('customer_portal') && (
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
            )}

            {hasPlatformAccess('ops_platform') && (
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
            )}

            {hasPlatformAccess('exec_platform') && (
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
            )}
          </nav>

          {/* Right Actions: Auth User Profile, Language Switcher & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Enterprise Auth Profile Button & Quick Menu */}
            <div className="relative group">
              <button
                onClick={openAuthModal}
                className="flex items-center gap-2 bg-[#1C2541] border border-amber-500/40 hover:border-amber-400 text-white px-2.5 sm:px-3 py-1.5 rounded-xl text-xs cursor-pointer transition-all shadow-md group-hover:bg-[#253259]"
              >
                {currentUser?.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.displayName}
                    className="w-5 h-5 rounded-full border border-amber-400 object-cover shrink-0"
                  />
                ) : (
                  <User className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <div className="text-left hidden sm:block">
                  <div className="text-[11px] font-bold font-mono text-amber-300 leading-none truncate max-w-[120px]">
                    {currentUser?.displayName || 'Sign In'}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 leading-tight truncate max-w-[120px]">
                    {currentUser?.title?.split('&')[0] || (currentUserRole ? currentUserRole.toUpperCase() : 'Guest')}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              <div className="absolute right-0 top-full mt-1 w-72 bg-[#0B132B] border border-amber-500/40 rounded-2xl shadow-2xl p-3 hidden group-hover:block z-50 font-mono text-xs text-white">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[10px] uppercase text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Firebase Authenticated
                  </span>
                  <span className="text-amber-300 font-bold">{currentUser?.role.toUpperCase()}</span>
                </div>

                <div className="py-2.5 px-1 space-y-1">
                  <div className="font-bold text-sm text-white">{currentUser?.displayName}</div>
                  <div className="text-[11px] text-amber-300/90">{currentUser?.title}</div>
                  <div className="text-[10px] text-slate-400">{currentUser?.email}</div>
                </div>

                <div className="pt-2 border-t border-white/10 space-y-1">
                  <button
                    onClick={openAuthModal}
                    className="w-full text-left px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs transition-colors flex items-center justify-between cursor-pointer border border-amber-500/30"
                  >
                    <span className="flex items-center gap-2">
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                      Switch Account / Demo Sign In
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </button>

                  {systemMode === 'demo' && (
                    <>
                      <div className="text-[10px] uppercase font-mono text-slate-400 pt-2 pb-1 px-1">
                        Quick Role Switcher:
                      </div>
                      {rolesList.map((r) => (
                        <button
                          key={r.role}
                          onClick={() => {
                            updateCurrentRole(r.role);
                            setCurrentUserRole(r.role);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-colors flex items-center justify-between cursor-pointer ${
                            currentUserRole === r.role || currentUser?.role === r.role
                              ? 'bg-amber-500/20 text-amber-300 font-semibold'
                              : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span>{r.name}</span>
                          {(currentUserRole === r.role || currentUser?.role === r.role) && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          )}
                        </button>
                      ))}
                    </>
                  )}

                  {currentUser && (
                    <button
                      onClick={logout}
                      className="w-full mt-2 text-left px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs transition-colors flex items-center justify-between cursor-pointer border border-rose-500/30"
                    >
                      <span>Sign Out</span>
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    </button>
                  )}
                </div>
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
          <ScrollableTabNav className="py-2 text-xs border-t border-white/5" variant="dark">
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
          </ScrollableTabNav>
        )}
      </div>
    </header>
  );
};
