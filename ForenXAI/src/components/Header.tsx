import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'EN', native: 'English' },
  { code: 'hi', label: 'HI', native: 'हिंदी' },
  { code: 'mr', label: 'MR', native: 'मराठी' },
];

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

// ─── Animated theme pill ──────────────────────────────────────────────────────
const ThemeToggle: React.FC = () => {
  const { theme, mode, toggleTheme } = useTheme();
  const isDark = mode === 'dark';

  // Thumb: 0 = left (dark side), 1 = right (light side)
  const thumbAnim = useRef(new Animated.Value(isDark ? 0 : 1)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  // Keep thumb in sync whenever mode changes (e.g. restored from AsyncStorage)
  useEffect(() => {
    Animated.spring(thumbAnim, {
      toValue: isDark ? 0 : 1,
      friction: 6,
      tension: 180,
      useNativeDriver: true,
    }).start();
  }, [isDark]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(pressScale, { toValue: 0.88, duration: 70, useNativeDriver: true }),
      Animated.spring(pressScale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    toggleTheme();
  };

  const thumbTranslate = thumbAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 20],
  });

  return (
    <Animated.View style={{ transform: [{ scale: pressScale }] }}>
      <Pressable
        onPress={handlePress}
        hitSlop={8}
        style={[
          styles.toggleTrack,
          {
            backgroundColor: isDark ? theme.surface : theme.accent,
            borderColor: theme.border,
          },
        ]}
      >
        {/* ● light icon (left) */}
        <Text style={[styles.toggleIcon, { color: isDark ? theme.textSecondary : theme.background }]}>
          ●
        </Text>
        {/* ○ dark icon (right) */}
        <Text style={[styles.toggleIcon, { color: isDark ? theme.text : theme.textSecondary }]}>
          ○
        </Text>

        {/* Sliding thumb */}
        <Animated.View
          style={[
            styles.toggleThumb,
            {
              backgroundColor: isDark ? theme.text : theme.background,
              transform: [{ translateX: thumbTranslate }],
            },
          ]}
        />
      </Pressable>
    </Animated.View>
  );
};

// ─── Main header ──────────────────────────────────────────────────────────────
export const Header: React.FC<HeaderProps> = ({ title, showBack = false, onBack }) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const [langOpen, setLangOpen] = useState(false);
  const langScale = useRef(new Animated.Value(1)).current;

  const tapAnim = (anim: Animated.Value, cb?: () => void) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.78, duration: 70, useNativeDriver: true }),
      Animated.spring(anim, { toValue: 1, friction: 5, tension: 200, useNativeDriver: true }),
    ]).start(() => cb?.());
  };

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  return (
    <>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: theme.background,
            borderBottomColor: theme.border,
            paddingTop: insets.top + 10,
          },
        ]}
      >
        {/* LEFT */}
        <View style={styles.left}>
          {showBack && onBack ? (
            <Pressable onPress={onBack} hitSlop={10}>
              <Text style={[styles.backArrow, { color: theme.text }]}>←</Text>
            </Pressable>
          ) : (
            <Text style={[styles.logo, { color: theme.text }]}>ForenXAI</Text>
          )}
        </View>

        {/* CENTER */}
        <View style={styles.center} pointerEvents="none">
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* RIGHT */}
        <View style={styles.right}>
          {/* Language */}
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

          {/* Animated theme toggle pill */}
          <ThemeToggle />
        </View>
      </View>

      {/* Language dropdown */}
      <Modal visible={langOpen} transparent animationType="fade" onRequestClose={() => setLangOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setLangOpen(false)}>
          <View
            style={[
              styles.dropdown,
              { backgroundColor: theme.card, borderColor: theme.border, top: insets.top + 58 },
            ]}
          >
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
                  {isActive && <Text style={[styles.activeCheck, { color: theme.text }]}>✓</Text>}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 100,
  },
  left: { width: 90, alignItems: 'flex-start' },
  logo: { fontSize: 16, fontWeight: '800', letterSpacing: 0.8 },
  backArrow: { fontSize: 22, fontWeight: '300' },
  center: { flex: 1, alignItems: 'center', paddingHorizontal: 4 },
  title: { fontSize: 15, fontWeight: '600', letterSpacing: 0.4 },
  right: {
    width: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },

  // Language button
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

  // Toggle pill
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  toggleIcon: { fontSize: 8, zIndex: 1 },
  toggleThumb: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    zIndex: 2,
  },

  // Dropdown
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  dropdown: {
    position: 'absolute',
    right: 16,
    width: 180,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  dropdownHeader: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dropdownHeading: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  optionCode: { fontSize: 13, fontWeight: '700', letterSpacing: 0.4 },
  optionNative: { fontSize: 11 },
  activeCheck: { fontSize: 14, fontWeight: '700' },
});
