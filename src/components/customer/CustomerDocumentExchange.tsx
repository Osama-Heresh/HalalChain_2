import React, { useState } from 'react';
import {
  FileText,
  Download,
  Upload,
  CheckCircle2,
  Award,
  CreditCard,
  FileCheck,
  ShieldCheck,
  Paperclip,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { CertificationApplication } from '../../types';
import { ShariaCertificateModal } from '../ShariaCertificateModal';

interface CustomerDocumentExchangeProps {
  project: CertificationApplication;
  lang?: 'en' | 'ar' | 'side-by-side';
}

export const CustomerDocumentExchange: React.FC<CustomerDocumentExchangeProps> = ({
  project,
  lang = 'en'
}) => {
  const [showCertModal, setShowCertModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; date: string; size: string; status: string }[]>([
    {
      name: `${project.companyName}_Whitepaper_v2.1.pdf`,
      date: project.submittedAt || new Date().toISOString().split('T')[0],
      size: '2.4 MB',
      status: 'Verified & SHA-256 Hashed'
    }
  ]);
  const [uploadNameInput, setUploadNameInput] = useState('');

  const isRtl = lang === 'ar';

  const handleSimulatedUpload = () => {
    if (!uploadNameInput.trim()) return;
    setUploadedFiles((prev) => [
      ...prev,
      {
        name: uploadNameInput.trim(),
        date: new Date().toISOString().split('T')[0],
        size: '1.8 MB',
        status: 'Uploaded to Secure Storage'
      }
    ]);
    setUploadNameInput('');
  };

  const handleDownloadInvoice = (type: 'deposit' | 'final') => {
    const filename = `HalalChain_Invoice_${type.toUpperCase()}_${project.applicationNumber || project.id}.pdf`;
    const dummyContent = `HalalChain Sharia Certification Invoice - ${type.toUpperCase()}\nProject: ${project.companyName}\nAmount: $${type === 'deposit' ? project.depositAmount : project.remainingAmount} USD\nStatus: ${type === 'deposit' ? (project.depositPaid ? 'PAID' : 'UNPAID') : (project.finalPaid ? 'PAID' : 'UNPAID')}`;
    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadReport = (title: string) => {
    const filename = `${title.replace(/\s+/g, '_')}_${project.companyName}.pdf`;
    const dummyContent = `HalalChain Executive Assessment Report\nProject: ${project.companyName}\nStage: ${project.stage}\nVerification Hash: 0x88f921...`;
    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
              Document Exchange & Secure Downloads
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Download executive reports, certificates, and invoices, or upload requested audit proofs
          </p>
        </div>

        <button
          onClick={() => setShowCertModal(true)}
          disabled={project.stage !== 'published_registry' && project.stage !== 'certificate_generation'}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow transition-all"
        >
          <Award className="w-4 h-4" />
          <span>View Sharia Certificate & Seal</span>
        </button>
      </div>

      {/* Grid of Downloads */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Reports Download Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold uppercase border-b pb-2">
            <FileCheck className="w-4 h-4" />
            <span>Official Assessment Reports</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Executive Sharia Briefing</span>
                <span className="text-[10px] text-slate-400">PDF • Theological Verdict Summary</span>
              </div>
              <button
                onClick={() => handleDownloadReport('Executive_Sharia_Briefing')}
                className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 rounded-xl hover:bg-indigo-100"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Full Sharia Audit Dossier</span>
                <span className="text-[10px] text-slate-400">PDF • Complete Finding Matrix</span>
              </div>
              <button
                onClick={() => handleDownloadReport('Full_Sharia_Audit_Dossier')}
                className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 rounded-xl hover:bg-indigo-100"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Certificates & Seals Download Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold uppercase border-b pb-2">
            <Award className="w-4 h-4" />
            <span>Sharia Certificate & Seal</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Official Certificate PDF</span>
                <span className="text-[10px] text-amber-700 dark:text-amber-300">Signed with QR Code Verification</span>
              </div>
              <button
                onClick={() => setShowCertModal(true)}
                disabled={project.stage !== 'published_registry' && project.stage !== 'certificate_generation'}
                className="p-2 bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400 disabled:opacity-40"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Website Verification Badge</span>
                <span className="text-[10px] text-slate-400">Embeddable HTML Seal</span>
              </div>
              <button
                onClick={() => handleDownloadReport('Verification_Badge_Embed')}
                className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 rounded-xl hover:bg-indigo-100"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Invoices Download Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold uppercase border-b pb-2">
            <CreditCard className="w-4 h-4" />
            <span>Billing & Invoices</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Invoice #1: 50% Deposit</span>
                <span className={`text-[10px] font-bold ${project.depositPaid ? 'text-emerald-600' : 'text-rose-600'}`}>
                  ${project.depositAmount?.toLocaleString()} USD • {project.depositPaid ? 'PAID' : 'UNPAID'}
                </span>
              </div>
              <button
                onClick={() => handleDownloadInvoice('deposit')}
                className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 rounded-xl hover:bg-emerald-100"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Invoice #2: Final Release</span>
                <span className={`text-[10px] font-bold ${project.finalPaid ? 'text-emerald-600' : 'text-rose-600'}`}>
                  ${project.remainingAmount?.toLocaleString()} USD • {project.finalPaid ? 'PAID' : 'UNPAID'}
                </span>
              </div>
              <button
                onClick={() => handleDownloadInvoice('final')}
                className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 rounded-xl hover:bg-emerald-100"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Upload Requested Documents Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h4 className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-2">
          <Upload className="w-4 h-4 text-indigo-500" />
          <span>Upload Requested Whitepaper / Audit Evidence</span>
        </h4>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter file title (e.g. Smart_Contract_Audit_Proof.pdf)"
            value={uploadNameInput}
            onChange={(e) => setUploadNameInput(e.target.value)}
            className="flex-1 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleSimulatedUpload}
            disabled={!uploadNameInput.trim()}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Uploaded Files Table */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Uploaded Files Repository</span>
          {uploadedFiles.map((file, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs font-mono flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-indigo-500" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{file.name}</span>
                  <span className="text-[10px] text-slate-400">Uploaded on {file.date} • {file.size}</span>
                </div>
              </div>

              <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                {file.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Modal */}
      <ShariaCertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        project={project}
      />
    </div>
  );
};
