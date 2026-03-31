import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography } from '../theme/typography';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/Card';
import { SmartHeader } from '../components/SmartHeader';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी (Marathi)', flag: '🇮🇳' },
];

export const SettingsScreen = () => {
  const { theme, mode, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <SmartHeader title={t('settings.title')} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Theme */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('settings.theme')}</Text>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              {mode === 'dark' ? t('settings.darkMode') : t('settings.lightMode')}
            </Text>
            <Switch
              value={mode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.border, true: theme.text }}
              thumbColor={theme.background}
            />
          </View>
        </Card>

        {/* Language */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('settings.language')}</Text>
          {LANGUAGES.map((lang) => {
            const isActive = i18n.language === lang.code;
            return (
              <Pressable
                key={lang.code}
                style={[
                  styles.langRow,
                  { borderColor: theme.border },
                  isActive && { backgroundColor: theme.surface },
                ]}
                onPress={() => i18n.changeLanguage(lang.code)}
              >
                <Text style={styles.langFlag}>{lang.flag}</Text>
                <Text style={[styles.langLabel, { color: theme.text }]}>{lang.label}</Text>
                {isActive && <Text style={[styles.checkmark, { color: theme.text }]}>✓</Text>}
              </Pressable>
            );
          })}
        </Card>

        {/* App info */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('settings.appInfo')}</Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoKey, { color: theme.textSecondary }]}>{t('settings.version')}</Text>
            <Text style={[styles.infoVal, { color: theme.text }]}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoKey, { color: theme.textSecondary }]}>{t('settings.build')}</Text>
            <Text style={[styles.infoVal, { color: theme.text }]}>Expo SDK 54</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoKey, { color: theme.textSecondary }]}>Platform</Text>
            <Text style={[styles.infoVal, { color: theme.text }]}>ForenXAI Intelligence</Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16 },
  section: { marginBottom: 16 },
  sectionTitle: { ...Typography.h3, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { ...Typography.body },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    gap: 12,
  },
  langFlag: { fontSize: 20 },
  langLabel: { ...Typography.body, flex: 1 },
  checkmark: { fontSize: 16, fontWeight: '700' },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.15)',
  },
  infoKey: { ...Typography.caption },
  infoVal: { ...Typography.bodyBold, fontSize: 13 },
});
