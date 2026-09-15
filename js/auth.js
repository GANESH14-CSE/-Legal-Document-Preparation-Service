/* LexDraft — Authentication & Demo Sessions (auth.js) */

import { StorageAPI } from './storage.js';
import { showToast } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const demoUserBtn = document.getElementById('btn-demo-user');
  const demoAdminBtn = document.getElementById('btn-demo-admin');

  if (demoUserBtn) {
    demoUserBtn.addEventListener('click', () => {
      StorageAPI.login('user@legaldoc.com', 'user');
      showToast('Signed in as Demo User (user@legaldoc.com)');
      setTimeout(() => {
        window.location.href = 'dashboard/index.html';
      }, 500);
    });
  }

  if (demoAdminBtn) {
    demoAdminBtn.addEventListener('click', () => {
      StorageAPI.login('admin@legaldoc.com', 'admin');
      showToast('Signed in as Demo Admin (admin@legaldoc.com)');
      setTimeout(() => {
        window.location.href = 'admin/index.html';
      }, 500);
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('input-email').value.trim();
      if (!email) return;

      const role = email.includes('admin') ? 'admin' : 'user';
      StorageAPI.login(email, role);
      showToast(`Welcome back, ${email}!`);
      setTimeout(() => {
        window.location.href = role === 'admin' ? 'admin/index.html' : 'dashboard/index.html';
      }, 500);
    });
  }
});
