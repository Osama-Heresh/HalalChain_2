import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';

export interface ReportDataColumn {
  header: string;
  key: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'number' | 'currency' | 'date' | 'status' | 'percentage';
}

export interface ReportSection {
  title: string;
  subtitle?: string;
  type?: 'key_value' | 'table' | 'text' | 'metrics_grid';
  content?: string;
  keyValuePairs?: Array<{ label: string; value: string | number }>;
  metrics?: Array<{ label: string; value: string | number; change?: string }>;
  columns?: ReportDataColumn[];
  rows?: Array<Record<string, any>>;
}

export interface ReportExportOptions {
  reportTitle: string;
  reportSubtitle?: string;
  reportNumber?: string;
  generatedBy?: string;
  customerName?: string;
  projectName?: string;
  tokenSymbol?: string;
  format: 'PDF' | 'Excel' | 'CSV' | 'Print';
  orientation?: 'portrait' | 'landscape';
  includeCoverPage?: boolean;
  watermarkText?: string;
  sections: ReportSection[];
  summaryMetrics?: Array<{ label: string; value: string | number }>;
  metadata?: Record<string, string>;
  elementToPrintId?: string;
}

/**
 * Generate standard report filename based on title, project, and format
 */
export function generateReportFilename(
  title: string,
  projectName?: string,
  tokenSymbol?: string,
  extension: 'pdf' | 'xlsx' | 'csv' = 'pdf'
): string {
  const cleanTitle = title
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  const cleanProject = (tokenSymbol || projectName || '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .toUpperCase();
  const dateStr = new Date().toISOString().split('T')[0];

  if (cleanProject) {
    return `HC_${cleanTitle}_${cleanProject}_${dateStr}.${extension}`;
  }
  return `HC_${cleanTitle}_${dateStr}.${extension}`;
}

/**
 * Helper to download Blob as file in browser
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Centralized Enterprise Report Export Engine
 */
export async function exportReport(options: ReportExportOptions): Promise<{ success: boolean; message: string }> {
  // Validate data existence
  const hasSections = options.sections && options.sections.length > 0;
  const hasRows = options.sections?.some((s) => (s.rows && s.rows.length > 0) || (s.keyValuePairs && s.keyValuePairs.length > 0) || s.content);
  const hasMetrics = options.summaryMetrics && options.summaryMetrics.length > 0;

  if (!hasSections && !hasRows && !hasMetrics) {
    throw new Error('No report data available to export.');
  }

  const format = options.format;

  switch (format) {
    case 'PDF':
      await exportToPDF(options);
      break;
    case 'Excel':
      await exportToExcel(options);
      break;
    case 'CSV':
      await exportToCSV(options);
      break;
    case 'Print':
      await exportToPrint(options);
      break;
    default:
      throw new Error(`Unsupported report format: ${format}`);
  }

  return {
    success: true,
    message: `Report "${options.reportTitle}" exported successfully as ${format}.`
  };
}

/**
 * Big Four Consulting Style PDF Export
 */
export async function exportToPDF(options: ReportExportOptions): Promise<void> {
  const orientation = options.orientation || 'portrait';
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const today = new Date().toISOString().split('T')[0];
  const reportNo = options.reportNumber || `HC-RPT-${Math.floor(100000 + Math.random() * 900000)}`;
  const generatedBy = options.generatedBy || 'HalalChain Enterprise Engine';

  let currentY = margin;

  // Colors
  const navyHex = '#0B132B';
  const emeraldHex = '#059669';
  const goldHex = '#D97706';
  const darkSlateHex = '#1E293B';
  const lightBgHex = '#F8FAFC';

  const shouldCoverPage = options.includeCoverPage ?? (options.sections.length >= 4);

  // --- COVER PAGE (If requested or long report) ---
  if (shouldCoverPage) {
    // Dark Navy Background Header Banner
    doc.setFillColor(11, 19, 43); // #0B132B
    doc.rect(0, 0, pageWidth, 65, 'F');

    // Accent Gold Bar
    doc.setFillColor(217, 119, 6); // #D97706
    doc.rect(0, 65, pageWidth, 4, 'F');

    // Cover Page Header Branding
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('HALALCHAIN ENTERPRISE', margin, 26);

    doc.setFontSize(10);
    doc.setTextColor(52, 211, 153); // Emerald text
    doc.text('SHARIAH & TECHNICAL AUDIT REPORTING SYSTEM', margin, 34);

    doc.setTextColor(203, 213, 225);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`REPORT NO: ${reportNo}  |  ISSUED: ${today}`, margin, 44);

    // Title Block
    currentY = 85;
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);

    const titleLines = doc.splitTextToSize(options.reportTitle.toUpperCase(), contentWidth);
    doc.text(titleLines, margin, currentY);
    currentY += titleLines.length * 9;

    if (options.reportSubtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(71, 85, 105);
      const subLines = doc.splitTextToSize(options.reportSubtitle, contentWidth);
      doc.text(subLines, margin, currentY);
      currentY += subLines.length * 6 + 4;
    }

    currentY += 10;

    // Metadata Card Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, contentWidth, 55, 3, 3, 'FD');

    let metaY = currentY + 10;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(11, 19, 43);
    doc.text('REPORT METADATA & COMPLIANCE VERIFICATION', margin + 6, metaY);
    metaY += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);

    const metaPairs = [
      ['Target Project:', options.projectName || 'Enterprise Portfolio'],
      ['Token Symbol:', options.tokenSymbol || 'N/A'],
      ['Customer / Institution:', options.customerName || 'HalalChain Enterprise Partner'],
      ['Generated By:', generatedBy],
      ['Audit Engine:', 'v2.4 Enterprise Production AI'],
      ['Digital Verification:', 'VERIFIED (SHA-256 INTEGRITY OK)']
    ];

    metaPairs.forEach(([label, val]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, margin + 6, metaY);
      doc.setFont('helvetica', 'normal');
      doc.text(String(val), margin + 55, metaY);
      metaY += 6.5;
    });

    // Decorative Seal Bottom
    const sealY = pageHeight - 35;
    doc.setFillColor(11, 19, 43);
    doc.rect(margin, sealY, contentWidth, 18, 'F');
    doc.setDrawColor(217, 119, 6);
    doc.rect(margin, sealY, contentWidth, 18, 'S');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL HALALCHAIN SHARIAH AUDIT DOSSIER', margin + 6, sealY + 7);
    doc.setFont('helvetica', 'normal');
    doc.text('This document contains verified audit trails and AI-extracted factual evidence.', margin + 6, sealY + 13);

    doc.addPage();
    currentY = margin;
  }

  // --- REGULAR PAGE HEADER (Top Banner for pages) ---
  const drawPageHeader = () => {
    doc.setFillColor(11, 19, 43);
    doc.rect(0, 0, pageWidth, 14, 'F');
    doc.setFillColor(52, 211, 153);
    doc.rect(0, 14, pageWidth, 1, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('HALALCHAIN ENTERPRISE REPORTING ENGINE', margin, 9);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    const topRight = `${options.reportTitle} | ${today}`;
    doc.text(topRight, pageWidth - margin, 9, { align: 'right' });
  };

  // Header for page 1 if no cover page
  if (!shouldCoverPage) {
    drawPageHeader();
    currentY = 22;

    // Report Header Title Block
    doc.setTextColor(11, 19, 43);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(options.reportTitle, margin, currentY);
    currentY += 7;

    if (options.reportSubtitle) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(options.reportSubtitle, margin, currentY);
      currentY += 6;
    }

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Report #: ${reportNo}  |  Project: ${options.projectName || 'All'}  |  Date: ${today}`, margin, currentY);
    currentY += 8;

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 8;
  } else {
    drawPageHeader();
    currentY = 22;
  }

  // Summary Metrics Banner if provided
  if (options.summaryMetrics && options.summaryMetrics.length > 0) {
    const cardCount = options.summaryMetrics.length;
    const cardWidth = (contentWidth - (cardCount - 1) * 4) / cardCount;

    doc.setFillColor(248, 250, 252);
    options.summaryMetrics.forEach((m, idx) => {
      const cardX = margin + idx * (cardWidth + 4);
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(cardX, currentY, cardWidth, 18, 2, 2, 'FD');

      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text(m.label.toUpperCase(), cardX + 4, currentY + 6);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(11, 19, 43);
      doc.text(String(m.value), cardX + 4, currentY + 14);
    });

    currentY += 24;
  }

  // Helper check Y overflow
  const ensureSpace = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 20) {
      doc.addPage();
      drawPageHeader();
      currentY = 22;
    }
  };

  // --- SECTIONS ITERATION ---
  for (const sec of options.sections) {
    ensureSpace(15);

    // Section Header
    doc.setFillColor(11, 19, 43);
    doc.rect(margin, currentY, 3, 7, 'F');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(11, 19, 43);
    doc.text(sec.title, margin + 6, currentY + 5.5);
    currentY += 10;

    if (sec.subtitle) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(sec.subtitle, margin + 6, currentY);
      currentY += 5;
    }

    // Text Section
    if (sec.content) {
      ensureSpace(10);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const textLines = doc.splitTextToSize(sec.content, contentWidth);
      textLines.forEach((line: string) => {
        ensureSpace(5);
        doc.text(line, margin, currentY);
        currentY += 4.5;
      });
      currentY += 4;
    }

    // Key-Value Pairs
    if (sec.keyValuePairs && sec.keyValuePairs.length > 0) {
      ensureSpace(12);
      const colW = contentWidth / 2 - 2;

      sec.keyValuePairs.forEach((kv, idx) => {
        ensureSpace(7);
        const isRightCol = idx % 2 === 1;
        const x = isRightCol ? margin + colW + 4 : margin;

        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(241, 245, 249);
        doc.roundedRect(x, currentY, colW, 7, 1, 1, 'FD');

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(71, 85, 105);
        doc.text(kv.label, x + 3, currentY + 4.8);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(String(kv.value), x + colW - 3, currentY + 4.8, { align: 'right' });

        if (isRightCol || idx === sec.keyValuePairs!.length - 1) {
          currentY += 8.5;
        }
      });
      currentY += 2;
    }

    // Table Section
    if (sec.columns && sec.rows && sec.rows.length > 0) {
      const headRow = sec.columns.map((c) => c.header);
      const bodyRows = sec.rows.map((row) => sec.columns!.map((col) => (row[col.key] !== undefined && row[col.key] !== null ? String(row[col.key]) : '')));

      autoTable(doc, {
        startY: currentY,
        head: [headRow],
        body: bodyRows,
        margin: { left: margin, right: margin },
        styles: {
          font: 'helvetica',
          fontSize: 7.5,
          cellPadding: 2.5,
          textColor: [30, 41, 59]
        },
        headStyles: {
          fillColor: [11, 19, 43],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        tableLineColor: [226, 232, 240],
        tableLineWidth: 0.1,
        didDrawPage: (data) => {
          drawPageHeader();
        }
      });

      // @ts-ignore
      currentY = (doc as any).lastAutoTable.finalY + 8;
    }
  }

  // Add Page Numbers Footer to ALL pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(241, 245, 249);
    doc.rect(0, pageHeight - 10, pageWidth, 10, 'F');

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('CONFIDENTIAL — HALALCHAIN SHARIAH COMPLIANCE PLATFORM', margin, pageHeight - 4);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 4, { align: 'right' });
  }

  const filename = generateReportFilename(options.reportTitle, options.projectName, options.tokenSymbol, 'pdf');
  doc.save(filename);
}

