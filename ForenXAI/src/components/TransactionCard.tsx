import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Typography } from '../theme/typography';
import { Transaction } from '../types';
import { Card } from './Card';
import { RiskBadge } from './RiskBadge';

interface TransactionCardProps {
  transaction: Transaction;
  onPress: () => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onPress }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const formatAmount = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card} elevated>
        {/* Header row */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.merchant, { color: theme.text }]} numberOfLines={1}>
              {transaction.merchant}
            </Text>
            <Text style={[styles.category, { color: theme.textSecondary }]}>
              {transaction.category}
            </Text>
          </View>
          <RiskBadge score={transaction.riskScore} />
        </View>

        {/* Divider — theme-aware */}
        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Detail rows */}
        <View style={styles.details}>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>
              {t('transactions.amount').toUpperCase()}
            </Text>
            <Text style={[styles.amount, { color: theme.text }]}>
              {formatAmount(transaction.amount)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>
              {t('transactions.location').toUpperCase()}
            </Text>
            <Text style={[styles.value, { color: theme.text }]} numberOfLines={1}>
              {transaction.location}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>
              {t('transactions.time').toUpperCase()}
            </Text>
            <Text style={[styles.value, { color: theme.text }]}>
              {formatTime(transaction.timestamp)}
            </Text>
          </View>
        </View>

        {/* Anomaly banner — theme-aware border */}
        {transaction.anomalyFactors.length > 0 && (
          <View style={[styles.anomalySection, { borderTopColor: theme.border }]}>
            <Text style={[styles.anomalyTitle, { color: theme.text }]}>
              {t('transactions.anomalyDetected')}
            </Text>
            <Text style={[styles.anomalyText, { color: theme.textSecondary }]}>
              {transaction.anomalyFactors[0]}
            </Text>
          </View>
        )}
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: { flex: 1, marginRight: 12 },
  merchant: { ...Typography.h4, marginBottom: 3 },
  category: { ...Typography.caption },
  divider: { height: StyleSheet.hairlineWidth, marginBottom: 12 },
  details: { gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { ...Typography.label, fontSize: 10 },
  amount: { ...Typography.h3 },
  value: { ...Typography.body, maxWidth: '60%', textAlign: 'right' },
  anomalySection: { marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
  anomalyTitle: { ...Typography.bodyBold, marginBottom: 4 },
  anomalyText: { ...Typography.caption },
});
