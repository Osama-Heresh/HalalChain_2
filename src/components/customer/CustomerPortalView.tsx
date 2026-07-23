import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CertificationApplication, ClarificationMessage } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  MessageSquare,
  Download,
  FileText,
  AlertCircle,
  Lock,
  Send,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { IslamicPatternBg } from '../IslamicPatternBg';

interface CustomerPortalViewProps {
  applications: CertificationApplication[];
  onRefreshApplications: () => void;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  applications,
  onRefreshApplications
}) => {
  const { t, dir } = useLanguage();
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'messages' | 'certificate'>('overview');

  const [messageInput, setMessageInput] = useState('');
  const [messagesList, setMessagesList] = useState<ClarificationMessage[]>([]);
  const [payingDeposit, setPayingDeposit] = useState(false);
  const [payingFinal, setPayingFinal] = useState(false);

  const currentApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  const fetchMessages = async (appId: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}/messages`);
      const data = await res.json();
      setMessagesList(data);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    if (selectedAppId) {
      fetchMessages(selectedAppId);
    }
  }, [selectedAppId]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentApp) return;
    try {
      const res = await fetch(`/api/applications/${currentApp.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderRole: 'customer',
          senderName: `${currentApp.representativeName} (${currentApp.companyName})`,
          message: messageInput.trim()
        })
      });
      if (res.ok) {
        setMessageInput('');
        fetchMessages(currentApp.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  const workflowStagesList = [
    { key: 'waiting_deposit', label: '1. Waiting Deposit' },
    { key: 'project_created', label: '2. Project Created' },
    { key: 'ai_assessment', label: '3. AI Extraction' },
    { key: 'technical_review', label: '4. Tech Review' },
    { key: 'business_review', label: '5. Business Review' },
    { key: 'scholar_review', label: '6. Scholar Review' },
    { key: 'quality_assurance', label: '7. QA Sign-Off' },
    { key: 'waiting_final_payment', label: '8. Waiting Final Payment' },
    { key: 'certificate_generation', label: '9. Cert Issuance' },
    { key: 'published_registry', label: '10. Published Registry' }
  ];

  if (!currentApp) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500 font-mono">
        No active certification projects found in customer portal.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      {/* Top Banner & Project Selector */}
      <div className="bg-[#0B132B] text-white p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <IslamicPatternBg />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono border border-amber-500/30">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Customer Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif">{currentApp.companyName}</h1>
          <p className="text-xs text-slate-300 font-mono">Ref: {currentApp.applicationNumber} • Package: {currentApp.packageType} Tier • Blockchain: {currentApp.blockchain}</p>
        </div>

        {/* Project Selector Switcher */}
        {applications.length > 1 && (
          <div className="relative z-10 bg-[#1C2541] p-3 rounded-2xl border border-amber-500/20">
            <label className="text-[10px] text-amber-400 font-mono block uppercase mb-1">Select Project:</label>
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="bg-[#0B132B] text-amber-300 text-xs font-mono font-bold py-1.5 px-3 rounded-xl border border-amber-500/30 focus:outline-none"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.companyName} ({app.applicationNumber})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Navigation Tabs inside Customer Portal */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-mono overflow-x-auto whitespace-nowrap scrollbar-none max-w-full touch-pan-x">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold shrink-0 ${
            activeTab === 'overview'
              ? 'bg-[#0B132B] text-amber-400 shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Project Overview & Progress
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold flex items-center gap-1.5 shrink-0 ${
            activeTab === 'payments'
              ? 'bg-[#0B132B] text-amber-400 shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
          <span>Invoices & Payments</span>
          {(!currentApp.depositPaid || (!currentApp.finalPaid && currentApp.stage === 'waiting_final_payment')) && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold flex items-center gap-1.5 shrink-0 ${
            activeTab === 'messages'
              ? 'bg-[#0B132B] text-amber-400 shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
          <span>Clarifications & Messages ({messagesList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('certificate')}
          disabled={currentApp.stage !== 'published_registry'}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold flex items-center gap-1.5 disabled:opacity-40 shrink-0 ${
            activeTab === 'certificate'
              ? 'bg-[#0B132B] text-amber-400 shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>Download Certificate</span>
        </button>
      </div>

      {/* Tab Content 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Workflow Progress Bar */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-serif text-slate-900">Real-Time Certification Workflow Tracker</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Target SLA Completion Date: <span className="font-bold text-amber-700">{currentApp.targetCompletionDate}</span></p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase">
                Stage: {currentApp.stage.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Stage Steps List */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
              {workflowStagesList.map((stg) => {
                const isCurrent = currentApp.stage === stg.key;
                return (
                  <div
                    key={stg.key}
                    className={`p-2.5 rounded-xl border text-[11px] font-mono ${
                      isCurrent
                        ? 'bg-[#0B132B] text-amber-300 border-amber-500 shadow-md font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {isCurrent ? (
                        <Clock className="w-3 h-3 text-amber-400 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3 text-slate-400" />
                      )}
                      <span className="truncate">{stg.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Extraction Banner */}
          {currentApp.stage === 'ai_assessment' && (
            <div className="bg-gradient-to-r from-amber-900 via-[#0B132B] to-[#1C2541] text-white p-6 rounded-3xl border border-amber-500/40 shadow-lg space-y-3">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
                <div>
                  <h4 className="text-sm font-bold font-serif text-amber-300">Centralized AI Automated Information Collection Active</h4>
                  <p className="text-xs text-slate-300">HalalChain AI engine is crawling your whitepaper, contract bytecode, and tokenomics metrics...</p>
                </div>
              </div>
            </div>
          )}

          {/* Unpaid Invoice Warning */}
          {!currentApp.depositPaid && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-amber-700 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900 font-mono">Action Required: Initial Deposit Unpaid</h4>
                  <p className="text-xs text-amber-800 mt-0.5">Please settle your initial deposit of ${currentApp.depositAmount.toLocaleString()} USD to activate technical auditor review.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('payments')}
                className="px-5 py-2 rounded-xl bg-amber-700 text-white text-xs font-bold hover:bg-amber-800 transition-all cursor-pointer whitespace-nowrap"
              >
                Pay Deposit Now
              </button>
            </div>
          )}

          {/* Application Details Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-xs font-mono">
              <h4 className="font-bold text-slate-900 border-b pb-2 uppercase text-[11px] text-slate-400">Project Disclosures</h4>
              <div className="flex justify-between">
                <span className="text-slate-500">Official Website:</span>
                <a href={currentApp.websiteUrl} target="_blank" rel="noreferrer" className="text-amber-700 underline font-semibold">{currentApp.websiteUrl}</a>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Whitepaper:</span>
                <a href={currentApp.whitepaperUrl} target="_blank" rel="noreferrer" className="text-amber-700 underline font-semibold">View PDF</a>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Smart Contract:</span>
                <span className="text-slate-900 font-semibold">{currentApp.contractAddress}</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-xs font-mono">
              <h4 className="font-bold text-slate-900 border-b pb-2 uppercase text-[11px] text-slate-400">Financial Summary</h4>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Assessment Fee:</span>
                <span className="font-bold text-slate-900">${currentApp.totalFee.toLocaleString()} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Deposit Paid:</span>
                <span className={`font-bold ${currentApp.depositPaid ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {currentApp.depositPaid ? 'PAID ✓' : 'UNPAID ✕'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Final Balance Paid:</span>
                <span className={`font-bold ${currentApp.finalPaid ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {currentApp.finalPaid ? 'PAID ✓' : 'UNPAID ✕'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Payments */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
            <h3 className="text-lg font-bold font-serif text-slate-900">Invoices & Payment Gate</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Deposit Invoice Box */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-slate-500">Invoice #1: Initial Deposit</span>
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-md font-bold uppercase ${
                    currentApp.depositPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {currentApp.depositPaid ? 'Confirmed Paid' : 'Payment Required'}
                  </span>
                </div>
                <div className="text-3xl font-bold font-serif text-slate-900">${currentApp.depositAmount.toLocaleString()} USD</div>
                <p className="text-xs text-slate-600">50% upfront deposit to trigger AI collection and Technical Auditor review.</p>

                {!currentApp.depositPaid && (
                  <button
                    onClick={() => handlePay('deposit')}
                    disabled={payingDeposit}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer shadow-md"
                  >
                    {payingDeposit ? 'Confirming Payment...' : 'Pay Deposit Invoice Now'}
                  </button>
                )}
              </div>

              {/* Final Invoice Box */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-slate-500">Invoice #2: Final Release</span>
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-md font-bold uppercase ${
                    currentApp.finalPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {currentApp.finalPaid ? 'Confirmed Paid' : 'Pending Stage Release'}
                  </span>
                </div>
                <div className="text-3xl font-bold font-serif text-slate-900">${currentApp.remainingAmount.toLocaleString()} USD</div>
                <p className="text-xs text-slate-600">Remaining 50% fee due prior to Digital Certificate issuance and Public Registry publication.</p>

                {!currentApp.finalPaid && (
                  <button
                    onClick={() => handlePay('final')}
                    disabled={payingFinal}
                    className="w-full py-3 rounded-xl bg-[#0B132B] text-amber-400 font-bold text-xs hover:bg-[#1C2541] transition-all cursor-pointer shadow-md"
                  >
                    {payingFinal ? 'Confirming Payment...' : 'Pay Final Balance Invoice'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Messages */}
      {activeTab === 'messages' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-base font-bold font-serif text-slate-900">Clarification & Communications Board</h3>
              <p className="text-xs text-slate-500 font-mono">Direct secure messaging with HalalChain Auditors and Sharia Scholars</p>
            </div>
            <span className="text-xs font-mono bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full font-semibold">
              Permanent Audit Logging Active
            </span>
          </div>

          {/* Messages History List */}
          <div className="space-y-3 max-h-80 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
            {messagesList.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 font-mono">
                No clarification messages yet for this project.
              </div>
            ) : (
              messagesList.map((msg) => {
                const isCust = msg.senderRole === 'customer';
                return (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-2xl text-xs space-y-1.5 ${
                      isCust
                        ? 'bg-amber-500/10 border border-amber-500/30 text-slate-900 ml-8'
                        : 'bg-white border border-slate-200 text-slate-900 mr-8'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="font-bold text-slate-800">{msg.senderName}</span>
                      <span className="text-slate-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="leading-relaxed text-slate-800">{msg.message}</p>
                  </div>
                );
              })
            )}
          </div>

          {/* Send Message Input */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Type your response or clarification notes..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-grow px-4 py-3 rounded-2xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleSendMessage}
              className="px-6 py-3 rounded-2xl bg-[#0B132B] text-amber-400 font-bold text-xs hover:bg-[#1C2541] transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Send Message</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab Content 4: Certificate View */}
      {activeTab === 'certificate' && currentApp.stage === 'published_registry' && (
        <div className="bg-[#0B132B] text-white p-8 rounded-3xl border-2 border-amber-500 shadow-2xl space-y-6 text-center relative overflow-hidden">
          <IslamicPatternBg />
          <div className="relative z-10 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-amber-300">Official Sharia Certification Document</h2>
            <p className="text-xs text-slate-300 max-w-xl mx-auto">
              This certificate confirms full Sharia compliance for {currentApp.companyName} under HalalChain Standard v2.1.
            </p>
            <button
              onClick={() => window.print()}
              className="px-8 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all cursor-pointer inline-flex items-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Download Official PDF Certificate</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
