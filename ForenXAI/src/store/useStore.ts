import { create } from 'zustand';
import { Transaction, InvestigationCase, AuditLog, UserProfile } from '../types';
import { mockTransactions } from '../data/mockData';

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  email: '',
  phone: '',
  city: '',
  monthlyIncome: 0,
  monthlyBudget: 0,
  preferredCategories: [],
  isSetupComplete: false,
};

interface AppState {
  transactions: Transaction[];
  cases: InvestigationCase[];
  auditLogs: AuditLog[];
  currentUser: string;
  userProfile: UserProfile;
  useDemoData: boolean;

  // Transaction actions
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (txn: Transaction) => void;
  updateTransaction: (txn: Transaction) => void;
  deleteTransaction: (id: string) => void;
  updateTransactionStatus: (id: string, status: Transaction['status']) => void;

  // Profile actions
  setUserProfile: (profile: UserProfile) => void;
  completeSetup: () => void;

  // Demo toggle
  setUseDemoData: (val: boolean) => void;

  // Case / audit actions
  addCase: (caseData: InvestigationCase) => void;
  addAuditLog: (log: AuditLog) => void;
  addNoteToCase: (caseId: string, note: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  transactions: mockTransactions,   // start with demo data
  cases: [],
  auditLogs: [],
  currentUser: 'user@forensai.com',
  userProfile: DEFAULT_PROFILE,
  useDemoData: true,

  setTransactions: (transactions) => set({ transactions }),

  addTransaction: (txn) =>
    set((state) => ({ transactions: [txn, ...state.transactions] })),

  updateTransaction: (txn) =>
    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === txn.id ? txn : t)),
    })),

  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),

  updateTransactionStatus: (id, status) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, status } : t
      ),
    })),

  setUserProfile: (profile) => set({ userProfile: profile }),

  completeSetup: () =>
    set((state) => ({
      userProfile: { ...state.userProfile, isSetupComplete: true },
      useDemoData: false,
      transactions: [],   // clear demo data when user sets up their own profile
    })),

  setUseDemoData: (val) =>
    set({
      useDemoData: val,
      transactions: val ? mockTransactions : get().transactions,
    }),

  addCase: (caseData) =>
    set((state) => ({ cases: [...state.cases, caseData] })),

  addAuditLog: (log) =>
    set((state) => ({ auditLogs: [...state.auditLogs, log] })),

  addNoteToCase: (caseId, note) =>
    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === caseId ? { ...c, notes: [...c.notes, note] } : c
      ),
    })),
}));
