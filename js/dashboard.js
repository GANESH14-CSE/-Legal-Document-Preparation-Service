/* LexDraft — User Dashboard Controller (dashboard.js) */

import { StorageAPI } from './storage.js';
import { showToast } from './main.js';
import { generateLegalPDF } from './pdfGenerator.js';

document.addEventListener('DOMContentLoaded', () => {
  renderDashboardData();
});

export function renderDashboardData() {
  const docs = StorageAPI.getDocuments();

  // Compute Live Metrics
  const totalCount = docs.length;
  const completedCount = docs.filter(d => d.status === 'completed').length;
  const draftCount = totalCount - completedCount;

  // Render Metric Counters
  const elTotal = document.getElementById('stat-total');
  const elDrafts = document.getElementById('stat-drafts');
  const elCompleted = document.getElementById('stat-completed');

  if (elTotal) elTotal.textContent = totalCount;
  if (elDrafts) elDrafts.textContent = draftCount;
  if (elCompleted) elCompleted.textContent = completedCount;

  // Render Recent Documents Table / Empty State
  const tableBody = document.getElementById('dashboard-docs-body');
  const emptyState = document.getElementById('dashboard-empty-state');
  const tableContainer = document.getElementById('dashboard-table-container');

  if (!tableBody) return;

  if (docs.length === 0) {
    if (tableContainer) tableContainer.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
  } else {
    if (tableContainer) tableContainer.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';

    tableBody.innerHTML = docs.map(doc => {
      const isComplete = doc.status === 'completed';
      const pct = doc.progress || (isComplete ? 100 : Math.round((doc.currentStep / 9) * 100));

      return `
        <tr>
          <td data-label="Document Title">
            <div style="display: flex; flex-direction: column; align-items: flex-end; text-align: right;">
              <strong style="color: var(--navy); line-height: 1.3;">${doc.title || 'Untitled Document'}</strong>
              <span class="badge badge-outline" style="font-size: 10px; margin-top: 4px; text-transform: uppercase;">${doc.type}</span>
            </div>
          </td>
          <td data-label="Status">
            <span class="badge ${isComplete ? 'badge-completed' : 'badge-draft'}">
              ${isComplete ? 'COMPLETED' : 'IN DRAFT'}
            </span>
          </td>
          <td data-label="Progress">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="flex-grow: 1; height: 6px; background-color: var(--border); border-radius: 3px; overflow: hidden; max-width: 100px;">
                <div style="width: ${pct}%; height: 100%; background-color: var(--gold);"></div>
              </div>
              <span style="font-size: 12px; font-weight: 700;">${pct}%</span>
            </div>
          </td>
          <td data-label="Last Modified" style="color: var(--muted); font-size: 13px;">${doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString() : 'Recent'}</td>
          <td data-label="Actions" style="text-align: right;">
            <div class="actions-group">
              <a href="../wizard/${doc.type}.html?doc=${doc.id}&step=${doc.currentStep || 1}" class="btn btn-outline btn-sm">
                <i data-lucide="edit-3" style="width: 13px; height: 13px;"></i> Continue
              </a>
              <button data-download-id="${doc.id}" class="btn btn-gold btn-sm">
                <i data-lucide="download" style="width: 13px; height: 13px;"></i> PDF
              </button>
              <button data-delete-id="${doc.id}" class="btn btn-ghost btn-sm" style="color: var(--danger); padding: 6px 8px;">
                <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();

    // Download & Delete Event Handlers
    tableBody.querySelectorAll('[data-download-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-download-id');
        const docObj = StorageAPI.getDocument(id);
        if (docObj) {
          generateLegalPDF(docObj);
          showToast(`PDF Compiled: ${docObj.title}`);
        }
      });
    });

    tableBody.querySelectorAll('[data-delete-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-delete-id');
        if (confirm('Are you sure you want to delete this document draft?')) {
          StorageAPI.deleteDocument(id);
          showToast('Document draft deleted');
          renderDashboardData();
        }
      });
    });
  }
}
