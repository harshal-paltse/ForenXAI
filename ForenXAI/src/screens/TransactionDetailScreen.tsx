import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography } from '../theme/typography';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { Card } from '../components/Card';
import { RiskBadge } from '../components/RiskBadge';
import { SmartHeader } from '../components/SmartHeader';
import { BarChart } from '../components/charts/BarChart';

export const TransactionDetailScreen = ({ route, navigation }: any) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { transactionId } = route.params;
  const { transactions, updateTransactionStatus } = useStore();

  const transaction = transactions.find((t) => t.id === transactionId);

  if (!transaction) return null;

  const formatAmount = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const chartData = Object.entries(transaction.explanationWeights).map(([key, value]) => ({
    label: key.split(' ')[0],
    value: Math.round(value * 100),
  }));

  const handleMarkSafe = () => { updateTransactionStatus(transactionId, 'safe'); navigation.goBack(); };
  const handleInvestigate = () => { updateTransactionStatus(transactionId, 'investigating'); navigation.goBack(); };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <SmartHeader title={t('detail.title')} showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
      <Card style={styles.mainCard}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.merchant, { color: theme.text }]}>
              {transaction.merchant}
            </Text>
            <Text style={[styles.category, { color: theme.textSecondary }]}>
              {transaction.category}
            </Text>
          </View>
          <RiskBadge score={transaction.riskScore} size="large" />
        </View>

        <View style={styles.amountSection}>
          <Text style={[styles.amount, { color: theme.text }]}>
            {formatAmount(transaction.amount)}
          </Text>
          <Text style={[styles.location, { color: theme.textSecondary }]}>
            {transaction.location}
          </Text>
        </View>
      </Card>

      <Card style={styles.explainabilityCard}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t('detail.explainability')}
        </Text>
        {transaction.anomalyFactors.map((factor, index) => (
          <View key={index} style={styles.factorItem}>
            <Text style={[styles.bullet, { color: theme.text }]}>•</Text>
            <Text style={[styles.factorText, { color: theme.textSecondary }]}>
              {factor}
            </Text>
          </View>
        ))}
      </Card>

      <Card style={styles.chartCard}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t('detail.contributionFactors')}
        </Text>
        <BarChart data={chartData} height={220} />
      </Card>

      <Card style={styles.deviationCard}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t('detail.behavioralDeviation')}
        </Text>
        <Text style={[styles.deviationValue, { color: theme.danger }]}>
          78%
        </Text>
        <Text style={[styles.deviationText, { color: theme.textSecondary }]}>
          This transaction deviates significantly from user's normal pattern
        </Text>
      </Card>

      <View style={styles.actions}>
        <Pressable
          style={[styles.button, { backgroundColor: theme.safe }]}
          onPress={handleMarkSafe}
        >
          <Text style={[styles.buttonText, { color: theme.background }]}>
            {t('detail.markSafe')}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: theme.danger }]}
          onPress={handleInvestigate}
        >
          <Text style={[styles.buttonText, { color: theme.background }]}>
            {t('detail.investigate')}
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
  mainCard: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  merchant: {
    ...Typography.h2,
    marginBottom: 4,
  },
  category: {
    ...Typography.caption,
  },
  amountSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  amount: {
    ...Typography.h1,
    fontSize: 40,
    marginBottom: 8,
  },
  location: {
    ...Typography.body,
  },
  explainabilityCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    ...Typography.h3,
    marginBottom: 16,
  },
  factorItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bullet: {
    ...Typography.body,
    marginRight: 8,
  },
  factorText: {
    ...Typography.body,
    flex: 1,
  },
  chartCard: {
    marginBottom: 16,
  },
  deviationCard: {
    marginBottom: 16,
    alignItems: 'center',
  },
  deviationValue: {
    ...Typography.h1,
    fontSize: 48,
    marginVertical: 12,
  },
  deviationText: {
    ...Typography.body,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    ...Typography.bodyBold,
  },
});
