import React from 'react';
import { Text, View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Typography } from '../theme/typography';
import { Card } from '../components/Card';

import { HomeScreen } from '../screens/HomeScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { TransactionDetailScreen } from '../screens/TransactionDetailScreen';
import { InvestigationScreen } from '../screens/InvestigationScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { NetworkGraphScreen } from '../screens/NetworkGraphScreen';
import { AIInsightScreen } from '../screens/AIInsightScreen';
import { AuditTrailScreen } from '../screens/AuditTrailScreen';
import { BehavioralScreen } from '../screens/BehavioralScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { MyProfileScreen } from '../screens/MyProfileScreen';
import { AddTransactionScreen } from '../screens/AddTransactionScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const MoreStack = createStackNavigator();

const TAB_ICONS: Record<string, string> = {
  Home: '⬛',
  Transactions: '≡',
  Cases: '⚑',
  Analytics: '◈',
  More: '⋯',
};

// ─── More menu screen ────────────────────────────────────────────────────────
const MoreMenuScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const tools = [
    { label: `👤 My Profile & Analytics`, screen: 'MyProfile', desc: 'View your data, budget & AI insights' },
    { label: `➕ Add Transaction`, screen: 'AddTransaction', desc: 'Manually enter a transaction for analysis' },
    { label: `🕸️ ${t('more.network')}`, screen: 'Network', desc: t('more.networkDesc') },
    { label: `🤖 ${t('more.aiInsight')}`, screen: 'AIInsight', desc: t('more.aiInsightDesc') },
    { label: `🧬 ${t('more.behavioral')}`, screen: 'Behavioral', desc: t('more.behavioralDesc') },
    { label: `🧾 ${t('more.auditTrail')}`, screen: 'AuditTrail', desc: t('more.auditTrailDesc') },
    { label: `⚙️ ${t('settings.title')}`, screen: 'Settings', desc: t('more.settingsDesc') },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
        {t('more.forensicTools')}
      </Text>
      {tools.map((tool) => (
        <Pressable key={tool.screen} onPress={() => navigation.navigate(tool.screen)}>
          <Card style={styles.toolCard} elevated>
            <Text style={[styles.toolLabel, { color: theme.text }]}>{tool.label}</Text>
            <Text style={[styles.toolDesc, { color: theme.textSecondary }]}>{tool.desc}</Text>
          </Card>
        </Pressable>
      ))}
    </ScrollView>
  );
};

// ─── More stack ──────────────────────────────────────────────────────────────
const MoreNavigator = () => (
  <MoreStack.Navigator screenOptions={{ headerShown: false }}>
    <MoreStack.Screen name="MoreHome" component={MoreMenuScreen} />
    <MoreStack.Screen name="Network" component={NetworkGraphScreen} />
    <MoreStack.Screen name="AIInsight" component={AIInsightScreen} />
    <MoreStack.Screen name="AuditTrail" component={AuditTrailScreen} />
    <MoreStack.Screen name="Behavioral" component={BehavioralScreen} />
    <MoreStack.Screen name="Settings" component={SettingsScreen} />
    <MoreStack.Screen name="MyProfile" component={MyProfileScreen} />
    <MoreStack.Screen name="AddTransaction" component={AddTransactionScreen} />
  </MoreStack.Navigator>
);

// ─── Tab navigator ───────────────────────────────────────────────────────────
const TabNavigator = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          paddingBottom: 6,
          paddingTop: 4,
          height: 62,
        },
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        tabBarIcon: ({ color }) => (
          <Text style={{ fontSize: 16, color }}>{TAB_ICONS[route.name] ?? '•'}</Text>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t('nav.dashboard') }} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} options={{ tabBarLabel: t('nav.transactions') }} />
      <Tab.Screen name="Cases" component={InvestigationScreen} options={{ tabBarLabel: t('nav.cases') }} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ tabBarLabel: t('nav.analytics') }} />
      <Tab.Screen name="More" component={MoreNavigator} options={{ tabBarLabel: t('nav.more') }} />
    </Tab.Navigator>
  );
};

// ─── Root stack ──────────────────────────────────────────────────────────────
export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
      <Stack.Screen name="MyProfile" component={MyProfileScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  sectionTitle: { ...Typography.label, fontSize: 11, marginBottom: 16 },
  toolCard: { marginBottom: 12 },
  toolLabel: { ...Typography.h4, marginBottom: 4 },
  toolDesc: { ...Typography.caption },
});
