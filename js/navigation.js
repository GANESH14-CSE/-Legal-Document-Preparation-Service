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
});
