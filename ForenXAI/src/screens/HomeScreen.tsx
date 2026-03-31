import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography } from '../theme/typography';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/Card';
import { RiskBadge } from '../components/RiskBadge';
import { SmartHeader } from '../components/SmartHeader';
import { TrendChart } from '../components/charts/TrendChart';
import { useStore } from '../store/useStore';
import { mockTransactions } from '../data/mockData';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const TREND_DATA = [
  { day: 'Mon', value: 12 }, { day: 'Tue', value: 18 }, { day: 'Wed', value: 15 },
  { day: 'Thu', value: 25 }, { day: 'Fri', value: 22 }, { day: 'Sat', value: 30 }, { day: 'Sun', value: 28 },
];

const HEATMAP_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const HEATMAP_SLOTS = ['Night', 'Morning', 'Afternoon', 'Evening'];
const HEATMAP_VALUES = [
  [90, 10, 20, 15], [15, 5, 30, 25], [20, 8, 18, 40],
  [85, 12, 22, 35], [10, 6, 28, 50], [70, 20, 15, 60], [45, 8, 12, 30],
];

const HeatCell: React.FC<{ value: number }> = ({ value }) => {
  const { mode } = useTheme();
  const alpha = Math.round((value / 100) * 255).toString(16).padStart(2, '0');
  const bg = mode === 'dark' ? `#FFFFFF${alpha}` : `#000000${alpha}`;
  return <View style={[styles.heatCell, { backgroundColor: bg }]} />;
};

export const HomeScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { transactions, setTransactions } = useStore();

  useEffect(() => {
    if (transactions.length === 0) setTransactions(mockTransactions);
  }, []);

  const stats = {
    total: transactions.length,
    flagged: transactions.filter((tx) => tx.riskScore >= 70).length,
    investigating: transactions.filter((tx) => tx.status === 'investigating').length,
    resolved: transactions.filter((tx) => tx.status === 'safe').length,
  };

  const avgRisk = transactions.length
    ? Math.round(transactions.reduce((a, tx) => a + tx.riskScore, 0) / transactions.length)
    : 0;

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <SmartHeader title={t('home.title')} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Subtitle + avg risk */}
        <View style={styles.topRow}>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {t('home.subtitle')}
          </Text>
          <RiskBadge score={avgRisk} size="medium" />
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {[
            { label: t('home.totalTransactions'), value: stats.total, hi: false },
            { label: t('home.flaggedTransactions'), value: stats.flagged, hi: true },
            { label: t('home.underInvestigation'), value: stats.investigating, hi: false },
            { label: t('home.resolved'), value: stats.resolved, hi: false },
          ].map((s) => (
            <Card key={s.label} style={styles.statCard}>
              <Text style={[styles.statValue, { color: s.hi ? theme.danger : theme.text }]}>
                {s.value}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{s.label}</Text>
            </Card>
          ))}
        </View>

        {/* Explainability score */}
        <Card style={styles.explainCard}>
          <View style={styles.explainRow}>
            <View style={styles.explainLeft}>
              <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
                {t('home.explainabilityScore').toUpperCase()}
              </Text>
              <Text style={[styles.explainValue, { color: theme.text }]}>94/100</Text>
              <Text style={[styles.explainDesc, { color: theme.textSecondary }]}>
                {t('home.explainabilityDesc')}
              </Text>
            </View>
            <View style={[styles.explainCircle, { borderColor: theme.text }]}>
              <Text style={[styles.explainCircleText, { color: theme.text }]}>94%</Text>
            </View>
          </View>
        </Card>

        {/* Trend chart */}
        <Card style={styles.chartCard}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>
            {t('home.anomalyTrend')}
          </Text>
          <TrendChart data={TREND_DATA} height={180} />
        </Card>

        {/* Heatmap */}
        <Card style={styles.heatmapCard}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>
            {t('home.riskHeatmap')}
          </Text>
          <View style={styles.heatmapContainer}>
            <View style={styles.heatmapYLabels}>
              {HEATMAP_SLOTS.map((s) => (
                <Text key={s} style={[styles.heatLabel, { color: theme.textSecondary }]}>{s}</Text>
              ))}
            </View>
            <View>
              <View style={styles.heatmapXLabels}>
                {HEATMAP_DAYS.map((d, i) => (
                  <Text key={i} style={[styles.heatLabel, { color: theme.textSecondary }]}>{d}</Text>
                ))}
              </View>
              {HEATMAP_SLOTS.map((slot, si) => (
                <View key={slot} style={styles.heatRow}>
                  {HEATMAP_DAYS.map((_, di) => (
                    <HeatCell key={di} value={HEATMAP_VALUES[di][si]} />
                  ))}
                </View>
              ))}
            </View>
          </View>
          <Text style={[styles.heatmapLegend, { color: theme.textSecondary }]}>
            {t('home.heatmapLegend')}
          </Text>
        </Card>

        {/* Quick actions */}
        <View style={styles.quickActions}>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: theme.text }]}
            onPress={() => navigation.navigate('Transactions' as never)}
          >
            <Text style={[styles.actionBtnText, { color: theme.background }]}>
              {t('home.reviewFlagged')}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}
            onPress={() => navigation.navigate('Cases' as never)}
          >
            <Text style={[styles.actionBtnText, { color: theme.text }]}>
              {t('home.openCases')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subtitle: { ...Typography.caption, flex: 1 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, minWidth: '47%', alignItems: 'center', paddingVertical: 18 },
  statValue: { ...Typography.h1, marginBottom: 4 },
  statLabel: { ...Typography.small, textAlign: 'center' },
  explainCard: { marginBottom: 16 },
  explainRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  explainLeft: { flex: 1 },
  sectionLabel: { ...Typography.label, fontSize: 11, marginBottom: 6 },
  explainValue: { ...Typography.h2, marginBottom: 4 },
  explainDesc: { ...Typography.small, maxWidth: 200 },
  explainCircle: {
    width: 72, height: 72, borderRadius: 36, borderWidth: 3,
    justifyContent: 'center', alignItems: 'center',
  },
  explainCircleText: { ...Typography.h4 },
  chartCard: { marginBottom: 16 },
  chartTitle: { ...Typography.h4, marginBottom: 8 },
  heatmapCard: { marginBottom: 16 },
  heatmapContainer: { flexDirection: 'row', marginTop: 8 },
  heatmapYLabels: { justifyContent: 'space-around', paddingRight: 8, paddingTop: 20 },
  heatmapXLabels: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 4 },
  heatLabel: { ...Typography.small, width: 36, textAlign: 'center' },
  heatRow: { flexDirection: 'row', marginBottom: 3 },
  heatCell: { width: 36, height: 28, borderRadius: 4, marginHorizontal: 1 },
  heatmapLegend: { ...Typography.small, marginTop: 8, textAlign: 'center' },
  quickActions: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  actionBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  actionBtnText: { ...Typography.bodyBold, fontSize: 14 },
});
