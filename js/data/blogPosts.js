/* LexDraft — Blog Articles Data (blogPosts.js) */

export const blogPosts = [
  {
    slug: "what-is-a-will",
    title: "What Is a Will? The Complete Beginner's Guide to Estate Planning",
    category: "Wills",
    excerpt: "Learn what a Last Will & Testament is, how it protects your family, and why every adult needs one regardless of net worth.",
    author: "Attorney Marcus Vance",
    date: "Sep 10, 2026",
    readingTime: "5 min read",
    featured: true,
    content: `
      <p>A Last Will and Testament is a legal document that communicates your final wishes regarding assets and dependents. Drafting a Will ensures your property is distributed according to your wishes rather than state intestacy laws.</p>
      <h3>Key Elements of a Valid Will</h3>
      <p>To be legally binding, a Will must clearly identify the testator, revoke prior instruments, nominate a personal executor, allocate assets to beneficiaries, and be signed in the presence of disinterested witnesses.</p>
      <h3>Why Minor Guardianship Designation Matters</h3>
      <p>If you have children under 18, a Will allows you to nominate legal guardians to care for them if both parents pass away unexpectedly.</p>
    `
  },
  {
    slug: "financial-vs-medical-poa",
    title: "Financial vs. Medical Power of Attorney: Key Differences Explained",
    category: "Power of Attorney",
    excerpt: "Understand the distinctions between financial management powers and healthcare directive choices during incapacity.",
    author: "Sarah Jenkins, Legal Analyst",
    date: "Sep 05, 2026",
    readingTime: "6 min read",
    featured: true,
    content: `
      <p>A Power of Attorney grants a trusted agent authority to act on your behalf if you become temporarily or permanently incapacitated.</p>
      <h3>Financial Power of Attorney</h3>
      <p>Allows your agent to manage bank accounts, pay bills, handle real estate, and make tax decisions.</p>
      <h3>Medical Power of Attorney</h3>
      <p>Authorizes your agent to consult doctors and enforce your end-of-life healthcare directives.</p>
    `
  },
  {
    slug: "sworn-affidavit-uses",
    title: "When and How to Use a Sworn Affidavit in Court & Legal Transactions",
    category: "Affidavits",
    excerpt: "Discover how written declarations under oath carry perjury penalties and accelerate legal verification.",
    author: "David Sterling, Esq.",
    date: "Aug 28, 2026",
    readingTime: "4 min read",
    featured: true,
    content: `
      <p>A Sworn Affidavit is a voluntary statement of facts affirmed under oath before a Notary Public.</p>
      <p>Common uses include address verification, financial disclosures, name change declarations, and lost property claims.</p>
    `
  },
  {
    slug: "executor-responsibilities",
    title: "What Does an Executor Do? A Step-by-Step Guide for Nominated Agents",
    category: "Wills",
    excerpt: "A breakdown of duties for estate personal representatives from probate filing to asset distribution.",
    author: "Attorney Marcus Vance",
    date: "Aug 15, 2026",
    readingTime: "7 min read",
    featured: false,
    content: `
      <p>An Executor oversees the administration of an estate during probate. Responsibilities include inventorying assets, paying valid creditor debts, and distributing remaining assets to beneficiaries.</p>
    `
  },
  {
    slug: "durable-power-of-attorney",
    title: "Why 'Durable' Status Is Essential in Power of Attorney Documents",
    category: "Power of Attorney",
    excerpt: "Standard POAs terminate upon incapacity — discover why Durable POAs stay active when needed most.",
    author: "Sarah Jenkins, Legal Analyst",
    date: "Aug 02, 2026",
    readingTime: "5 min read",
    featured: false,
    content: `
      <p>Adding a "Durable" clause ensures your agent retains authority even if you suffer severe illness or mental incapacity.</p>
    `
  },
  {
    slug: "common-estate-planning-mistakes",
    title: "7 Costly Estate Planning Mistakes to Avoid",
    category: "Estate Planning",
    excerpt: "Avoid failing to update beneficiary designations, neglecting minor guardianships, and improper witness signatures.",
    author: "David Sterling, Esq.",
    date: "Jul 20, 2026",
    readingTime: "6 min read",
    featured: false,
    content: `
      <p>Common pitfalls include leaving assets to minor children directly without trusts, neglecting alternate executor choices, and failing to execute proper witness attestations.</p>
    `
  },
  {
    slug: "how-to-notarize-documents",
    title: "How Notarization Works for Online Legal Documents",
    category: "Affidavits",
    excerpt: "Learn what Notaries check, how self-proving affidavits function, and options for remote online notarization.",
    author: "Attorney Marcus Vance",
    date: "Jul 10, 2026",
    readingTime: "4 min read",
    featured: false,
    content: `
      <p>Notarization verifies affiant identity and confirms statements are made under oath without duress.</p>
    `
  },
  {
    slug: "protecting-digital-assets",
    title: "How to Include Digital Assets & Passwords in Your Will",
    category: "Estate Planning",
    excerpt: "Manage cryptocurrency, cloud storage, social media accounts, and digital heirlooms in modern estate planning.",
    author: "Sarah Jenkins, Legal Analyst",
    date: "Jun 25, 2026",
    readingTime: "5 min read",
    featured: false,
    content: `
      <p>Digital estate planning specifies how online accounts, digital currencies, and family photo repositories should be transferred or memorialized.</p>
    `
  }
];

if (typeof window !== 'undefined') window.blogPosts = blogPosts;
