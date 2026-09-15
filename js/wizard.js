/* LexDraft — Parameterized Document Wizard Engine (wizard.js) */

import { StorageAPI } from './storage.js';
import { showToast } from './main.js';
import { generateLegalPDF } from './pdfGenerator.js';

let currentDoc = null;
let currentStep = 1;
let debounceTimer = null;

document.addEventListener('DOMContentLoaded', () => {
  initWizard();
});

export function initWizard() {
  const urlParams = new URLSearchParams(window.location.search);
  const docId = urlParams.get('doc');
  const stepParam = parseInt(urlParams.get('step')) || 1;

  // Determine docType from URL filename (will.html, poa.html, affidavit.html)
  const filename = window.location.pathname.split('/').pop();
  let docType = 'will';
  if (filename.includes('poa')) docType = 'poa';
  if (filename.includes('affidavit')) docType = 'affidavit';

  if (docId) {
    currentDoc = StorageAPI.getDocument(docId);
  } else {
    const existingDocs = StorageAPI.getDocuments();
    const existingDraft = existingDocs.find(d => d.type === docType && d.status === 'draft');
    if (existingDraft) {
      currentDoc = existingDraft;
    }
  }

  if (!currentDoc) {
    const user = StorageAPI.getAuth();
    currentDoc = {
      id: `doc_${docType}_${Date.now()}`,
      type: docType,
      status: 'draft',
      progress: Math.round((stepParam / 9) * 100),
      currentStep: stepParam,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title: `${docType.toUpperCase()} — ${user.name || 'User'}`,
      formData: {
        personal: { fullName: user.name || '', dob: '', address: '', civilStatus: 'married' },
        family: { spouseName: '', hasChildren: 'no', childrenDetails: '' },
        assets: { realEstate: '', bankAccounts: '' },
        beneficiaries: { primary: '', contingent: '' },
        executor: { primaryName: '', altName: '', guardianName: '' },
        directives: { funeralWishes: '' },
        witnesses: { witness1: '', witness2: '' }
      }
    };
    StorageAPI.saveDraft(currentDoc);
  }

  currentStep = stepParam || currentDoc.currentStep || 1;

  renderWizardStep();
}

function renderWizardStep() {
  const container = document.getElementById('wizard-content-container');
  const stepperContainer = document.getElementById('wizard-stepper');
  if (!container) return;

  // Render Stepper UI with step continuation arrows (1 ➔ 2 ➔ 3 ➔ ...) and clickable steps
  if (stepperContainer) {
    stepperContainer.innerHTML = `
      <div class="progress-steps">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((s, idx) => `
          <div class="step-item ${s === currentStep ? 'active' : ''} ${s < currentStep ? 'completed' : ''}" onclick="jumpToStep(${s})" style="cursor: pointer;" title="Go to Step ${s}: ${getStepLabel(s)}">
            <div class="step-number">${s < currentStep ? '✓' : s}</div>
            <span class="step-label">${getStepLabel(s)}</span>
          </div>
          ${idx < 8 ? `<div class="step-arrow ${s <= currentStep ? 'completed' : ''}">➔</div>` : ''}
        `).join('')}
      </div>
    `;
  }

  // Render Form Step HTML
  container.innerHTML = `
    <div class="card space-y-6">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: 16px; margin-bottom: 20px;">
        <div>
          <span class="section-eyebrow">STEP ${currentStep} OF 9</span>
          <h2 style="font-size: 22px;">${getStepTitle(currentStep)}</h2>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span id="wiz-autosave-indicator" style="font-size: 12px; color: var(--success); font-weight: 600;">✓ Auto-Saved</span>
          <button id="btn-save-exit" type="button" class="btn btn-outline btn-sm">Save & Exit</button>
        </div>
      </div>

      <form id="wizard-form" class="space-y-4" onsubmit="return false;">
        ${getStepFormHTML(currentStep, currentDoc.formData)}

        <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 20px; margin-top: 24px;">
          ${currentStep > 1 ? `
            <button type="button" id="btn-prev-step" class="btn btn-outline">← Previous</button>
          ` : `<div></div>`}

          ${currentStep < 9 ? `
            <button type="button" id="btn-next-step" class="btn btn-gold">Continue →</button>
          ` : `
            <button type="button" id="btn-generate-pdf" class="btn btn-gold">
              Generate & Download PDF
            </button>
          `}
        </div>
      </form>
    </div>
  `;

  attachWizardEvents();
}

function getStepLabel(s) {
  const labels = ['Profile', 'Family', 'Assets', 'Beneficiaries', 'Executor', 'Directives', 'Review', 'Finalize', 'PDF'];
  return labels[s - 1] || `Step ${s}`;
}

