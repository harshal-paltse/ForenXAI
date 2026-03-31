import { Transaction, UserProfile } from '../types';

export const CATEGORIES = [
  'Groceries', 'Fuel', 'Dining', 'Electronics', 'Entertainment',
  'Healthcare', 'Travel', 'Shopping', 'Utilities', 'Education',
  'Luxury Goods', 'Transfer', 'Other',
];

// ─── Compute risk score + anomaly factors for a transaction ──────────────────
export function computeRisk(
  txn: Omit<Transaction, 'riskScore' | 'anomalyFactors' | 'explanationWeights' | 'status'>,
  allTxns: Transaction[],
  profile: UserProfile
): Pick<Transaction, 'riskScore' | 'anomalyFactors' | 'explanationWeights' | 'status'> {
  const factors: string[] = [];
  const weights: Record<string, number> = {};
  let score = 0;

  const prevTxns = allTxns.filter((t) => t.id !== txn.id);

  // ── 1. Amount anomaly ──────────────────────────────────────────────────────
  const avgAmount =
    prevTxns.length > 0
      ? prevTxns.reduce((s, t) => s + t.amount, 0) / prevTxns.length
      : profile.monthlyBudget / 30;

  const amountRatio = txn.amount / Math.max(avgAmount, 1);
  let amountScore = 0;
  if (amountRatio > 5) {
    amountScore = 40;
    factors.push(`Amount ${amountRatio.toFixed(1)}x higher than your average`);
  } else if (amountRatio > 3) {
    amountScore = 28;
    factors.push(`Amount ${amountRatio.toFixed(1)}x above your normal pattern`);
  } else if (amountRatio > 2) {
    amountScore = 15;
    factors.push('Amount slightly above your usual spending');
  }
  // Also flag if amount > 30% of monthly budget
  if (txn.amount > profile.monthlyBudget * 0.3) {
    amountScore = Math.max(amountScore, 20);
    factors.push(`Single transaction is ${Math.round((txn.amount / profile.monthlyBudget) * 100)}% of your monthly budget`);
  }
  if (amountScore > 0) weights['Amount Anomaly'] = amountScore / 100;
  score += amountScore;

  // ── 2. Location anomaly ────────────────────────────────────────────────────
  const knownLocations = [
    profile.city,
    ...prevTxns.map((t) => t.location.split(',')[0].trim()),
  ].map((l) => l.toLowerCase());
  const txnCity = txn.location.split(',')[0].trim().toLowerCase();
  const isNewLocation = !knownLocations.includes(txnCity);
  const isInternational =
    !txn.location.toLowerCase().includes('india') &&
    !txn.location.toLowerCase().includes(profile.city.toLowerCase());

  if (isInternational) {
    score += 30;
    weights['Location Anomaly'] = 0.30;
    factors.push(`International transaction — outside your usual region`);
  } else if (isNewLocation) {
    score += 18;
    weights['Location Anomaly'] = 0.18;
    factors.push(`New location — not seen in your transaction history`);
  }

  // ── 3. Time anomaly ────────────────────────────────────────────────────────
  const hour = new Date(txn.timestamp).getHours();
  if (hour >= 0 && hour < 5) {
    score += 20;
    weights['Time Anomaly'] = 0.20;
    factors.push(`Transaction at unusual hour (${hour}:00 AM)`);
  } else if (hour >= 23 || hour < 6) {
    score += 10;
    weights['Time Anomaly'] = 0.10;
    factors.push('Late-night transaction outside normal hours');
  }

  // ── 4. New merchant ────────────────────────────────────────────────────────
  const knownMerchants = prevTxns.map((t) => t.merchant.toLowerCase());
  if (!knownMerchants.includes(txn.merchant.toLowerCase())) {
    score += 12;
    weights['Merchant Novelty'] = 0.12;
    factors.push('First transaction with this merchant');
  }

  // ── 5. Category risk ───────────────────────────────────────────────────────
  const highRiskCategories = ['Luxury Goods', 'Entertainment', 'Transfer'];
  const medRiskCategories = ['Electronics', 'Travel', 'Shopping'];
  if (highRiskCategories.includes(txn.category)) {
    score += 15;
    weights['Category Risk'] = 0.15;
    factors.push(`${txn.category} is a high-risk spending category`);
  } else if (medRiskCategories.includes(txn.category)) {
    score += 8;
    weights['Category Risk'] = 0.08;
  }

  // ── 6. Velocity — multiple txns in short window ───────────────────────────
  const recentWindow = new Date(txn.timestamp).getTime() - 2 * 60 * 60 * 1000; // 2h
  const recentCount = prevTxns.filter(
    (t) => new Date(t.timestamp).getTime() > recentWindow
  ).length;
  if (recentCount >= 3) {
    score += 15;
    weights['Velocity Pattern'] = 0.15;
    factors.push(`${recentCount} transactions in the last 2 hours — unusual velocity`);
  }

  // ── 7. Budget overrun ──────────────────────────────────────────────────────
  const monthStart = new Date(txn.timestamp);
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthSpend = prevTxns
    .filter((t) => new Date(t.timestamp) >= monthStart)
    .reduce((s, t) => s + t.amount, 0);
  if (monthSpend + txn.amount > profile.monthlyBudget) {
    score += 10;
    weights['Budget Overrun'] = 0.10;
    factors.push('This transaction will exceed your monthly budget');
  }

  // Clamp score 0–100
  const riskScore = Math.min(100, Math.max(0, score));

  // Normalise weights to sum ≤ 1
  const wTotal = Object.values(weights).reduce((s, v) => s + v, 0);
  if (wTotal > 0) {
    Object.keys(weights).forEach((k) => (weights[k] = weights[k] / wTotal));
  }

  // Default weight if no anomaly
  if (Object.keys(weights).length === 0) {
    weights['Normal Pattern'] = 1.0;
  }

  const status: Transaction['status'] =
    riskScore >= 70 ? 'flagged' : riskScore >= 40 ? 'pending' : 'safe';

  return { riskScore, anomalyFactors: factors, explanationWeights: weights, status };
}

