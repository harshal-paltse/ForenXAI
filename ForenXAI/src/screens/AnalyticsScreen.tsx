import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography } from '../theme/typography';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/Card';
import { SmartHeader } from '../components/SmartHeader';
import { BarChart } from '../components/charts/BarChart';
import { PieChart } from '../components/charts/PieChart';
import { TrendChart } from '../components/charts/TrendChart';
import { useStore } from '../store/useStore';

const WEEKLY_TREND = [
  { day: 'Mon', value: 3 }, { day: 'Tue', value: 5 }, { day: 'Wed', value: 4 },
  { day: 'Thu', value: 8 }, { day: 'Fri', value: 6 }, { day: 'Sat', value: 9 }, { day: 'Sun', value: 7 },
];

export const AnalyticsScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { transactions } = useStore();

  const categoryMap = transactions.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const pieData = Object.entries(categoryMap).map(([label, value]) => ({ label, value }));

  const riskData = [
    { label: 'Low', value: transactions.filter((tx) => tx.riskScore < 40).length },
    { label: 'Medium', value: transactions.filter((tx) => tx.riskScore >= 40 && tx.riskScore < 70).length },
    { label: 'High', value: transactions.filter((tx) => tx.riskScore >= 70).length },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <SmartHeader title={t('analytics.title')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.chartCard}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>{t('analytics.weeklyTrend')}</Text>
          <TrendChart data={WEEKLY_TREND} height={180} />
        </Card>
        <Card style={styles.chartCard}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>{t('analytics.riskDistribution')}</Text>
          <BarChart data={riskData} height={220} />
        </Card>
        <Card style={styles.chartCard}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>{t('analytics.categoryBreakdown')}</Text>
          {pieData.length > 0 && <PieChart data={pieData} height={220} />}
        </Card>
        <Card style={styles.insightCard}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>{t('analytics.keyInsights')}</Text>
          {[
            'Highest risk category: Electronics',
            'Peak anomaly time: Late night (2–4 AM)',
            'Most common anomaly: Amount deviation (45%)',
            `${riskData[2].value} of ${transactions.length} transactions are high-risk`,
          ].map((insight, i) => (
            <Text key={i} style={[styles.insightText, { color: theme.textSecondary }]}>• {insight}</Text>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16 },
  chartCard: { marginBottom: 20 },
  chartTitle: { ...Typography.h4, marginBottom: 12 },
  insightCard: { marginBottom: 20 },
  insightText: { ...Typography.body, marginBottom: 8 },
});
