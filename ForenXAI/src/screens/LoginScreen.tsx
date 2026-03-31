import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { Typography } from '../theme/typography';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'EN', native: 'English' },
  { code: 'hi', label: 'HI', native: 'हिंदी' },
  { code: 'mr', label: 'MR', native: 'मराठी' },
];

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const { theme, mode, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Top bar with lang + theme */}
      <View
        style={[
          styles.topBar,
          {
            borderBottomColor: theme.border,
            paddingTop: insets.top + 10,
          },
        ]}
      >
        <View style={styles.topBarLeft} />
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

      {/* Login form */}
      <View style={styles.content}>
        <Text style={[styles.logo, { color: theme.text }]}>ForenXAI</Text>
        <Text style={[styles.tagline, { color: theme.textSecondary }]}>
          {t('app.tagline')}
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              {t('auth.email').toUpperCase()}
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={email}
              onChangeText={setEmail}
              placeholder={t('auth.placeholder_email')}
              placeholderTextColor={theme.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              {t('auth.password').toUpperCase()}
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={password}
              onChangeText={setPassword}
              placeholder={t('auth.placeholder_password')}
              placeholderTextColor={theme.textSecondary}
              secureTextEntry
            />
          </View>

          <Pressable style={[styles.loginBtn, { backgroundColor: theme.text }]} onPress={onLogin}>
            <Text style={[styles.loginBtnText, { color: theme.background }]}>
              {t('auth.login')}
            </Text>
          </Pressable>

          <Pressable>
            <Text style={[styles.forgotText, { color: theme.textSecondary }]}>
              {t('auth.forgotPassword')}
            </Text>
          </Pressable>
        </View>
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topBarLeft: { flex: 1 },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 3,
  },
  langBtnText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.6 },
  chevron: { fontSize: 9, lineHeight: 14 },
  themeBtn: {
    width: 32, height: 32, borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center', justifyContent: 'center',
  },
  themeIcon: { fontSize: 14, fontWeight: '700' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  logo: { fontSize: 40, fontWeight: '800', textAlign: 'center', letterSpacing: 1, marginBottom: 6 },
  tagline: { ...Typography.body, textAlign: 'center', marginBottom: 48, letterSpacing: 1.5 },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  inputLabel: { ...Typography.label, fontSize: 11 },
  input: {
    ...Typography.body,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  loginBtn: { paddingVertical: 16, borderRadius: 10, alignItems: 'center', marginTop: 4 },
  loginBtnText: { ...Typography.bodyBold, letterSpacing: 1 },
  forgotText: { ...Typography.caption, textAlign: 'center', marginTop: 4 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  dropdown: {
    position: 'absolute', right: 16, width: 180,
    borderRadius: 10, borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden', elevation: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18, shadowRadius: 12,
  },
  dropdownHeader: { paddingHorizontal: 14, paddingVertical: 9, borderBottomWidth: StyleSheet.hairlineWidth },
  dropdownHeading: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2 },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 13 },
  optionCode: { fontSize: 13, fontWeight: '700', letterSpacing: 0.4 },
  optionNative: { fontSize: 11 },
  check: { fontSize: 14, fontWeight: '700' },
});
