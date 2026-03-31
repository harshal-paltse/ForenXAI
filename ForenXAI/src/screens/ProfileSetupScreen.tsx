import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  Pressable, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography } from '../theme/typography';
import { useStore } from '../store/useStore';
import { CATEGORIES } from '../utils/riskEngine';
import { UserProfile } from '../types';

interface Props { onComplete: () => void; onSkip: () => void; }

const STEPS = ['Personal', 'Financial', 'Preferences'];

export const ProfileSetupScreen: React.FC<Props> = ({ onComplete, onSkip }) => {
  const { theme } = useTheme();
  const { setUserProfile, completeSetup } = useStore();
  const [step, setStep] = useState(0);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [income, setIncome] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  const toggleCat = (cat: string) =>
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const handleFinish = () => {
    const profile: UserProfile = {
      name: name.trim() || 'User',
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim() || 'Mumbai',
      monthlyIncome: parseFloat(income) || 50000,
      monthlyBudget: parseFloat(budget) || 30000,
      preferredCategories: selectedCats,
      isSetupComplete: true,
    };
    setUserProfile(profile);
    completeSetup();
    onComplete();
  };

  const canNext = () => {
    if (step === 0) return name.trim().length > 0 && city.trim().length > 0;
    if (step === 1) return parseFloat(budget) > 0;
    return true;
  };

  const inputStyle = [
    styles.input,
    { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border },
  ];
  const labelStyle = [styles.label, { color: theme.textSecondary }];

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.appName, { color: theme.text }]}>ForenXAI</Text>
        <Text style={[styles.headerSub, { color: theme.textSecondary }]}>Profile Setup</Text>
      </View>

      {/* Step indicator */}
      <View style={styles.stepRow}>
        {STEPS.map((s, i) => (
          <View key={s} style={styles.stepItem}>
            <View
              style={[
                styles.stepDot,
                {
                  backgroundColor: i <= step ? theme.text : theme.border,
                  width: i === step ? 24 : 8,
                },
              ]}
            />
            <Text style={[styles.stepLabel, { color: i === step ? theme.text : theme.textSecondary }]}>
              {s}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* ── Step 0: Personal ── */}
        {step === 0 && (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.text }]}>Tell us about yourself</Text>
            <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
              This helps personalise your risk analysis
            </Text>

            <Text style={labelStyle}>FULL NAME *</Text>
            <TextInput style={inputStyle} value={name} onChangeText={setName} placeholder="e.g. Rahul Sharma" placeholderTextColor={theme.textSecondary} />

            <Text style={labelStyle}>EMAIL</Text>
            <TextInput style={inputStyle} value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor={theme.textSecondary} keyboardType="email-address" autoCapitalize="none" />

            <Text style={labelStyle}>PHONE</Text>
            <TextInput style={inputStyle} value={phone} onChangeText={setPhone} placeholder="+91 98765 43210" placeholderTextColor={theme.textSecondary} keyboardType="phone-pad" />

            <Text style={labelStyle}>HOME CITY *</Text>
            <TextInput style={inputStyle} value={city} onChangeText={setCity} placeholder="e.g. Mumbai" placeholderTextColor={theme.textSecondary} />
          </View>
        )}

        {/* ── Step 1: Financial ── */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.text }]}>Your finances</Text>
            <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
              Used to detect budget overruns and spending anomalies
            </Text>

            <Text style={labelStyle}>MONTHLY INCOME (₹)</Text>
            <TextInput style={inputStyle} value={income} onChangeText={setIncome} placeholder="e.g. 75000" placeholderTextColor={theme.textSecondary} keyboardType="numeric" />

            <Text style={labelStyle}>MONTHLY BUDGET (₹) *</Text>
            <TextInput style={inputStyle} value={budget} onChangeText={setBudget} placeholder="e.g. 40000" placeholderTextColor={theme.textSecondary} keyboardType="numeric" />

            {parseFloat(budget) > 0 && parseFloat(income) > 0 && (
              <View style={[styles.infoBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                  Budget is {Math.round((parseFloat(budget) / parseFloat(income)) * 100)}% of income
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ── Step 2: Preferences ── */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.text }]}>Spending categories</Text>
            <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
              Select categories you regularly spend in (helps reduce false alerts)
            </Text>
            <View style={styles.catGrid}>
              {CATEGORIES.map((cat) => {
                const active = selectedCats.includes(cat);
                return (
                  <Pressable
                    key={cat}
                    style={[
                      styles.catChip,
                      {
                        backgroundColor: active ? theme.text : theme.surface,
                        borderColor: active ? theme.text : theme.border,
                      },
                    ]}
                    onPress={() => toggleCat(cat)}
                  >
                    <Text style={[styles.catChipText, { color: active ? theme.background : theme.textSecondary }]}>
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer buttons */}
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <Pressable onPress={onSkip} style={styles.skipBtn}>
          <Text style={[styles.skipText, { color: theme.textSecondary }]}>Use Demo Data</Text>
        </Pressable>

        {step > 0 && (
          <Pressable
            style={[styles.navBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => setStep(step - 1)}
          >
            <Text style={[styles.navBtnText, { color: theme.text }]}>Back</Text>
          </Pressable>
        )}

        <Pressable
          style={[
            styles.navBtn,
            styles.primaryBtn,
            { backgroundColor: canNext() ? theme.text : theme.border },
          ]}
          onPress={() => {
            if (step < STEPS.length - 1) setStep(step + 1);
            else handleFinish();
          }}
          disabled={!canNext()}
        >
          <Text style={[styles.navBtnText, { color: theme.background }]}>
            {step === STEPS.length - 1 ? 'Finish Setup' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  appName: { fontSize: 18, fontWeight: '800', letterSpacing: 0.8 },
  headerSub: { ...Typography.caption, marginTop: 2 },
  stepRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 20,
    alignItems: 'center',
  },
  stepItem: { alignItems: 'center', gap: 4 },
  stepDot: { height: 8, borderRadius: 4 },
  stepLabel: { ...Typography.small },
  content: { paddingHorizontal: 20, paddingBottom: 20 },
  stepContent: { gap: 6 },
  stepTitle: { ...Typography.h2, marginBottom: 4 },
  stepDesc: { ...Typography.body, marginBottom: 20 },
  label: { ...Typography.label, fontSize: 11, marginTop: 14, marginBottom: 6 },
  input: {
    ...Typography.body,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  infoBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  infoText: { ...Typography.caption },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  catChipText: { ...Typography.caption },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  skipBtn: { flex: 1 },
  skipText: { ...Typography.caption },
  navBtn: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  primaryBtn: { borderWidth: 0, minWidth: 120 },
  navBtnText: { ...Typography.bodyBold, fontSize: 14 },
});
