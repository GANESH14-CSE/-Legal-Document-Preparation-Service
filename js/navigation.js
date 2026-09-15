/* LexDraft — Navigation Controller (navigation.js) */

document.addEventListener('DOMContentLoaded', () => {
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

  // Mobile Hamburger Menu Drawer Toggle
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.querySelector('.nav-links');

  if (toggleBtn && navMenu) {
    const closeMenu = () => {
      navMenu.classList.remove('mobile-open');
      document.body.classList.remove('no-scroll');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', 'menu');
        if (window.lucide) window.lucide.createIcons();
      }
    };

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('mobile-open');
      document.body.classList.toggle('no-scroll', isOpen);

      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
        if (window.lucide) window.lucide.createIcons();
      }
    });

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

  // Dashboard & Admin Mobile Sidebar Toggle
  const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebar = document.querySelector('.sidebar');

  if (sidebarToggleBtn && sidebar) {
    sidebarToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('mobile-open');
    });

    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target) && !sidebarToggleBtn.contains(e.target)) {
        sidebar.classList.remove('mobile-open');
      }
    });
  }
});
