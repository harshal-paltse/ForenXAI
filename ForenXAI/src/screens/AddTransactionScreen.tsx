import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  Pressable, KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography } from '../theme/typography';
import { useStore } from '../store/useStore';
import { Transaction } from '../types';
import { computeRisk } from '../utils/riskEngine';
import { CATEGORIES } from '../utils/riskEngine';
import { SmartHeader } from '../components/SmartHeader';

interface Props { navigation: any; }

export const AddTransactionScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { transactions, userProfile, addTransaction } = useStore();

  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [location, setLocation] = useState(userProfile.city || '');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState<Transaction | null>(null);

  const inputStyle = [styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }];
  const labelStyle = [styles.label, { color: theme.textSecondary }];

  const buildTimestamp = () => `${date}T${time}:00Z`;

  const handlePreview = () => {
    if (!amount || !merchant || !category) return;
    const base = {
      id: `TXN${Date.now()}`,
      amount: parseFloat(amount),
      merchant: merchant.trim(),
      location: location.trim() || userProfile.city || 'Unknown',
      timestamp: buildTimestamp(),
      category,
      userId: userProfile.email || 'user',
    };
    const risk = computeRisk(base, transactions, userProfile);
    setPreview({ ...base, ...risk });
  };

  const handleSave = () => {
    if (!preview) return;
    addTransaction(preview);
    setSaved(true);
    setTimeout(() => navigation.goBack(), 1200);
  };

  const riskColor = (score: number) =>
    score >= 70 ? theme.danger : score >= 40 ? theme.textSecondary : theme.safe;

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SmartHeader title="Add Transaction" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Transaction Details</Text>

        <Text style={labelStyle}>AMOUNT (₹) *</Text>
        <TextInput style={inputStyle} value={amount} onChangeText={setAmount} placeholder="e.g. 2500" placeholderTextColor={theme.textSecondary} keyboardType="numeric" />

        <Text style={labelStyle}>MERCHANT / PAYEE *</Text>
        <TextInput style={inputStyle} value={merchant} onChangeText={setMerchant} placeholder="e.g. Swiggy, Amazon, Petrol Pump" placeholderTextColor={theme.textSecondary} />

        <Text style={labelStyle}>LOCATION</Text>
        <TextInput style={inputStyle} value={location} onChangeText={setLocation} placeholder="e.g. Mumbai, India" placeholderTextColor={theme.textSecondary} />

        <Text style={labelStyle}>CATEGORY *</Text>
        <Pressable
          style={[inputStyle, styles.catSelector]}
          onPress={() => setCatModalOpen(true)}
        >
          <Text style={{ color: category ? theme.text : theme.textSecondary, ...Typography.body }}>
            {category || 'Select category...'}
          </Text>
          <Text style={{ color: theme.textSecondary }}>▾</Text>
        </Pressable>

        <View style={styles.dateRow}>
          <View style={styles.dateField}>
            <Text style={labelStyle}>DATE</Text>
            <TextInput style={inputStyle} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" placeholderTextColor={theme.textSecondary} />
          </View>
          <View style={styles.dateField}>
            <Text style={labelStyle}>TIME (24h)</Text>
            <TextInput style={inputStyle} value={time} onChangeText={setTime} placeholder="HH:MM" placeholderTextColor={theme.textSecondary} />
          </View>
        </View>

        {/* AI Risk Preview */}
        {preview && (
          <View style={[styles.previewCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.previewTitle, { color: theme.text }]}>AI Risk Analysis</Text>

            <View style={styles.scoreRow}>
              <Text style={[styles.scoreLabel, { color: theme.textSecondary }]}>RISK SCORE</Text>
              <Text style={[styles.scoreValue, { color: riskColor(preview.riskScore) }]}>
                {preview.riskScore}/100
              </Text>
            </View>

            <View style={[styles.scoreMeter, { backgroundColor: theme.surface }]}>
              <View
                style={[
                  styles.scoreFill,
                  {
                    width: `${preview.riskScore}%`,
                    backgroundColor: riskColor(preview.riskScore),
                  },
                ]}
              />
            </View>

            {preview.anomalyFactors.length > 0 ? (
              <>
                <Text style={[styles.factorsTitle, { color: theme.textSecondary }]}>ANOMALY FACTORS</Text>
                {preview.anomalyFactors.map((f, i) => (
                  <Text key={i} style={[styles.factor, { color: theme.text }]}>▸ {f}</Text>
                ))}
              </>
            ) : (
              <Text style={[styles.factor, { color: theme.safe }]}>✓ No anomalies detected</Text>
            )}
          </View>
        )}

        {saved && (
          <View style={[styles.savedBanner, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.savedText, { color: theme.text }]}>✓ Transaction saved successfully</Text>
          </View>
        )}

        {/* Buttons */}
        <View style={styles.btnRow}>
          <Pressable
            style={[styles.btn, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={handlePreview}
            disabled={!amount || !merchant || !category}
          >
            <Text style={[styles.btnText, { color: theme.text }]}>🤖 Analyse Risk</Text>
          </Pressable>

          <Pressable
            style={[
              styles.btn,
              styles.primaryBtn,
              { backgroundColor: preview ? theme.text : theme.border },
            ]}
            onPress={handleSave}
            disabled={!preview}
          >
            <Text style={[styles.btnText, { color: theme.background }]}>Save Transaction</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Category picker modal */}
      <Modal visible={catModalOpen} transparent animationType="fade" onRequestClose={() => setCatModalOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setCatModalOpen(false)}>
          <View style={[styles.catModal, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.catModalTitle, { color: theme.text }]}>Select Category</Text>
            <ScrollView>
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat}
                  style={[
                    styles.catOption,
                    { borderBottomColor: theme.border },
                    category === cat && { backgroundColor: theme.surface },
                  ]}
                  onPress={() => { setCategory(cat); setCatModalOpen(false); }}
                >
                  <Text style={[styles.catOptionText, { color: theme.text }]}>{cat}</Text>
                  {category === cat && <Text style={{ color: theme.text }}>✓</Text>}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  sectionTitle: { ...Typography.h3, marginBottom: 16 },
  label: { ...Typography.label, fontSize: 11, marginTop: 14, marginBottom: 6 },
  input: {
    ...Typography.body,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  catSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateRow: { flexDirection: 'row', gap: 12 },
  dateField: { flex: 1 },
  previewCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  previewTitle: { ...Typography.h4, marginBottom: 4 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scoreLabel: { ...Typography.label, fontSize: 11 },
  scoreValue: { fontSize: 28, fontWeight: '800' },
  scoreMeter: { height: 6, borderRadius: 3, overflow: 'hidden', marginVertical: 4 },
  scoreFill: { height: '100%', borderRadius: 3 },
  factorsTitle: { ...Typography.label, fontSize: 10, marginTop: 8 },
  factor: { ...Typography.caption, marginTop: 4 },
  savedBanner: {
    marginTop: 16,
    padding: 14,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  savedText: { ...Typography.bodyBold },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  primaryBtn: { borderWidth: 0 },
  btnText: { ...Typography.bodyBold, fontSize: 14 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  catModal: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    maxHeight: '70%',
    padding: 16,
  },
  catModalTitle: { ...Typography.h4, marginBottom: 12 },
  catOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  catOptionText: { ...Typography.body },
});
