/* LexDraft — Admin Demo Metrics & Chart Configuration Data (adminDemo.js) */

export const adminMetrics = {
  totalUsers: 142,
  totalDocuments: 289,
  completedDocs: 198,
  draftDocs: 91,
  monthlyGrowthPct: 18.5,
  recentUsers: [
    { name: "Eleanor Vance", email: "user@legaldoc.com", role: "client", status: "Active", joined: "2026-09-01" },
    { name: "Marcus Vance", email: "admin@legaldoc.com", role: "admin", status: "Active", joined: "2025-11-01" },
    { name: "Robert Sterling", email: "robert@sterling.com", role: "client", status: "Active", joined: "2026-08-15" },
    { name: "Evelyn Martinez", email: "dr.martinez@med.org", role: "client", status: "Active", joined: "2026-08-10" }
  ],
  chartData: {
    monthlyLabels: ["May", "Jun", "Jul", "Aug", "Sep"],
    documentsCreated: [32, 45, 68, 84, 112],
    docTypeDistribution: {
      labels: ["Last Will & Testament", "Power of Attorney", "Sworn Affidavit"],
      counts: [142, 98, 49]
    }
  }
};

if (typeof window !== 'undefined') window.adminMetrics = adminMetrics;
