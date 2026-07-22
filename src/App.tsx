import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
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

// App platforms
import { CustomerPortalView } from './components/customer/CustomerPortalView';
import { OpsPlatformView } from './components/ops/OpsPlatformView';
import { ExecPlatformView } from './components/exec/ExecPlatformView';

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

const MainContent: React.FC = () => {
  const { dir } = useLanguage();

  const [activePlatformView, setActivePlatformView] = useState<PlatformView>('public_website');
  const [publicSubView, setPublicSubView] = useState<PublicSubView>('home');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('customer');

  const [verifyCertQuery, setVerifyCertQuery] = useState('');
  const [selectedApplyPackage, setSelectedApplyPackage] = useState('Professional');

  // Application State
  const [applications, setApplications] = useState<CertificationApplication[]>([]);
  const [certifiedProjects, setCertifiedProjects] = useState<PublicCertifiedProject[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

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
    } else if (role === 'exec') {
      setActivePlatformView('exec_platform');
    } else {
      setActivePlatformView('ops_platform');
    }
  };

  const handlePlatformTabChange = (tab: PlatformTab) => {
    const newView = platformTabToView[tab];
    setActivePlatformView(newView);
    if (tab === 'customer') {
      setCurrentUserRole('customer');
    } else if (tab === 'exec') {
      setCurrentUserRole('exec');
    } else if (tab === 'ops') {
      if (currentUserRole === 'customer' || currentUserRole === 'exec') {
        setCurrentUserRole('pm');
      }
    }
  };

  const refreshData = async () => {
    try {
      const [appsRes, registryRes, leadsRes, auditRes] = await Promise.all([
        fetch('/api/applications'),
        fetch('/api/registry'),
        fetch('/api/leads'),
        fetch('/api/audit-logs')
      ]);

      if (appsRes.ok) setApplications(await appsRes.json());
      if (registryRes.ok) setCertifiedProjects(await registryRes.json());
      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (auditRes.ok) setAuditLogs(await auditRes.json());
    } catch (err) {
      console.error('Failed to load initial platform data', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

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
      />

      <main className="flex-grow">
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
          />
        )}

        {/* PLATFORM 3: OPERATIONS PLATFORM */}
        {activePlatformView === 'ops_platform' && (
          <OpsPlatformView
            currentUserRole={currentUserRole}
            setCurrentUserRole={setCurrentUserRole}
            applications={applications}
            leads={leads}
            auditLogs={auditLogs}
            onRefreshData={refreshData}
          />
        )}

        {/* PLATFORM 4: EXECUTIVE PLATFORM */}
        {activePlatformView === 'exec_platform' && <ExecPlatformView />}
      </main>

      <Footer setPublicSubView={(sub) => {
        setActivePlatformView('public_website');
        setPublicSubView(sub);
      }} />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <MainContent />
    </LanguageProvider>
  );
}