// ─── Generate AI suggestion text ─────────────────────────────────────────────
export function generateSuggestion(txn: Transaction, profile: UserProfile): string {
  if (txn.riskScore >= 80) {
    return `⚠️ High Risk: This transaction shows ${txn.anomalyFactors.length} anomaly signals. Immediate review recommended. ${txn.anomalyFactors[0] ?? ''}`;
  }
  if (txn.riskScore >= 50) {
    return `🔍 Moderate Risk: ${txn.anomalyFactors[0] ?? 'Unusual pattern detected'}. Monitor this merchant for repeat activity.`;
  }
  if (txn.amount > profile.monthlyBudget * 0.2) {
    return `💡 Budget Tip: This is a large spend (${Math.round((txn.amount / profile.monthlyBudget) * 100)}% of your monthly budget). Consider if it aligns with your financial goals.`;
  }
  return `✅ Low Risk: Transaction appears normal based on your spending history.`;
}

// ─── Compute overall behavioral deviation % ──────────────────────────────────
export function computeDeviation(txns: Transaction[], profile: UserProfile): number {
  if (txns.length === 0) return 0;
  const avgRisk = txns.reduce((s, t) => s + t.riskScore, 0) / txns.length;
  // Deviation = how far avg risk is from "normal" (baseline 15)
  return Math.min(100, Math.round(Math.max(0, avgRisk - 15) * 1.2));
}

// ─── Spending insights from user transactions ─────────────────────────────────
export function generateInsights(txns: Transaction[], profile: UserProfile): string[] {
  const insights: string[] = [];
  if (txns.length === 0) return ['Add transactions to see personalised insights.'];

  const total = txns.reduce((s, t) => s + t.amount, 0);
  const highRisk = txns.filter((t) => t.riskScore >= 70);
  const topCategory = Object.entries(
    txns.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1])[0];

  if (highRisk.length > 0)
    insights.push(`${highRisk.length} high-risk transaction${highRisk.length > 1 ? 's' : ''} need your attention`);
  if (topCategory)
    insights.push(`Highest spend category: ${topCategory[0]} (₹${topCategory[1].toLocaleString('en-IN')})`);
  if (total > profile.monthlyBudget)
    insights.push(`Total spend ₹${total.toLocaleString('en-IN')} exceeds your ₹${profile.monthlyBudget.toLocaleString('en-IN')} budget`);
  else
    insights.push(`You've used ${Math.round((total / profile.monthlyBudget) * 100)}% of your monthly budget`);

  const lateNight = txns.filter((t) => {
    const h = new Date(t.timestamp).getHours();
    return h >= 0 && h < 5;
  });
  if (lateNight.length > 0)
    insights.push(`${lateNight.length} late-night transaction${lateNight.length > 1 ? 's' : ''} detected (midnight–5 AM)`);

  return insights;
}
