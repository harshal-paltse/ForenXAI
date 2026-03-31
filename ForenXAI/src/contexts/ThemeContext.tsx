import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { Animated, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Theme, ThemeMode } from '../theme/colors';

const STORAGE_KEY = 'forenxai_theme';

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (m: ThemeMode) => void;
  themeAnim: Animated.Value;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const themeAnim = useRef(new Animated.Value(0)).current;   // 0=dark 1=light
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const overlayColor = useRef('#000000');
  // Keep a ref so callbacks always see the latest mode without stale closure
  const modeRef = useRef<ThemeMode>('dark');

  // Restore persisted preference on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark') {
        modeRef.current = saved;
        setMode(saved);
        themeAnim.setValue(saved === 'light' ? 1 : 0);
      }
    });
  }, []);

  const applyTheme = (next: ThemeMode) => {
    if (next === modeRef.current) return;

    // Pick overlay colour that matches the destination theme
    overlayColor.current = next === 'light' ? '#FFFFFF' : '#000000';

    // Phase 1 — fade in overlay
    Animated.timing(overlayAnim, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      // Phase 2 — swap theme while hidden
      modeRef.current = next;
      setMode(next);
      themeAnim.setValue(next === 'light' ? 1 : 0);
      AsyncStorage.setItem(STORAGE_KEY, next);

      // Phase 3 — fade out overlay
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }).start();
    });
  };

  const toggleTheme = () => applyTheme(modeRef.current === 'dark' ? 'light' : 'dark');
  const setTheme = (m: ThemeMode) => applyTheme(m);

  return (
    <ThemeContext.Provider
      value={{ theme: Colors[mode], mode, toggleTheme, setTheme, themeAnim }}
    >
      {children}

      {/* Full-screen crossfade overlay */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: overlayColor.current, opacity: overlayAnim, zIndex: 9999 },
        ]}
      />
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
