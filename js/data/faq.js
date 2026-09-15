/* LexDraft — FAQ Data (faq.js) */

export const faqItems = [
  {
    q: "Is a document created on LexDraft legally binding?",
    a: "Documents generated on LexDraft conform to standard legal statutory requirements. To become fully legally binding, you must print the PDF document and sign it in the presence of required disinterested witnesses and a Notary Public as mandated by your jurisdiction."
  },
  {
    q: "Can I edit my document after downloading?",
    a: "Yes! All wizard progress is auto-saved in your account dashboard. You can return at any time, update details, and re-generate a new PDF document."
  },
  {
    q: "Is my personal legal information kept private?",
    a: "Your data is saved directly in your local browser storage (`localStorage`) or secure session stores. We do not sell or share personal legal records with third parties."
  },
  {
    q: "What happens if I leave mid-wizard?",
    a: "Your progress is automatically debounced and saved. Reopening the wizard or clicking 'Continue Draft' on your Dashboard restores your exact step and inputs."
  },
  {
    q: "Do I need a lawyer to use this software?",
    a: "LexDraft is an automated legal self-service document platform. For straightforward estate needs, our guided wizard provides structured templates. For complex trusts or contested estates, we advise consulting a licensed attorney."
  },
  {
    q: "How long does it take to complete a document?",
    a: "Most users complete a Last Will, Power of Attorney, or Affidavit in 10 to 15 minutes."
  }
];

if (typeof window !== 'undefined') window.faqItems = faqItems;
