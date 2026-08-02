import React, { useState } from 'react';
import {
  Mail,
  Plus,
  Edit,
  Eye,
  Send,
  CheckCircle2,
  Copy,
  Globe,
  RotateCcw,
  Sparkles,
  Code,
  FileText,
  AlertCircle,
  Layers,
  History
} from 'lucide-react';
import { EmailTemplate } from '../../types';
import { DEFAULT_EMAIL_TEMPLATES, buildBrandedHtmlEmail } from '../../lib/emailTemplateService';

interface EmailTemplateManagerProps {
  onSelectTemplateForOutreach?: (template: EmailTemplate) => void;
}

export const EmailTemplateManager: React.FC<EmailTemplateManagerProps> = ({
  onSelectTemplateForOutreach
}) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(DEFAULT_EMAIL_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(DEFAULT_EMAIL_TEMPLATES[0]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'test_send'>('preview');

  // Form State for editing/creating
  const [editName, setEditName] = useState<string>(selectedTemplate.name);
  const [editSubject, setEditSubject] = useState<string>(selectedTemplate.subject);
  const [editCategory, setEditCategory] = useState<EmailTemplate['category']>(selectedTemplate.category);
  const [editHtml, setEditHtml] = useState<string>(selectedTemplate.htmlContent);
  const [editLanguage, setEditLanguage] = useState<'en' | 'ar'>(selectedTemplate.language);

  // Test Send Simulation State
  const [testProject, setTestProject] = useState<string>('Islamic Coin (ISLM)');
  const [testSalesPerson, setTestSalesPerson] = useState<string>('Youssef Al-Mansoor');
  const [testRecipientEmail, setTestRecipientEmail] = useState<string>('bd@islamiccoin.net');
  const [testSendSuccess, setTestSendSuccess] = useState<string | null>(null);

  // Select a template
  const handleSelectTemplate = (tpl: EmailTemplate) => {
    setSelectedTemplate(tpl);
    setEditName(tpl.name);
    setEditSubject(tpl.subject);
    setEditCategory(tpl.category);
    setEditHtml(tpl.htmlContent);
    setEditLanguage(tpl.language);
    setIsEditing(false);
  };

  // Insert Variable Chip into HTML editor
  const handleInsertVariable = (varName: string) => {
    setEditHtml((prev) => prev + ` ${varName} `);
  };

  // Set Default Template
  const handleSetDefault = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => ({
        ...t,
        isDefault: t.id === id
      }))
    );
  };

  // Save Template Changes
  const handleSaveTemplate = () => {
    const updated: EmailTemplate = {
      ...selectedTemplate,
      name: editName,
      subject: editSubject,
      category: editCategory,
      htmlContent: editHtml,
      language: editLanguage,
      version: (parseFloat(selectedTemplate.version) + 0.1).toFixed(1),
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setTemplates((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setSelectedTemplate(updated);
    setIsEditing(false);
  };

  // Create New Template
  const handleCreateNewTemplate = () => {
    const newTpl: EmailTemplate = {
      id: `tpl-custom-${Date.now().toString().slice(-4)}`,
      name: 'New Custom Email Template',
      category: 'Invitation',
      subject: 'Custom Subject — {{Project Name}}',
      isDefault: false,
      language: 'en',
      version: '1.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      variables: ['{{Project Name}}', '{{Sales Person}}', '{{HalalChain Website}}', '{{Current Date}}'],
      htmlContent: '<p>Dear <strong>{{Project Name}}</strong> Team,</p>\n<p>Insert your custom text here.</p>\n<p>Regards,<br/><strong>{{Sales Person}}</strong></p>'
    };

    setTemplates((prev) => [newTpl, ...prev]);
    handleSelectTemplate(newTpl);
    setIsEditing(true);
  };

  // Build full rendered preview
  const sampleVariables = {
    '{{Project Name}}': testProject,
    '{{Sales Person}}': testSalesPerson,
    '{{HalalChain Website}}': 'https://halalchain.io',
    '{{Current Date}}': new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    '{{Company Logo}}': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    '{{Sales Signature}}': `${testSalesPerson}<br/>Senior BD Lead, HALALCHAIN™`
  };

  const fullBrandedPreview = buildBrandedHtmlEmail(
    isEditing ? editHtml : selectedTemplate.htmlContent,
    sampleVariables
  );

  const handleTestSend = () => {
    setTestSendSuccess(`Test email sent successfully to ${testRecipientEmail}!`);
    setTimeout(() => setTestSendSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-widest">
            <Mail className="w-4 h-4" />
            <span>EMAIL TEMPLATE ENGINE & BRANDING AUTOMATION</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">
            Smart CRM Email Template Management
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Manage approved outreach templates with dynamic variable insertion, responsive HTML previewing, versioning, and test delivery.
          </p>
        </div>

        <button
          onClick={handleCreateNewTemplate}
          className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Template Directory List */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold font-mono text-slate-500 uppercase">
              Templates Catalog ({templates.length})
            </span>
            <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              Management Approved
            </span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {templates.map((tpl) => {
              const isSelected = selectedTemplate.id === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-800 dark:bg-indigo-950 dark:border-indigo-800 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs truncate max-w-[180px]">
                      {tpl.name}
                    </span>
                    {tpl.isDefault ? (
                      <span className="text-[9px] font-mono font-bold bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded">
                        DEFAULT
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-slate-400">
                        v{tpl.version}
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] opacity-80 truncate">
                    {tpl.subject}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] opacity-70">
                    <span className="font-mono">{tpl.category}</span>
                    <span className="uppercase">{tpl.language}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Editor & Preview Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
          
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded">
                  {selectedTemplate.category}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Version {selectedTemplate.version} • Updated {selectedTemplate.lastUpdated}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                {selectedTemplate.name}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {!selectedTemplate.isDefault && (
                <button
                  onClick={() => handleSetDefault(selectedTemplate.id)}
                  className="py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all"
                >
                  Set Default
                </button>
              )}
              {isEditing ? (
                <button
                  onClick={handleSaveTemplate}
                  className="py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Save Template
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="py-1.5 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit Template
                </button>
              )}
            </div>
          </div>

          {/* Sub-Tabs: Live Preview vs Test Send vs HTML Source */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'preview' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Responsive HTML Preview
              </button>
              <button
                onClick={() => setActiveTab('test_send')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'test_send' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Test Send Delivery
              </button>
            </div>

            {activeTab === 'preview' && (
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[10px] font-mono">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`px-2 py-1 rounded-lg ${previewMode === 'desktop' ? 'bg-white dark:bg-slate-700 font-bold text-slate-900 dark:text-white shadow-sm' : 'text-slate-400'}`}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`px-2 py-1 rounded-lg ${previewMode === 'mobile' ? 'bg-white dark:bg-slate-700 font-bold text-slate-900 dark:text-white shadow-sm' : 'text-slate-400'}`}
                >
                  Mobile
                </button>
              </div>
            )}
          </div>

          {/* EDIT FORM (If in edit mode) */}
          {isEditing && (
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Template Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 rounded-xl border text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full p-2 bg-white dark:bg-slate-900 rounded-xl border text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Invitation">Invitation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Reminder">Reminder</option>
                    <option value="Certificate Issued">Certificate Issued</option>
                    <option value="Renewal Reminder">Renewal Reminder</option>
                    <option value="Payment Reminder">Payment Reminder</option>
                    <option value="Welcome Email">Welcome Email</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Subject Line</label>
                <input
                  type="text"
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-900 rounded-xl border text-slate-900 dark:text-white font-mono"
                />
              </div>

              {/* Variable Chips */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1.5">
                  Insert Dynamic Variables:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '{{Project Name}}',
                    '{{Sales Person}}',
                    '{{HalalChain Website}}',
                    '{{Current Date}}',
                    '{{Company Logo}}',
                    '{{Sales Signature}}'
                  ].map((varName) => (
                    <button
                      key={varName}
                      type="button"
                      onClick={() => handleInsertVariable(varName)}
                      className="px-2 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg text-[10px] font-mono font-bold hover:bg-indigo-100"
                    >
                      + {varName}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">HTML Body Content</label>
                <textarea
                  rows={8}
                  value={editHtml}
                  onChange={(e) => setEditHtml(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl border font-mono text-[11px] text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* TAB 1: LIVE RESPONSIVE HTML PREVIEW */}
          {activeTab === 'preview' && (
            <div className={`mx-auto transition-all ${previewMode === 'mobile' ? 'max-w-sm' : 'w-full'}`}>
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-950 p-2">
                <iframe
                  srcDoc={fullBrandedPreview}
                  title="Email Template Live Preview"
                  className="w-full h-[500px] rounded-xl border-0 bg-white"
                />
              </div>
            </div>
          )}

          {/* TAB 2: TEST SEND SIMULATION */}
          {activeTab === 'test_send' && (
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
              <h4 className="font-extrabold text-slate-900 dark:text-white uppercase font-mono">
                Test Delivery Simulator
              </h4>
              <p className="text-slate-500 text-[11px]">
                Simulate sending this template with live project variable data to verify rendering and layout formatting.
              </p>

              {testSendSuccess && (
                <div className="bg-emerald-500 text-slate-950 p-3 rounded-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{testSendSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Test Project Name</label>
                  <input
                    type="text"
                    value={testProject}
                    onChange={(e) => setTestProject(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-slate-900 rounded-xl border"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Sales Person Name</label>
                  <input
                    type="text"
                    value={testSalesPerson}
                    onChange={(e) => setTestSalesPerson(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-slate-900 rounded-xl border"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Recipient Test Email</label>
                <input
                  type="email"
                  value={testRecipientEmail}
                  onChange={(e) => setTestRecipientEmail(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 rounded-xl border font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleTestSend}
                  className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2 shadow"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Test Email</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
