import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography } from '../theme/typography';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { SwipeableTransaction } from '../components/SwipeableTransaction';
import { SmartHeader } from '../components/SmartHeader';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = { TransactionDetail: { transactionId: string } };

export const TransactionsScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { transactions, updateTransactionStatus, addAuditLog, currentUser } = useStore();

  const pendingTransactions = transactions.filter(
    (tx) => tx.status === 'pending' || tx.status === 'flagged'
  );

  const handlePress = (transactionId: string) =>
    navigation.navigate('TransactionDetail', { transactionId });

  const handleSwipeRight = (id: string) => {
    updateTransactionStatus(id, 'safe');
    addAuditLog({ id: `LOG${Date.now()}`, action: 'MARKED_SAFE', transactionId: id, userId: currentUser, timestamp: new Date().toISOString(), decision: 'Safe' });
  };

  const handleSwipeLeft = (id: string) => {
    updateTransactionStatus(id, 'investigating');
    addAuditLog({ id: `LOG${Date.now()}`, action: 'FLAGGED_FOR_INVESTIGATION', transactionId: id, userId: currentUser, timestamp: new Date().toISOString(), decision: 'Investigating' });
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <SmartHeader title={t('transactions.title')} />

      {/* Top summary bar */}
      <View style={[styles.summaryBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.summaryText, { color: theme.text }]}>
          {pendingTransactions.length}
        </Text>
        <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
          {' '}{t('transactions.pendingReview')}
        </Text>
        <View style={styles.swipeHints}>
          <Text style={[styles.hintText, { color: theme.textSecondary }]}>
            {t('transactions.swipeLeft')}
          </Text>
          <Text style={[styles.hintDivider, { color: theme.border }]}>|</Text>
          <Text style={[styles.hintText, { color: theme.textSecondary }]}>
            {t('transactions.swipeRight')}
          </Text>
        </View>
      </View>

      <FlatList
        data={pendingTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SwipeableTransaction
            transaction={item}
            onPress={() => handlePress(item.id)}
            onSwipeLeft={() => handleSwipeLeft(item.id)}
            onSwipeRight={() => handleSwipeRight(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB — add transaction */}
      <Pressable
        style={[styles.fab, { backgroundColor: theme.text }]}
        onPress={() => navigation.navigate('AddTransaction' as never)}
      >
        <Text style={[styles.fabText, { color: theme.background }]}>+</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  summaryText: { ...Typography.h4 },
  summaryLabel: { ...Typography.body, flex: 1 },
  swipeHints: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  hintText: { ...Typography.small },
  hintDivider: { ...Typography.small },
  list: { padding: 16 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  fabText: { fontSize: 28, fontWeight: '300', lineHeight: 32 },
});