function getStepTitle(s) {
  const titles = [
    'Personal Profile Identification',
    'Family Information & Dependents',
    'Asset Inventory & Allocations',
    'Primary & Contingent Beneficiaries',
    'Executor & Agent Designation',
    'Special Directives & Funeral Wishes',
    'Comprehensive Review & Verification',
    'Execution & Attestation Declaration',
    'PDF Export Center'
  ];
  return titles[s - 1] || 'Wizard Step';
}

function getStepFormHTML(s, data) {
  if (s === 1) {
    return `
      <div class="form-group">
        <label class="form-label">Full Legal Name *</label>
        <input type="text" name="fullName" value="${data.personal?.fullName || ''}" class="input" required>
      </div>
      <div class="form-group">
        <label class="form-label">Date of Birth *</label>
        <input type="date" name="dob" value="${data.personal?.dob || ''}" class="input">
      </div>
      <div class="form-group">
        <label class="form-label">Primary Residential Address *</label>
        <input type="text" name="address" value="${data.personal?.address || ''}" class="input">
      </div>
      <div class="form-group">
        <label class="form-label">Marital Status</label>
        <select name="civilStatus" class="select">
          <option value="married" ${data.personal?.civilStatus === 'married' ? 'selected' : ''}>Married</option>
          <option value="single" ${data.personal?.civilStatus === 'single' ? 'selected' : ''}>Single</option>
          <option value="widowed" ${data.personal?.civilStatus === 'widowed' ? 'selected' : ''}>Widowed</option>
        </select>
      </div>
    `;
  } else if (s === 2) {
    return `
      <div class="form-group">
        <label class="form-label">Spouse / Partner Name</label>
        <input type="text" name="spouseName" value="${data.family?.spouseName || ''}" class="input">
      </div>
      <div class="form-group">
        <label class="form-label">Minor Dependents & Children Details</label>
        <textarea name="childrenDetails" rows="3" class="textarea" placeholder="List dependent names and birth years">${data.family?.childrenDetails || ''}</textarea>
      </div>
    `;
  } else if (s === 3) {
    return `
      <div class="form-group">
        <label class="form-label">Real Estate Properties</label>
        <textarea name="realEstate" rows="3" class="textarea" placeholder="Primary residence and real property addresses">${data.assets?.realEstate || ''}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Bank Accounts & Investment Institutions</label>
        <textarea name="bankAccounts" rows="3" class="textarea" placeholder="Bank names and account identifiers">${data.assets?.bankAccounts || ''}</textarea>
      </div>
    `;
  } else if (s === 4) {
    return `
      <div class="form-group">
        <label class="form-label">Primary Beneficiaries & Allocation (%) *</label>
        <textarea name="primary" rows="3" class="textarea" placeholder="e.g., Spouse (100% Share)">${data.beneficiaries?.primary || ''}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Contingent Beneficiaries</label>
        <textarea name="contingent" rows="3" class="textarea" placeholder="Alternate beneficiaries if primary predeceases">${data.beneficiaries?.contingent || ''}</textarea>
      </div>
    `;
  } else if (s === 5) {
    return `
      <div class="form-group">
        <label class="form-label">Primary Executor / Agent Name *</label>
        <input type="text" name="primaryName" value="${data.executor?.primaryName || ''}" class="input">
      </div>
      <div class="form-group">
        <label class="form-label">Successor Executor Name</label>
        <input type="text" name="altName" value="${data.executor?.altName || ''}" class="input">
      </div>
    `;
  } else if (s === 6) {
    return `
      <div class="form-group">
        <label class="form-label">Special Directives & Funeral Wishes</label>
        <textarea name="funeralWishes" rows="4" class="textarea" placeholder="Specific memorial, cremation, or healthcare instructions">${data.directives?.funeralWishes || ''}</textarea>
      </div>
    `;
  } else if (s === 7) {
    return `
      <div style="background-color: var(--ivory); padding: 20px; border-radius: 8px; font-size: 14px; line-height: 1.8;">
        <h4 style="color: var(--gold); margin-bottom: 10px;">DATA REVIEW CHECKLIST</h4>
        <p><strong>Testator:</strong> ${data.personal?.fullName || 'N/A'} (<a href="javascript:void(0)" onclick="jumpToStep(1)">Edit</a>)</p>
        <p><strong>Address:</strong> ${data.personal?.address || 'N/A'} (<a href="javascript:void(0)" onclick="jumpToStep(1)">Edit</a>)</p>
        <p><strong>Executor:</strong> ${data.executor?.primaryName || 'N/A'} (<a href="javascript:void(0)" onclick="jumpToStep(5)">Edit</a>)</p>
        <p><strong>Beneficiaries:</strong> ${data.beneficiaries?.primary || 'N/A'} (<a href="javascript:void(0)" onclick="jumpToStep(4)">Edit</a>)</p>
      </div>
    `;
  } else if (s === 8) {
    return `
      <div class="form-group">
        <label class="form-label">Witness 1 Full Name</label>
        <input type="text" name="witness1" value="${data.witnesses?.witness1 || ''}" class="input">
      </div>
      <div class="form-group">
        <label class="form-label">Witness 2 Full Name</label>
        <input type="text" name="witness2" value="${data.witnesses?.witness2 || ''}" class="input">
      </div>
      <div style="display: flex; items-center; gap: 8px; margin-top: 16px;">
        <input type="checkbox" id="chk-confirm" ${data.finalized ? 'checked' : ''}>
        <label for="chk-confirm" style="font-size: 13px; color: var(--navy);">I confirm the information above is accurate and complete.</label>
      </div>
    `;
  } else {
    return `
      <div style="text-align: center; padding: 30px 0;">
        <h3 style="color: var(--success); font-size: 24px; margin-bottom: 12px;">✓ Legal Document Ready for Download</h3>
        <p style="margin-bottom: 24px; color: var(--muted); font-size: 14px;">Your official legal document has been compiled and saved. Click below to download your ready-to-sign PDF.</p>
        <button type="button" id="btn-generate-pdf-main" class="btn btn-gold" style="padding: 12px 24px; font-size: 15px;">
          Download Official PDF
        </button>
      </div>
    `;
  }
}

