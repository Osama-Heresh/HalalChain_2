import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CertificationApplication, ClarificationMessage } from '../../types';
import {
  ShieldCheck,
  Clock,
  CreditCard,
  MessageSquare,
  Award,
  LayoutDashboard,
  UserCheck,
  Activity,
  FileText,
  AlertCircle,
  Globe,
  Sparkles
} from 'lucide-react';
import { IslamicPatternBg } from '../IslamicPatternBg';
import { ShariaCertificateModal } from '../ShariaCertificateModal';
import { ScrollableTabNav } from '../common/ScrollableTabNav';
import { useRbac } from '../../context/RbacContext';
import { navigateTo } from '../../lib/router';

// Customer Experience Platform Sub-components
import { CustomerExperienceDashboard } from './CustomerExperienceDashboard';
import { Customer360ProfileView } from './Customer360ProfileView';
import { AssessmentProgressTracker } from './AssessmentProgressTracker';
import { CustomerActivityTimeline } from './CustomerActivityTimeline';
import { CustomerCommunicationCenter } from './CustomerCommunicationCenter';
import { CustomerDocumentExchange } from './CustomerDocumentExchange';

interface CustomerPortalViewProps {
  applications: CertificationApplication[];
  onRefreshApplications: () => void;
  activeSubTab?: string;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  applications,
  onRefreshApplications,
  activeSubTab
}) => {
  const { language } = useLanguage();
  const { getNavigation } = useRbac();
  const navConfig = getNavigation('customer');
  const customerNavItems = navConfig.customerTabs;

  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [activeTab, setActiveTab] = useState<string>(activeSubTab || 'dashboard');
  const [portalLang, setPortalLang] = useState<'en' | 'ar' | 'side-by-side'>(
    language === 'ar' ? 'ar' : 'en'
  );

  useEffect(() => {
    if (activeSubTab) {
      if (activeSubTab === 'deposit') {
        setActiveTab('payments');
      } else {
        setActiveTab(activeSubTab);
      }
    }
  }, [activeSubTab]);

  const [showCertModal, setShowCertModal] = useState(false);
  const [messagesList, setMessagesList] = useState<ClarificationMessage[]>([]);
  const [payingDeposit, setPayingDeposit] = useState(false);
  const [payingFinal, setPayingFinal] = useState(false);

  const currentApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  const fetchMessages = async (appId: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessagesList(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedAppId) {
      fetchMessages(selectedAppId);
    }
  }, [selectedAppId]);

  const handlePay = async (type: 'deposit' | 'final') => {
    if (!currentApp) return;
    if (type === 'deposit') setPayingDeposit(true);
    else setPayingFinal(true);

    try {
      const res = await fetch(`/api/applications/${currentApp.id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentType: type,
          txHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`
        })
      });
      if (res.ok) {
        onRefreshApplications();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPayingDeposit(false);
      setPayingFinal(false);
    }
  };

  if (!currentApp) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500 font-mono">
        No active certification projects found in Customer Experience Platform.
      </div>
    );
  }

  const isRtl = portalLang === 'ar';

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8 ${isRtl ? 'rtl' : 'ltr'}`}>
      
      {/* Top Banner & Project Selector */}
      <div className="bg-[#0B132B] text-white p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <IslamicPatternBg />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono border border-amber-500/30">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Customer Experience Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif">{currentApp.companyName}</h1>
          <p className="text-xs text-slate-300 font-mono">
            Ref: {currentApp.applicationNumber || currentApp.id} • Package: {currentApp.packageType} Tier • Blockchain: {currentApp.blockchain}
          </p>
        </div>

        {/* Project Selector Switcher */}
        {applications.length > 1 && (
          <div className="relative z-10 bg-[#1C2541] p-3 rounded-2xl border border-amber-500/20 shrink-0">
            <label className="text-[10px] text-amber-400 font-mono block uppercase mb-1 font-bold">Select Active Project:</label>
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="bg-[#0B132B] text-amber-300 text-xs font-mono font-bold py-2 px-3 rounded-xl border border-amber-500/30 focus:outline-none cursor-pointer"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.companyName} ({app.applicationNumber || app.id})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Navigation Tabs inside Customer Portal */}
      <ScrollableTabNav className="border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-mono" variant="light">
        {customerNavItems.map((item) => {
          const tabKey = item.id === 'deposit' ? 'payments' : item.id === 'messages' ? 'communication' : item.id;
          const isActive = activeTab === tabKey || activeTab === item.id || item.active;
          const isDisabled = item.id === 'certificate' && currentApp.stage !== 'published_registry' && currentApp.stage !== 'certificate_generation';
          return (
            <button
              key={item.id}
              disabled={isDisabled}
              onClick={() => {
                navigateTo(item.path);
                setActiveTab(tabKey);
              }}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer font-extrabold flex items-center gap-2 shrink-0 disabled:opacity-40 ${
                isActive ? 'bg-[#0B132B] text-amber-400 shadow-md border border-amber-500/40' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item.iconName === 'LayoutDashboard' && <LayoutDashboard className="w-4 h-4 text-amber-400" />}
              {item.iconName === 'UserCheck' && <UserCheck className="w-4 h-4 text-indigo-400" />}
              {item.iconName === 'Clock' && <Clock className="w-4 h-4 text-amber-400" />}
              {item.iconName === 'Activity' && <Activity className="w-4 h-4 text-sky-400" />}
              {item.iconName === 'MessageSquare' && <MessageSquare className="w-4 h-4 text-amber-500" />}
              {item.iconName === 'CreditCard' && <CreditCard className="w-4 h-4 text-emerald-500" />}
              {item.iconName === 'FileText' && <FileText className="w-4 h-4 text-indigo-400" />}
              {item.iconName === 'Award' && <Award className="w-4 h-4 text-amber-400" />}
              <span>{item.label}</span>
              {item.id === 'communication' && messagesList.length > 0 && (
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {messagesList.length}
                </span>
              )}
            </button>
          );
        })}
      </ScrollableTabNav>

      {/* TAB 1: CUSTOMER DASHBOARD */}
      {activeTab === 'dashboard' && (
        <CustomerExperienceDashboard
          project={currentApp}
          allProjects={applications}
          messages={messagesList}
          onSelectTab={(tabKey) => setActiveTab(tabKey)}
          lang={portalLang}
          onChangeLang={(l) => setPortalLang(l)}
        />
      )}

      {/* TAB 2: CUSTOMER 360 PROFILE */}
      {activeTab === 'c360' && (
        <Customer360ProfileView
          project={currentApp}
          onUpdateProject={() => onRefreshApplications()}
          lang={portalLang}
        />
      )}

      {/* TAB 3: ASSESSMENT PROGRESS TRACKER */}
      {activeTab === 'overview' && (
        <AssessmentProgressTracker
          project={currentApp}
          lang={portalLang}
        />
      )}

      {/* TAB 4: ACTIVITY TIMELINE */}
      {activeTab === 'timeline' && (
        <CustomerActivityTimeline
          project={currentApp}
          lang={portalLang}
        />
      )}

      {/* TAB 5: COMMUNICATION CENTER */}
      {(activeTab === 'communication' || activeTab === 'messages') && (
        <CustomerCommunicationCenter
          project={currentApp}
          isCustomerPortalView={true}
          lang={portalLang}
        />
      )}

      {/* TAB 6: INVOICES & PAYMENTS */}
      {(activeTab === 'payments' || activeTab === 'deposit') && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">Invoices & Payment Gate</h3>
                <p className="text-xs text-slate-500 font-mono">Settle initial deposit and final release balances to advance certification</p>
              </div>
              <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full">
                Encrypted Settlement Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Deposit Invoice Box */}
              <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-slate-500">Invoice #1: Initial Deposit</span>
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-md font-bold uppercase ${
                    currentApp.depositPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {currentApp.depositPaid ? 'Confirmed Paid ✓' : 'Payment Required'}
                  </span>
                </div>
                <div className="text-3xl font-bold font-serif text-slate-900 dark:text-white">${currentApp.depositAmount?.toLocaleString()} USD</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-mono">50% upfront deposit to trigger AI collection and Technical Auditor review.</p>

                {!currentApp.depositPaid && (
                  <button
                    onClick={() => handlePay('deposit')}
                    disabled={payingDeposit}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer shadow-md"
                  >
                    {payingDeposit ? 'Confirming Payment...' : 'Pay Deposit Invoice Now'}
                  </button>
                )}
              </div>

              {/* Final Invoice Box */}
              <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-slate-500">Invoice #2: Final Release</span>
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-md font-bold uppercase ${
                    currentApp.finalPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {currentApp.finalPaid ? 'Confirmed Paid ✓' : 'Pending Stage Release'}
                  </span>
                </div>
                <div className="text-3xl font-bold font-serif text-slate-900 dark:text-white">${currentApp.remainingAmount?.toLocaleString()} USD</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-mono">Remaining 50% fee due prior to Digital Certificate issuance and Public Registry publication.</p>

                {!currentApp.finalPaid && (
                  <button
                    onClick={() => handlePay('final')}
                    disabled={payingFinal}
                    className="w-full py-3 rounded-2xl bg-[#0B132B] text-amber-400 font-bold text-xs hover:bg-[#1C2541] transition-all cursor-pointer shadow-md"
                  >
                    {payingFinal ? 'Confirming Payment...' : 'Pay Final Balance Invoice'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: DOCUMENT EXCHANGE */}
      {activeTab === 'documents' && (
        <CustomerDocumentExchange
          project={currentApp}
          lang={portalLang}
        />
      )}

      {/* TAB 8: SHARIA CERTIFICATE & SEAL */}
      {activeTab === 'certificate' && (
        <div className="bg-[#0B132B] text-white p-8 sm:p-12 rounded-3xl border-2 border-amber-500 shadow-2xl space-y-6 text-center relative overflow-hidden">
          <IslamicPatternBg />
          <div className="relative z-10 space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 mx-auto shadow-lg">
              <div className="w-full h-full bg-[#0B132B] rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-amber-400" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 rounded font-bold uppercase">
                OFFICIAL SHARIA DIPLOMA & CERTIFICATION
              </span>
              <h2 className="text-2xl font-bold font-serif text-amber-300">Sharia Compliance Certificate</h2>
              <p className="text-xs text-slate-300 font-mono">
                Official document confirming full theological and bytecode compliance for <strong className="text-white">{currentApp.companyName}</strong> featuring barcode, QR code verification, scholar signatures, and PDF download capability.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center">
              <button
                onClick={() => setShowCertModal(true)}
                className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-lg"
              >
                <Award className="w-4 h-4" />
                <span>View & Print Official Sharia Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      <ShariaCertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        project={currentApp}
      />
    </div>
  );
};
