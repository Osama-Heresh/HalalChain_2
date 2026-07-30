import React, { useState, useEffect } from 'react';
import {
  Users,
  Mail,
  Send,
  Phone,
  MapPin,
  Globe,
  Plus,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Building2,
  Printer,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { MarketingProspectRecord, EmailHistoryEntry, SmartMarketingQueueItem, UserRole } from '../../types';
import { exportReport } from '../../lib/reportEngine';
import { buildMarketingReportOptions } from '../../lib/reportGenerators';

interface SmartMarketingCRMViewProps {
  currentUserRole?: UserRole;
  currentUserName?: string;
}

export const SmartMarketingCRMView: React.FC<SmartMarketingCRMViewProps> = ({
  currentUserRole = 'marketing',
  currentUserName = 'Marketing BD Lead'
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'prospects' | 'email_history'>('queue');
  const [prospects, setProspects] = useState<MarketingProspectRecord[]>([]);
  const [emailHistory, setEmailHistory] = useState<EmailHistoryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Selected Prospect for Emailing / Editing
  const [selectedProspect, setSelectedProspect] = useState<MarketingProspectRecord | null>(null);
  const [emailTemplate, setEmailTemplate] = useState<string>('Standard HalalChain Shariah Audit Invitation');
  const [emailSubject, setEmailSubject] = useState<string>('Invitation for Shariah Compliance Audit & Certification — HalalChain™');
  const [overrideDuplicate, setOverrideDuplicate] = useState<boolean>(false);
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);

  const fetchMarketingData = async () => {
    setLoading(true);
    try {
      const [pRes, eRes] = await Promise.all([
        fetch('/api/marketing/prospects'),
        fetch('/api/marketing/emails')
      ]);
      if (pRes.ok) {
        const pData = await pRes.json();
        setProspects(pData);
      }
      if (eRes.ok) {
        const eData = await eRes.json();
        setEmailHistory(eData);
      }
    } catch (err) {
      console.warn('Marketing data fetch fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketingData();
  }, []);

  // Compute Smart Queue Ranking
  const smartQueueItems: SmartMarketingQueueItem[] = prospects
    .map((p) => {
      let rank = 50;
      let reason = 'Standard Prospect';

      if ((p.marketCapUSD || 0) > 200000000) {
        rank += 30;
        reason = 'Large Market Cap ($200M+) & High Liquidity';
      }
      if (!p.invitationSent) {
        rank += 20;
        reason += ' • Never Contacted';
      }
      if (p.certificateStatus === 'Expired' || p.certificateStatus === 'Pending') {
        rank += 15;
        reason += ' • High Need for Shariah Certificate';
      }

      return {
        prospect: p,
        rankPriority: rank,
        reason,
        suggestedAction: p.invitationSent
          ? 'Follow up on previous Shariah Audit Invitation'
          : 'Send Initial Shariah Certification Outreach'
      };
    })
    .sort((a, b) => b.rankPriority - a.rankPriority);

  const handleSendEmail = async (prospect: MarketingProspectRecord) => {
    if (prospect.invitationSent && !overrideDuplicate && currentUserRole !== 'pm' && currentUserRole !== 'admin') {
      alert('Invitation already sent. Waiting for customer response.');
      return;
    }

    setIsSendingEmail(true);
    const newEntry: EmailHistoryEntry = {
      id: `EML-${Date.now().toString().slice(-6)}`,
      prospectId: prospect.id,
      masterId: prospect.masterId,
      employeeName: currentUserName,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emailTemplate,
      recipient: prospect.bdEmail || prospect.generalEmail,
      subject: emailSubject,
      deliveryStatus: 'Delivered',
      replyStatus: 'No Reply',
      nextFollowUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
    };

    try {
      const res = await fetch('/api/marketing/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      });

      if (res.ok) {
        // Update prospect invitation state
        const updatedProspect: MarketingProspectRecord = {
          ...prospect,
          invitationSent: true,
          lastContactedAt: new Date().toISOString()
        };
        await fetch('/api/marketing/prospects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProspect)
        });

        setEmailHistory((prev) => [newEntry, ...prev]);
        setProspects((prev) => prev.map((p) => (p.id === prospect.id ? updatedProspect : p)));
        setSendSuccessMessage(`Email successfully recorded for ${prospect.companyName}!`);
        setTimeout(() => setSendSuccessMessage(null), 4000);
      }
    } catch (e) {
      console.error('Email send logging error:', e);
    } finally {
      setIsSendingEmail(false);
      setSelectedProspect(null);
    }
  };

  const prospectsList = Array.isArray(prospects) ? prospects : [];
  const filteredProspects = prospectsList.filter(
    (p) =>
      p &&
      ((p.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.generalEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.country || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleExportReport = async (format: 'PDF' | 'Excel' | 'CSV') => {
    if (!prospects || prospects.length === 0) {
      alert('No report data available to export.');
      return;
    }
    try {
      const opts = buildMarketingReportOptions(prospects);
      opts.format = format;
      await exportReport(opts);
    } catch (err) {
      console.error('Marketing report export error:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>ENTERPRISE MARKETING & PROSPECT INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Smart Marketing CRM & Queue
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Automated prospect ranking, full public business contact records, and duplicate outreach prevention guardrails.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export Actions */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700 text-xs font-bold">
            <button
              onClick={() => handleExportReport('PDF')}
              className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1 transition-all"
              title="Export PDF"
            >
              <Printer className="w-3.5 h-3.5" /> PDF
            </button>
            <button
              onClick={() => handleExportReport('Excel')}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-1 transition-all"
              title="Export Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
            </button>
            <button
              onClick={() => handleExportReport('CSV')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white flex items-center gap-1 transition-all"
              title="Export CSV"
            >
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'queue' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Smart Queue
            </button>
            <button
              onClick={() => setActiveTab('prospects')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'prospects' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Prospect Database
            </button>
            <button
              onClick={() => setActiveTab('email_history')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'email_history' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Outreach Log ({emailHistory.length})
            </button>
          </div>
        </div>
      </div>

      {sendSuccessMessage && (
        <div className="bg-emerald-500 text-slate-950 p-4 rounded-2xl font-bold text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{sendSuccessMessage}</span>
          </div>
        </div>
      )}

      {/* SMART MARKETING QUEUE VIEW */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span>DAILY PRIORITIZED WORK QUEUE FOR MARKETING REPRESENTATIVE</span>
            <span>{smartQueueItems.length} Prospects Ranked</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {smartQueueItems.map((item, idx) => {
              const p = item.prospect;
              return (
                <div
                  key={p.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 font-black flex items-center justify-center font-mono text-sm border border-indigo-200 dark:border-indigo-800">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white text-base">
                          {p.companyName}
                        </span>
                        <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                          Score: {item.rankPriority}
                        </span>
                        {p.invitationSent && (
                          <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                            Invitation Already Sent
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {p.country}</span>
                        <span>• Market Cap: ${((p.marketCapUSD || 0) / 1000000).toFixed(0)}M</span>
                        <span>• BD Email: {p.bdEmail || p.generalEmail}</span>
                      </div>

                      <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-2">
                        Priority Reason: {item.reason}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    {p.invitationSent ? (
                      <div className="text-right">
                        <div className="text-xs font-bold text-amber-600 flex items-center gap-1 justify-end">
                          <Lock className="w-3.5 h-3.5" />
                          Invitation Already Sent
                        </div>
                        <div className="text-[10px] text-slate-400">Waiting for customer response</div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedProspect(p)}
                        className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl flex items-center gap-2 transition-all shadow"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Outreach Email</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PROSPECT DATABASE VIEW */}
      {activeTab === 'prospects' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search prospects by company, email, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProspects.map((p) => (
              <div key={p.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{p.companyName}</h3>
                    <div className="text-xs text-slate-500 font-mono">{p.website}</div>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-xl">
                    Master ID: {p.masterId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">General Email</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 truncate block">{p.generalEmail}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">BD Email</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 truncate block">{p.bdEmail}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Support Email</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 truncate block">{p.supportEmail}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Phone</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 truncate block">{p.officialPhone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="text-slate-500">{p.country} • {p.city}</div>
                  <button
                    onClick={() => setSelectedProspect(p)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs"
                  >
                    Manage Outreach
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OUTREACH EMAIL HISTORY LOG */}
      {activeTab === 'email_history' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-extrabold text-xs text-slate-500 uppercase font-mono">
            Recorded Email History & Outreach Logs
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 font-mono text-[10px] text-slate-500 uppercase border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3.5">Log ID</th>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5">Employee</th>
                  <th className="p-3.5">Recipient</th>
                  <th className="p-3.5">Subject</th>
                  <th className="p-3.5">Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {emailHistory.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-bold text-indigo-600">{e.id}</td>
                    <td className="p-3.5 text-slate-500">{e.date} {e.time}</td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{e.employeeName}</td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300">{e.recipient}</td>
                    <td className="p-3.5 text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{e.subject}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200 text-[10px]">
                        {e.deliveryStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* OUTREACH EMAIL MODAL WITH DUPLICATE GUARD */}
      {selectedProspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full p-6 space-y-4">
            
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {selectedProspect.masterId}
                </span>
                <h2 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  Send Outreach Email to {selectedProspect.companyName}
                </h2>
              </div>
              <button onClick={() => setSelectedProspect(null)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">
                ✕
              </button>
            </div>

            {/* Duplicate Guard Warning Banner */}
            {selectedProspect.invitationSent && (
              <div className="bg-amber-50 dark:bg-amber-950/60 p-4 rounded-2xl border border-amber-200 dark:border-amber-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Invitation already sent. Waiting for customer response.</span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  Duplicate outreach is disabled by platform safety guidelines to protect brand reputation.
                </p>
                <label className="flex items-center gap-2 pt-1 font-bold text-[11px] text-slate-800 dark:text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={overrideDuplicate}
                    onChange={(e) => setOverrideDuplicate(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <span>Manager Override: Force re-send invitation email</span>
                </label>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Recipient BD Email</label>
                <input
                  type="text"
                  value={selectedProspect.bdEmail || selectedProspect.generalEmail}
                  readOnly
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono text-slate-600 dark:text-slate-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Subject</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Template</label>
                <select
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border text-slate-900 dark:text-white font-bold"
                >
                  <option value="Standard HalalChain Shariah Audit Invitation">Standard HalalChain Shariah Audit Invitation</option>
                  <option value="Executive Level Shariah Advisory Partnership">Executive Level Shariah Advisory Partnership</option>
                  <option value="Annual Shariah Certificate Renewal Notification">Annual Shariah Certificate Renewal Notification</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProspect(null)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSendEmail(selectedProspect)}
                  disabled={selectedProspect.invitationSent && !overrideDuplicate}
                  className={`px-5 py-2.5 font-bold rounded-xl shadow flex items-center gap-2 ${
                    selectedProspect.invitationSent && !overrideDuplicate
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>{isSendingEmail ? 'Recording...' : 'Send & Log Outreach'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
