import {
  CertificationApplication,
  AssessmentReportData,
  ReportValidationResult,
  ReportValidationIssue
} from '../types';

export const STANDARDIZED_LEGAL_DISCLAIMER =
  'The percentages displayed within HALALCHAIN™ represent workflow completion, evidence collection progress, or task completion only. They do not represent the degree of Sharia permissibility. The final Sharia determination is expressed solely through the certification decision (HALAL, HARAM, Pending Scholar Review, Remediation Required, Insufficient Evidence, Certification Suspended, or Certification Expired) following completion of the approved assessment methodology.';

/**
 * Pre-generation Quality and Consistency Validator
 * Runs automatically before PDF/Report generation to guarantee zero template leaks,
 * status consistency, complete human review approvals, and audit data integrity.
 */
export function validateReportConsistencyAndQuality(
  app: CertificationApplication,
  assessmentData?: AssessmentReportData | null
): ReportValidationResult {
  const errors: ReportValidationIssue[] = [];
  const warnings: ReportValidationIssue[] = [];

  const projectName = app.companyName?.trim() || assessmentData?.companyName?.trim() || '';
  const tokenSymbol = (app.projectSymbol || assessmentData?.projectSymbol || '').toUpperCase().trim();
  const contractAddress = app.contractAddress || assessmentData?.contractAddress || '';
  const blockchain = app.blockchain || assessmentData?.blockchain || '';
  const websiteUrl = app.websiteUrl || assessmentData?.websiteUrl || '';
  const whitepaperUrl = app.whitepaperUrl || assessmentData?.whitepaperUrl || '';
  const certNo = assessmentData?.certificateNumber || '';
  const assessmentId = assessmentData?.id || `ASSESS-${app.id}`;

  // 1. Mandatory Core Fields Check
  if (!projectName || projectName.toLowerCase() === 'sample web3 enterprise' || projectName.toLowerCase() === 'haqq protocol') {
    errors.push({
      code: 'ERR_INVALID_PROJECT_NAME',
      message: 'Project name must be specific and valid. Placeholder project names are not permitted.',
      section: 'Project Metadata',
      severity: 'error'
    });
  }

  if (!contractAddress || contractAddress === 'Not Available') {
    warnings.push({
      code: 'WARN_MISSING_CONTRACT',
      message: 'Smart Contract address is marked as Not Available. Ensure off-chain scope is documented.',
      section: 'Smart Contract Analysis',
      severity: 'warning'
    });
  }

  // 2. Template / Hardcoded Data Prevention Check
  const blacklistedTerms = [
    { term: 'ETHE', reason: 'Unrelated token symbol leak (ETHE token reference)' },
    { term: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', reason: 'Sample contract address from third-party audit template' },
    { term: 'AAOIFI PASSED', reason: 'Prohibited legal phrasing. Must use AAOIFI-informed methodology disclosure.' },
    { term: 'AAOIFI APPROVED', reason: 'Prohibited legal phrasing implying official endorsement by AAOIFI.' }
  ];

  const reportStringified = JSON.stringify(assessmentData || {}).toLowerCase();
  
  // If app is not explicitly named Chainlink or ISLM, check for leaks
  if (!projectName.toLowerCase().includes('chainlink') && reportStringified.includes('chainlink oracle feed token')) {
    errors.push({
      code: 'ERR_TEMPLATE_LEAK_CHAINLINK',
      message: 'Report contains leftover template references to Chainlink project data.',
      section: 'Report Consistency',
      severity: 'error'
    });
  }

  blacklistedTerms.forEach((item) => {
    if (reportStringified.includes(item.term.toLowerCase())) {
      errors.push({
        code: `ERR_TEMPLATE_LEAK_${item.term}`,
        message: `Incompatible text found: "${item.term}" (${item.reason}).`,
        section: 'Consistency Audit',
        severity: 'error'
      });
    }
  });

  // 3. Status Integrity Check (Single Final Status Enforcement)
  if (assessmentData) {
    const isWatermarkActive = assessmentData.draftWatermark;
    const isWorkflowCertified = assessmentData.workflowState === 'Certified' || assessmentData.status === 'Final Approved';

    if (isWorkflowCertified && isWatermarkActive) {
      errors.push({
        code: 'ERR_CONTRADICTORY_WATERMARK',
        message: 'Report is marked CERTIFIED but DRAFT watermark remains active. Watermark must be removed upon certification.',
        section: 'Workflow Status',
        severity: 'error'
      });
    }

    // Verify Human Sign-off Completeness if marked Certified
    if (isWorkflowCertified) {
      const signoffs = assessmentData.humanReviewSignoffs || {};
      const requiredRoles = ['tech_auditor', 'business_analyst', 'scholar', 'qa', 'pm'];
      const missingApprovals = requiredRoles.filter(
        (role) => signoffs[role]?.status !== 'Approved' || !signoffs[role]?.digitalSignature
      );

      if (missingApprovals.length > 0) {
        errors.push({
          code: 'ERR_MISSING_HUMAN_SIGNOFFS',
          message: `Cannot issue Final Certified status. Missing sign-off / digital signature from: ${missingApprovals.join(', ')}.`,
          section: 'Human Expert Review Panel',
          severity: 'error'
        });
      }
    }
  }

  // 4. Certificate Number & Verification Hash Check
  if (assessmentData?.workflowState === 'Certified') {
    if (!certNo || certNo.trim() === '') {
      errors.push({
        code: 'ERR_MISSING_CERT_NO',
        message: 'Final Certified report requires an official Certificate Number.',
        section: 'Certificate Verification',
        severity: 'error'
      });
    }
    if (!assessmentData.verificationHash) {
      errors.push({
        code: 'ERR_MISSING_VERIFICATION_HASH',
        message: 'Cryptographic verification hash is missing from certified assessment.',
        section: 'Certificate Verification',
        severity: 'error'
      });
    }
  }

  // 5. Evidence Register Citation Integrity
  if (assessmentData?.step2WhitepaperFacts) {
    const factsWithoutSource = assessmentData.step2WhitepaperFacts.filter(
      (f) => !f.sourceUrl || f.sourceUrl === ''
    );
    if (factsWithoutSource.length > 0) {
      warnings.push({
        code: 'WARN_FACTS_WITHOUT_URL',
        message: `${factsWithoutSource.length} extracted whitepaper fact(s) lack explicit source citations.`,
        section: 'Evidence Register',
        severity: 'warning'
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    validatedAt: new Date().toISOString()
  };
}
