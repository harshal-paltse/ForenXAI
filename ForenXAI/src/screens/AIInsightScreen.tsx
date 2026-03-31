import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography } from '../theme/typography';
import { Card } from '../components/Card';
import { SmartHeader } from '../components/SmartHeader';
import { useStore } from '../store/useStore';

const generateInsight = (query: string, transactions: any[]): string => {
  const highRisk = transactions.filter((t) => t.riskScore >= 70);
  const q = query.toLowerCase();

  if (q.includes('why') && q.includes('risky')) {
    return `Based on behavioral analysis, the flagged transaction deviates significantly from the user's established pattern. Key indicators: amount 3.2x above the 90-day average, a merchant category with zero prior history, and a location outside the user's typical activity radius of 50km. The combination of these three independent anomalies raises the composite risk score to 87/100.`;
  }
  if (q.includes('pattern') || q.includes('trend')) {
    return `Anomaly trend analysis reveals a 34% increase in high-risk transactions over the past 7 days. The dominant pattern is late-night transactions (2–4 AM) combined with above-average amounts. This cluster suggests either compromised credentials or a coordinated fraud attempt. Recommend immediate review of ${highRisk.length} flagged transactions.`;
  }
  if (q.includes('predict') || q.includes('next') || q.includes('future')) {
    return `Predictive model (confidence: 78%) indicates elevated risk in the next 48 hours. Based on historical fraud patterns, the next suspicious activity is likely to occur between 11 PM–3 AM, involving an electronics or luxury goods merchant. Predicted amount range: ₹12,000–₹50,000. Recommend proactive monitoring of accounts with recent location changes.`;
  }
  if (q.includes('location') || q.includes('where')) {
    return `Geographic analysis shows 3 transactions originating from locations more than 200km from the user's registered address in the past 72 hours. Two occurred within 4 hours of each other in different cities — physically impossible without air travel. This velocity-location mismatch is a strong indicator of card cloning or account takeover.`;
  }
  if (q.includes('merchant') || q.includes('shop')) {
    return `Merchant analysis flags 2 new merchants never previously transacted with, both in high-risk categories (Electronics, Luxury Goods). First-time merchant transactions carry a 2.4x higher fraud probability. Cross-referencing with known fraud merchant databases shows Merchant-X has been flagged in 3 prior investigations.`;
  }
  return `AI analysis of ${transactions.length} transactions identifies ${highRisk.length} high-risk events. Primary anomaly driver: amount deviation (45%), location mismatch (30%), time-of-day patterns (15%). Overall portfolio risk score: ${Math.round(transactions.reduce((a, t) => a + t.riskScore, 0) / Math.max(transactions.length, 1))}/100. Recommend prioritizing TXN003 and TXN001.`;
};

const PREDICTIVE_ALERTS = [
  {
    id: 'PA1',
    title: 'High-Risk Window Approaching',
    description: 'Based on historical patterns, elevated fraud risk expected tonight between 11 PM – 3 AM.',
    confidence: 78,
    timeframe: 'Next 6 hours',
  },
  {
    id: 'PA2',
    title: 'Unusual Spending Velocity',
    description: 'User ACC-001 has made 4 transactions in 2 hours — 3x above normal velocity.',
    confidence: 85,
    timeframe: 'Active now',
  },
  {
    id: 'PA3',
    title: 'New Location Pattern',
    description: 'First transaction detected from Dubai. Recommend secondary verification.',
    confidence: 91,
    timeframe: 'Triggered 2h ago',
  },
];

const QUICK_QUERIES = [
  'Why is this transaction risky?',
  'What patterns do you see?',
  'Predict next risk event',
  'Explain location anomaly',
];

export const AIInsightScreen = () => {
  const { theme } = useTheme();
  const { transactions } = useStore();
  const [query, setQuery] = useState('');
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleQuery = () => {
    if (!query.trim()) return;
    setLoading(true);
    setInsight('');
    fadeAnim.setValue(0);

    setTimeout(() => {
      const result = generateInsight(query, transactions);
      setInsight(result);
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 1400);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <SmartHeader title="AI Insight Engine" />

      <Card style={styles.queryCard}>
        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>QUERY</Text>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          value={query}
          onChangeText={setQuery}
          placeholder="e.g. Why is this transaction risky?"
          placeholderTextColor={theme.textSecondary}
          multiline
          numberOfLines={2}
        />
        <View style={styles.quickQueries}>
          {QUICK_QUERIES.map((q) => (
            <Pressable
              key={q}
              style={[styles.chip, { borderColor: theme.border }]}
              onPress={() => setQuery(q)}
            >
              <Text style={[styles.chipText, { color: theme.textSecondary }]}>{q}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          style={[styles.analyzeBtn, { backgroundColor: theme.text }]}
          onPress={handleQuery}
        >
          <Text style={[styles.analyzeBtnText, { color: theme.background }]}>
            🤖 Analyze
          </Text>
        </Pressable>
      </Card>

      {(loading || insight.length > 0) && (
        <Card style={styles.responseCard}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>AI RESPONSE</Text>
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={theme.text} />
              <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                Analyzing patterns...
              </Text>
            </View>
          ) : (
            <Animated.View style={{ opacity: fadeAnim }}>
              <Text style={[styles.insightText, { color: theme.text }]}>{insight}</Text>
            </Animated.View>
          )}
        </Card>
      )}

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        📈 Predictive Risk Alerts
      </Text>
      {PREDICTIVE_ALERTS.map((alert) => (
        <Card key={alert.id} style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <Text style={[styles.alertTitle, { color: theme.text }]}>{alert.title}</Text>
            <View style={[styles.confidenceBadge, { backgroundColor: theme.surface }]}>
              <Text style={[styles.confidenceText, { color: theme.text }]}>
                {alert.confidence}%
              </Text>
            </View>
          </View>
          <Text style={[styles.alertDesc, { color: theme.textSecondary }]}>
            {alert.description}
          </Text>
          <Text style={[styles.alertTime, { color: theme.textSecondary }]}>
            ⏱ {alert.timeframe}
          </Text>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  queryCard: { marginBottom: 20 },
  sectionLabel: { ...Typography.label, fontSize: 11, marginBottom: 10 },
  input: {
    ...Typography.body,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  quickQueries: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { borderWidth: 1, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12 },
  chipText: { ...Typography.small },
  analyzeBtn: { paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  analyzeBtnText: { ...Typography.bodyBold },
  responseCard: { marginBottom: 24 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  loadingText: { ...Typography.body },
  insightText: { ...Typography.body, lineHeight: 26 },
  sectionTitle: { ...Typography.h3, marginBottom: 16 },
  alertCard: { marginBottom: 12 },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alertTitle: { ...Typography.bodyBold, flex: 1, marginRight: 8 },
  confidenceBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  confidenceText: { ...Typography.label, fontSize: 12 },
  alertDesc: { ...Typography.body, marginBottom: 8 },
  alertTime: { ...Typography.caption },
});
