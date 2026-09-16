/* LexiWill — Online Will & Legal Document Preparation System (Self-Contained Unified Engine) */

(function () {
  // -------------------------------------------------------------
  // 1. SAMPLE DATA & INITIAL STATE
  // -------------------------------------------------------------
  const MOCK_USERS = [
    { id: 'user_1', name: 'Eleanor Vance', email: 'user@legaldoc.com', role: 'client', createdAt: '2026-01-15' },
    { id: 'user_admin', name: 'Attorney Marcus Vance', email: 'admin@legaldoc.com', role: 'admin', createdAt: '2025-11-01' }
  ];

  const MOCK_BLOGS = [
    {
      id: 'blog-1',
      title: '5 Essential Elements Every Last Will & Testament Must Contain',
      category: 'Estate Planning',
      readTime: '6 min read',
      author: 'Attorney Marcus Vance',
      date: 'Sep 10, 2026',
      excerpt: 'Avoid common legal pitfalls when drafting your Will. Learn about clear executor designation, asset inventory, and guardianship clauses.',
      content: `
        <p class="mb-4">Drafting a Last Will & Testament is one of the most critical legal acts of adult life. Without a valid Will, state intestacy laws decide who inherits your assets and who raises your minor children.</p>
        <h4 class="text-lg font-bold text-gold-400 mt-4 mb-2">1. Unambiguous Identification of the Testator</h4>
        <p class="mb-4">Your Will must state your full legal name, current primary address, and an explicit revocation clause stating that all prior Wills and codicils are revoked.</p>
        <h4 class="text-lg font-bold text-gold-400 mt-4 mb-2">2. Appointment of Executor & Successor</h4>
        <p class="mb-4">The Executor manages probate, pays valid debts, and distributes property. Always name a trustworthy primary executor and an alternate.</p>
        <h4 class="text-lg font-bold text-gold-400 mt-4 mb-2">3. Guardianship Designation for Minors</h4>
        <p class="mb-4">If you have minor children, designating a legal guardian in your Will is essential. Courts strongly weigh the wishes stated in a legally executed Will.</p>
        <h4 class="text-lg font-bold text-gold-400 mt-4 mb-2">4. Specific Bequests vs. Residuary Estate</h4>
        <p class="mb-4">Distinguish between specific gifts (e.g. family heirlooms, real property) and your residuary estate.</p>
        <h4 class="text-lg font-bold text-gold-400 mt-4 mb-2">5. Execution and Two Disinterested Witnesses</h4>
        <p class="mb-4">To be enforceable, the testator must sign the document in the presence of at least two adult witnesses who are not beneficiaries.</p>
      `
    },
    {
      id: 'blog-2',
      title: 'Financial vs. Medical Power of Attorney: What You Need to Know',
      category: 'Power of Attorney',
      readTime: '4 min read',
      author: 'Sarah Jenkins, Legal Analyst',
      date: 'Sep 02, 2026',
      excerpt: 'Discover why having both financial and medical Powers of Attorney is vital for complete emergency protection.',
      content: `
        <p class="mb-4">A Power of Attorney (POA) grants a trusted person legal authority to act on your behalf if you become incapacitated.</p>
        <h4 class="text-lg font-bold text-gold-400 mt-4 mb-2">Financial Power of Attorney</h4>
        <p class="mb-4">Authorizes your agent to manage bank accounts, pay bills, handle real estate, and manage investments.</p>
        <h4 class="text-lg font-bold text-gold-400 mt-4 mb-2">Medical Power of Attorney</h4>
        <p class="mb-4">Allows your chosen agent to make healthcare decisions and enforce your treatment preferences.</p>
        <h4 class="text-lg font-bold text-gold-400 mt-4 mb-2">Why "Durable" Status Matters</h4>
        <p class="mb-4">Making your POA "Durable" ensures that the agent's authority remains active upon incapacity.</p>
      `
    },
    {
      id: 'blog-3',
      title: 'When and How to Use a Sworn Affidavit in Legal Transactions',
      category: 'Affidavits',
      readTime: '5 min read',
      author: 'David Sterling, Esq.',
      date: 'Aug 25, 2026',
      excerpt: 'Understand the legal weight of sworn written declarations under oath and proper affidavit formatting.',
      content: `
        <p class="mb-4">A Sworn Affidavit is a written statement of facts voluntarily made under an oath administered by a Notary Public or authorized officer.</p>
        <h4 class="text-lg font-bold text-gold-400 mt-4 mb-2">Key Uses of Sworn Affidavits</h4>
        <ul class="list-disc pl-5 space-y-1 my-2">
          <li>Proof of residency or address confirmation</li>
          <li>Financial disclosures</li>
          <li>Name change declarations</li>
          <li>Loss or damage statements</li>
        </ul>
      `
    }
  ];

  const MOCK_TESTIMONIALS = [
    { id: 't-1', name: 'Robert & Clara Sterling', role: 'Homeowners & Parents', text: 'Preparing our Will with LexiWill took less than 20 minutes. The guided wizard explained every step clearly.', rating: 5, location: 'Chicago, IL' },
    { id: 't-2', name: 'Dr. Evelyn Martinez', role: 'Medical Director', text: 'I created both my Financial and Healthcare Power of Attorney documents here. Peace of mind guaranteed.', rating: 5, location: 'Austin, TX' },
    { id: 't-3', name: 'James L. Thorne', role: 'Small Business Owner', text: 'Needed a sworn affidavit for lease verification. LexiWill generated an exact formatted document instantly.', rating: 5, location: 'Seattle, WA' }
  ];

  const DEFAULT_TEMPLATES = {
    will: { title: 'Last Will & Testament', revocationClause: 'I hereby declare that I revoke all former Wills and Codicils made by me.' },
    poa: { title: 'General Durable Power of Attorney', revocationClause: 'I hereby revoke any prior powers of attorney granted by me.' },
    affidavit: { title: 'General Sworn Affidavit', oathClause: 'I solemnly swear and affirm under penalty of perjury that the facts stated herein are true.' }
  };

  const INITIAL_DRAFTS = [
    {
      id: 'draft-will-101',
      userId: 'user_1',
      docType: 'will',
      title: 'Last Will & Testament — Eleanor Vance',
      currentStep: 4,
      totalSteps: 9,
      status: 'Draft',
      updatedAt: '2026-09-14',
      formData: {
        fullName: 'Eleanor Vance',
        dob: '1984-06-22',
        address: '742 Evergreen Terrace, Springfield, IL',
        civilStatus: 'married',
        spouseName: 'Arthur Vance',
        hasChildren: 'yes',
        childrenDetails: 'Oliver Vance (Son, Age 12), Sophia Vance (Daughter, Age 8)',
        realEstateAssets: 'Primary Residence at 742 Evergreen Terrace; Family Cottage in Lake Michigan',
        bankAssets: 'First National Savings Account ending in #4092',
        primaryBeneficiaries: 'Arthur Vance (Spouse, 100% Share)',
        contingentBeneficiaries: 'Oliver Vance (50%) & Sophia Vance (50%) equally in trust',
        executorName: 'Arthur Vance',
        altExecutorName: 'Julian Vance (Brother)',
        guardianName: 'Martha Sterling (Sister)',
        specialDirectives: 'Funeral service to be private family gathering; memorial donations to Legal Aid Society.'
      }
    }
  ];

  const KEYS = { CURRENT_USER: 'lexiwill_user', USERS: 'lexiwill_users', DRAFTS: 'lexiwill_drafts', BLOGS: 'lexiwill_blogs', TEMPLATES: 'lexiwill_templates' };

  // -------------------------------------------------------------
  // 2. STORAGE ENGINE
  // -------------------------------------------------------------
  function initStorage() {
    if (!localStorage.getItem(KEYS.USERS)) localStorage.setItem(KEYS.USERS, JSON.stringify(MOCK_USERS));
    if (!localStorage.getItem(KEYS.BLOGS)) localStorage.setItem(KEYS.BLOGS, JSON.stringify(MOCK_BLOGS));
    if (!localStorage.getItem(KEYS.TEMPLATES)) localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(DEFAULT_TEMPLATES));
    if (!localStorage.getItem(KEYS.DRAFTS)) localStorage.setItem(KEYS.DRAFTS, JSON.stringify(INITIAL_DRAFTS));
    if (!localStorage.getItem(KEYS.CURRENT_USER)) localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(MOCK_USERS[0]));
  }

  function getCurrentUser() {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  }

  function loginUser(email, role = 'client') {
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = { id: 'user_' + Date.now(), name: email.split('@')[0].toUpperCase(), email: email, role: role, createdAt: new Date().toISOString().split('T')[0] };
      users.push(user);
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    }
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  }

  function logoutUser() { localStorage.removeItem(KEYS.CURRENT_USER); }

  function getAllUsers() { return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]'); }

  function updateUserRole(userId, newRole) {
    const users = getAllUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.role = newRole;
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      const current = getCurrentUser();
      if (current && current.id === userId) {
        current.role = newRole;
        localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(current));
      }
    }
  }

  function getDraftsByUser(userId) {
    const drafts = JSON.parse(localStorage.getItem(KEYS.DRAFTS) || '[]');
    return drafts.filter(d => d.userId === userId || !userId);
  }

  function getAllDrafts() { return JSON.parse(localStorage.getItem(KEYS.DRAFTS) || '[]'); }

  function getDraftById(id) { return getAllDrafts().find(d => d.id === id); }

  function saveDraft(draftData) {
    const drafts = getAllDrafts();
    const idx = drafts.findIndex(d => d.id === draftData.id);
    const updated = { ...draftData, updatedAt: new Date().toISOString().split('T')[0] };
    if (idx >= 0) drafts[idx] = updated; else drafts.push(updated);
    localStorage.setItem(KEYS.DRAFTS, JSON.stringify(drafts));
    return updated;
  }

  function deleteDraft(id) {
    let drafts = getAllDrafts().filter(d => d.id !== id);
    localStorage.setItem(KEYS.DRAFTS, JSON.stringify(drafts));
  }

  function getBlogs() { return JSON.parse(localStorage.getItem(KEYS.BLOGS) || '[]'); }
  function getBlogById(id) { return getBlogs().find(b => b.id === id); }
  function getTemplates() { return JSON.parse(localStorage.getItem(KEYS.TEMPLATES) || '{}'); }
  function saveTemplates(tpl) { localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(tpl)); }

  // -------------------------------------------------------------
  // 3. TOAST NOTIFICATION DISPATCHER
  // -------------------------------------------------------------
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    let icon = 'check-circle';
    let color = 'text-gold-400';
    if (type === 'error') { icon = 'alert-circle'; color = 'text-rose-500'; }
    if (type === 'warning') { icon = 'alert-triangle'; color = 'text-amber-500'; }

    toast.innerHTML = `
      <i data-lucide="${icon}" class="${color} w-5 h-5 flex-shrink-0"></i>
      <span class="text-sm font-medium text-slate-100">${message}</span>
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

  // -------------------------------------------------------------
  // 4. PDF GENERATOR
  // -------------------------------------------------------------
  function generateLegalPDF(draft) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert("jsPDF library loading. Please verify internet connection.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const formData = draft.formData || {};
    const docType = draft.docType || 'will';
    const docId = draft.id || ('DOC-' + Math.floor(Math.random() * 899999 + 100000));

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = 20;

    // Double Borders
    doc.setDrawColor(15, 23, 42); doc.setLineWidth(1.2); doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
    doc.setDrawColor(212, 175, 55); doc.setLineWidth(0.4); doc.rect(11, 11, pageWidth - 22, pageHeight - 22);

    // Seal Crest
    doc.setFillColor(212, 175, 55); doc.circle(pageWidth / 2, yPos, 6, 'F');
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(11, 19, 43);
    doc.text("L", pageWidth / 2, yPos + 3.5, { align: 'center' });

    yPos += 14;
    doc.setFont("times", "bold"); doc.setFontSize(18); doc.setTextColor(15, 23, 42);
    let docTitle = "LAST WILL AND TESTAMENT";
    if (docType === 'poa') docTitle = "GENERAL DURABLE POWER OF ATTORNEY";
    if (docType === 'affidavit') docTitle = "GENERAL SWORN AFFIDAVIT";
    doc.text(docTitle, pageWidth / 2, yPos, { align: 'center' });

    yPos += 6;
    doc.setDrawColor(212, 175, 55); doc.setLineWidth(0.8);
    doc.line(pageWidth / 2 - 45, yPos, pageWidth / 2 + 45, yPos);

    yPos += 12;
    doc.setFont("times", "normal"); doc.setFontSize(11); doc.setTextColor(30, 41, 59);

    const fullName = (formData.fullName || '__________________________').toUpperCase();
    const address = formData.address || '__________________________________________________';

    const introText = `I, ${fullName}, residing at ${address}, being of sound mind, do hereby execute and declare this instrument to be my official ${docTitle}.`;
    const splitIntro = doc.splitTextToSize(introText, contentWidth);
    doc.text(splitIntro, margin, yPos);
    yPos += splitIntro.length * 6 + 6;

    // Clauses
    doc.setFont("times", "bold"); doc.text("CLAUSE I: REVOCATION & REVOCABLE CLAUSES", margin, yPos);
    yPos += 6; doc.setFont("times", "normal");
    doc.text("I hereby revoke all prior wills, codicils, and powers of attorney made by me.", margin, yPos);
    yPos += 10;

    doc.setFont("times", "bold"); doc.text("CLAUSE II: APPOINTMENT OF EXECUTOR / AGENT", margin, yPos);
    yPos += 6; doc.setFont("times", "normal");
    const execText = `Primary Appointed Agent / Executor: ${formData.executorName || '[Appointed Name]'}. Successor: ${formData.altExecutorName || '[Alternate Name]'}.`;
    doc.text(doc.splitTextToSize(execText, contentWidth), margin, yPos);
    yPos += 12;

    doc.setFont("times", "bold"); doc.text("CLAUSE III: ASSET DISTRIBUTION & BENEFICIARIES", margin, yPos);
    yPos += 6; doc.setFont("times", "normal");
    const assetText = `Real Property: ${formData.realEstateAssets || 'Declared Assets'}\nBeneficiary Allocations: ${formData.primaryBeneficiaries || 'Primary Share Allocations'}`;
    doc.text(doc.splitTextToSize(assetText, contentWidth), margin, yPos);
    yPos += 18;

    // Signatures
    doc.setFont("times", "bold"); doc.text("IN WITNESS WHEREOF, I HAVE HEREUNTO SET MY HAND THIS DAY.", margin, yPos);
    yPos += 14;
    const colW = contentWidth / 2 - 5;
    doc.line(margin, yPos, margin + colW, yPos);
    doc.text(`Testator / Affiant: ${fullName}`, margin, yPos + 5);

    doc.line(margin + colW + 10, yPos, pageWidth - margin, yPos);
    doc.text(`Primary Executor / Agent: ${formData.executorName || 'Executor'}`, margin + colW + 10, yPos + 5);

    yPos += 20;
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(100, 116, 139);
    doc.text(`LEXIWILL SYSTEM • ID: ${docId} • CONFIDENTIAL LEGAL DOCUMENT`, pageWidth / 2, pageHeight - 14, { align: 'center' });

    doc.save(`${docType.toUpperCase()}_${fullName.replace(/\s+/g, '_')}.pdf`);
  }

  // -------------------------------------------------------------
  // 5. NAVBAR & FOOTER RENDERERS
  // -------------------------------------------------------------
  function renderNavbar(currentHash = '#/') {
    const container = document.getElementById('navbar-container');
    if (!container) return;
    const user = getCurrentUser();
    const clean = currentHash.split('?')[0].replace('#/', '');

    const links = [
      { name: 'Home', hash: '#/' },
      { name: 'Home2', hash: '#/home2' },
      { name: 'About', hash: '#/about' },
      { name: 'Services', hash: '#/services' },
      { name: 'Blogs', hash: '#/blogs' },
      { name: 'Contact', hash: '#/contact' }
    ];

    container.innerHTML = `
      <nav class="bg-navy-900/95 backdrop-blur-md border-b border-gold-500/20 px-4 lg:px-8 py-3.5">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#/" class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-gold-500 flex items-center justify-center text-navy-950 font-bold shadow-lg">
              <i data-lucide="scale" class="w-5 h-5"></i>
            </div>
            <span class="font-serif text-xl font-bold text-slate-100">Lexi<span class="text-gold-400">Will</span></span>
          </a>

          <div class="hidden md:flex items-center gap-6">
            ${links.map(l => `<a href="${l.hash}" class="text-sm font-semibold ${currentHash === l.hash || (l.hash === '#/' && clean === '') ? 'text-gold-400 border-b-2 border-gold-500 pb-1' : 'text-slate-300 hover:text-gold-300'}">${l.name}</a>`).join('')}
          </div>

          <div class="flex items-center gap-3">
            ${user ? `
              <a href="#/dashboard" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-850 border border-gold-500/30 text-slate-200">
                <div class="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold text-xs">${user.name.charAt(0)}</div>
                <span class="text-xs font-semibold hidden sm:inline">${user.name}</span>
              </a>
              <button id="nav-logout-btn" class="p-1.5 text-rose-400 hover:text-rose-300"><i data-lucide="log-out" class="w-4 h-4"></i></button>
            ` : `
              <a href="#/login" class="text-xs font-semibold text-slate-200 hover:text-gold-400 px-3 py-2">Sign In</a>
              <a href="#/wizard/will" class="btn-gold text-xs px-4 py-2">Get Started</a>
            `}
          </div>
        </div>
      </nav>
    `;

    container.querySelector('#nav-logout-btn')?.addEventListener('click', () => {
      logoutUser(); showToast('Logged out'); window.location.hash = '#/login';
    });
    if (window.lucide) window.lucide.createIcons();
  }

  function renderFooter() {
    const container = document.getElementById('footer-container');
    if (!container) return;
    container.innerHTML = `
      <footer class="bg-navy-900 border-t border-gold-500/20 text-slate-400 pt-12 pb-8 px-4 lg:px-8 mt-16 text-xs">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="font-serif font-bold text-slate-200 text-base">Lexi<span class="text-gold-400">Will</span> Legal Systems</span>
          </div>
          <p>&copy; ${new Date().getFullYear()} LexiWill. All rights reserved. Self-service legal document software platform.</p>
        </div>
      </footer>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  // -------------------------------------------------------------
  // 6. PAGE RENDERERS
  // -------------------------------------------------------------
  function renderHome() {
    const div = document.createElement('div');
    div.className = 'space-y-16 pb-12';
    div.innerHTML = `
      <section class="navy-hero-gradient pt-16 pb-20 px-4 lg:px-8 border-b border-gold-500/20 text-center">
        <div class="max-w-4xl mx-auto space-y-6">
          <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30 text-xs font-bold">
            <i data-lucide="sparkles" class="w-4 h-4"></i> Trusted Legal Tech Platform
          </span>
          <h1 class="font-serif text-4xl sm:text-6xl font-extrabold text-slate-100">
            Protect Your Legacy & Family With <span class="gold-gradient-text">Legally Sound</span> Online Wills
          </h1>
          <p class="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            Prepare Last Will & Testaments, Power of Attorney, and Sworn Affidavits in minutes. Auto-saved drafts and instant legal PDF generation.
          </p>
          <div class="flex flex-wrap justify-center gap-4 pt-4">
            <a href="#/wizard/will" class="btn-gold text-sm px-6 py-3.5 shadow-xl"><i data-lucide="file-text" class="w-5 h-5"></i> Create Your Will Now</a>
            <a href="#/home2" class="btn-navy text-sm px-6 py-3.5"><i data-lucide="calculator" class="w-5 h-5"></i> Savings Calculator</a>
          </div>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="glass-card p-8 space-y-4">
            <h3 class="font-serif text-xl font-bold text-slate-100">Last Will & Testament</h3>
            <p class="text-slate-400 text-xs">Appoint executors, nominate minor guardians, and allocate assets.</p>
            <a href="#/wizard/will" class="btn-gold w-full text-xs py-2.5">Start Last Will</a>
          </div>
          <div class="glass-card p-8 space-y-4">
            <h3 class="font-serif text-xl font-bold text-slate-100">Power of Attorney</h3>
            <p class="text-slate-400 text-xs">Authorize financial and medical decision agents.</p>
            <a href="#/wizard/poa" class="btn-gold w-full text-xs py-2.5">Start Power of Attorney</a>
          </div>
          <div class="glass-card p-8 space-y-4">
            <h3 class="font-serif text-xl font-bold text-slate-100">Sworn Affidavit</h3>
            <p class="text-slate-400 text-xs">Sworn statements of fact under oath with notary blocks.</p>
            <a href="#/wizard/affidavit" class="btn-gold w-full text-xs py-2.5">Start Sworn Affidavit</a>
          </div>
        </div>
      </section>
    `;
    return div;
  }

  function renderHome2() {
    const div = document.createElement('div');
    div.className = 'max-w-5xl mx-auto px-4 py-12 space-y-8';
    div.innerHTML = `
      <div class="text-center space-y-3">
        <h1 class="font-serif text-3xl font-extrabold text-slate-100">Interactive Legal Savings Calculator</h1>
        <p class="text-slate-400 text-sm">Calculate your savings vs. traditional attorney rates.</p>
      </div>
      <div class="glass-card p-8 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-4">
            <label class="form-label">Attorney Hourly Rate ($)</label>
            <input type="range" id="rate-range" min="200" max="600" value="350" class="w-full accent-gold-500">
            <p class="text-xs text-gold-400 font-bold" id="rate-disp">$350 / hr</p>
          </div>
          <div class="bg-navy-950 p-6 rounded-xl border border-slate-800 space-y-4">
            <p class="text-xs text-slate-400">Estimated Attorney Cost: <strong id="att-cost" class="text-rose-400 text-base">$1,400</strong></p>
            <p class="text-xs text-slate-400">LexiWill Self-Service Fee: <strong class="text-emerald-400 text-base">$0 (Free Demo)</strong></p>
            <p class="text-sm font-bold text-gold-400 pt-2 border-t border-slate-800">Your Net Savings: <span id="sav-disp" class="text-xl">$1,400</span></p>
          </div>
        </div>
      </div>
    `;
    setTimeout(() => {
      const range = div.querySelector('#rate-range');
      range?.addEventListener('input', () => {
        const val = range.value;
        div.querySelector('#rate-disp').textContent = `$${val} / hr`;
        div.querySelector('#att-cost').textContent = `$${val * 4}`;
        div.querySelector('#sav-disp').textContent = `$${val * 4}`;
      });
    }, 50);
    return div;
  }

  function renderAbout() {
    const div = document.createElement('div');
    div.className = 'max-w-4xl mx-auto px-4 py-12 space-y-6';
    div.innerHTML = `
      <div class="text-center space-y-3">
        <h1 class="font-serif text-3xl font-bold text-slate-100">About LexiWill Platform</h1>
        <p class="text-slate-400 text-sm">Empowering individuals with self-service legal document software.</p>
      </div>
      <div class="glass-card p-8 text-slate-300 text-sm space-y-4">
        <p>LexiWill provides self-guided legal document software. We are not a law firm and do not provide legal advice.</p>
      </div>
    `;
    return div;
  }

  function renderServices() {
    const div = document.createElement('div');
    div.className = 'max-w-4xl mx-auto px-4 py-12 space-y-6';
    div.innerHTML = `
      <div class="text-center space-y-3">
        <h1 class="font-serif text-3xl font-bold text-slate-100">Legal Document Products</h1>
        <p class="text-slate-400 text-sm">Last Will & Testament, Power of Attorney, Sworn Affidavits.</p>
      </div>
    `;
    return div;
  }

  function renderBlogs() {
    const div = document.createElement('div');
    div.className = 'max-w-5xl mx-auto px-4 py-12 space-y-6';
    const blogs = getBlogs();
    div.innerHTML = `
      <h1 class="font-serif text-3xl font-bold text-slate-100 text-center">Legal Knowledge Hub</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        ${blogs.map(b => `
          <div class="glass-card p-6 space-y-3">
            <span class="text-xs text-gold-400 font-bold">${b.category}</span>
            <h3 class="font-serif font-bold text-slate-100">${b.title}</h3>
            <p class="text-xs text-slate-400">${b.excerpt}</p>
          </div>
        `).join('')}
      </div>
    `;
    return div;
  }

  function renderContact() {
    const div = document.createElement('div');
    div.className = 'max-w-xl mx-auto px-4 py-12 space-y-6';
    div.innerHTML = `
      <div class="glass-card p-8 space-y-4">
        <h1 class="font-serif text-2xl font-bold text-slate-100">Contact Support</h1>
        <form id="cnt-form" class="space-y-4">
          <input type="text" placeholder="Full Name" required class="form-input">
          <input type="email" placeholder="Email Address" required class="form-input">
          <textarea rows="4" placeholder="Your Message" required class="form-input"></textarea>
          <button type="submit" class="btn-gold w-full text-xs py-3">Send Message</button>
        </form>
      </div>
    `;
    setTimeout(() => {
      div.querySelector('#cnt-form')?.addEventListener('submit', (e) => {
        e.preventDefault(); showToast('Message transmitted!');
      });
    }, 50);
    return div;
  }

  function renderAuth() {
    const div = document.createElement('div');
    div.className = 'max-w-md mx-auto px-4 py-12 space-y-6';
    div.innerHTML = `
      <div class="text-center space-y-2">
        <h1 class="font-serif text-3xl font-bold text-slate-100">Sign In to LexiWill</h1>
        <p class="text-xs text-slate-400">Click a demo toggle below for instant access:</p>
      </div>
      <div class="glass-card p-6 border-gold-500/30 space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <button id="demo-user-btn" class="btn-gold text-xs py-2.5">Client User Demo</button>
          <button id="demo-admin-btn" class="btn-navy text-xs py-2.5 border-amber-500/40 text-amber-300">Admin User Demo</button>
        </div>
        <form id="lgn-form" class="space-y-4 pt-2 border-t border-slate-800">
          <input type="email" id="lgn-email" required placeholder="user@legaldoc.com" value="user@legaldoc.com" class="form-input">
          <button type="submit" class="btn-gold w-full text-xs py-3">Sign In</button>
        </form>
      </div>
    `;
    setTimeout(() => {
      div.querySelector('#demo-user-btn')?.addEventListener('click', () => {
        loginUser('user@legaldoc.com', 'client'); showToast('Logged in as Client'); window.location.hash = '#/dashboard';
      });
      div.querySelector('#demo-admin-btn')?.addEventListener('click', () => {
        loginUser('admin@legaldoc.com', 'admin'); showToast('Logged in as Admin'); window.location.hash = '#/admin';
      });
      div.querySelector('#lgn-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const em = div.querySelector('#lgn-email').value;
        const role = em.includes('admin') ? 'admin' : 'client';
        loginUser(em, role); showToast(`Logged in as ${em}`); window.location.hash = role === 'admin' ? '#/admin' : '#/dashboard';
      });
    }, 50);
    return div;
  }

  function renderDashboard() {
    const div = document.createElement('div');
    div.className = 'max-w-6xl mx-auto px-4 py-10 space-y-8';
    const user = getCurrentUser() || { name: 'Client User', id: 'user_1' };
    const drafts = getDraftsByUser(user.id);
    div.innerHTML = `
      <div class="glass-card p-8 border-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 class="font-serif text-2xl font-bold text-slate-100">Welcome, ${user.name}</h1>
          <p class="text-xs text-slate-400">User Dashboard & Active Drafts</p>
        </div>
        <a href="#/wizard/will" class="btn-gold text-xs px-4 py-2 font-bold">+ Start New Document</a>
      </div>
      <div class="glass-card p-6 space-y-4">
        <h3 class="font-serif font-bold text-slate-100">Your Active Legal Drafts</h3>
        <div class="space-y-3">
          ${drafts.map(d => `
            <div class="bg-navy-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <p class="font-bold text-slate-100">${d.title}</p>
                <p class="text-slate-400">Type: ${d.docType.toUpperCase()} • Step ${d.currentStep} of 9</p>
              </div>
              <div class="flex items-center gap-2">
                <a href="#/wizard/${d.docType}?draftId=${d.id}" class="btn-navy text-[11px] px-3 py-1.5">Continue</a>
                <button data-pdf-id="${d.id}" class="btn-gold text-[11px] px-3 py-1.5">PDF</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    setTimeout(() => {
      div.querySelectorAll('[data-pdf-id]').forEach(b => {
        b.addEventListener('click', () => {
          const id = b.getAttribute('data-pdf-id');
          const draft = getDraftById(id);
          if (draft) { generateLegalPDF(draft); showToast('PDF Downloaded'); }
        });
      });
    }, 50);
    return div;
  }

  function renderDocumentWizard(docType = 'will', draftId = null) {
    const div = document.createElement('div');
    div.className = 'max-w-6xl mx-auto px-4 py-8 space-y-6';
    const user = getCurrentUser() || { id: 'user_1', name: 'Eleanor Vance' };
    let draft = draftId ? getDraftById(draftId) : null;
    if (!draft) {
      draft = {
        id: 'draft-' + Date.now(), userId: user.id, docType: docType, title: `${docType.toUpperCase()} — ${user.name}`,
        currentStep: 1, totalSteps: 9, status: 'Draft', formData: { fullName: user.name, address: '742 Evergreen Terrace, Springfield, IL', executorName: 'Arthur Vance' }
      };
    }
    saveDraft(draft);

    div.innerHTML = `
      <div class="flex justify-between items-center border-b border-slate-800 pb-4">
        <h1 class="font-serif text-2xl font-bold text-slate-100">${docType.toUpperCase()} Document Wizard</h1>
        <button id="wiz-exit" class="btn-navy text-xs px-4 py-2">Save & Exit</button>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-6 glass-card p-6 space-y-4">
          <p class="text-xs text-gold-400 font-bold">Step ${draft.currentStep} of 9</p>
          <div class="space-y-3">
            <label class="form-label">Full Legal Name</label>
            <input type="text" id="wiz-name" value="${draft.formData.fullName || ''}" class="form-input">
            <label class="form-label">Residential Address</label>
            <input type="text" id="wiz-addr" value="${draft.formData.address || ''}" class="form-input">
            <label class="form-label">Primary Executor / Agent Name</label>
            <input type="text" id="wiz-exec" value="${draft.formData.executorName || ''}" class="form-input">
          </div>
          <div class="flex justify-between pt-4 border-t border-slate-800">
            <button id="wiz-pdf" class="btn-gold text-xs px-5 py-2">Download Legal PDF</button>
          </div>
        </div>
        <div class="lg:col-span-6">
          <div class="legal-document-preview text-xs leading-relaxed space-y-3 text-slate-900">
            <h3 class="legal-header-title">${docType.toUpperCase()} PREVIEW</h3>
            <p><strong>DECLARATION:</strong> I, <u id="prev-name">${draft.formData.fullName}</u>, residing at <u id="prev-addr">${draft.formData.address}</u>, declare this instrument.</p>
            <p><strong>CLAUSE I:</strong> Appointed Executor: <u id="prev-exec">${draft.formData.executorName}</u>.</p>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const nameIn = div.querySelector('#wiz-name');
      const addrIn = div.querySelector('#wiz-addr');
      const execIn = div.querySelector('#wiz-exec');

      function update() {
        draft.formData.fullName = nameIn.value;
        draft.formData.address = addrIn.value;
        draft.formData.executorName = execIn.value;
        saveDraft(draft);
        div.querySelector('#prev-name').textContent = nameIn.value;
        div.querySelector('#prev-addr').textContent = addrIn.value;
        div.querySelector('#prev-exec').textContent = execIn.value;
      }

      nameIn?.addEventListener('input', update);
      addrIn?.addEventListener('input', update);
      execIn?.addEventListener('input', update);

      div.querySelector('#wiz-exit')?.addEventListener('click', () => { window.location.hash = '#/dashboard'; });
      div.querySelector('#wiz-pdf')?.addEventListener('click', () => { generateLegalPDF(draft); showToast('PDF Exported'); });
    }, 50);

    return div;
  }

  function renderAdmin() {
    const div = document.createElement('div');
    div.className = 'max-w-6xl mx-auto px-4 py-10 space-y-6';
    const users = getAllUsers();
    div.innerHTML = `
      <div class="glass-card p-6 border-amber-500/30">
        <h1 class="font-serif text-2xl font-bold text-slate-100">Admin Control Panel</h1>
        <p class="text-xs text-amber-300 font-semibold">User Role Management & Document Repository</p>
      </div>
      <div class="glass-card p-6 space-y-4">
        <h3 class="font-serif font-bold text-slate-100">Registered Users (${users.length})</h3>
        <div class="space-y-2">
          ${users.map(u => `
            <div class="p-3 bg-navy-950 rounded-lg flex justify-between items-center text-xs">
              <span><strong>${u.name}</strong> (${u.email}) — Role: ${u.role.toUpperCase()}</span>
              <button data-role-id="${u.id}" class="btn-navy text-[10px] px-2 py-1">Toggle Role</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    setTimeout(() => {
      div.querySelectorAll('[data-role-id]').forEach(b => {
        b.addEventListener('click', () => {
          const id = b.getAttribute('data-role-id');
          const u = users.find(x => x.id === id);
          if (u) { updateUserRole(id, u.role === 'admin' ? 'client' : 'admin'); showToast('Role Updated'); window.location.reload(); }
        });
      });
    }, 50);
    return div;
  }

  function renderPrivacy() {
    const div = document.createElement('div');
    div.className = 'max-w-4xl mx-auto px-4 py-12 space-y-6';
    div.innerHTML = `
      <div class="text-center space-y-3">
        <h1 class="font-serif text-3xl font-bold text-slate-100">Privacy Policy & Terms</h1>
      </div>
      <div class="glass-card p-8 text-slate-300 text-sm space-y-4">
        <h3 class="font-serif text-lg font-bold text-gold-400">Data Storage & Confidentiality</h3>
        <p>All legal document drafts are saved to browser local storage. We do not sell or monetize personal legal records.</p>
      </div>
    `;
    return div;
  }

  // -------------------------------------------------------------
  // 7. ROUTER INITIALIZATION
  // -------------------------------------------------------------
  function handleRoute() {
    initStorage();
    const hash = window.location.hash || '#/';
    const appContent = document.getElementById('app-content');
    if (!appContent) return;

    appContent.innerHTML = '';
    window.scrollTo(0, 0);

    renderNavbar(hash);
    renderFooter();

    const cleanHash = hash.split('?')[0];
    const searchParams = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');

    if (cleanHash === '#/' || cleanHash === '') {
      appContent.appendChild(renderHome());
    } else if (cleanHash === '#/home2') {
      appContent.appendChild(renderHome2());
    } else if (cleanHash === '#/about') {
      appContent.appendChild(renderAbout());
    } else if (cleanHash === '#/services') {
      appContent.appendChild(renderServices());
    } else if (cleanHash === '#/blogs') {
      appContent.appendChild(renderBlogs());
    } else if (cleanHash === '#/contact') {
      appContent.appendChild(renderContact());
    } else if (cleanHash === '#/login') {
      appContent.appendChild(renderAuth());
    } else if (cleanHash === '#/privacy') {
      appContent.appendChild(renderPrivacy());
    } else if (cleanHash === '#/dashboard') {
      appContent.appendChild(renderDashboard());
    } else if (cleanHash.startsWith('#/wizard')) {
      const docType = cleanHash.replace('#/wizard/', '').replace('#/wizard', '') || 'will';
      const draftId = searchParams.get('draftId');
      appContent.appendChild(renderDocumentWizard(docType, draftId));
    } else if (cleanHash === '#/admin') {
      appContent.appendChild(renderAdminDashboard());
    } else {
      window.location.href = '404.html';
    }

    if (window.lucide) window.lucide.createIcons();
  }

  window.addEventListener('hashchange', handleRoute);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleRoute);
  } else {
    handleRoute();
  }
})();
