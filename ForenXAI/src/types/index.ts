// Core Types for ForenXAI

export interface Transaction {
  id: string;
  amount: number;
  location: string;
  timestamp: string;
  merchant: string;
  category: string;
  riskScore: number;
  anomalyFactors: string[];
  explanationWeights: { [key: string]: number };
  status: 'pending' | 'safe' | 'investigating' | 'flagged';
  userId: string;
}

export interface BehavioralProfile {
  userId: string;
  avgAmount: number;
  commonLocations: string[];
  commonMerchants: string[];
  typicalTimeRanges: string[];
  spendingPattern: {
    category: string;
    avgAmount: number;
    frequency: number;
  }[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  monthlyIncome: number;
  monthlyBudget: number;
  preferredCategories: string[];
  isSetupComplete: boolean;
}

export interface InvestigationCase {
  id: string;
  title: string;
  transactions: Transaction[];
  notes: string[];
  createdAt: string;
  status: 'open' | 'closed';
  assignedTo: string;
}

export interface AuditLog {
  id: string;
  action: string;
  transactionId: string;
  userId: string;
  timestamp: string;
  decision: string;
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'account' | 'merchant';
  riskLevel: number;
}

export interface NetworkEdge {
  source: string;
  target: string;
  amount: number;
  timestamp: string;
}
