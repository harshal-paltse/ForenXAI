import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { SplashScreen } from './src/screens/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { ProfileSetupScreen } from './src/screens/ProfileSetupScreen';
import { AppNavigator } from './src/navigation/AppNavigator';
import './src/i18n';

type AppState = 'splash' | 'onboarding' | 'login' | 'setup' | 'main';

function AppContent() {
  const [appState, setAppState] = useState<AppState>('splash');
  const { mode } = useTheme();

  if (appState === 'splash') {
    return <SplashScreen onFinish={() => setAppState('onboarding')} />;
  }
  if (appState === 'onboarding') {
    return <OnboardingScreen onComplete={() => setAppState('login')} />;
  }
  if (appState === 'login') {
    return <LoginScreen onLogin={() => setAppState('setup')} />;
  }
  if (appState === 'setup') {
    return (
      <ProfileSetupScreen
        onComplete={() => setAppState('main')}
        onSkip={() => setAppState('main')}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} animated />
      <AppNavigator />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
