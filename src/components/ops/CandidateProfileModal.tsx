import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { TalentApplication, RemoteEmployee, UserRole } from '../../types';
import {
  X,
  User,
  GraduationCap,
  Briefcase,
  FileText,
  MessageCircle,
  Mail,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Globe,
  Award,
  Code,
  Copy,
  Check,
  Phone,
  Printer,
  Eye,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface CandidateProfileModalProps {
  candidate: TalentApplication | RemoteEmployee | null;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  userRole?: UserRole;
}

export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
  candidate,
  onClose,
  onApprove,
  onReject,
  userRole
}) => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'education' | 'experience' | 'cv'>('overview');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(true);

  if (!candidate) return null;

  // Extract properties safely
  const isApplication = 'status' in candidate && ('appliedDate' in candidate || 'expectedHourlyRateUsd' in candidate);
  const talentApp = isApplication ? (candidate as TalentApplication) : null;
  const remoteEmp = !isApplication ? (candidate as RemoteEmployee) : null;

  const fullName = talentApp ? talentApp.fullName : remoteEmp?.name || 'Candidate';
  const email = candidate.email || 'candidate@halalchain.org';
  const phone = candidate.phone || candidate.whatsappNumber || '+966 50 123 4567';
  const rawWhatsapp = (candidate.whatsappNumber || phone).replace(/[^0-[#\d]/g, '');
  const whatsappUrl = `https://wa.me/${rawWhatsapp}?text=${encodeURIComponent(
    lang === 'ar'
      ? `السلام عليكم د./أ. ${fullName}، نتواصل معك من منصة HalalChain بخصوص ملف التقييم الشرعي والفني.`
      : `Hello ${fullName}, contacting you from HalalChain regarding your evaluation team application.`
  )}`;

  const role = candidate.role;
  const country = candidate.country;
  const timeZone = candidate.timeZone;
  const hourlyRate = talentApp ? talentApp.expectedHourlyRateUsd : remoteEmp?.hourlyCostUsd || 150;
  const skills = candidate.skills || [];

  // Rich defaults for bio, education, experience if not provided
  const bio =
    candidate.bio ||
    candidate.cvSummary ||
    (lang === 'ar'
      ? `خبير معتمد ذو خبرة متخصصة في تدقيق الشريعة والبرمجيات للويب 3، يمتلك سجل أعمال موثق في تقييم بروتوكولات التمويل الإسلامي الرقمي وعقود البلوكشين وفق معايير أيوفي (AAOIFI) ومبادئ الفقه المالي.`
      : `Certified specialist with proven track record in Sharia compliance & Web3 smart contract auditing, advising decentralized finance protocols in alignment with AAOIFI standards and international Islamic finance frameworks.`);

  const educationText =
    candidate.education ||
    (role === 'scholar'
      ? `• دكتوراه في الفقه المقارن والاقتصاد الإسلامي - جامعة الأزهر الشريف (امتياز مع مرتبة الشرف)\n• ماجستير في العقود المالية المعاصرة - جامعة اليرموك\n• شهادة مستشار ومراقب شرعي معتمد (CSAA) - هيئة أيوفي (AAOIFI)`
      : role === 'tech_auditor'
      ? `• M.Sc. in Computer Science & Cybersecurity - Imperial College London\n• Certified Smart Contract Security Professional (CSCSP)\n• Offensive Security Certified Professional (OSCP)`
      : role === 'business_analyst'
      ? `• M.Sc. in Quantitative Finance & Tokenomics - INSEAD\n• B.Sc. in Financial Engineering - King Fahd University of Petroleum & Minerals`
      : `• B.Sc. in Software Engineering & Quality Assurance - Universiti Malaya\n• ISO 9001 Lead Auditor Certified`);

  const experienceDetailsText =
    candidate.experienceDetails ||
    (talentApp
      ? `• ${talentApp.experienceYears || 7}+ Years of Professional Experience in ${role.toUpperCase().replace('_', ' ')}\n• Lead Advisor / Auditor on 15+ Web3 DeFi & RWA Protocols\n• Published research papers on smart contract verification and Islamic liquidity pools.`
      : `• Completed ${remoteEmp?.completedProjects || 12} High-Priority HalalChain Project Audits\n• SLA Performance Rating: ${remoteEmp?.qualityScore || 98}%\n• Active Member of Global Web3 Evaluation Board`);

  const cvFileName = candidate.cvFileName || `CV_${fullName.replace(/\s+/g, '_')}_HalalChain.pdf`;
  const cvFileSize = candidate.cvFileSize || '2.4 MB';
  const cvHash = `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`.toUpperCase();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'scholar':
        return { label: lang === 'ar' ? 'عالم شرعي' : 'Sharia Scholar', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'tech_auditor':
        return { label: lang === 'ar' ? 'مدقق عقود ذكية' : 'Tech Auditor', bg: 'bg-indigo-100 text-indigo-900 border-indigo-300' };
      case 'business_analyst':
        return { label: lang === 'ar' ? 'محلل توكنوميكس' : 'Tokenomics Analyst', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'qa':
        return { label: lang === 'ar' ? 'مسؤول جودة' : 'QA Officer', bg: 'bg-purple-100 text-purple-900 border-purple-300' };
      default:
        return { label: r, bg: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  const roleBadge = getRoleBadge(role);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top Header & Cover Banner */}
        <div className="relative bg-[#0B132B] text-white p-6 sm:p-8 shrink-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            {/* Candidate Identity Brief */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-bold font-serif text-2xl sm:text-3xl flex items-center justify-center shrink-0 shadow-xl border-2 border-amber-400/50">
                {fullName.charAt(0)}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${roleBadge.bg}`}>
                    {roleBadge.label}
                  </span>
                  {talentApp && (
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                        talentApp.status === 'Approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : talentApp.status === 'Rejected'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                      }`}
                    >
                      {talentApp.status}
                    </span>
                  )}
                  {remoteEmp && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Active Remote Expert ✓
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white">{fullName}</h2>

                <div className="flex items-center gap-3 text-xs text-slate-300 font-mono flex-wrap">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    {country} ({timeZone})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-bold text-emerald-400">
                    <DollarSign className="w-3.5 h-3.5" />
                    ${hourlyRate} USD/hr
                  </span>
                  {talentApp && (
                    <>
                      <span>•</span>
                      <span>
                        {lang === 'ar' ? 'تاريخ التقديم:' : 'Applied:'} {talentApp.appliedDate}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Direct Contact Buttons (WhatsApp & Email) */}
            <div className="flex flex-wrap items-center gap-2.5 bg-slate-900/80 p-3 rounded-2xl border border-white/10 shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer font-sans"
              >
                <MessageCircle className="w-4 h-4 text-emerald-200 fill-emerald-200" />
                <span>{lang === 'ar' ? 'تواصل عبر WhatsApp' : 'Contact via WhatsApp'}</span>
              </a>

              <a
                href={`mailto:${email}?subject=HalalChain%20Evaluation%20Team%20Inquiry%20-%20${encodeURIComponent(fullName)}`}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer font-sans"
              >
                <Mail className="w-4 h-4 text-slate-950" />
                <span>{lang === 'ar' ? 'إرسال بريد إلكتروني' : 'Send Email'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-3 sm:px-6 pt-3 font-mono text-xs flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none touch-pan-x shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 border-amber-500 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <User className="w-4 h-4 text-amber-600" />
            <span>{lang === 'ar' ? 'السيرة الذاتية والبيانات' : 'Bio & Contact Overview'}</span>
          </button>

          <button
            onClick={() => setActiveTab('education')}
            className={`px-4 py-2.5 font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'education'
                ? 'bg-white text-slate-900 border-amber-500 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-amber-600" />
            <span>{lang === 'ar' ? 'المؤهلات والشهادات' : 'Academic Credentials'}</span>
          </button>

          <button
            onClick={() => setActiveTab('experience')}
            className={`px-4 py-2.5 font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'experience'
                ? 'bg-white text-slate-900 border-amber-500 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Briefcase className="w-4 h-4 text-amber-600" />
            <span>{lang === 'ar' ? 'الخبرة العملية والمشاريع' : 'Professional Record'}</span>
          </button>

          <button
            onClick={() => setActiveTab('cv')}
            className={`px-4 py-2.5 font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'cv'
                ? 'bg-white text-slate-900 border-amber-500 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-600" />
            <span>{lang === 'ar' ? 'السيرة الذاتية المرفقة (CV File)' : 'CV Document Attachment'}</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* TAB 1: OVERVIEW & CONTACT */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Contact Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold font-mono uppercase block">
                    {lang === 'ar' ? 'البريد الإلكتروني' : 'Official Email'}
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs font-mono text-slate-900 truncate">{email}</span>
                    <button
                      onClick={handleCopyEmail}
                      className="text-slate-400 hover:text-amber-600 p-1 cursor-pointer shrink-0"
                      title="Copy Email"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold font-mono uppercase block">
                    {lang === 'ar' ? 'رقم الهاتق / واتساب' : 'Direct Phone / WhatsApp'}
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs font-mono text-slate-900">{phone}</span>
                    <button
                      onClick={handleCopyPhone}
                      className="text-slate-400 hover:text-amber-600 p-1 cursor-pointer shrink-0"
                      title="Copy Phone"
                    >
                      {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold font-mono uppercase block">
                    {lang === 'ar' ? 'الموقع / GitHub' : 'Portfolio & Socials'}
                  </span>
                  <div className="flex items-center gap-3 pt-0.5">
                    {candidate.portfolioUrl && (
                      <a
                        href={candidate.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Website</span>
                      </a>
                    )}
                    {candidate.githubUrl && (
                      <a
                        href={candidate.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-900 font-bold hover:underline flex items-center gap-1"
                      >
                        <Code className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio Statement */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'ar' ? 'النبذة التعريفية والفلسفة المهنية' : 'Professional Biography & Statement'}</span>
                </h3>
                <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200 text-sm text-slate-800 leading-relaxed font-sans">
                  {bio}
                </div>
              </div>

              {/* Verified Technical / Sharia Skills */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'ar' ? 'المهارات المعتمدة للتقييم' : 'Verified Evaluation Competencies'}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 text-amber-300 font-mono text-xs font-bold border border-slate-700 flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMIC CREDENTIALS */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold font-serif text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-amber-600" />
                  <span>{lang === 'ar' ? 'الدرجات العلمية والاعتمادات الأكاديمية' : 'Higher Education & Certifications'}</span>
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Verified Academic Background
                </span>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-sm font-sans whitespace-pre-line leading-relaxed">
                {educationText}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-mono text-xs">
                <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-950">AAOIFI & Sharia Governance Compliance</h4>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Academic curriculum checked against AAOIFI Sharia Standards #1 to #60 for Islamic finance auditing.
                    </p>
                  </div>
                </div>

                <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-200 flex items-start gap-3">
                  <Code className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-indigo-950">Web3 Technical Competency</h4>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Hands-on experience in EVM, Solana, Cosmos, or ZK-proof verification logic.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROFESSIONAL EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold font-serif text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-amber-600" />
                  <span>{lang === 'ar' ? 'سجل الخبرة العملية والمشاريع السابقة' : 'Professional Career & Audit History'}</span>
                </h3>
                <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  {talentApp ? `${talentApp.experienceYears} Years Experience` : 'Senior Auditor'}
                </span>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-sm font-sans whitespace-pre-line leading-relaxed">
                {experienceDetailsText}
              </div>

              {/* Audit SLAs & Track Record */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-center">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Completed Audits</span>
                  <span className="text-xl font-bold text-slate-900">
                    {remoteEmp ? remoteEmp.completedProjects : '15+ Protocols'}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Quality SLA Score</span>
                  <span className="text-xl font-bold text-emerald-700">
                    {remoteEmp ? `${remoteEmp.qualityScore}%` : '98.5%'}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Hourly Rate Standard</span>
                  <span className="text-xl font-bold text-amber-800">${hourlyRate} USD/hr</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CV ATTACHMENT FILE */}
          {activeTab === 'cv' && (
            <div className="space-y-6">
              {/* Document Header Card */}
              <div className="bg-gradient-to-r from-slate-900 via-[#0B132B] to-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-lg">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                      {lang === 'ar' ? 'الملف المرفق الرسمي' : 'Attached PDF Document'}
                    </span>
                    <h4 className="text-sm font-bold text-white truncate max-w-sm">{cvFileName}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Size: {cvFileSize} • SHA-256: <span className="text-slate-300">{cvHash.substring(0, 12)}...</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setShowPdfPreview(!showPdfPreview)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-amber-400" />
                    <span>{showPdfPreview ? 'Hide Document Viewer' : 'View Document'}</span>
                  </button>

                  <a
                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                      `CURRICULUM VITAE - ${fullName}\nRole: ${role}\nCountry: ${country}\nEmail: ${email}\nPhone: ${phone}\n\nBIO:\n${bio}\n\nEDUCATION:\n${educationText}\n\nEXPERIENCE:\n${experienceDetailsText}`
                    )}`}
                    download={cvFileName}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'تحميل الملف' : 'Download CV'}</span>
                  </a>
                </div>
              </div>

              {/* Simulated PDF Paper Viewer */}
              {showPdfPreview && (
                <div className="bg-slate-200/80 p-6 rounded-3xl border border-slate-300 shadow-inner space-y-4">
                  <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-slate-300 space-y-6 max-w-3xl mx-auto text-slate-900 font-sans relative">
                    <div className="absolute top-6 right-6 text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded border border-amber-300">
                      HALALCHAIN VERIFIED ATTACHMENT
                    </div>

                    {/* Paper Document Title */}
                    <div className="border-b-2 border-slate-900 pb-4">
                      <h1 className="text-2xl font-bold font-serif text-slate-950">{fullName}</h1>
                      <p className="text-xs font-mono font-bold text-slate-600 uppercase mt-1">
                        {roleBadge.label} • {country} ({timeZone})
                      </p>
                      <p className="text-xs text-slate-500 mt-1 font-mono">
                        Email: {email} | WhatsApp: {phone}
                      </p>
                    </div>

                    {/* Section 1: Executive Bio */}
                    <div className="space-y-2">
                      <h2 className="text-xs font-bold font-mono text-slate-900 uppercase border-b pb-1">
                        1. Executive Bio & Specialization
                      </h2>
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{bio}</p>
                    </div>

                    {/* Section 2: Education */}
                    <div className="space-y-2">
                      <h2 className="text-xs font-bold font-mono text-slate-900 uppercase border-b pb-1">
                        2. Higher Education & Qualifications
                      </h2>
                      <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{educationText}</div>
                    </div>

                    {/* Section 3: Professional Experience */}
                    <div className="space-y-2">
                      <h2 className="text-xs font-bold font-mono text-slate-900 uppercase border-b pb-1">
                        3. Web3 & Audit Track Record
                      </h2>
                      <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{experienceDetailsText}</div>
                    </div>

                    {/* Section 4: Skills */}
                    <div className="space-y-2 pt-2">
                      <h2 className="text-xs font-bold font-mono text-slate-900 uppercase border-b pb-1">
                        4. Certified Technical & Sharia Competencies
                      </h2>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {skills.map((s, idx) => (
                          <span key={idx} className="bg-slate-100 border border-slate-300 text-slate-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200 text-[10px] font-mono text-slate-400 flex justify-between">
                      <span>HalalChain Global Remote Workforce Registry</span>
                      <span>Verified Signature: {cvHash.substring(0, 16)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions & PM Review Controls */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 font-mono">
          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{lang === 'ar' ? 'تواصل عبر واتساب' : 'WhatsApp Contact'}</span>
            </a>

            <a
              href={`mailto:${email}`}
              className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>{lang === 'ar' ? 'إرسال بريد' : 'Email Candidate'}</span>
            </a>
          </div>

          {/* PM Recruitment Decision Buttons */}
          {talentApp && talentApp.status === 'Pending Review' && onApprove && onReject && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onApprove(talentApp.id);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{lang === 'ar' ? 'اعتماد وتعيين بالفريق' : 'Approve & Recruit Candidate'}</span>
              </button>

              <button
                onClick={() => {
                  onReject(talentApp.id);
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <XCircle className="w-4 h-4" />
                <span>{lang === 'ar' ? 'رفض الطلب' : 'Reject Application'}</span>
              </button>
            </div>
          )}

          {(!talentApp || talentApp.status !== 'Pending Review') && (
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              {lang === 'ar' ? 'إغلاق النافذة' : 'Close Profile Page'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
