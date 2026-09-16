/* LexDraft — Admin Guard Controller (adminGuard.js) */
import { StorageAPI } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  const auth = StorageAPI.getAuth();

  // Protect Admin Dashboard routes from unauthenticated or non-admin access
  if (!auth || !auth.loggedIn || auth.role !== 'admin') {
    window.location.href = '../login.html';
    return;
  }

  // Intercept Admin Sign Out link to clear session
  const signOutLink = document.querySelector('a[href="../login.html"], a[href="login.html"]');
  if (signOutLink) {
    signOutLink.addEventListener('click', (e) => {
      e.preventDefault();
      StorageAPI.logout();
      window.location.href = '../login.html';
    });
  }
});
