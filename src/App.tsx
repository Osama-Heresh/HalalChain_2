import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RbacProvider, useRbac } from './context/RbacContext';
import { SessionSecurityProvider } from './context/SessionSecurityContext';
import { AuthModal } from './components/auth/AuthModal';
import { AccessDeniedPage } from './components/auth/AccessDeniedPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Public views
import { HomeView } from './components/public/HomeView';
import { ServicesView } from './components/public/ServicesView';
import { MethodologyView } from './components/public/MethodologyView';
import { PricingView } from './components/public/PricingView';
import { RegistryView } from './components/public/RegistryView';
import { VerificationView } from './components/public/VerificationView';
import { ResourcesView } from './components/public/ResourcesView';
import { ApplyView } from './components/public/ApplyView';
import { JoinTeamView } from './components/public/JoinTeamView';
import { WhitepaperRepositoryPage } from './components/repository/WhitepaperRepositoryPage';

// App platforms
import { CustomerPortalView } from './components/customer/CustomerPortalView';
import { OpsPlatformView } from './components/ops/OpsPlatformView';
import { ExecPlatformView } from './components/exec/ExecPlatformView';

import { parsePath, navigateTo } from './lib/router';
import {
  PlatformView,
  PlatformTab,
  PublicSubView,
  UserRole,
  CertificationApplication,
  PublicCertifiedProject,
  Lead,
  AuditLogEntry
} from './types';
import {
  safeFetch,
  getLocalApps,
  getLocalCertifiedProjects,
  getLocalLeads,
  getLocalAuditLogs
} from './lib/api';
import {
  INITIAL_APPLICATIONS,
  INITIAL_CERTIFIED_PROJECTS,
  INITIAL_LEADS,
  INITIAL_AUDIT_LOGS
} from './data/mockData';

