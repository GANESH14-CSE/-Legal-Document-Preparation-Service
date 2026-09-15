/* LexDraft — LocalStorage Data Management API (storage.js) */

const STORAGE_KEY = "lexdraft_app_v1";

const INITIAL_STATE = {
  session: {
    loggedIn: true,
    role: "user",
    email: "user@legaldoc.com",
    name: "Eleanor Vance"
  },
  documents: [
    {
      id: "doc_will_001",
      type: "will",
      status: "draft",
      progress: 45,
      currentStep: 4,
      createdAt: "2026-09-01T10:00:00Z",
      updatedAt: "2026-09-12T14:22:00Z",
      title: "Last Will and Testament — Eleanor Vance",
      formData: {
        personal: { fullName: "Eleanor Vance", dob: "1984-06-22", address: "742 Evergreen Terrace, Springfield, IL", civilStatus: "married" },
        family: { spouseName: "Arthur Vance", hasChildren: "yes", childrenDetails: "Oliver Vance (Son, Age 12), Sophia Vance (Daughter, Age 8)" },
        assets: { realEstate: "Primary Residence at 742 Evergreen Terrace; Family Cottage", bankAccounts: "First National Savings Account #4092" },
        beneficiaries: { primary: "Arthur Vance (Spouse, 100%)", contingent: "Oliver Vance (50%) & Sophia Vance (50%) in trust" },
        executor: { primaryName: "Arthur Vance", altName: "Julian Vance (Brother)", guardianName: "Martha Sterling (Sister)" },
        directives: { funeralWishes: "Private family memorial gathering; donations to Legal Aid Society." }
      }
    },
    {
      id: "doc_poa_002",
      type: "poa",
      status: "completed",
      progress: 100,
      currentStep: 9,
      createdAt: "2026-08-20T09:15:00Z",
      updatedAt: "2026-08-22T11:00:00Z",
      title: "General Durable Power of Attorney — Eleanor Vance",
      formData: {
        personal: { fullName: "Eleanor Vance", address: "742 Evergreen Terrace, Springfield, IL" },
        executor: { primaryName: "Arthur Vance", altName: "Julian Vance" }
      }
    }
  ],
  templates: {
    will: { title: "Last Will & Testament", revocationClause: "I hereby revoke all former Wills and Codicils made by me." },
    poa: { title: "General Durable Power of Attorney", revocationClause: "I hereby revoke any prior powers of attorney granted by me." },
    affidavit: { title: "General Sworn Affidavit", oathClause: "I solemnly swear under penalty of perjury that the facts stated herein are true." }
  }
};

function getStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STATE));
    return INITIAL_STATE;
  }
  return JSON.parse(data);
}

function setStorage(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const StorageAPI = {
  getAuth: () => getStorage().session,
  login: (email, role = "user") => {
    const state = getStorage();
    state.session = {
      loggedIn: true,
      role: role,
      email: email,
      name: email.split('@')[0].toUpperCase()
    };
    setStorage(state);
    return state.session;
  },
  logout: () => {
    const state = getStorage();
    state.session = { loggedIn: false, role: null, email: null, name: null };
    setStorage(state);
  },

  getDocuments: () => getStorage().documents || [],
  getDocument: (id) => getStorage().documents.find(d => d.id === id),
  
  saveDraft: (docData) => {
    const state = getStorage();
    const idx = state.documents.findIndex(d => d.id === docData.id);
    const updatedDoc = {
      ...docData,
      updatedAt: new Date().toISOString()
    };
    if (idx >= 0) {
      state.documents[idx] = updatedDoc;
    } else {
      state.documents.push(updatedDoc);
    }
    setStorage(state);
    return updatedDoc;
  },

  markCompleted: (id) => {
    const state = getStorage();
    const doc = state.documents.find(d => d.id === id);
    if (doc) {
      doc.status = "completed";
      doc.progress = 100;
      doc.updatedAt = new Date().toISOString();
      setStorage(state);
    }
  },

  deleteDocument: (id) => {
    const state = getStorage();
    state.documents = state.documents.filter(d => d.id !== id);
    setStorage(state);
  },

  getTemplates: () => getStorage().templates || INITIAL_STATE.templates,
  saveTemplates: (templates) => {
    const state = getStorage();
    state.templates = templates;
    setStorage(state);
  }
};

// Also expose globally on window for non-module scripts
if (typeof window !== 'undefined') {
  window.StorageAPI = StorageAPI;
}