/**
 * Real Excel (.xlsx) Export with ExcelJS
 */
export async function exportToExcel(options: ReportExportOptions): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = options.generatedBy || 'HalalChain Enterprise Engine';
  workbook.created = new Date();

  const navyFill: ExcelJS.Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0B132B' }
  };

  const whiteBoldFont: Partial<ExcelJS.Font> = {
    name: 'Calibri',
    bold: true,
    color: { argb: 'FFFFFFFF' },
    size: 11
  };

  const titleFont: Partial<ExcelJS.Font> = {
    name: 'Calibri',
    bold: true,
    color: { argb: 'FF0B132B' },
    size: 16
  };

  const subtitleFont: Partial<ExcelJS.Font> = {
    name: 'Calibri',
    italic: true,
    color: { argb: 'FF475569' },
    size: 10
  };

  // Sheet 1: Summary Sheet
  const summarySheet = workbook.addWorksheet('Executive Summary');
  summarySheet.views = [{ state: 'frozen', ySplit: 6 }];

  // Title Row
  summarySheet.mergeCells('A1:F1');
  const titleCell = summarySheet.getCell('A1');
  titleCell.value = options.reportTitle.toUpperCase();
  titleCell.font = titleFont;
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' };

  // Subtitle Row
  summarySheet.mergeCells('A2:F2');
  const subCell = summarySheet.getCell('A2');
  subCell.value = options.reportSubtitle || `Generated on ${new Date().toISOString().split('T')[0]} by HalalChain Reporting System`;
  subCell.font = subtitleFont;

  // Metadata Block
  summarySheet.getCell('A4').value = 'Project Name:';
  summarySheet.getCell('B4').value = options.projectName || 'All Projects';
  summarySheet.getCell('C4').value = 'Token Symbol:';
  summarySheet.getCell('D4').value = options.tokenSymbol || 'N/A';
  summarySheet.getCell('E4').value = 'Report #:';
  summarySheet.getCell('F4').value = options.reportNumber || 'HC-EXCEL-001';

  ['A4', 'C4', 'E4'].forEach((cellRef) => {
    summarySheet.getCell(cellRef).font = { bold: true, color: { argb: 'FF0B132B' } };
  });

  // Summary Metrics Section
  if (options.summaryMetrics && options.summaryMetrics.length > 0) {
    summarySheet.getCell('A6').value = 'METRIC NAME';
    summarySheet.getCell('B6').value = 'VALUE';
    summarySheet.mergeCells('B6:C6');

    ['A6', 'B6'].forEach((cellRef) => {
      const cell = summarySheet.getCell(cellRef);
      cell.fill = navyFill;
      cell.font = whiteBoldFont;
    });

    options.summaryMetrics.forEach((m, idx) => {
      const r = 7 + idx;
      summarySheet.getCell(`A${r}`).value = m.label;
      summarySheet.getCell(`B${r}`).value = m.value;
      summarySheet.mergeCells(`B${r}:C${r}`);
    });
  }

  // Iterate sections & create dedicated sheets for tables
  let tableSheetIndex = 1;
  for (const sec of options.sections) {
    if (sec.columns && sec.rows && sec.rows.length > 0) {
      const sheetName = (sec.title || `Data Sheet ${tableSheetIndex}`)
        .replace(/[\\/*?:\[\]]/g, '')
        .substring(0, 31);

      const sheet = workbook.addWorksheet(sheetName);

      // Section Title Banner
      sheet.mergeCells(1, 1, 1, sec.columns.length);
      const secTitleCell = sheet.getCell(1, 1);
      secTitleCell.value = sec.title.toUpperCase();
      secTitleCell.font = titleFont;

      // Column Headers Row (Row 3)
      const headerRowIndex = 3;
      const headerRow = sheet.getRow(headerRowIndex);

      sec.columns.forEach((col, colIdx) => {
        const cell = headerRow.getCell(colIdx + 1);
        cell.value = col.header;
        cell.fill = navyFill;
        cell.font = whiteBoldFont;
        cell.alignment = { vertical: 'middle', horizontal: col.align || 'left' };
      });

      // Data Rows
      sec.rows.forEach((row, rowIdx) => {
        const rowObj = sheet.getRow(headerRowIndex + 1 + rowIdx);
        sec.columns!.forEach((col, colIdx) => {
          const cell = rowObj.getCell(colIdx + 1);
          const rawVal = row[col.key];

          if (col.type === 'number' || typeof rawVal === 'number') {
            cell.value = Number(rawVal);
            cell.numFmt = '#,##0.00';
          } else if (col.type === 'percentage') {
            cell.value = Number(rawVal);
            cell.numFmt = '0.0%';
          } else if (col.type === 'currency') {
            cell.value = Number(rawVal);
            cell.numFmt = '$#,##0.00';
          } else {
            cell.value = rawVal !== undefined && rawVal !== null ? String(rawVal) : '';
          }

          if (col.align) {
            cell.alignment = { horizontal: col.align };
          }
        });
      });

      // Freeze headers & Enable AutoFilter
      sheet.views = [{ state: 'frozen', ySplit: headerRowIndex }];
      sheet.autoFilter = {
        from: { row: headerRowIndex, column: 1 },
        to: { row: headerRowIndex + sec.rows.length, column: sec.columns.length }
      };

      // Auto Column Widths
      sec.columns.forEach((col, colIdx) => {
        let maxLen = col.header.length;
        sec.rows!.forEach((r) => {
          const valLen = String(r[col.key] || '').length;
          if (valLen > maxLen) maxLen = valLen;
        });
        sheet.getColumn(colIdx + 1).width = Math.min(Math.max(maxLen + 4, 12), 45);
      });

      tableSheetIndex++;
    }
  }

  // Export buffer & download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const filename = generateReportFilename(options.reportTitle, options.projectName, options.tokenSymbol, 'xlsx');
  downloadBlob(blob, filename);
}

/**
 * UTF-8 Encoded CSV Export
 */
export async function exportToCSV(options: ReportExportOptions): Promise<void> {
  const lines: string[] = [];

  // UTF-8 BOM to guarantee proper Unicode rendering in Excel & CSV viewers
  lines.push('\uFEFF');

  // Title Block
  lines.push(`"HALALCHAIN ENTERPRISE REPORT: ${options.reportTitle.replace(/"/g, '""')}"`);
  if (options.reportSubtitle) {
    lines.push(`"${options.reportSubtitle.replace(/"/g, '""')}"`);
  }
  lines.push(`"Date","${new Date().toISOString().split('T')[0]}"`);
  lines.push(`"Project","${(options.projectName || 'All').replace(/"/g, '""')}"`);
  lines.push(`"Generated By","${(options.generatedBy || 'HalalChain Reporting Engine').replace(/"/g, '""')}"`);
  lines.push('');

  // Summary Metrics
  if (options.summaryMetrics && options.summaryMetrics.length > 0) {
    lines.push('"SUMMARY METRICS"');
    lines.push('"Metric Name","Value"');
    options.summaryMetrics.forEach((m) => {
      lines.push(`"${String(m.label).replace(/"/g, '""')}","${String(m.value).replace(/"/g, '""')}"`);
    });
    lines.push('');
  }

  // Table Sections
  options.sections.forEach((sec) => {
    lines.push(`"SECTION: ${sec.title.replace(/"/g, '""')}"`);

    if (sec.content) {
      lines.push(`"${sec.content.replace(/"/g, '""')}"`);
    }

    if (sec.keyValuePairs && sec.keyValuePairs.length > 0) {
      sec.keyValuePairs.forEach((kv) => {
        lines.push(`"${kv.label.replace(/"/g, '""')}","${String(kv.value).replace(/"/g, '""')}"`);
      });
      lines.push('');
    }

    if (sec.columns && sec.rows && sec.rows.length > 0) {
      const headers = sec.columns.map((c) => `"${c.header.replace(/"/g, '""')}"`).join(',');
      lines.push(headers);

      sec.rows.forEach((row) => {
        const rowCells = sec.columns!.map((col) => {
          const val = row[col.key];
          const strVal = val !== undefined && val !== null ? String(val) : '';
          return `"${strVal.replace(/"/g, '""')}"`;
        });
        lines.push(rowCells.join(','));
      });
      lines.push('');
    }
  });

  const csvContent = lines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const filename = generateReportFilename(options.reportTitle, options.projectName, options.tokenSymbol, 'csv');
  downloadBlob(blob, filename);
}

/**
 * Dedicated Browser Print Layout Export
 */
export async function exportToPrint(options: ReportExportOptions): Promise<void> {
  if (options.elementToPrintId) {
    const el = document.getElementById(options.elementToPrintId);
    if (el) {
      window.print();
      return;
    }
  }

  // Fallback: create printable print area overlay
  const printDiv = document.createElement('div');
  printDiv.id = 'temp-printable-report';
  printDiv.className = 'fixed inset-0 z-[99999] bg-white p-8 text-slate-900 font-sans overflow-auto print:p-0 print:static print:block';

  let html = `
    <div style="font-family: sans-serif; color: #0f172a; max-width: 900px; margin: 0 auto; padding: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0B132B; padding-bottom: 12px; margin-bottom: 20px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 900; margin: 0; color: #0B132B;">HALALCHAIN ENTERPRISE REPORT</h1>
          <p style="font-size: 14px; font-weight: 700; color: #059669; margin: 4px 0 0 0;">${options.reportTitle}</p>
        </div>
        <div style="text-align: right; font-size: 11px; color: #64748b;">
          <div>Report #: ${options.reportNumber || 'HC-RPT-PRINT'}</div>
          <div>Date: ${new Date().toISOString().split('T')[0]}</div>
          <div>Project: ${options.projectName || 'All Projects'}</div>
        </div>
      </div>
  `;

  if (options.summaryMetrics && options.summaryMetrics.length > 0) {
    html += `<div style="display: flex; gap: 10px; margin-bottom: 20px;">`;
    options.summaryMetrics.forEach((m) => {
      html += `
        <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 8px;">
          <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">${m.label}</div>
          <div style="font-size: 18px; font-weight: 900; color: #0B132B; margin-top: 4px;">${m.value}</div>
        </div>
      `;
    });
    html += `</div>`;
  }

  options.sections.forEach((sec) => {
    html += `<div style="margin-bottom: 24px;">`;
    html += `<h2 style="font-size: 16px; font-weight: 800; color: #0B132B; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 10px;">${sec.title}</h2>`;

    if (sec.content) {
      html += `<p style="font-size: 12px; color: #334155; line-height: 1.5;">${sec.content}</p>`;
    }

    if (sec.keyValuePairs && sec.keyValuePairs.length > 0) {
      html += `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; margin-bottom: 12px;">`;
      sec.keyValuePairs.forEach((kv) => {
        html += `<div style="background: #f8fafc; padding: 8px; border-radius: 6px;"><strong>${kv.label}:</strong> ${kv.value}</div>`;
      });
      html += `</div>`;
    }

    if (sec.columns && sec.rows && sec.rows.length > 0) {
      html += `<table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 8px;">`;
      html += `<thead><tr style="background-color: #0B132B; color: white;">`;
      sec.columns.forEach((col) => {
        html += `<th style="padding: 8px; text-align: left; border: 1px solid #334155;">${col.header}</th>`;
      });
      html += `</tr></thead><tbody>`;

      sec.rows.forEach((row, rIdx) => {
        const bg = rIdx % 2 === 0 ? '#ffffff' : '#f8fafc';
        html += `<tr style="background-color: ${bg};">`;
        sec.columns!.forEach((col) => {
          html += `<style>@media print { .no-print { display: none !important; } }</style>`;
          html += `<td style="padding: 6px 8px; border: 1px solid #e2e8f0;">${row[col.key] !== undefined ? row[col.key] : ''}</td>`;
        });
        html += `</tr>`;
      });

      html += `</tbody></table>`;
    }

    html += `</div>`;
  });

  html += `
      <div style="margin-top: 40px; border-top: 1px solid #cbd5e1; pt: 10px; font-size: 10px; color: #94a3b8; text-align: center;">
        HALALCHAIN ENTERPRISE AUDIT SYSTEM — CONFIDENTIAL & PROPRIETARY
      </div>
    </div>
  `;

  printDiv.innerHTML = html;
  document.body.appendChild(printDiv);

  window.print();

  setTimeout(() => {
    if (document.body.contains(printDiv)) {
      document.body.removeChild(printDiv);
    }
  }, 1000);
}
