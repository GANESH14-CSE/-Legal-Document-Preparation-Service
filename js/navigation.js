/* LexDraft — Navigation Controller (navigation.js) */

document.addEventListener('DOMContentLoaded', () => {
  // Redirect invalid subpaths appended after .html extension (e.g., /wizard/will.html/wqedwqdas)
  if (window.location.pathname.includes('.html/')) {
    window.location.href = '/404.html';
    return;
  }

  // Highlight Active Link based on pathname
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .sidebar-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Check matching filename
    const linkPath = href.split('/').pop().split('?')[0];
    const pagePath = currentPath.split('/').pop().split('?')[0] || 'index.html';

    if (linkPath === pagePath || (pagePath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Mobile Hamburger Menu Drawer Toggle & Backdrop Overlay
  const toggleBtn = document.getElementById('mobile-menu-btn') || document.getElementById('sidebar-toggle-btn');
  const navMenu = document.querySelector('.sidebar') || document.querySelector('.nav-links');

  if (toggleBtn && navMenu) {
    // Create Backdrop element if not already present
    let backdrop = document.querySelector('.mobile-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'mobile-backdrop';
      document.body.appendChild(backdrop);
    }

    const updateIcon = (isOpen) => {
      toggleBtn.innerHTML = `<i data-lucide="${isOpen ? 'x' : 'menu'}"></i>`;
      if (window.lucide) {
        window.lucide.createIcons();
      }
    };

    const closeMenu = () => {
      navMenu.classList.remove('mobile-open');
      backdrop.classList.remove('active');
      document.body.classList.remove('no-scroll');
      updateIcon(false);
    };

    const openMenu = () => {
      navMenu.classList.add('mobile-open');
      backdrop.classList.add('active');
      document.body.classList.add('no-scroll');
      updateIcon(true);
    };

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('mobile-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when tapping backdrop
    backdrop.addEventListener('click', closeMenu);

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('mobile-open') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on link click
    navMenu.querySelectorAll('a').forEach(l => {
      l.addEventListener('click', () => {
        closeMenu();
      });
    });
  }

  // Interactive Document Picker Modal for "Get Started" Header Buttons
  const getStartedBtns = document.querySelectorAll('.header-get-started, .mobile-cta-btn, [data-open-wizard-modal]');
  
  let wizardModal = document.getElementById('wizard-picker-modal');
  if (!wizardModal && getStartedBtns.length > 0) {
    wizardModal = document.createElement('div');
    wizardModal.id = 'wizard-picker-modal';
    wizardModal.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.65); z-index: 10000;
      display: flex; align-items: center; justify-content: center;
      padding: 16px; opacity: 0; visibility: hidden;
      transition: all 0.25s ease; backdrop-filter: blur(4px);
    `;
    wizardModal.innerHTML = `
      <div style="background: var(--white); border-radius: var(--radius-lg); max-width: 460px; width: 100%; padding: 24px; box-shadow: var(--shadow-lg); border: 1px solid var(--border); position: relative;" class="space-y-4">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; font-size: 19px; color: var(--navy); display: flex; align-items: center; gap: 8px;">
            <i data-lucide="sparkles" style="color: var(--gold);"></i> Choose Document Wizard
          </h3>
          <button id="close-wizard-modal" style="font-size: 18px; color: var(--muted); cursor: pointer; padding: 4px; background: none; border: none;">✕</button>
        </div>
        <p style="font-size: 13.5px; color: var(--muted); margin: 0;">Select which self-guided document wizard you want to launch:</p>
        
        <div class="space-y-2">
          <a href="wizard/will.html" style="display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--ivory); text-decoration: none; color: var(--navy); transition: all 0.2s ease;">
            <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(200, 164, 93, 0.15); color: var(--gold-dark); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <i data-lucide="scroll" style="width: 20px; height: 20px;"></i>
            </div>
            <div>
              <strong style="display: block; font-size: 14px; color: var(--navy);">Last Will & Testament</strong>
              <span style="font-size: 12px; color: var(--muted);">Asset allocation, executor & guardian nomination</span>
            </div>
          </a>

          <a href="wizard/poa.html" style="display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--ivory); text-decoration: none; color: var(--navy); transition: all 0.2s ease;">
            <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(11, 31, 58, 0.08); color: var(--navy); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <i data-lucide="briefcase" style="width: 20px; height: 20px;"></i>
            </div>
            <div>
              <strong style="display: block; font-size: 14px; color: var(--navy);">Power of Attorney</strong>
              <span style="font-size: 12px; color: var(--muted);">Financial management & healthcare proxy authority</span>
            </div>
          </a>

          <a href="wizard/affidavit.html" style="display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--ivory); text-decoration: none; color: var(--navy); transition: all 0.2s ease;">
            <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(27, 127, 76, 0.08); color: var(--success); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <i data-lucide="file-check" style="width: 20px; height: 20px;"></i>
            </div>
            <div>
              <strong style="display: block; font-size: 14px; color: var(--navy);">Sworn Affidavit</strong>
              <span style="font-size: 12px; color: var(--muted);">Sworn statement of facts under oath</span>
            </div>
          </a>
        </div>

        <div style="text-align: center; padding-top: 8px; border-top: 1px solid var(--border);">
          <a href="services.html" style="font-size: 13px; color: var(--gold); font-weight: 600; text-decoration: none;">View All Services & Feature Details →</a>
        </div>
      </div>
    `;
    document.body.appendChild(wizardModal);

    const closeModalBtn = document.getElementById('close-wizard-modal');
    const hideModal = () => {
      wizardModal.style.opacity = '0';
      wizardModal.style.visibility = 'hidden';
    };

    closeModalBtn?.addEventListener('click', hideModal);
    wizardModal.addEventListener('click', (e) => {
      if (e.target === wizardModal) hideModal();
    });

    getStartedBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        wizardModal.style.opacity = '1';
        wizardModal.style.visibility = 'visible';
        if (window.lucide) window.lucide.createIcons();
      });
    });
  }
});
