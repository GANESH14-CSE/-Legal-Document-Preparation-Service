/* LexDraft — jsPDF Legal Document Compiler (pdfGenerator.js) */

export function generateLegalPDF(draft) {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("jsPDF CDN library is loading. Please check internet connection.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const formData = draft.formData || {};
  const docType = draft.type || 'will';
  const docId = draft.id || ('DOC-' + Math.floor(Math.random() * 899999 + 100000));

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = 20;

  // Double Border
  doc.setDrawColor(11, 31, 58); doc.setLineWidth(1.2); doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
  doc.setDrawColor(200, 164, 93); doc.setLineWidth(0.4); doc.rect(11, 11, pageWidth - 22, pageHeight - 22);

  // Crest Seal
  doc.setFillColor(200, 164, 93); doc.circle(pageWidth / 2, yPos, 6, 'F');
  doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(11, 31, 58);
  doc.text("L", pageWidth / 2, yPos + 3.5, { align: 'center' });

  yPos += 14;
  doc.setFont("times", "bold"); doc.setFontSize(18); doc.setTextColor(11, 31, 58);

  let docTitle = "LAST WILL AND TESTAMENT";
  if (docType === 'poa') docTitle = "GENERAL DURABLE POWER OF ATTORNEY";
  if (docType === 'affidavit') docTitle = "GENERAL SWORN AFFIDAVIT";

  doc.text(docTitle, pageWidth / 2, yPos, { align: 'center' });

  yPos += 6;
  doc.setDrawColor(200, 164, 93); doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - 45, yPos, pageWidth / 2 + 45, yPos);

  yPos += 12;
  doc.setFont("times", "normal"); doc.setFontSize(11); doc.setTextColor(23, 32, 51);

  const fullName = (formData.personal?.fullName || '__________________________').toUpperCase();
  const address = formData.personal?.address || '__________________________________________________';

  const introText = `I, ${fullName}, residing at ${address}, being of sound mind and disposing memory, do hereby make, publish, and declare this instrument to be my official ${docTitle}.`;
  const splitIntro = doc.splitTextToSize(introText, contentWidth);
  doc.text(splitIntro, margin, yPos);
  yPos += splitIntro.length * 6 + 6;

  // Numbered Clauses
  doc.setFont("times", "bold"); doc.text("1. REVOCATION OF PRIOR INSTRUMENTS", margin, yPos);
  yPos += 6; doc.setFont("times", "normal");
  doc.text("I hereby revoke all former wills, codicils, and powers of attorney made by me.", margin, yPos);
  yPos += 10;

  doc.setFont("times", "bold"); doc.text("2. APPOINTMENT OF EXECUTOR & REPRESENTATIVE", margin, yPos);
  yPos += 6; doc.setFont("times", "normal");
  const execText = `Primary Appointed Representative: ${formData.executor?.primaryName || '[Appointed Name]'}. Successor Representative: ${formData.executor?.altName || '[Alternate Name]'}.`;
  doc.text(doc.splitTextToSize(execText, contentWidth), margin, yPos);
  yPos += 12;

  doc.setFont("times", "bold"); doc.text("3. ASSET ALLOCATION & BENEFICIARY BEQUESTS", margin, yPos);
  yPos += 6; doc.setFont("times", "normal");
  const assetText = `Real Property: ${formData.assets?.realEstate || 'Declared Assets'}\nBeneficiary Allocations: ${formData.beneficiaries?.primary || 'Primary Share Allocations'}`;
  doc.text(doc.splitTextToSize(assetText, contentWidth), margin, yPos);
  yPos += 18;

  // Signatures
  doc.setFont("times", "bold"); doc.text("IN WITNESS WHEREOF, I HAVE HEREUNTO SET MY HAND THIS DAY.", margin, yPos);
  yPos += 14;
  const colW = contentWidth / 2 - 5;
  doc.line(margin, yPos, margin + colW, yPos);
  doc.text(`Testator / Affiant: ${fullName}`, margin, yPos + 5);

  doc.line(margin + colW + 10, yPos, pageWidth - margin, yPos);
  doc.text(`Primary Executor: ${formData.executor?.primaryName || 'Executor'}`, margin + colW + 10, yPos + 5);

  yPos += 20;

  // Disclaimer Footer on every page
  doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(102, 112, 133);
  doc.text(`Generated via LexDraft Platform — Demo Document, Not Legally Certified • REF: ${docId}`, pageWidth / 2, pageHeight - 12, { align: 'center' });

  doc.save(`${docType.toUpperCase()}_${fullName.replace(/\s+/g, '_')}.pdf`);
}

if (typeof window !== 'undefined') {
  window.generateLegalPDF = generateLegalPDF;
}
