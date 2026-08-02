import { EmailTemplate } from '../types';

export const DEFAULT_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tpl-invitation-en',
    name: 'Standard Sharia Audit Invitation (Default)',
    category: 'Invitation',
    subject: 'Unlock Access to the Global Muslim Crypto Market with HALALCHAIN™ Certification — {{Project Name}}',
    isDefault: true,
    language: 'en',
    version: '1.2',
    lastUpdated: '2026-08-01',
    variables: [
      '{{Project Name}}',
      '{{Sales Person}}',
      '{{HalalChain Website}}',
      '{{Current Date}}',
      '{{Company Logo}}',
      '{{Sales Signature}}'
    ],
    htmlContent: `<p>Dear <strong>{{Project Name}}</strong> Team,</p>

<p>I am writing to invite your team to undergo an independent <strong>Sharia Compliance & Technical Risk Assessment</strong> with <strong>HALALCHAIN™</strong>.</p>

<p>As the digital asset economy matures, institutional and retail investors across the global <strong>$3.8 Trillion Islamic financial market</strong> increasingly demand verified, transparent, and immutable proof of Sharia compliance.</p>

<p style="margin-top: 16px; font-weight: bold;">HALALCHAIN™ provides full-spectrum auditing across:</p>
<ul style="margin-top: 8px; margin-bottom: 16px; padding-left: 20px;">
  <li style="margin-bottom: 6px;"><strong>Smart Contract Security & Bytecode Verification:</strong> Automated static analysis and manual audit of smart contract security vulnerabilities.</li>
  <li style="margin-bottom: 6px;"><strong>Tokenomics & Revenue Model Governance:</strong> Assessment against <strong>AAOIFI Sharia Standards</strong> (including Sharia Standard No. 21 Financial Papers & No. 59 Sale of Debt).</li>
  <li style="margin-bottom: 6px;"><strong>On-Chain Proof of Certification:</strong> Immutable Sharia Certificate issued directly on-chain and registered in the Master Certified Registry.</li>
</ul>

<p>By securing your <strong>HALALCHAIN™ Sharia Certificate</strong>, {{Project Name}} will gain immediate credibility, expanded access to Web3 capital in the GCC & Southeast Asia, and official listing in our Master Certified Registry.</p>

<p style="margin-top: 16px;">We would welcome a brief 15-minute introductory call to outline our audit framework and timeline.</p>

<div style="margin-top: 24px; padding: 16px; background-color: #F8FAFC; border-left: 4px solid #059669; border-radius: 8px;">
  <p style="margin: 0; font-size: 13px; color: #1E293B;"><strong>Next Action:</strong> Schedule an audit consultation call or review our Sharia Certification Guidelines at <a href="{{HalalChain Website}}" style="color: #059669; text-decoration: underline;">{{HalalChain Website}}</a>.</p>
</div>

<p style="margin-top: 24px;">Warm regards,</p>
<p style="margin: 0; font-weight: bold; color: #0B132B;">{{Sales Person}}</p>
<p style="margin: 2px 0 0 0; font-size: 13px; color: #64748B;">HALALCHAIN™ Enterprise Business Development</p>`
  },
  {
    id: 'tpl-followup-7d',
    name: '7-Day Automated Sharia Audit Follow-up',
    category: 'Follow-up',
    subject: 'Following up: Sharia Audit & Compliance Certification for {{Project Name}}',
    isDefault: false,
    language: 'en',
    version: '1.0',
    lastUpdated: '2026-08-01',
    variables: [
      '{{Project Name}}',
      '{{Sales Person}}',
      '{{HalalChain Website}}',
      '{{Current Date}}',
      '{{Sales Signature}}'
    ],
    htmlContent: `<p>Dear <strong>{{Project Name}}</strong> Team,</p>

<p>I hope this message finds you well. I am following up on our previous invitation regarding the <strong>HALALCHAIN™ Sharia & Technical Assessment</strong> for {{Project Name}}.</p>

<p>Our research unit recently updated our <strong>Q3 Global Islamic Web3 Capital Report</strong>, highlighting increased capital deployment into Sharia-compliant digital asset projects. Securing a verified Sharia Certificate provides immediate trust for institutional liquidity providers in MENA and SE Asia.</p>

<p>Would you have 10 minutes this week for a brief alignment call?</p>

<p style="margin-top: 20px;">Best regards,</p>
<p style="margin: 0; font-weight: bold; color: #0B132B;">{{Sales Person}}</p>
<p style="margin: 2px 0 0 0; font-size: 13px; color: #64748B;">HALALCHAIN™ Enterprise BD</p>`
  },
  {
    id: 'tpl-cert-issued',
    name: 'Official Certificate Issued Announcement',
    category: 'Certificate Issued',
    subject: 'Congratulations! Official HALALCHAIN™ Sharia Certificate Issued for {{Project Name}}',
    isDefault: false,
    language: 'en',
    version: '1.1',
    lastUpdated: '2026-08-01',
    variables: [
      '{{Project Name}}',
      '{{Sales Person}}',
      '{{HalalChain Website}}',
      '{{Current Date}}'
    ],
    htmlContent: `<p>Dear <strong>{{Project Name}}</strong> Leadership Team,</p>

<p>We are delighted to announce that following comprehensive technical audits and Sharia Board evaluation, <strong>{{Project Name}}</strong> has been officially awarded the <strong>HALALCHAIN™ Sharia Compliance Certificate</strong>.</p>

<p>Your official audit dossier and immutable cryptographic certificate are now active in the <strong>HALALCHAIN™ Master Certified Registry</strong>.</p>

<div style="margin-top: 20px; padding: 20px; background: linear-gradient(135deg, #0B132B 0%, #1C2541 100%); color: #ffffff; border-radius: 12px; border: 1px solid #D97706;">
  <div style="color: #34D399; font-size: 11px; font-family: monospace; font-weight: bold; text-transform: uppercase;">STATUS: VERIFIED SHARIA COMPLIANT</div>
  <h3 style="margin: 8px 0 4px 0; color: #F59E0B; font-size: 18px;">HALALCHAIN™ Certified Asset</h3>
  <p style="margin: 0; font-size: 13px; color: #CBD5E1;">Certificate ID: HC-CERT-{{Current Date}} | Registry Verification Active</p>
</div>

<p style="margin-top: 20px;">You may now embed the official HALALCHAIN™ Verification Badge on your website and dApp.</p>

<p>Sincerely,</p>
<p style="margin: 0; font-weight: bold; color: #0B132B;">HALALCHAIN™ Governing Board & Executive Committee</p>`
  },
  {
    id: 'tpl-renewal-reminder',
    name: 'Annual Certificate Renewal Reminder',
    category: 'Renewal Reminder',
    subject: 'Upcoming Annual Sharia Certificate Renewal for {{Project Name}}',
    isDefault: false,
    language: 'en',
    version: '1.0',
    lastUpdated: '2026-08-01',
    variables: [
      '{{Project Name}}',
      '{{Sales Person}}',
      '{{HalalChain Website}}',
      '{{Current Date}}'
    ],
    htmlContent: `<p>Dear <strong>{{Project Name}}</strong> Team,</p>

<p>This is a polite reminder that your annual <strong>HALALCHAIN™ Sharia Compliance Certificate</strong> is scheduled for re-assessment in 30 days on <strong>{{Current Date}}</strong>.</p>

<p>To maintain seamless active status on the Master Registry and avoid any interruption in investor verification, please review your annual re-audit dossier.</p>

<p>Best regards,</p>
<p style="margin: 0; font-weight: bold; color: #0B132B;">HALALCHAIN™ Registry Services</p>`
  },
  {
    id: 'tpl-payment-reminder',
    name: 'Invoice & Fee Disbursal Pending Reminder',
    category: 'Payment Reminder',
    subject: 'Invoice Pending: Sharia Audit Fee Disbursal — {{Project Name}}',
    isDefault: false,
    language: 'en',
    version: '1.0',
    lastUpdated: '2026-08-01',
    variables: [
      '{{Project Name}}',
      '{{Sales Person}}',
      '{{HalalChain Website}}',
      '{{Current Date}}'
    ],
    htmlContent: `<p>Dear <strong>{{Project Name}}</strong> Finance Team,</p>

<p>This is an automated notification regarding the pending deposit for your HALALCHAIN™ Sharia & Technical Assessment.</p>

<p>Prompt payment guarantees fast-track allocation of technical auditors and Sharia board scholars.</p>

<p>Warm regards,</p>
<p style="margin: 0; font-weight: bold; color: #0B132B;">HALALCHAIN™ Treasury Operations</p>`
  },
  {
    id: 'tpl-welcome-email',
    name: 'Welcome to HalalChain Ecosystem',
    category: 'Welcome Email',
    subject: 'Welcome to HALALCHAIN™ — Next Steps for {{Project Name}}',
    isDefault: false,
    language: 'en',
    version: '1.0',
    lastUpdated: '2026-08-01',
    variables: [
      '{{Project Name}}',
      '{{Sales Person}}',
      '{{HalalChain Website}}',
      '{{Current Date}}'
    ],
    htmlContent: `<p>Welcome <strong>{{Project Name}}</strong> to the HALALCHAIN™ Web3 Sharia Certification Ecosystem!</p>

<p>We are thrilled to partner with your team in bringing institutional Sharia integrity and bytecode transparency to your digital asset.</p>

<p>Your dedicated Project Manager and Technical Review Panel will reach out shortly to begin the evidence intake process.</p>

<p>Warm regards,</p>
<p style="margin: 0; font-weight: bold; color: #0B132B;">HALALCHAIN™ Executive Team</p>`
  }
];

