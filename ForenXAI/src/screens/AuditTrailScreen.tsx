import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography } from '../theme/typography';
import { Card } from '../components/Card';
import { SmartHeader } from '../components/SmartHeader';
import { useStore } from '../store/useStore';

// Seed some default audit logs for demo
const SEED_LOGS = [
  {
    id: 'LOG001',
    action: 'TRANSACTION_REVIEWED',
    transactionId: 'TXN003',
    userId: 'auditor@forensai.com',
    timestamp: '2026-03-30T10:15:00Z',
    decision: 'Flagged for investigation',
  },
  {
    id: 'LOG002',
    action: 'CASE_CREATED',
    transactionId: 'TXN003',
    userId: 'auditor@forensai.com',
    timestamp: '2026-03-30T10:18:00Z',
    decision: 'Case CASE-001 opened',
  },
  {
    id: 'LOG003',
    action: 'MARKED_SAFE',
    transactionId: 'TXN004',
    userId: 'auditor@forensai.com',
    timestamp: '2026-03-30T11:02:00Z',
    decision: 'Safe',
  },
  {
    id: 'LOG004',
    action: 'RISK_SCORE_UPDATED',
    transactionId: 'TXN001',
    userId: 'system@forensai.com',
    timestamp: '2026-03-30T12:00:00Z',
    decision: 'Score updated: 72 → 87',
  },
];

const ACTION_ICONS: Record<string, string> = {
  TRANSACTION_REVIEWED: '🔍',
  CASE_CREATED: '📁',
  MARKED_SAFE: '✓',
  FLAGGED_FOR_INVESTIGATION: '⚑',
  RISK_SCORE_UPDATED: '📊',
  NOTE_ADDED: '📝',
};

export const AuditTrailScreen = () => {
  const { theme } = useTheme();
  const { auditLogs } = useStore();

  const allLogs = [...SEED_LOGS, ...auditLogs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SmartHeader title="Audit Trail" />
      <View style={[styles.immutableBanner, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.bannerText, { color: theme.textSecondary }]}>
          🔒 All entries are immutable and tamper-proof
        </Text>
      </View>

      <FlatList
        data={allLogs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <View style={styles.timelineItem}>
            {/* Timeline line */}
            {index < allLogs.length - 1 && (
              <View style={[styles.timelineLine, { backgroundColor: theme.border }]} />
            )}
            {/* Timeline dot */}
            <View style={[styles.timelineDot, { backgroundColor: theme.text }]} />

            <Card style={styles.logCard}>
              <View style={styles.logHeader}>
                <Text style={styles.logIcon}>
                  {ACTION_ICONS[item.action] ?? '•'}
                </Text>
                <View style={styles.logMeta}>
                  <Text style={[styles.logAction, { color: theme.text }]}>
                    {item.action.replace(/_/g, ' ')}
                  </Text>
                  <Text style={[styles.logTime, { color: theme.textSecondary }]}>
                    {formatTime(item.timestamp)}
                  </Text>
                </View>
              </View>
              <Text style={[styles.logTxn, { color: theme.textSecondary }]}>
                Transaction: {item.transactionId}
              </Text>
              <Text style={[styles.logDecision, { color: theme.text }]}>
                Decision: {item.decision}
              </Text>
              <Text style={[styles.logUser, { color: theme.textSecondary }]}>
                By: {item.userId}
              </Text>
            </Card>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  immutableBanner: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  bannerText: { ...Typography.caption, textAlign: 'center' },
  list: { padding: 16, paddingTop: 8 },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 7,
    top: 20,
    width: 2,
    bottom: -16,
    zIndex: 0,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 16,
    marginRight: 12,
    zIndex: 1,
    flexShrink: 0,
  },
  logCard: { flex: 1, padding: 12 },
  logHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  logIcon: { fontSize: 18, marginRight: 10 },
  logMeta: { flex: 1 },
  logAction: { ...Typography.bodyBold, fontSize: 13, marginBottom: 2 },
  logTime: { ...Typography.small },
  logTxn: { ...Typography.caption, marginBottom: 4 },
  logDecision: { ...Typography.caption, marginBottom: 4 },
  logUser: { ...Typography.small },
});
