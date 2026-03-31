export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  divider: string;
  riskLow: string;
  riskMedium: string;
  riskHigh: string;
  accent: string;
  accentLight: string;
  safe: string;
  warning: string;
  danger: string;
}

export const Colors: Record<ThemeMode, Theme> = {
  // ── DARK ─────────────────────────────────────────────────────────────────
  dark: {
    mode: 'dark',
    background: '#000000',   // pure black
    surface: '#111111',      // slightly lifted
    card: '#1A1A1A',         // card bg
    text: '#FFFFFF',         // pure white text
    textSecondary: '#AAAAAA',// secondary labels
    border: '#2A2A2A',       // subtle borders
    divider: '#1F1F1F',
    riskLow: '#CCCCCC',
    riskMedium: '#AAAAAA',
    riskHigh: '#FFFFFF',
    accent: '#E5E5E5',
    accentLight: '#333333',
    safe: '#BBBBBB',
    warning: '#DDDDDD',
    danger: '#FFFFFF',
  },
  // ── LIGHT ────────────────────────────────────────────────────────────────
  light: {
    mode: 'light',
    background: '#FFFFFF',   // pure white
    surface: '#F2F2F2',      // light grey surface
    card: '#F8F8F8',         // card bg
    text: '#000000',         // pure black text
    textSecondary: '#444444',// dark enough to read
    border: '#CCCCCC',       // visible borders
    divider: '#E5E5E5',
    riskLow: '#333333',
    riskMedium: '#555555',
    riskHigh: '#000000',
    accent: '#111111',
    accentLight: '#DDDDDD',
    safe: '#333333',
    warning: '#222222',
    danger: '#000000',
  },
};