/**
 * Builds the complete branded HTML email layout for output
 */
export function buildBrandedHtmlEmail(
  bodyHtml: string,
  variables: Record<string, string> = {}
): string {
  const projectName = variables['{{Project Name}}'] || 'Valued Project';
  const salesPerson = variables['{{Sales Person}}'] || 'HALALCHAIN™ Executive';
  const website = variables['{{HalalChain Website}}'] || 'https://halalchain.io';
  const currentDate = variables['{{Current Date}}'] || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const companyLogo = variables['{{Company Logo}}'] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80';
  const salesSignature = variables['{{Sales Signature}}'] || `${salesPerson}<br/>Senior Enterprise BD Manager<br/>HALALCHAIN™`;

  // Perform dynamic variable substitution inside bodyHtml
  let processedBody = bodyHtml
    .replace(/\{\{Project Name\}\}/g, projectName)
    .replace(/\{\{Sales Person\}\}/g, salesPerson)
    .replace(/\{\{HalalChain Website\}\}/g, website)
    .replace(/\{\{Current Date\}\}/g, currentDate)
    .replace(/\{\{Company Logo\}\}/g, companyLogo)
    .replace(/\{\{Sales Signature\}\}/g, salesSignature);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HALALCHAIN™ Certification Outreach</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B; line-height: 1.6; }
    .wrapper { width: 100%; max-width: 650px; margin: 0 auto; padding: 24px 12px; }
    .card { background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05); border: 1px solid #E2E8F0; }
    .header { background-color: #0B132B; padding: 32px 28px 24px 28px; text-align: left; position: relative; }
    .accent-bar { height: 4px; background: linear-gradient(90deg, #D97706 0%, #059669 50%, #3B82F6 100%); }
    .logo-container { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .logo-badge { background-color: #D97706; color: #0B132B; font-weight: 900; font-size: 14px; padding: 6px 12px; border-radius: 8px; font-family: monospace; letter-spacing: 1px; display: inline-block; }
    .header-title { color: #ffffff; font-size: 20px; font-weight: 800; margin: 0 0 6px 0; line-height: 1.3; }
    .header-subtitle { color: #34D399; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0; }
    .body-content { padding: 32px 28px; font-size: 14px; color: #334155; }
    .footer { background-color: #0B132B; color: #94A3B8; padding: 28px; font-size: 11px; line-height: 1.6; border-top: 1px solid #1E293B; }
    .footer-logo { color: #ffffff; font-size: 16px; font-weight: 900; font-family: monospace; margin-bottom: 4px; }
    .footer-tagline { color: #D97706; font-weight: 700; font-size: 12px; margin-bottom: 12px; }
    .footer-links { margin: 12px 0; padding-top: 12px; border-top: 1px solid #1E293B; }
    .footer-link { color: #38BDF8; text-decoration: none; margin-right: 16px; font-weight: 600; }
    .confidential-notice { margin-top: 16px; font-size: 10px; color: #64748B; font-style: italic; border-top: 1px solid #1E293B; padding-top: 12px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="accent-bar"></div>
      
      <!-- HEADER -->
      <div class="header">
        <div class="logo-container">
          <span class="logo-badge">HALALCHAIN™</span>
        </div>
        <h1 class="header-title">Unlock Access to the Global Muslim Crypto Market with HALALCHAIN™ Certification</h1>
        <p class="header-subtitle">Independent Sharia Compliance Assessment for Digital Assets</p>
      </div>

      <!-- BODY CONTENT -->
      <div class="body-content">
        ${processedBody}
      </div>

      <!-- FOOTER -->
      <div class="footer">
        <div class="footer-logo">HALALCHAIN™ ENTERPRISE</div>
        <div class="footer-tagline">Where Blockchain Meets Sharia</div>
        <p style="margin: 4px 0;">Official Sharia & Technical Audit Authority for Digital Tokens & Protocol Infrastructure.</p>
        
        <div class="footer-links">
          <a href="${website}" class="footer-link">Website</a>
          <a href="mailto:contact@halalchain.io" class="footer-link">contact@halalchain.io</a>
          <a href="https://linkedin.com/company/halalchain" class="footer-link">LinkedIn</a>
          <a href="https://x.com/HalalChain" class="footer-link">X (Twitter)</a>
        </div>

        <p style="margin: 12px 0 0 0; color: #64748B;">© 2026 HALALCHAIN™ Technology Group. All rights reserved.</p>
        
        <div class="confidential-notice">
          <strong>CONFIDENTIALITY NOTICE:</strong> This electronic mail transmission contains confidential information intended solely for the recipient specified above. If you are not the intended recipient, any disclosure, copying, distribution, or action taken in reliance on the contents is strictly prohibited.
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}
