/* LexDraft — Contact Form & Inline Validation (contact.js) */

import { showToast } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
  // FAQ Accordion Toggle Interaction
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Close all other accordion items
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Contact Form Submission
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('cnt-name');
    const emailInput = document.getElementById('cnt-email');
    const msgInput = document.getElementById('cnt-message');

    let isValid = true;

    if (!nameInput || !nameInput.value.trim()) {
      if (nameInput) nameInput.classList.add('error');
      isValid = false;
    } else {
      nameInput.classList.remove('error');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
      if (emailInput) emailInput.classList.add('error');
      isValid = false;
    } else {
      emailInput.classList.remove('error');
    }

    if (msgInput && msgInput.value.trim().length < 5) {
      msgInput.classList.add('error');
      isValid = false;
    } else if (msgInput) {
      msgInput.classList.remove('error');
    }

    if (!isValid) {
      if (typeof showToast === 'function') {
        showToast('Please fill out all required fields accurately.', 'danger');
      }
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';
    }

    setTimeout(() => {
      if (typeof showToast === 'function') {
        showToast('Thank you! Your inquiry has been submitted to LexDraft India Support.');
      }
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Inquiry Message ➔';
      }
    }, 800);
  });
});
