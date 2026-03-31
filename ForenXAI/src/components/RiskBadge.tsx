import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography } from '../theme/typography';

interface RiskBadgeProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ score, size = 'medium' }) => {
  const { theme } = useTheme();

  const getRiskLevel = () => {
    if (score >= 70) return { label: 'HIGH', color: theme.riskHigh };
    if (score >= 40) return { label: 'MEDIUM', color: theme.riskMedium };
    return { label: 'LOW', color: theme.riskLow };
  };

  const risk = getRiskLevel();
  const sizeStyles = {
    small: { padding: 4, fontSize: 10 },
    medium: { padding: 6, fontSize: 12 },
    large: { padding: 8, fontSize: 14 },
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: risk.color,
          padding: sizeStyles[size].padding,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: theme.background,
            fontSize: sizeStyles[size].fontSize,
          },
        ]}
      >
        {score} • {risk.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 1,
  },
});