const MainContent: React.FC = () => {
  const { dir } = useLanguage();
  const { currentUser, isAuthModalOpen, closeAuthModal } = useAuth();
  const { hasPlatformAccess } = useRbac();

  const [activePlatformView, setActivePlatformView] = useState<PlatformView>('exec_platform');
  const [publicSubView, setPublicSubView] = useState<PublicSubView>('home');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('exec');

  const [activeOpsSubTab, setActiveOpsSubTab] = useState<string>('my_work');
  const [activeExecSubTab, setActiveExecSubTab] = useState<string>('bi');
  const [activeCustomerSubTab, setActiveCustomerSubTab] = useState<string>('overview');

  // Reactive URL router listener
  useEffect(() => {
    const syncRoute = () => {
      const route = parsePath(window.location.pathname);
      setActivePlatformView(route.platformView);
      if (route.platformTab === 'public') {
        setPublicSubView(route.subTab as PublicSubView);
      } else if (route.platformTab === 'ops') {
        setActiveOpsSubTab(route.subTab);
      } else if (route.platformTab === 'exec') {
        setActiveExecSubTab(route.subTab);
      } else if (route.platformTab === 'customer') {
        setActiveCustomerSubTab(route.subTab);
      }
    };

    syncRoute();
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('app-navigation', syncRoute as EventListener);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('app-navigation', syncRoute as EventListener);
    };
  }, []);

  // Sync auth context user state with app view and role
  useEffect(() => {
    if (currentUser) {
      setCurrentUserRole(currentUser.role);
      if (currentUser.targetPlatform) {
        setActivePlatformView(currentUser.targetPlatform);
      }
    }
  }, [currentUser]);

  const [verifyCertQuery, setVerifyCertQuery] = useState('');
  const [selectedApplyPackage, setSelectedApplyPackage] = useState('Professional');

  // Application State - Guaranteed fallback to initial data so 0 counts never happen
  const [systemMode, setSystemMode] = useState<'demo' | 'production'>('demo');
  const [applications, setApplications] = useState<CertificationApplication[]>(() => getLocalApps());
  const [certifiedProjects, setCertifiedProjects] = useState<PublicCertifiedProject[]>(() => getLocalCertifiedProjects());
  const [leads, setLeads] = useState<Lead[]>(() => getLocalLeads());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => getLocalAuditLogs());

  const platformTabToView: Record<PlatformTab, PlatformView> = {
    public: 'public_website',
    customer: 'customer_portal',
    ops: 'ops_platform',
    exec: 'exec_platform'
  };

  const platformViewToTab: Record<PlatformView, PlatformTab> = {
    public_website: 'public',
    customer_portal: 'customer',
    ops_platform: 'ops',
    exec_platform: 'exec'
  };

  const handleUserRoleChange = (role: UserRole) => {
    setCurrentUserRole(role);
    if (role === 'customer') {
      setActivePlatformView('customer_portal');
      setActiveCustomerSubTab('overview');
      navigateTo('/customer/overview');
    } else if (role === 'exec') {
      setActivePlatformView('exec_platform');
      setActiveExecSubTab('bi');
      navigateTo('/exec/bi');
    } else {
      setActivePlatformView('ops_platform');
      const defaultSubTab = 'my_work';
      setActiveOpsSubTab(defaultSubTab);
      navigateTo(`/ops/${defaultSubTab}`);
    }
  };

  const handlePlatformTabChange = (tab: PlatformTab) => {
    const newView = platformTabToView[tab];
    setActivePlatformView(newView);
    if (tab === 'customer') {
      setCurrentUserRole('customer');
      setActiveCustomerSubTab('overview');
      navigateTo('/customer/overview');
    } else if (tab === 'exec') {
      setCurrentUserRole('exec');
      setActiveExecSubTab('bi');
      navigateTo('/exec/bi');
    } else if (tab === 'ops') {
      if (currentUserRole === 'customer' || currentUserRole === 'exec') {
        setCurrentUserRole('pm');
      }
      setActiveOpsSubTab('my_work');
      navigateTo('/ops/my_work');
    } else if (tab === 'public') {
      setPublicSubView('home');
      navigateTo('/public/home');
    }
  };

  const refreshData = async () => {
    try {
      const modeRes = await fetch('/api/system/mode').then(r => r.json()).catch(() => ({ mode: 'demo' }));
      if (modeRes && modeRes.mode) {
        setSystemMode(modeRes.mode);
      }

      const [appsData, registryData, leadsData, auditData] = await Promise.all([
        safeFetch('/api/applications', 'apps', INITIAL_APPLICATIONS),
        safeFetch('/api/registry', 'registry', INITIAL_CERTIFIED_PROJECTS),
        safeFetch('/api/leads', 'leads', INITIAL_LEADS),
        safeFetch('/api/audit-logs', 'audit', INITIAL_AUDIT_LOGS)
      ]);

      if (appsData && Array.isArray(appsData)) setApplications(appsData);
      if (registryData && Array.isArray(registryData)) setCertifiedProjects(registryData);
      if (leadsData && Array.isArray(leadsData)) setLeads(leadsData);
      if (auditData && Array.isArray(auditData)) setAuditLogs(auditData);
    } catch (err) {
      console.warn('Running with client-side state', err);
    }
  };

  const handleModeChange = (newMode: 'demo' | 'production') => {
    setSystemMode(newMode);
    refreshData();
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Scroll to top whenever page view or public subview changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activePlatformView, publicSubView]);

  const handleApplyService = (pkgName: string) => {
    setSelectedApplyPackage(pkgName);
    setPublicSubView('apply');
  };

  const handleSelectVerify = (certNumber: string) => {
    setVerifyCertQuery(certNumber);
    setPublicSubView('verify');
  };

  const handleApplicationCreated = (newApp: CertificationApplication) => {
    refreshData();
  };

  return (
    <div className={`min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col font-sans ${dir === 'rtl' ? 'rtl' : 'ltr'}`} dir={dir}>
      <Header
        activePlatform={platformViewToTab[activePlatformView]}
        setActivePlatform={handlePlatformTabChange}
        activePublicTab={publicSubView}
        setActivePublicTab={(tab) => setPublicSubView(tab as PublicSubView)}
        currentUserRole={currentUserRole}
        setCurrentUserRole={handleUserRoleChange}
        systemMode={systemMode}
      />

      <main className="flex-grow">
        {!hasPlatformAccess(activePlatformView) ? (
          <AccessDeniedPage
            targetPlatform={activePlatformView}
            requiredPermission={`platform:${activePlatformView}`}
            onRedirectAuthorized={() => {
              setActivePlatformView('public_website');
              setPublicSubView('home');
            }}
          />
        ) : (
          <>
            {/* PLATFORM 1: PUBLIC WEBSITE */}
            {activePlatformView === 'public_website' && (
              <>
                {publicSubView === 'home' && (
                  <HomeView
                    certifiedProjects={certifiedProjects}
                    onNavigate={(sub) => setPublicSubView(sub as PublicSubView)}
                    onApplyPackage={handleApplyService}
                  />
                )}
                {publicSubView === 'services' && (
                  <ServicesView onApplyService={handleApplyService} />
                )}
                {publicSubView === 'methodology' && <MethodologyView />}
                {publicSubView === 'pricing' && (
                  <PricingView onApplyPackage={handleApplyService} />
                )}
                {publicSubView === 'registry' && (
                  <RegistryView
                    certifiedProjects={certifiedProjects}
                    onSelectVerify={handleSelectVerify}
                  />
                )}
                {publicSubView === 'verify' && (
                  <VerificationView initialQuery={verifyCertQuery} />
                )}
                {publicSubView === 'resources' && <ResourcesView />}
                {publicSubView === 'whitepaper_repository' && (
                  <WhitepaperRepositoryPage systemMode={systemMode} />
                )}
                {publicSubView === 'apply' && (
                  <ApplyView
                    selectedPackage={selectedApplyPackage}
                    onApplicationCreated={handleApplicationCreated}
                  />
                )}
                {publicSubView === 'join_team' && (
                  <JoinTeamView onApplicationSubmitted={refreshData} />
                )}
              </>
            )}

            {/* PLATFORM 2: CUSTOMER PORTAL */}
            {activePlatformView === 'customer_portal' && (
              <CustomerPortalView
                applications={applications}
                onRefreshApplications={refreshData}
                activeSubTab={activeCustomerSubTab}
              />
            )}

            {/* PLATFORM 3: OPERATIONS PLATFORM */}
            {activePlatformView === 'ops_platform' && (
              <OpsPlatformView
                currentUserRole={currentUserRole}
                setCurrentUserRole={handleUserRoleChange}
                applications={applications}
                leads={leads}
                auditLogs={auditLogs}
                onRefreshData={refreshData}
                systemMode={systemMode}
                activeSubTab={activeOpsSubTab}
              />
            )}

            {/* PLATFORM 4: EXECUTIVE PLATFORM */}
            {activePlatformView === 'exec_platform' && (
              <ExecPlatformView
                systemMode={systemMode}
                onModeChange={handleModeChange}
                currentUserRole={currentUserRole}
                activeSubTab={activeExecSubTab}
                applications={applications}
              />
            )}
          </>
        )}
      </main>

      <Footer setPublicSubView={(sub) => {
        setActivePlatformView('public_website');
        setPublicSubView(sub);
      }} />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onSelectPlatformView={(view) => setActivePlatformView(view)}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <RbacProvider>
          <SessionSecurityProvider>
            <MainContent />
          </SessionSecurityProvider>
        </RbacProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
