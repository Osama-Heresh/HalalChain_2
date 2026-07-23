import React, { useState, useEffect } from 'react';
import { CertificationApplication, UserRole, ClarificationMessage, WorkflowStage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { ShariaCertificateModal } from '../ShariaCertificateModal';
import {
  X,
  ExternalLink,
  Copy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileText,
  Code,
  Globe,
  Mail,
  Phone,
  ShieldCheck,
  AlertTriangle,
  MessageSquare,
  DollarSign,
  Send,
  Building,
  Layers,
  ArrowRight,
  Award
} from 'lucide-react';

interface TaskDetailModalProps {
  application: CertificationApplication | null;
  currentUserRole: UserRole;
  onClose: () => void;
  onRefreshData: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  application,
  currentUserRole,
  onClose,
  onRefreshData
}) => {
  const { lang } = useLanguage();
  const [decisionNote, setDecisionNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState<ClarificationMessage[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);

  useEffect(() => {
    if (application) {
      fetchMessages();
    }
  }, [application?.id]);

  if (!application) return null;

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/applications/${application.id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getNextStage = (currentStage: WorkflowStage): WorkflowStage => {
    switch (currentStage) {
      case 'waiting_deposit':
        return 'project_created';
      case 'project_created':
        return 'ai_assessment';
      case 'ai_assessment':
        return 'technical_review';
      case 'technical_review':
        return 'scholar_review';
      case 'business_review':
        return 'scholar_review';
      case 'scholar_review':
        return 'quality_assurance';
      case 'quality_assurance':
        return 'waiting_final_payment';
      case 'waiting_final_payment':
        return 'published_registry';
      case 'waiting_customer_response':
      case 'clarification_requested':
        return 'scholar_review';
      default:
        return 'published_registry';
    }
  };

  const handleDecision = async (decisionType: 'approve' | 'reject' | 'clarify') => {
    setFeedbackMsg(null);

    if (decisionType === 'reject' && !decisionNote.trim()) {
      setFeedbackMsg({
        type: 'error',
        text: lang === 'ar' ? 'يرجى كتابة سبب الرفض في صندوق الملاحظات قبل الإرسال.' : 'Please enter a rejection reason in the decision note field before submitting.'
      });
      return;
    }

    if (decisionType === 'clarify' && !decisionNote.trim()) {
      setFeedbackMsg({
        type: 'error',
        text: lang === 'ar' ? 'يرجى كتابة الاستفسار المطلوب من العميل في صندوق الملاحظات.' : 'Please enter the required clarification query for the customer.'
      });
      return;
    }

    let targetStage: WorkflowStage;
    if (decisionType === 'approve') {
      targetStage = getNextStage(application.stage);
    } else if (decisionType === 'reject') {
      targetStage = 'rejected';
    } else {
      targetStage = 'clarification_requested';
    }

    setActionLoading(true);

    try {
      const res = await fetch(`/api/applications/${application.id}/advance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nextStage: targetStage,
          reason: decisionNote.trim() || `Decision: ${decisionType.toUpperCase()} by ${currentUserRole}`,
          note: decisionNote.trim(),
          userName: `Staff Member (${currentUserRole.toUpperCase()})`,
          userRole: currentUserRole
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedbackMsg({
          type: 'error',
          text: data.error || 'Failed to process decision action.'
        });
      } else {
        setFeedbackMsg({
          type: 'success',
          text:
            decisionType === 'approve'
              ? (lang === 'ar' ? 'تمت الموافقة ونقل الطلب للمرحلة التالية بنجاح!' : 'Task approved and advanced to next stage successfully!')
              : decisionType === 'reject'
              ? (lang === 'ar' ? 'تم رفض الطلب وتسجيل السبب في دفتر التتبع.' : 'Application rejected and logged in audit ledger.')
              : (lang === 'ar' ? 'تم إرسال طلب التوضيح للعميل بنجاح.' : 'Clarification request sent to customer portal successfully.')
        });
        setDecisionNote('');
        onRefreshData();
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
      setFeedbackMsg({ type: 'error', text: 'Network connection error.' });
    } finally {
      setActionLoading(false);
    }
  };

  const getExplorerUrl = (contract: string, blockchain: string) => {
    if (blockchain.toLowerCase().includes('bsc') || blockchain.toLowerCase().includes('binance')) {
      return `https://bscscan.com/address/${contract}`;
    } else if (blockchain.toLowerCase().includes('polygon')) {
      return `https://polygonscan.com/address/${contract}`;
    } else if (blockchain.toLowerCase().includes('arbitrum')) {
      return `https://arbiscan.io/address/${contract}`;
    }
    return `https://etherscan.io/address/${contract}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col my-auto relative">
        {/* Header */}
        <div className="bg-[#0B132B] text-white p-6 rounded-t-3xl border-b border-amber-500/30 flex items-start justify-between gap-4 sticky top-0 z-20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                {application.applicationNumber}
              </span>
              <span className="bg-slate-800 text-slate-300 font-mono text-[10px] font-semibold px-2 py-0.5 rounded uppercase">
                {application.packageType} Tier
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Stage: {application.stage.replace(/_/g, ' ')}
              </span>
            </div>
            <h2 className="text-xl font-bold font-serif text-white">{application.companyName}</h2>
            <p className="text-xs text-slate-300 font-mono">
              {lang === 'ar' ? 'الشبكة:' : 'Blockchain:'} <span className="text-amber-400 font-semibold">{application.blockchain}</span> •{' '}
              {lang === 'ar' ? 'الموعد المستهدف:' : 'SLA Target:'} {application.targetCompletionDate}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCertModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span>{lang === 'ar' ? 'عرض الشهادة (باركوود)' : 'View Certificate'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 font-mono text-xs text-slate-800 overflow-y-auto">
          {feedbackMsg && (
            <div
              className={`p-4 rounded-xl text-xs font-semibold border flex items-center gap-2 ${
                feedbackMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border-rose-200'
              }`}
            >
              {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* Enhanced Task Metrics & Live Progress Bar */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-amber-400 tracking-wider">
                  {lang === 'ar' ? 'مؤشر إنجاز مرحلة العمل' : 'Workflow Stage Execution Progress'}
                </span>
                <div className="text-lg font-serif font-bold text-white flex items-center gap-2">
                  <span>{application.stage.replace(/_/g, ' ').toUpperCase()}</span>
                  <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                    {(() => {
                      const map: Record<string, number> = {
                        waiting_deposit: 10,
                        project_created: 25,
                        ai_assessment: 40,
                        technical_review: 55,
                        business_review: 65,
                        scholar_review: 80,
                        quality_assurance: 90,
                        waiting_final_payment: 95,
                        published_registry: 100,
                        completed: 100
                      };
                      return map[application.stage] || 50;
                    })()}% Completed
                  </span>
                </div>
              </div>

              {/* Priority & SLA Countdown */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-amber-500 text-slate-950">
                  PRIORITY: HIGH
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-slate-800 text-slate-200 border border-slate-700">
                  Target SLA: {application.targetCompletionDate}
                </span>
              </div>
            </div>

            {/* Visual Stage Bar */}
            <div className="space-y-1">
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-500"
                  style={{
                    width: `${(() => {
                      const map: Record<string, number> = {
                        waiting_deposit: 10,
                        project_created: 25,
                        ai_assessment: 40,
                        technical_review: 55,
                        business_review: 65,
                        scholar_review: 80,
                        quality_assurance: 90,
                        waiting_final_payment: 95,
                        published_registry: 100,
                        completed: 100
                      };
                      return map[application.stage] || 50;
                    })()}%`
                  }}
                />
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300 text-[11px] font-mono">
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400">{lang === 'ar' ? 'الوقت المقدر' : 'Estimated Time'}</div>
                <div className="font-bold text-white text-xs mt-0.5">24.0 Hours</div>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400">{lang === 'ar' ? 'الوقت المنقضي' : 'Elapsed Working Time'}</div>
                <div className="font-bold text-amber-400 text-xs mt-0.5">14.5 Hours Logged</div>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400">{lang === 'ar' ? 'الأدلة والملفات' : 'Evidence Items'}</div>
                <div className="font-bold text-emerald-400 text-xs mt-0.5">4 Documents Verified</div>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400">{lang === 'ar' ? 'المناقشات والاستفسارات' : 'Discussions Count'}</div>
                <div className="font-bold text-blue-400 text-xs mt-0.5">{messages.length} Clarifications</div>
              </div>
            </div>
          </div>

          {/* Section 1: Linked References & Evidence Inspection */}

          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold font-serif text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>{lang === 'ar' ? 'الأدلة والروابط التوثيقية المباشرة للمشروع' : 'Linked References & Verified Evidence'}</span>
              </h3>
              <span className="text-[10px] text-slate-500">{lang === 'ar' ? 'تحقق من الأصول قبل اتخاذ القرار' : 'Inspect before deciding'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Reference 1: Whitepaper (Visible to all) */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-700" />
                    <span>{lang === 'ar' ? 'الورقة البيضاء الرسمية' : 'Official Whitepaper'}</span>
                  </span>
                  <a
                    href={application.whitepaperUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:underline"
                  >
                    <span>{lang === 'ar' ? 'فتح الرابط' : 'View Link'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {application.projectDescription || (lang === 'ar' ? 'لا يوجد وصف للمشروع' : 'No description provided')}
                </p>
              </div>

              {/* Reference 2: Smart Contract OR Sharia Business Model */}
              {currentUserRole === 'scholar' ? (
                <div className="p-4 rounded-2xl bg-amber-50/30 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      <span>{lang === 'ar' ? 'النموذج المالي والتنفيذي' : 'Sharia & Business Structure'}</span>
                    </span>
                    <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-bold">
                      {lang === 'ar' ? 'معتمد' : 'Verified'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-700 space-y-1">
                    <div>• {lang === 'ar' ? 'نموذج الربح:' : 'Profit Model:'} <span className="font-semibold text-slate-900">مشاركة في الأرباح والخسائر (Mudarabah)</span></div>
                    <div>• {lang === 'ar' ? 'الربا والغرر:' : 'Riba & Gharar:'} <span className="font-semibold text-emerald-700">خالٍ من الفوائد المضمونة ✓</span></div>
                    <div>• {lang === 'ar' ? 'الأصل الداعم:' : 'Underlying Asset:'} <span className="font-semibold text-slate-900">{application.blockchain} Infrastructure Token</span></div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Code className="w-4 h-4 text-slate-700" />
                      <span>{lang === 'ar' ? 'العقد الذكي على البلوكشين' : 'Smart Contract Address'}</span>
                    </span>
                    {application.contractAddress && application.contractAddress !== 'N/A' && (
                      <a
                        href={getExplorerUrl(application.contractAddress, application.blockchain)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
                      >
                        <span>Etherscan</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 text-[11px]">
                    <span className="truncate max-w-[240px] font-mono text-slate-800">{application.contractAddress || '0x0000...0000'}</span>
                    <button
                      onClick={() => copyToClipboard(application.contractAddress || '')}
                      className="text-slate-500 hover:text-amber-700 p-1 cursor-pointer flex items-center gap-1 text-[10px]"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Reference 3: Official Website */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-slate-700" />
                    <span>{lang === 'ar' ? 'الموقع الإلكتروني للمشروع' : 'Official Project Website'}</span>
                  </span>
                  <a
                    href={application.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:underline"
                  >
                    <span>{application.websiteUrl.replace('https://', '').replace('http://', '')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="text-[11px] text-slate-600">
                  {lang === 'ar' ? 'النطاق القانوني:' : 'Legal Jurisdiction:'}{' '}
                  <span className="font-bold text-slate-900">{application.legalCountry}</span>
                </div>
              </div>

              {/* Reference 4: Contact & Finance Status */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-slate-700" />
                    <span>{lang === 'ar' ? 'الممثل والوضع المالي' : 'Representative & Financials'}</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">{lang === 'ar' ? 'الممثل الرسمي:' : 'REPRESENTATIVE'}</span>
                    <span className="font-bold text-slate-900">{application.representativeName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">{lang === 'ar' ? 'الرسوم الكلية:' : 'TOTAL FEE'}</span>
                    <span className="font-bold text-emerald-700">${application.totalFee.toLocaleString()} USD</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">{lang === 'ar' ? 'العربون (50%):' : 'DEPOSIT'}</span>
                    <span className={`font-bold ${application.depositPaid ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {application.depositPaid ? 'PAID ✓' : 'UNPAID ✕'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">{lang === 'ar' ? 'الدفع النهائي:' : 'FINAL PAYMENT'}</span>
                    <span className={`font-bold ${application.finalPaid ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {application.finalPaid ? 'PAID ✓' : 'UNPAID ✕'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1.5: Sharia Compliance Verification Checklist (AAOIFI Standard v2.1) */}
          <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
              <h4 className="text-xs font-bold font-serif text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>
                  {lang === 'ar'
                    ? 'قائمة التثبت الشرعي المربوطة بالأدلة (معايير أيوفي AAOIFI v2.1)'
                    : 'Sharia Compliance Verification Checklist (AAOIFI Standard v2.1)'}
                </span>
              </h4>
              <span className="text-[10px] bg-amber-200/90 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                {lang === 'ar' ? '4 معايير موثقة' : '4 Verified Items'}
              </span>
            </div>

            <div className="space-y-2 font-mono text-[11px]">
              {/* AAOIFI Item 1 */}
              <div className="p-2.5 bg-white rounded-xl border border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="mt-0.5 rounded text-amber-600 focus:ring-amber-500" />
                  <div>
                    <span className="font-bold text-slate-900 block text-[11px]">
                      {lang === 'ar' ? '1. خلو برك السيولة من الفوائد الربوية المضمونة (AAOIFI Standard #21)' : '1. Verified zero guaranteed fixed interest (Riba) in yield pool structures (AAOIFI #21)'}
                    </span>
                    <span className="text-[10px] text-slate-500">Zero guaranteed fixed ROI in smart contract pool</span>
                  </div>
                </label>
                <a
                  href={application.whitepaperUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] flex items-center gap-1 border border-amber-300"
                >
                  <FileText className="w-3 h-3 text-amber-800" />
                  <span>{lang === 'ar' ? 'دليل: الورقة البيضاء §4.2' : 'Evidence: Whitepaper §4.2'}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-amber-800" />
                </a>
              </div>

              {/* AAOIFI Item 2 */}
              <div className="p-2.5 bg-white rounded-xl border border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="mt-0.5 rounded text-amber-600 focus:ring-amber-500" />
                  <div>
                    <span className="font-bold text-slate-900 block text-[11px]">
                      {lang === 'ar' ? '2. آلية المشاركة في الربح والخسارة - المضاربة (AAOIFI Standard #13)' : '2. Verified Mudarabah / Musharakah risk-sharing profit mechanism (AAOIFI #13)'}
                    </span>
                    <span className="text-[10px] text-slate-500">Proportional sharing matrix verified</span>
                  </div>
                </label>
                <a
                  href={application.whitepaperUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] flex items-center gap-1 border border-amber-300"
                >
                  <FileText className="w-3 h-3 text-amber-800" />
                  <span>{lang === 'ar' ? 'دليل: عقد المضاربة والتوزيع' : 'Evidence: Mudarabah Agreement'}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-amber-800" />
                </a>
              </div>

              {/* AAOIFI Item 3 */}
              <div className="p-2.5 bg-white rounded-xl border border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="mt-0.5 rounded text-amber-600 focus:ring-amber-500" />
                  <div>
                    <span className="font-bold text-slate-900 block text-[11px]">
                      {lang === 'ar' ? '3. وجود أصل حقيقي ومنع الغرر الفاحش (AAOIFI Standard #30)' : '3. Verified asset backing & absence of excessive speculation / Gharar (AAOIFI #30)'}
                    </span>
                    <span className="text-[10px] text-slate-500">On-chain reserve oracle proof</span>
                  </div>
                </label>
                <a
                  href={application.websiteUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] flex items-center gap-1 border border-amber-300"
                >
                  <Globe className="w-3 h-3 text-amber-800" />
                  <span>{lang === 'ar' ? 'دليل: أوراكل المحفظة المضمونة' : 'Evidence: On-Chain Vault Oracle'}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-amber-800" />
                </a>
              </div>

              {/* AAOIFI Item 4 */}
              <div className="p-2.5 bg-white rounded-xl border border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="mt-0.5 rounded text-amber-600 focus:ring-amber-500" />
                  <div>
                    <span className="font-bold text-slate-900 block text-[11px]">
                      {lang === 'ar' ? '4. مطابقة نموذج الحوكمة لمعايير الرقابة الشرعية (AAOIFI Gov #7)' : '4. Verified business governance with AAOIFI Governance Guidelines (AAOIFI Gov #7)'}
                    </span>
                    <span className="text-[10px] text-slate-500">Board oversight bylaws active</span>
                  </div>
                </label>
                <a
                  href={application.whitepaperUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] flex items-center gap-1 border border-amber-300"
                >
                  <ShieldCheck className="w-3 h-3 text-amber-800" />
                  <span>{lang === 'ar' ? 'دليل: لائحة الحوكمة والقرار' : 'Evidence: Board Resolution'}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-amber-800" />
                </a>
              </div>
            </div>
          </div>

          {/* Section 2: Clarification & Audit Messages Thread */}
          {messages.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold font-serif text-slate-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-amber-600" />
                <span>{lang === 'ar' ? 'سجل الملاحظات والاستفسارات السابقة' : 'Clarification & Audit Notes Thread'}</span>
              </h4>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-h-40 overflow-y-auto space-y-2.5">
                {messages.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-amber-800">{m.senderName} ({m.senderRole})</span>
                      <span className="text-slate-400">{new Date(m.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-700 text-[11px] leading-relaxed">{m.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Decision Note / Reason Input */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <label className="block text-xs font-bold text-slate-900 font-serif">
              {lang === 'ar' ? 'ملاحظات وتوجيهات القرار الشرعي / الفني' : 'Decision Notes, Audit Findings or Rejection Reason'}
            </label>
            <textarea
              rows={3}
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              placeholder={
                lang === 'ar'
                  ? 'اكتب ملاحظاتك الشرعية أو الفنية هنا (مطلوبة عند الرفض أو طلب التوضيح)...'
                  : 'Enter audit findings, required clarifications, or rejection justification...'
              }
              className="w-full p-3.5 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:border-amber-500 text-xs font-mono"
            />
          </div>

          {/* Section 4: Three Decision Buttons */}
          <div className="space-y-2 pt-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'ar' ? 'حدد القرار النهائي لهذا المهمة:' : 'Select Task Action Decision:'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Approve */}
              <button
                onClick={() => handleDecision('approve')}
                disabled={actionLoading}
                className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{lang === 'ar' ? 'اعتماد ونقل للمرحلة التالية' : 'Approve & Advance'}</span>
              </button>

              {/* Option 2: Request Clarification */}
              <button
                onClick={() => handleDecision('clarify')}
                disabled={actionLoading}
                className="py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                <HelpCircle className="w-4 h-4 text-slate-950" />
                <span>{lang === 'ar' ? 'طلب توضيح من العميل' : 'Request Clarification'}</span>
              </button>

              {/* Option 3: Reject */}
              <button
                onClick={() => handleDecision('reject')}
                disabled={actionLoading}
                className="py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>{lang === 'ar' ? 'رفض الطلب نهائياً' : 'Reject Application'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sharia Certificate Modal */}
      <ShariaCertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        project={application}
      />
    </div>
  );
};