function isFinalized() {
  const chk = document.getElementById('chk-confirm');
  return chk ? chk.checked : true;
}

function attachWizardEvents() {
  const form = document.getElementById('wizard-form');
  const autosaveInd = document.getElementById('wiz-autosave-indicator');

  function saveFormState() {
    if (!form) return;
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      const name = input.name;
      const val = input.value;
      if (!name) return;

      if (currentStep === 1) currentDoc.formData.personal[name] = val;
      if (currentStep === 2) currentDoc.formData.family[name] = val;
      if (currentStep === 3) currentDoc.formData.assets[name] = val;
      if (currentStep === 4) currentDoc.formData.beneficiaries[name] = val;
      if (currentStep === 5) currentDoc.formData.executor[name] = val;
      if (currentStep === 6) currentDoc.formData.directives[name] = val;
      if (currentStep === 8) currentDoc.formData.witnesses[name] = val;
    });

    const chk = document.getElementById('chk-confirm');
    if (chk) {
      currentDoc.formData.finalized = chk.checked;
    }

    currentDoc.currentStep = currentStep;
    currentDoc.progress = Math.round((currentStep / 9) * 100);
    StorageAPI.saveDraft(currentDoc);

    if (autosaveInd) {
      autosaveInd.textContent = '✓ Saved';
      setTimeout(() => { autosaveInd.textContent = '✓ Auto-Saved'; }, 1000);
    }
  }

  // Prevent default form submission reload
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleNextStep();
    });
  }

  // Debounced Autosave on input change/blur
  form?.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(saveFormState, 500);
    });
  });

  document.getElementById('btn-save-exit')?.addEventListener('click', () => {
    saveFormState();
    showToast('Draft progress saved');
    window.location.href = '../index.html';
  });

  document.getElementById('btn-prev-step')?.addEventListener('click', () => {
    saveFormState();
    if (currentStep > 1) {
      currentStep--;
      renderWizardStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  function handleNextStep() {
    saveFormState();
    if (currentStep < 9) {
      currentStep++;
      if (currentStep === 9) {
        StorageAPI.markCompleted(currentDoc.id);
      }
      renderWizardStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  document.getElementById('btn-next-step')?.addEventListener('click', (e) => {
    e.preventDefault();
    handleNextStep();
  });

  const triggerPDFDownload = () => {
    saveFormState();
    StorageAPI.markCompleted(currentDoc.id);
    generateLegalPDF(currentDoc);
    showToast('Legal PDF Compiled & Saved');
  };

  document.getElementById('btn-generate-pdf')?.addEventListener('click', triggerPDFDownload);
  document.getElementById('btn-generate-pdf-main')?.addEventListener('click', triggerPDFDownload);

  const chkConfirm = document.getElementById('chk-confirm');
  if (chkConfirm) {
    chkConfirm.addEventListener('change', () => {
      currentDoc.formData.finalized = chkConfirm.checked;
      StorageAPI.saveDraft(currentDoc);
    });
  }
}

if (typeof window !== 'undefined') {
  window.jumpToStep = (s) => {
    currentStep = s;
    renderWizardStep();
  };
}
