import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CertificationApplication } from '../../types';
import { ShieldCheck, CheckCircle2, ArrowRight, Upload, Building2, Globe, FileText, Code, Check } from 'lucide-react';

interface ApplyViewProps {
  selectedPackage?: string;
  onApplicationCreated: (app: CertificationApplication) => void;
}

export const ApplyView: React.FC<ApplyViewProps> = ({
  selectedPackage = 'Professional',
  onApplicationCreated
}) => {
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [successApp, setSuccessApp] = useState<CertificationApplication | null>(null);

  const [formData, setFormData] = useState({
    companyName: '',
    legalCountry: 'United Arab Emirates',
    representativeName: '',
    officialEmail: '',
    phone: '',
    telegram: '',
    websiteUrl: '',
    whitepaperUrl: '',
    contractAddress: '',
    blockchain: 'Ethereum Mainnet',
    cmcUrl: '',
    projectDescription: '',
    packageType: selectedPackage,
    termsAccepted: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.officialEmail || !formData.termsAccepted) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessApp(data);
        onApplicationCreated(data);
      }
    } catch (err) {
      console.error('Failed to submit application', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (successApp) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-serif text-slate-900">Application Submitted Successfully!</h2>
          <p className="text-xs text-slate-600 font-mono">Application Reference Number: <span className="text-amber-700 font-bold">{successApp.applicationNumber}</span></p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-left space-y-3 text-xs font-mono">
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500">Project Name:</span>
            <span className="font-bold text-slate-900">{successApp.companyName}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500">Package Tier:</span>
            <span className="font-bold text-amber-700">{successApp.packageType}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500">Initial Deposit Due:</span>
            <span className="font-bold text-emerald-700">${successApp.depositAmount.toLocaleString()} USD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Target Completion Date:</span>
            <span className="font-bold text-slate-900">{successApp.targetCompletionDate}</span>
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 text-left leading-relaxed">
          <span className="font-semibold block mb-1">Next Step in Workflow:</span>
          Please switch to the <span className="font-bold text-amber-800">Customer Portal</span> tab in the top header bar to complete your initial deposit payment and track the real-time AI Information Extraction progress.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-mono font-medium border border-amber-500/20">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>HalalChain Online Application</span>
        </div>
        <h1 className="text-3xl font-bold font-serif text-slate-900">Apply for Sharia Certification</h1>
        <p className="text-sm text-slate-600">Submit your project details to initiate the automated AI collection and Sharia audit workflow.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
        {/* Package Selector */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-slate-700 uppercase">Select Package Tier</label>
          <div className="grid grid-cols-3 gap-3">
            {['Starter', 'Professional', 'Enterprise'].map((pkg) => (
              <button
                type="button"
                key={pkg}
                onClick={() => setFormData({ ...formData, packageType: pkg as any })}
                className={`py-3 px-4 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-all ${
                  formData.packageType === pkg
                    ? 'bg-[#0B132B] text-amber-400 border-amber-500 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {pkg} Tier
              </button>
            ))}
          </div>
        </div>

        {/* Company & Representative */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-700 font-semibold">Company / Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Sovereign Sukuk Chain"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-700 font-semibold">Legal Country / Jurisdiction</label>
            <input
              type="text"
              placeholder="e.g. United Arab Emirates"
              value={formData.legalCountry}
              onChange={(e) => setFormData({ ...formData, legalCountry: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-700 font-semibold">Representative Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ahmad Razak"
              value={formData.representativeName}
              onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-700 font-semibold">Official Email Address *</label>
            <input
              type="email"
              required
              placeholder="e.g. founder@project.io"
              value={formData.officialEmail}
              onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-700 font-semibold">Official Website URL *</label>
            <input
              type="url"
              required
              placeholder="https://project.io"
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-700 font-semibold">Whitepaper URL *</label>
            <input
              type="url"
              required
              placeholder="https://project.io/whitepaper.pdf"
              value={formData.whitepaperUrl}
              onChange={(e) => setFormData({ ...formData, whitepaperUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-700 font-semibold">Smart Contract Address</label>
            <input
              type="text"
              placeholder="0x0000000000000000000000000000000000000000"
              value={formData.contractAddress}
              onChange={(e) => setFormData({ ...formData, contractAddress: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-700 font-semibold">Blockchain Network</label>
            <select
              value={formData.blockchain}
              onChange={(e) => setFormData({ ...formData, blockchain: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono bg-white focus:outline-none focus:border-amber-500"
            >
              <option value="Ethereum Mainnet">Ethereum Mainnet</option>
              <option value="HAQQ Chain">HAQQ Chain</option>
              <option value="Polygon POS">Polygon POS</option>
              <option value="Arbitrum One">Arbitrum One</option>
              <option value="Cosmos SDK">Cosmos SDK</option>
              <option value="Solana">Solana</option>
            </select>
          </div>
        </div>

        {/* Project Description */}
        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-700 font-semibold">Project Overview & Business Model Summary</label>
          <textarea
            rows={3}
            placeholder="Describe the utility, revenue sources, and tokenomics model..."
            value={formData.projectDescription}
            onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
            className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Terms Acceptance */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <input
            type="checkbox"
            id="terms"
            checked={formData.termsAccepted}
            onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
            className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
          />
          <label htmlFor="terms" className="text-xs text-slate-600 leading-relaxed">
            I confirm that I am an authorized representative of the project and agree to the HalalChain Assessment Terms & Conditions. Certificates will only be released following Finance confirmation of full payment.
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting || !formData.termsAccepted}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {submitting ? 'Submitting Application...' : 'Submit Certification Application'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
