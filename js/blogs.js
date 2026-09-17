/* LexDraft — Blogs Filter & Detail Engine (blogs.js) */

import { blogPosts } from './data/blogPosts.js';

document.addEventListener('DOMContentLoaded', () => {
  initBlogsPage();
  initBlogDetailPage();
});

function initBlogsPage() {
  const gridContainer = document.getElementById('blogs-grid-container');
  const searchInput = document.getElementById('blog-search-input');
  const categoryContainer = document.getElementById('blog-category-pills');

  if (!gridContainer) return;

  let activeCategory = 'ALL';
  let searchTerm = '';

  function renderGrid() {
    const filtered = blogPosts.filter(post => {
      const matchCat = activeCategory === 'ALL' || post.category === activeCategory;
      const matchSearch = post.title.toLowerCase().includes(searchTerm) ||
                          post.excerpt.toLowerCase().includes(searchTerm) ||
                          post.category.toLowerCase().includes(searchTerm);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 0; color: var(--muted);">
          <h3>No articles found matching your search query</h3>
          <p style="font-size: 14px; margin-top: 8px;">Try searching for alternative legal terms like "Wills", "POA", or "Affidavit".</p>
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = filtered.map(post => `
      <div class="card card-hover" style="display: flex; flex-direction: column; justify-content: space-between; background-color: var(--white);">
        <div class="space-y-3">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="badge" style="background-color: rgba(200, 164, 93, 0.15); color: var(--navy); font-weight: 700;">${post.category}</span>
            <span style="font-size: 12px; color: var(--muted); font-weight: 500;">${post.readingTime}</span>
          </div>

          <h3 style="font-size: 18px; font-weight: 700; line-height: 1.35;">
            <a href="blog-detail.html?slug=${post.slug}" style="color: var(--navy); text-decoration: none;">${post.title}</a>
          </h3>

          <p style="font-size: 14px; color: var(--muted); line-height: 1.6;">
            ${post.excerpt}
          </p>
        </div>

        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; font-size: 13px;">
          <span style="color: var(--navy); font-weight: 600;">${post.author}</span>
          <a href="blog-detail.html?slug=${post.slug}" class="btn btn-ghost btn-sm" style="color: var(--gold); padding: 0; font-weight: 700;">
            Read Article →
          </a>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  renderGrid();

  searchInput?.addEventListener('keyup', (e) => {
    searchTerm = e.target.value.toLowerCase().trim();
    renderGrid();
  });

  if (categoryContainer) {
    categoryContainer.querySelectorAll('.btn-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        categoryContainer.querySelectorAll('.btn-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCategory = pill.getAttribute('data-category');
        renderGrid();
      });
    });
  }
}

function initBlogDetailPage() {
  const detailContainer = document.getElementById('blog-detail-container');
  if (!detailContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug') || 'what-is-a-will';

  const post = blogPosts.find(p => p.slug === slug) || blogPosts[0];

  // Related posts (same category or general)
  let related = blogPosts.filter(p => p.slug !== post.slug);
  const sameCat = related.filter(p => p.category === post.category);
  if (sameCat.length >= 3) {
    related = sameCat.slice(0, 3);
  } else {
    related = related.slice(0, 3);
  }

  detailContainer.innerHTML = `
    <!-- Top Breadcrumb & Action Row -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
      <a href="blogs.html" class="btn btn-outline btn-sm" style="gap: 6px;">
        ← Back to Knowledge Hub
      </a>

      <div style="display: flex; gap: 8px;">
        <button id="copy-article-link-btn" class="btn btn-outline btn-sm" title="Share Article">
          <i data-lucide="share-2" style="width: 14px; height: 14px;"></i> Share
        </button>
        <button onclick="window.print()" class="btn btn-outline btn-sm" title="Print Article">
          <i data-lucide="printer" style="width: 14px; height: 14px;"></i> Print
        </button>
      </div>
    </div>

    <!-- Article Header Card -->
    <div class="card space-y-4" style="background-color: var(--white); border: 1px solid var(--border); padding: 32px; margin-bottom: 24px;">
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <span class="badge" style="background-color: rgba(200, 164, 93, 0.15); color: var(--navy); font-weight: 700; font-size: 12px;">${post.category}</span>
        <span style="font-size: 13px; color: var(--muted);">${post.readingTime}</span>
        <span style="font-size: 13px; color: var(--muted);">• Published ${post.date}</span>
      </div>

      <h1 class="hero-title" style="font-size: clamp(24px, 4vw, 34px); color: var(--navy); line-height: 1.25; margin: 8px 0;">
        ${post.title}
      </h1>

      <p style="font-size: 16px; color: var(--muted); line-height: 1.6;">
        ${post.excerpt}
      </p>

      <!-- Author Information Strip -->
      <div style="display: flex; align-items: center; gap: 12px; padding-top: 16px; border-top: 1px solid var(--border);">
        <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--navy); color: var(--gold); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px;">
          ${post.author.charAt(0)}
        </div>
        <div>
          <div style="font-size: 15px; font-weight: 700; color: var(--navy);">${post.author}</div>
          <div style="font-size: 12px; color: var(--muted);">${post.role || 'Legal Research Contributor'}</div>
        </div>
      </div>
    </div>

    <!-- Article Body Content Card -->
    <div class="card" style="background-color: var(--white); border: 1px solid var(--border); padding: 32px; margin-bottom: 32px; font-size: 15px; line-height: 1.75; color: var(--navy);">
      ${post.content}
    </div>

    <!-- Author Bio & Editorial Review Card -->
    <div class="card space-y-3" style="background-color: var(--ivory); border: 1px solid var(--border); padding: 24px; margin-bottom: 32px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <i data-lucide="shield-check" style="color: var(--gold); width: 22px; height: 22px;"></i>
        <h4 style="margin: 0; font-size: 16px; color: var(--navy);">Editorial Integrity & Legal Compliance Guarantee</h4>
      </div>
      <p style="font-size: 13.5px; color: var(--muted); line-height: 1.6; margin: 0;">
        This legal guide was drafted and reviewed by qualified legal analysts. Information presented is intended for educational self-help purposes. For complex multi-state trusts or litigation, consider consulting a licensed legal professional.
      </p>
    </div>

    <!-- Call to Action Banner -->
    <div class="card space-y-4" style="background-color: var(--navy); color: var(--white); text-align: center; padding: 36px; margin-bottom: 48px;">
      <h3 style="color: var(--white); font-size: 24px; font-weight: 700; margin: 0;">Ready to Prepare Your Own Document?</h3>
      <p style="color: #94A3B8; max-width: 540px; margin: 0 auto; font-size: 15px;">
        Draft a legally structured Last Will, Financial Power of Attorney, or Sworn Affidavit online in under 15 minutes.
      </p>
      <div style="padding-top: 8px;">
        <a href="wizard/will.html" class="btn btn-gold btn-lg">Start Document Preparation Now →</a>
      </div>
    </div>

    <!-- Related Articles Section -->
    <div class="space-y-6">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-size: 22px; color: var(--navy); margin: 0;">Related Legal Guides</h3>
        <a href="blogs.html" style="font-size: 14px; font-weight: 600; color: var(--gold);">View All Articles →</a>
      </div>

      <div class="grid grid-3">
        ${related.map(rel => `
          <div class="card card-hover" style="display: flex; flex-direction: column; justify-content: space-between; background-color: var(--white);">
            <div class="space-y-3">
              <span class="badge" style="background-color: rgba(200, 164, 93, 0.15); color: var(--navy); font-size: 11px;">${rel.category}</span>
              <h4 style="font-size: 16px; font-weight: 700; margin: 0;">
                <a href="blog-detail.html?slug=${rel.slug}" style="color: var(--navy); text-decoration: none;">${rel.title}</a>
              </h4>
              <p style="font-size: 13px; color: var(--muted); line-height: 1.5;">
                ${rel.excerpt}
              </p>
            </div>
            <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border);">
              <a href="blog-detail.html?slug=${rel.slug}" class="btn btn-ghost btn-sm" style="color: var(--gold); padding: 0; font-size: 12px; font-weight: 700;">
                Read Guide →
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Copy share link action
  const copyBtn = document.getElementById('copy-article-link-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href);
      copyBtn.innerHTML = `<i data-lucide="check" style="width: 14px; height: 14px; color: var(--success);"></i> Link Copied!`;
      if (window.lucide) window.lucide.createIcons();
      setTimeout(() => {
        copyBtn.innerHTML = `<i data-lucide="share-2" style="width: 14px; height: 14px;"></i> Share`;
        if (window.lucide) window.lucide.createIcons();
      }, 3000);
    });
  }
}
