import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  Pressable, Switch,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography } from '../theme/typography';
import { useStore } from '../store/useStore';
import { SmartHeader } from '../components/SmartHeader';
import { Card } from '../components/Card';
import { computeDeviation, generateInsights } from '../utils/riskEngine';
import { mockTransactions } from '../data/mockData';

interface Props { navigation: any; }

export const MyProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { userProfile, setUserProfile, transactions, useDemoData, setUseDemoData, completeSetup } = useStore();
  const [editing, setEditing] = useState(false);

  // Editable fields
  const [name, setName] = useState(userProfile.name);
  const [city, setCity] = useState(userProfile.city);
  const [income, setIncome] = useState(String(userProfile.monthlyIncome || ''));
  const [budget, setBudget] = useState(String(userProfile.monthlyBudget || ''));

  const activeTxns = useDemoData ? mockTransactions : transactions;
  const deviation = computeDeviation(activeTxns, userProfile);
  const insights = generateInsights(activeTxns, userProfile);

  const totalSpend = activeTxns.reduce((s, t) => s + t.amount, 0);
  const highRiskCount = activeTxns.filter((t) => t.riskScore >= 70).length;
  const avgRisk = activeTxns.length
    ? Math.round(activeTxns.reduce((s, t) => s + t.riskScore, 0) / activeTxns.length)
    : 0;

  const handleSave = () => {
    setUserProfile({
      ...userProfile,
      name: name.trim() || userProfile.name,
      city: city.trim() || userProfile.city,
      monthlyIncome: parseFloat(income) || userProfile.monthlyIncome,
      monthlyBudget: parseFloat(budget) || userProfile.monthlyBudget,
    });
    setEditing(false);
  };

  const inputStyle = [styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }];
  const labelStyle = [styles.label, { color: theme.textSecondary }];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <SmartHeader title="My Profile" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Profile card ── */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.avatarText, { color: theme.text }]}>
                {(userProfile.name || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.text }]}>
                {userProfile.name || 'Your Name'}
              </Text>
              <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>
                {userProfile.email || 'Not set'}
              </Text>
              <Text style={[styles.profileCity, { color: theme.textSecondary }]}>
                📍 {userProfile.city || 'City not set'}
              </Text>
            </View>
            <Pressable
              style={[styles.editBtn, { borderColor: theme.border }]}
              onPress={() => setEditing(!editing)}
            >
              <Text style={[styles.editBtnText, { color: theme.text }]}>
                {editing ? 'Cancel' : 'Edit'}
              </Text>
            </Pressable>
          </View>

          {editing && (
            <View style={styles.editForm}>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <Text style={labelStyle}>NAME</Text>
              <TextInput style={inputStyle} value={name} onChangeText={setName} placeholderTextColor={theme.textSecondary} />
              <Text style={labelStyle}>CITY</Text>
              <TextInput style={inputStyle} value={city} onChangeText={setCity} placeholderTextColor={theme.textSecondary} />
              <Text style={labelStyle}>MONTHLY INCOME (₹)</Text>
              <TextInput style={inputStyle} value={income} onChangeText={setIncome} keyboardType="numeric" placeholderTextColor={theme.textSecondary} />
              <Text style={labelStyle}>MONTHLY BUDGET (₹)</Text>
              <TextInput style={inputStyle} value={budget} onChangeText={setBudget} keyboardType="numeric" placeholderTextColor={theme.textSecondary} />
              <Pressable style={[styles.saveBtn, { backgroundColor: theme.text }]} onPress={handleSave}>
                <Text style={[styles.saveBtnText, { color: theme.background }]}>Save Changes</Text>
              </Pressable>
            </View>
          )}
        </Card>

        {/* ── Data source toggle ── */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Data Source</Text>
          <View style={styles.toggleRow}>
            <View>
              <Text style={[styles.toggleLabel, { color: theme.text }]}>
                {useDemoData ? 'Using Demo Data' : 'Using My Data'}
              </Text>
              <Text style={[styles.toggleSub, { color: theme.textSecondary }]}>
                {useDemoData
                  ? 'Switch off to use your own transactions'
                  : `${transactions.length} personal transactions loaded`}
              </Text>
            </View>
            <Switch
              value={useDemoData}
              onValueChange={(val) => setUseDemoData(val)}
              trackColor={{ false: theme.text, true: theme.border }}
              thumbColor={theme.background}
            />
          </View>
        </Card>

        {/* ── Stats ── */}
        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>YOUR ANALYTICS</Text>
        <View style={styles.statsGrid}>
          {[
            { label: 'Total Spend', value: `₹${totalSpend.toLocaleString('en-IN')}` },
            { label: 'Avg Risk Score', value: `${avgRisk}/100` },
            { label: 'High Risk Txns', value: String(highRiskCount) },
            { label: 'Behavioral Dev.', value: `${deviation}%` },
          ].map((s) => (
            <Card key={s.label} style={styles.statCard}>
              <Text style={[styles.statValue, { color: theme.text }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{s.label}</Text>
            </Card>
          ))}
        </View>

        {/* ── Budget meter ── */}
        {userProfile.monthlyBudget > 0 && (
          <Card style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Budget Usage</Text>
            <View style={styles.budgetRow}>
              <Text style={[styles.budgetSpent, { color: theme.text }]}>
                ₹{totalSpend.toLocaleString('en-IN')}
              </Text>
              <Text style={[styles.budgetOf, { color: theme.textSecondary }]}>
                of ₹{userProfile.monthlyBudget.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={[styles.meterTrack, { backgroundColor: theme.surface }]}>
              <View
                style={[
                  styles.meterFill,
                  {
                    width: `${Math.min(100, (totalSpend / userProfile.monthlyBudget) * 100)}%`,
                    backgroundColor:
                      totalSpend > userProfile.monthlyBudget ? theme.danger : theme.text,
                  },
                ]}
              />
            </View>
            <Text style={[styles.budgetPct, { color: theme.textSecondary }]}>
              {Math.round((totalSpend / userProfile.monthlyBudget) * 100)}% used
            </Text>
          </Card>
        )}

        {/* ── AI Insights ── */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>🤖 AI Insights</Text>
          {insights.map((insight, i) => (
            <View key={i} style={[styles.insightRow, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border }]}>
              <Text style={[styles.insightText, { color: theme.textSecondary }]}>{insight}</Text>
            </View>
          ))}
        </Card>

        {/* ── Financial profile ── */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Financial Profile</Text>
          {[
            { key: 'Monthly Income', val: userProfile.monthlyIncome ? `₹${userProfile.monthlyIncome.toLocaleString('en-IN')}` : 'Not set' },
            { key: 'Monthly Budget', val: userProfile.monthlyBudget ? `₹${userProfile.monthlyBudget.toLocaleString('en-IN')}` : 'Not set' },
            { key: 'Home City', val: userProfile.city || 'Not set' },
            { key: 'Preferred Categories', val: userProfile.preferredCategories.length > 0 ? userProfile.preferredCategories.join(', ') : 'None selected' },
          ].map((row, i, arr) => (
            <View
              key={row.key}
              style={[
                styles.profileRow,
                i < arr.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.border },
              ]}
            >
              <Text style={[styles.profileKey, { color: theme.textSecondary }]}>{row.key}</Text>
              <Text style={[styles.profileVal, { color: theme.text }]} numberOfLines={2}>{row.val}</Text>
            </View>
          ))}
        </Card>

        {/* ── Add transaction CTA ── */}
        <Pressable
          style={[styles.addTxnBtn, { backgroundColor: theme.text }]}
          onPress={() => navigation.navigate('AddTransaction')}
        >
          <Text style={[styles.addTxnText, { color: theme.background }]}>
            + Add New Transaction
          </Text>
        </Pressable>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  profileCard: { marginBottom: 16 },
  profileHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: '700' },
  profileInfo: { flex: 1, gap: 3 },
  profileName: { ...Typography.h4 },
  profileEmail: { ...Typography.caption },
  profileCity: { ...Typography.caption },
  editBtn: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 6, borderWidth: StyleSheet.hairlineWidth,
  },
  editBtnText: { ...Typography.small, fontWeight: '700' },
  editForm: { marginTop: 12, gap: 4 },
  divider: { height: StyleSheet.hairlineWidth, marginBottom: 12 },
  label: { ...Typography.label, fontSize: 11, marginTop: 10, marginBottom: 5 },
  input: {
    ...Typography.body,
    paddingVertical: 12, paddingHorizontal: 14,
    borderRadius: 8, borderWidth: StyleSheet.hairlineWidth,
  },
  saveBtn: { marginTop: 16, paddingVertical: 13, borderRadius: 8, alignItems: 'center' },
  saveBtnText: { ...Typography.bodyBold },
  section: { marginBottom: 16 },
  sectionTitle: { ...Typography.h4, marginBottom: 14 },
  sectionHeader: { ...Typography.label, fontSize: 11, marginBottom: 10 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleLabel: { ...Typography.bodyBold, fontSize: 15 },
  toggleSub: { ...Typography.small, marginTop: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, minWidth: '47%', alignItems: 'center', paddingVertical: 16 },
  statValue: { ...Typography.h2, marginBottom: 4 },
  statLabel: { ...Typography.small, textAlign: 'center' },
  budgetRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 10 },
  budgetSpent: { ...Typography.h3 },
  budgetOf: { ...Typography.caption },
  meterTrack: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  meterFill: { height: '100%', borderRadius: 4 },
  budgetPct: { ...Typography.small },
  insightRow: { paddingVertical: 10 },
  insightText: { ...Typography.body },
  profileRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, gap: 12 },
  profileKey: { ...Typography.caption, flex: 1 },
  profileVal: { ...Typography.bodyBold, fontSize: 13, flex: 1, textAlign: 'right' },
  addTxnBtn: { paddingVertical: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  addTxnText: { ...Typography.bodyBold },
});
