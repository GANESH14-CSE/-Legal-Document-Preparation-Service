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
          <h3>No articles found matching your query</h3>
          <p style="font-size: 14px;">Try searching for alternative legal keywords or resetting category filters.</p>
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = filtered.map(post => `
      <div class="card card-hover" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div class="space-y-3">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="badge" style="background-color: rgba(200, 164, 93, 0.15); color: var(--navy);">${post.category}</span>
            <span style="font-size: 12px; color: var(--muted);">${post.readingTime}</span>
          </div>

          <h3 style="font-size: 18px; font-weight: 700;">
            <a href="blog-detail.html?slug=${post.slug}" style="color: var(--navy);">${post.title}</a>
          </h3>

          <p style="font-size: 14px; color: var(--muted); line-height: 1.6;">
            ${post.excerpt}
          </p>
        </div>

        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; font-size: 13px;">
          <span style="color: var(--muted); font-weight: 500;">${post.author}</span>
          <a href="blog-detail.html?slug=${post.slug}" class="btn btn-ghost btn-sm" style="color: var(--gold); padding: 0;">
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
  const slug = urlParams.get('slug');

  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    detailContainer.innerHTML = `
      <div class="card text-center" style="padding: 48px;">
        <h2>Article Not Found</h2>
        <p style="margin-bottom: 20px;">The requested legal guide could not be located.</p>
        <a href="blogs.html" class="btn btn-gold">Back to Knowledge Hub</a>
      </div>
    `;
    return;
  }

  // Related posts (same category)
  const related = blogPosts.filter(p => p.category === post.category && p.slug !== post.slug).slice(0, 3);

  detailContainer.innerHTML = `
    <div style="margin-bottom: 24px;">
      <a href="blogs.html" style="font-size: 14px; font-weight: 600; color: var(--muted);">← Back to Legal Guides</a>
    </div>

    <div class="card" style="margin-bottom: 32px;">
      <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
        <span class="badge" style="background-color: rgba(200, 164, 93, 0.15); color: var(--navy);">${post.category}</span>
        <span style="font-size: 13px; color: var(--muted);">${post.readingTime} • Published ${post.date}</span>
      </div>

      <h1 class="hero-title" style="font-size: 36px; margin-bottom: 16px;">${post.title}</h1>
      <p style="font-size: 14px; font-weight: 600; color: var(--navy);">By ${post.author}</p>
    </div>

    <div class="card" style="font-size: 16px; line-height: 1.8; color: var(--text); margin-bottom: 48px;">
      ${post.content}
    </div>

    <div class="card" style="background-color: var(--navy); color: var(--white); text-align: center; padding: 40px;">
      <h3 style="color: var(--white); font-size: 24px; margin-bottom: 12px;">Ready to Prepare Your Legal Document?</h3>
      <p style="color: #94A3B8; margin-bottom: 24px;">Create your binding document online in less than 15 minutes.</p>
      <a href="wizard/will.html" class="btn btn-gold">Start Your Will Now</a>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}
