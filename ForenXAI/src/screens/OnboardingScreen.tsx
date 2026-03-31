import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { Typography } from '../theme/typography';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'EN', native: 'English' },
  { code: 'hi', label: 'HI', native: 'हिंदी' },
  { code: 'mr', label: 'MR', native: 'मराठी' },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { theme, mode, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const [currentPage, setCurrentPage] = useState(0);
  const [langOpen, setLangOpen] = useState(false);
  const themeScale = useRef(new Animated.Value(1)).current;
  const langScale = useRef(new Animated.Value(1)).current;

  const tapAnim = (anim: Animated.Value, cb?: () => void) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.78, duration: 70, useNativeDriver: true }),
      Animated.spring(anim, { toValue: 1, friction: 5, tension: 200, useNativeDriver: true }),
    ]).start(() => cb?.());
  };

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  const pages = [
    { title: t('onboarding.title1'), description: t('onboarding.desc1'), icon: '🔍' },
    { title: t('onboarding.title2'), description: t('onboarding.desc2'), icon: '🧠' },
    { title: t('onboarding.title3'), description: t('onboarding.desc3'), icon: '⚖️' },
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) setCurrentPage(currentPage + 1);
    else onComplete();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top bar */}
      <View style={[styles.topBar, { borderBottomColor: theme.border, paddingTop: insets.top + 10 }]}>
        <Text style={[styles.logo, { color: theme.text }]}>ForenXAI</Text>
        <View style={styles.topBarRight}>
          <Animated.View style={{ transform: [{ scale: langScale }] }}>
            <Pressable
              style={[styles.langBtn, { borderColor: theme.border, backgroundColor: theme.surface }]}
              onPress={() => tapAnim(langScale, () => setLangOpen(true))}
              hitSlop={6}
            >
              <Text style={[styles.langBtnText, { color: theme.text }]}>{currentLang.label}</Text>
              <Text style={[styles.chevron, { color: theme.textSecondary }]}>▾</Text>
            </Pressable>
          </Animated.View>
          <Animated.View style={{ transform: [{ scale: themeScale }] }}>
            <Pressable
              style={[styles.themeBtn, { borderColor: theme.border, backgroundColor: theme.surface }]}
              onPress={() => tapAnim(themeScale, toggleTheme)}
              hitSlop={6}
            >
              <Text style={styles.themeIcon}>{mode === 'dark' ? '○' : '●'}</Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>

      {/* Page content */}
      <View style={styles.content}>
        <Text style={styles.pageIcon}>{pages[currentPage].icon}</Text>
        <Text style={[styles.pageTitle, { color: theme.text }]}>{pages[currentPage].title}</Text>
        <Text style={[styles.pageDesc, { color: theme.textSecondary }]}>{pages[currentPage].description}</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {pages.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === currentPage ? theme.text : theme.border },
                i === currentPage && styles.dotActive,
              ]}
            />
          ))}
        </View>
        <Pressable style={[styles.nextBtn, { backgroundColor: theme.text }]} onPress={handleNext}>
          <Text style={[styles.nextBtnText, { color: theme.background }]}>
            {currentPage === pages.length - 1 ? t('onboarding.getStarted') : t('onboarding.next')}
          </Text>
        </Pressable>
      </View>

      {/* Language modal */}
      <Modal visible={langOpen} transparent animationType="fade" onRequestClose={() => setLangOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setLangOpen(false)}>
          <View style={[styles.dropdown, { backgroundColor: theme.card, borderColor: theme.border, top: insets.top + 58 }]}>
            <View style={[styles.dropdownHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.dropdownHeading, { color: theme.textSecondary }]}>LANGUAGE</Text>
            </View>
            {LANGUAGES.map((lang, idx) => {
              const isActive = i18n.language === lang.code;
              const isLast = idx === LANGUAGES.length - 1;
              return (
                <Pressable
                  key={lang.code}
                  style={[
                    styles.option,
                    !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.border },
                    isActive && { backgroundColor: theme.surface },
                  ]}
                  onPress={() => { i18n.changeLanguage(lang.code); setLangOpen(false); }}
                >
                  <View>
                    <Text style={[styles.optionCode, { color: theme.text }]}>{lang.label}</Text>
                    <Text style={[styles.optionNative, { color: theme.textSecondary }]}>{lang.native}</Text>
                  </View>
                  {isActive && <Text style={[styles.check, { color: theme.text }]}>✓</Text>}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  logo: { fontSize: 16, fontWeight: '800', letterSpacing: 0.8 },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  langBtn: {
    flexDirection: 'row', alignItems: 'center', borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 5, gap: 3,
  },
  langBtnText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.6 },
  chevron: { fontSize: 9, lineHeight: 14 },
  themeBtn: {
    width: 32, height: 32, borderRadius: 6, borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center', justifyContent: 'center',
  },
  themeIcon: { fontSize: 14, fontWeight: '700' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  pageIcon: { fontSize: 72, marginBottom: 32 },
  pageTitle: { ...Typography.h1, textAlign: 'center', marginBottom: 16 },
  pageDesc: { ...Typography.body, textAlign: 'center', lineHeight: 26 },
  footer: { paddingHorizontal: 24, paddingBottom: 48 },
  pagination: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 28 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  dotActive: { width: 20, borderRadius: 3 },
  nextBtn: { paddingVertical: 16, borderRadius: 10, alignItems: 'center' },
  nextBtnText: { ...Typography.bodyBold, letterSpacing: 0.8 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  dropdown: {
    position: 'absolute', right: 16, width: 180, borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden', elevation: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.18, shadowRadius: 12,
  },
  dropdownHeader: { paddingHorizontal: 14, paddingVertical: 9, borderBottomWidth: StyleSheet.hairlineWidth },
  dropdownHeading: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2 },
  option: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 13,
  },
  optionCode: { fontSize: 13, fontWeight: '700', letterSpacing: 0.4 },
  optionNative: { fontSize: 11 },
  check: { fontSize: 14, fontWeight: '700' },
});
