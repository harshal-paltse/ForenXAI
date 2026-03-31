import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography } from '../theme/typography';
import { Card } from '../components/Card';
import { SmartHeader } from '../components/SmartHeader';
import { BarChart } from '../components/charts/BarChart';
import { behavioralProfile } from '../data/mockData';

const WEEKLY_PATTERN = [
  { label: 'Mon', value: 10 }, { label: 'Tue', value: 8 }, { label: 'Wed', value: 12 },
  { label: 'Thu', value: 9 }, { label: 'Fri', value: 15 }, { label: 'Sat', value: 20 }, { label: 'Sun', value: 6 },
];

const DEVIATION_DATA = [
  { category: 'Groceries', normal: 2000, actual: 2200 },
  { category: 'Fuel', normal: 1500, actual: 1400 },
  { category: 'Dining', normal: 1200, actual: 3200 },
  { category: 'Electronics', normal: 5000, actual: 15000 },
  { category: 'Luxury', normal: 0, actual: 45000 },
];

const DeviationBar: React.FC<{ label: string; normal: number; actual: number }> = ({
  label, normal, actual,
}) => {
  const { theme } = useTheme();
  const maxVal = Math.max(normal, actual, 1);
  const normalPct = (normal / maxVal) * 100;
  const actualPct = (actual / maxVal) * 100;
  const deviation = normal > 0 ? Math.round(((actual - normal) / normal) * 100) : 100;

  return (
    <View style={styles.devRow}>
      <Text style={[styles.devLabel, { color: theme.textSecondary }]}>{label}</Text>
      <View style={styles.devBars}>
        <View style={[styles.devBarTrack, { backgroundColor: theme.surface }]}>
          <View style={[styles.devBarFill, { width: `${normalPct}%`, backgroundColor: theme.border }]} />
        </View>
        <View style={[styles.devBarTrack, { backgroundColor: theme.surface }]}>
          <View
            style={[
              styles.devBarFill,
              {
                width: `${Math.min(actualPct, 100)}%`,
                backgroundColor: deviation > 50 ? theme.text : theme.textSecondary,
              },
            ]}
          />
        </View>
      </View>
      <Text style={[styles.devPct, { color: deviation > 50 ? theme.danger : theme.textSecondary }]}>
        {deviation > 0 ? `+${deviation}%` : `${deviation}%`}
      </Text>
    </View>
  );
};

export const BehavioralScreen = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <SmartHeader title="Behavioral Fingerprint" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Card style={styles.deviationCard}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
            OVERALL BEHAVIORAL DEVIATION
          </Text>
          <Text style={[styles.bigNumber, { color: theme.text }]}>78%</Text>
          <Text style={[styles.deviationDesc, { color: theme.textSecondary }]}>
            This user's recent activity deviates 78% from their established 90-day behavioral baseline.
            Strong indicator of account compromise or unusual activity.
          </Text>
        </Card>

        <Card style={styles.profileCard}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>NORMAL PROFILE</Text>
          {[
            { key: 'Avg. Transaction', val: `₹${behavioralProfile.avgAmount.toLocaleString('en-IN')}` },
            { key: 'Usual Locations', val: behavioralProfile.commonLocations.join(', ') },
            { key: 'Active Hours', val: behavioralProfile.typicalTimeRanges.join(', ') },
          ].map((row, i, arr) => (
            <View
              key={row.key}
              style={[
                styles.profileRow,
                i < arr.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.border },
              ]}
            >
              <Text style={[styles.profileKey, { color: theme.textSecondary }]}>{row.key}</Text>
              <Text style={[styles.profileVal, { color: theme.text }]}>{row.val}</Text>
            </View>
          ))}
        </Card>

        <Card style={styles.chartCard}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
            SPENDING DEVIATION BY CATEGORY
          </Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: theme.border }]} />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>Normal</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: theme.text }]} />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>Actual</Text>
            </View>
          </View>
          {DEVIATION_DATA.map((d) => (
            <DeviationBar key={d.category} label={d.category} normal={d.normal} actual={d.actual} />
          ))}
        </Card>

        <Card style={styles.chartCard}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
            WEEKLY ACTIVITY PATTERN
          </Text>
          <BarChart data={WEEKLY_PATTERN} height={200} />
        </Card>

        <Card style={styles.flagsCard}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>BEHAVIORAL FLAGS</Text>
          {[
            'First international transaction in account history',
            'Luxury goods category — zero prior purchases',
            'Transaction velocity: 4 txns in 2 hours (3x normal)',
            'New device fingerprint detected',
            'Amount 8x above 90-day average',
          ].map((flag, i) => (
            <View key={i} style={styles.flagItem}>
              <Text style={[styles.flagBullet, { color: theme.text }]}>▸</Text>
              <Text style={[styles.flagText, { color: theme.textSecondary }]}>{flag}</Text>
            </View>
          ))}
        </Card>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16 },
  deviationCard: { marginBottom: 16, alignItems: 'center' },
  bigNumber: { fontSize: 72, fontWeight: '700', marginVertical: 8 },
  deviationDesc: { ...Typography.body, textAlign: 'center', lineHeight: 22 },
  profileCard: { marginBottom: 16 },
  profileRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  profileKey: { ...Typography.caption },
  profileVal: { ...Typography.bodyBold, fontSize: 14 },
  chartCard: { marginBottom: 16 },
  sectionLabel: { ...Typography.label, fontSize: 11, marginBottom: 14 },
  legendRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendBox: { width: 12, height: 12, borderRadius: 2 },
  legendText: { ...Typography.small },
  devRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  devLabel: { ...Typography.small, width: 72 },
  devBars: { flex: 1, gap: 4 },
  devBarTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  devBarFill: { height: '100%', borderRadius: 4 },
  devPct: { ...Typography.small, width: 44, textAlign: 'right', fontWeight: '700' },
  flagsCard: { marginBottom: 16 },
  flagItem: { flexDirection: 'row', marginBottom: 10 },
  flagBullet: { ...Typography.body, marginRight: 8 },
  flagText: { ...Typography.body, flex: 1 },
});
