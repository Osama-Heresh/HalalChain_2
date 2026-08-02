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
  Download,
  Eye,
  Layers
} from 'lucide-react';
import { MarketingProspectRecord, EmailHistoryEntry, SmartMarketingQueueItem, UserRole, EmailTemplate } from '../../types';
import { exportReport } from '../../lib/reportEngine';
import { buildMarketingReportOptions } from '../../lib/reportGenerators';
import { EmailTemplateManager } from './EmailTemplateManager';
import { CustomerCommunicationTimeline } from '../customer/CustomerCommunicationTimeline';
import { DEFAULT_EMAIL_TEMPLATES, buildBrandedHtmlEmail } from '../../lib/emailTemplateService';

interface SmartMarketingCRMViewProps {
  currentUserRole?: UserRole;
  currentUserName?: string;
}

export const SmartMarketingCRMView: React.FC<SmartMarketingCRMViewProps> = ({
  currentUserRole = 'marketing',
  currentUserName = 'Youssef Al-Mansoor'
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'prospects' | 'email_history' | 'email_templates'>('queue');
  const [prospects, setProspects] = useState<MarketingProspectRecord[]>([]);
  const [emailHistory, setEmailHistory] = useState<EmailHistoryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Selected Prospect for Emailing / Outreach Modal
  const [selectedProspect, setSelectedProspect] = useState<MarketingProspectRecord | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(DEFAULT_EMAIL_TEMPLATES[0]);
  const [emailSubject, setEmailSubject] = useState<string>(DEFAULT_EMAIL_TEMPLATES[0].subject);
  const [overrideDuplicate, setOverrideDuplicate] = useState<boolean>(false);
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

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
    } fontinally: {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketingData();
  }, []);

  // Update subject when template changes
  const handleTemplateChange = (tplId: string) => {
    const found = DEFAULT_EMAIL_TEMPLATES.find((t) => t.id === tplId) || DEFAULT_EMAIL_TEMPLATES[0];
    setSelectedTemplate(found);
    if (selectedProspect) {
      setEmailSubject(found.subject.replace('{{Project Name}}', selectedProspect.companyName));
    } else {
      setEmailSubject(found.subject);
    }
  };

  // Open modal with prospect pre-selected
  const handleOpenOutreachModal = (prospect: MarketingProspectRecord, defaultTplId?: string) => {
    setSelectedProspect(prospect);
    const tpl = DEFAULT_EMAIL_TEMPLATES.find((t) => t.id === defaultTplId) || DEFAULT_EMAIL_TEMPLATES[0];
    setSelectedTemplate(tpl);
    setEmailSubject(tpl.subject.replace('{{Project Name}}', prospect.companyName));
    setOverrideDuplicate(false);
  };

  // Compute Smart Queue Ranking
  const smartQueueItems: SmartMarketingQueueItem[] = (prospects || [])
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

  // Send Email & Record in CRM
  const handleSendEmail = async (prospect: MarketingProspectRecord) => {
    if (prospect.invitationSent && !overrideDuplicate && currentUserRole !== 'pm' && currentUserRole !== 'admin') {
      alert('Invitation already sent. Waiting for customer response.');
      return;
    }

    setIsSendingEmail(true);

    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const variables = {
      '{{Project Name}}': prospect.companyName,
      '{{Sales Person}}': currentUserName,
      '{{HalalChain Website}}': 'https://halalchain.io',
      '{{Current Date}}': todayStr,
      '{{Company Logo}}': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      '{{Sales Signature}}': `${currentUserName}<br/>Senior Enterprise BD Manager<br/>HALALCHAIN™`
    };

    const renderedHtml = buildBrandedHtmlEmail(selectedTemplate.htmlContent, variables);

    const newEntry: EmailHistoryEntry = {
      id: `EML-${Date.now().toString().slice(-6)}`,
      prospectId: prospect.id,
      masterId: prospect.masterId,
      companyName: prospect.companyName,
      employeeName: currentUserName,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emailTemplate: selectedTemplate.name,
      templateId: selectedTemplate.id,
      recipient: prospect.bdEmail || prospect.generalEmail,
      subject: emailSubject,
      deliveryStatus: 'Delivered',
      openStatus: 'Opened',
      clickStatus: 'Clicked',
      replyStatus: 'No Reply',
      nextFollowUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      renderedHtml
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
        setSendSuccessMessage(`Branded HTML email outreach successfully logged & sent to ${prospect.companyName}!`);
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
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>ENTERPRISE MARKETING & PROSPECT INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Smart Marketing CRM & Email Automation
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Prioritized outreach queue, branded HTML email automation, CRM customer timeline logging, and template management.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export Actions */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700 text-xs font-bold">
            <button
              onClick={() => handleExportReport('PDF')}
              className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1 transition-all"
            >
              <Printer className="w-3.5 h-3.5" /> PDF
            </button>
            <button
              onClick={() => handleExportReport('Excel')}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-1 transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
            </button>
            <button
              onClick={() => handleExportReport('CSV')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white flex items-center gap-1 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'queue' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Smart Queue
            </button>
            <button
              onClick={() => setActiveTab('prospects')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'prospects' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Prospect Database
            </button>
            <button
              onClick={() => setActiveTab('email_history')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'email_history' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Outreach Log ({emailHistory.length})
            </button>
            <button
              onClick={() => setActiveTab('email_templates')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'email_templates' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Email Templates
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

      {/* TAB 1: SMART MARKETING QUEUE VIEW */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 font-mono">
            <span>DAILY PRIORITIZED WORK QUEUE FOR {currentUserName.toUpperCase()}</span>
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
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 font-black flex items-center justify-center font-mono text-sm border border-indigo-200 dark:border-indigo-800 shrink-0">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 dark:text-white text-base">
                          {p.companyName}
                        </span>
                        <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                          Priority Score: {item.rankPriority}
                        </span>
                        {p.invitationSent && (
                          <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                            Outreach Email Sent
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
                    <button
                      onClick={() => handleOpenOutreachModal(p)}
                      className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl flex items-center gap-2 transition-all shadow shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{p.invitationSent ? 'Re-Send Outreach' : 'Send Outreach Email'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PROSPECT DATABASE VIEW */}
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
                </div>

                {/* Communication Timeline */}
                <CustomerCommunicationTimeline
                  prospectName={p.companyName}
                  masterId={p.masterId}
                  emailHistory={emailHistory}
                  onTriggerFollowUp={() => handleOpenOutreachModal(p, 'tpl-followup-7d')}
                />

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="text-slate-500">{p.country} • {p.city}</div>
                  <button
                    onClick={() => handleOpenOutreachModal(p)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3 h-3" />
                    <span>Manage Outreach</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: OUTREACH EMAIL HISTORY LOG */}
      {activeTab === 'email_history' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden space-y-4 p-4">
          <div className="font-extrabold text-xs text-slate-500 uppercase font-mono border-b border-slate-200 dark:border-slate-800 pb-3">
            Recorded Email History & Outreach Timeline Logs
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 font-mono text-[10px] text-slate-500 uppercase border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3.5">Log ID</th>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5">Project / Master ID</th>
                  <th className="p-3.5">Employee</th>
                  <th className="p-3.5">Recipient</th>
                  <th className="p-3.5">Subject</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {emailHistory.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-bold text-indigo-600">{e.id}</td>
                    <td className="p-3.5 text-slate-500">{e.date} {e.time}</td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      {e.companyName || e.masterId}
                    </td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300">{e.employeeName}</td>
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

      {/* TAB 4: EMAIL TEMPLATE MANAGER */}
      {activeTab === 'email_templates' && (
        <EmailTemplateManager
          onSelectTemplateForOutreach={(tpl) => {
            if (prospects.length > 0) {
              handleOpenOutreachModal(prospects[0], tpl.id);
            }
          }}
        />
      )}

      {/* OUTREACH EMAIL MODAL WITH LIVE HTML PREVIEW */}
      {selectedProspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 space-y-4 my-8">
            
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {selectedProspect.masterId}
                </span>
                <h2 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  Send Outbound Email to {selectedProspect.companyName}
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
                  <span>Manager Override: Force re-send outreach email</span>
                </label>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
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
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Email Template</label>
                  <select
                    value={selectedTemplate.id}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border text-slate-900 dark:text-white font-bold"
                  >
                    {DEFAULT_EMAIL_TEMPLATES.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Subject Line</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border text-slate-900 dark:text-white font-mono"
                />
              </div>

              {/* Rendered HTML Live Preview Box */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Live Branded HTML Email Preview
                  </label>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">
                    Dynamic Variables Substituted
                  </span>
                </div>
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 p-1">
                  <iframe
                    srcDoc={buildBrandedHtmlEmail(selectedTemplate.htmlContent, {
                      '{{Project Name}}': selectedProspect.companyName,
                      '{{Sales Person}}': currentUserName,
                      '{{HalalChain Website}}': 'https://halalchain.io',
                      '{{Current Date}}': new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                      '{{Company Logo}}': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
                      '{{Sales Signature}}': `${currentUserName}<br/>Senior BD Lead, HALALCHAIN™`
                    })}
                    title="Live Branded Email Preview"
                    className="w-full h-64 rounded-xl border-0 bg-white"
                  />
                </div>
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
                  <span>{isSendingEmail ? 'Logging...' : 'Send & Log Outbound Email'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
