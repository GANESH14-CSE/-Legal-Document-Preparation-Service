/* LexDraft — Main Platform Global Initialization (main.js) */

import { StorageAPI } from './storage.js';

export function initGlobalShell() {
  // Sticky Navbar shadow on scroll
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Auto-render Footer Copyright Year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // RTL Direction Handler
  const isRTL = localStorage.getItem('lexdraft_rtl') === 'true';
  if (isRTL) {
    document.documentElement.setAttribute('dir', 'rtl');
  }

  const updateRTLButtons = (rtlActive) => {
    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      if (rtlActive) {
        btn.textContent = 'LTR';
        btn.classList.add('active');
        btn.setAttribute('title', 'Switch to Left Side (LTR) Layout');
      } else {
        btn.textContent = 'RTL';
        btn.classList.remove('active');
        btn.setAttribute('title', 'Switch to Right Side (RTL) Layout');
      }
    });
  };

  updateRTLButtons(isRTL);

  document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir');
      if (currentDir === 'rtl') {
        document.documentElement.removeAttribute('dir');
        localStorage.setItem('lexdraft_rtl', 'false');
        updateRTLButtons(false);
        if (typeof window.showToast === 'function') {
          window.showToast('Switched to Left Side (LTR) layout');
        }
      } else {
        document.documentElement.setAttribute('dir', 'rtl');
        localStorage.setItem('lexdraft_rtl', 'true');
        updateRTLButtons(true);
        if (typeof window.showToast === 'function') {
          window.showToast('Switched to Right Side (RTL) layout');
        }
      }
    });
  });

  // Profile Dropdown Menu Handler
  document.querySelectorAll('.profile-dropdown-wrapper').forEach(wrapper => {
    const btn = wrapper.querySelector('.profile-btn');
    const menu = wrapper.querySelector('.profile-dropdown-menu');
    if (btn && menu) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('active');
      });

      document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
          menu.classList.remove('active');
        }
      });
    }
  });

  // Global FAQ Accordion Toggle Interaction
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      const parentList = item.parentElement;
      if (parentList) {
        parentList.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
      }

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Render SVG icons if Lucide is loaded
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'danger' ? 'border-danger' : ''}`;
  
  let iconName = 'check-circle';
  if (type === 'danger') iconName = 'alert-circle';
  if (type === 'warning') iconName = 'alert-triangle';

  toast.innerHTML = `
    <i data-lucide="${iconName}" style="width: 20px; height: 20px;"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

if (typeof window !== 'undefined') {
  window.showToast = showToast;
  document.addEventListener('DOMContentLoaded', initGlobalShell);
}
