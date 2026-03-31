# ForenXAI - Explainable Transaction Anomaly Detection

**Tagline:** Explain. Detect. Trust.

## 🎯 Product Vision

ForenXAI is an AI-powered forensic investigation tool for financial transactions. Unlike traditional banking apps, this is a professional-grade financial intelligence system designed for auditors, compliance teams, and fraud investigators.

## ✨ Key Features

### 1. **AI Transaction Feed**
- Real-time transaction monitoring
- Risk scoring (0-100)
- Swipe gestures for quick actions
- Status tracking (pending, safe, investigating, flagged)

### 2. **Explainable AI Panel** ⭐ CORE FEATURE
- Detailed explanation of WHY each transaction is flagged
- Feature importance breakdown
- Visual contribution factors
- No black-box decisions

### 3. **Behavioral Fingerprint Engine**
- User spending pattern analysis
- Deviation percentage from normal behavior
- Location, time, and amount pattern tracking

### 4. **Forensic Dashboard**
- Real-time statistics
- Anomaly trend visualization
- Risk overview cards
- High-risk alerts

### 5. **Investigation Mode**
- Create investigation cases
- Add notes and timeline
- Track case status
- Audit trail system

## 🎨 Design System

### Theme
- **Strict Black & White** - No colors, only grayscale
- Dark Mode: Black background, white text
- Light Mode: White background, black text
- Professional, forensic-style UI

### Typography
- Bold headers
- Clean sans-serif
- Large readable data
- Uppercase labels with letter spacing

### UI Style
- Sharp-edged cards
- Grid-based layout
- Smooth animations
- Minimal, professional aesthetic

## 🌍 Multilingual Support

Supported languages:
- English (default)
- Hindi (हिंदी)
- Marathi (मराठी)

Language switcher available in Settings.

## 🛠️ Tech Stack

- **Framework:** React Native with Expo SDK 54
- **Language:** TypeScript
- **State Management:** Zustand
- **Navigation:** React Navigation (Stack + Bottom Tabs)
- **Internationalization:** react-i18next
- **Animations:** React Native Reanimated + Gesture Handler
- **Charts:** Victory Native
- **Theme:** Context API

## 📱 App Structure

```
ForenXAI/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Card.tsx
│   │   ├── RiskBadge.tsx
│   │   └── TransactionCard.tsx
│   ├── contexts/         # React contexts
│   │   └── ThemeContext.tsx
│   ├── data/            # Mock data
│   │   └── mockData.ts
│   ├── i18n/            # Internationalization
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── en.json
│   │       ├── hi.json
│   │       └── mr.json
│   ├── navigation/      # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── screens/         # App screens
│   │   ├── SplashScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── TransactionsScreen.tsx
│   │   ├── TransactionDetailScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── store/           # State management
│   │   └── useStore.ts
│   ├── theme/           # Design system
│   │   ├── colors.ts
│   │   └── typography.ts
│   └── types/           # TypeScript types
│       └── index.ts
├── App.tsx
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Navigate to the project directory:
```bash
cd ForenXAI
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your device:
- **iOS:** Press `i` or scan QR code with Camera app
- **Android:** Press `a` or scan QR code with Expo Go app
- **Web:** Press `w`

## 📊 Data Structure

### Transaction Schema
```typescript
{
  id: string;
  amount: number;
  location: string;
  timestamp: string;
  merchant: string;
  category: string;
  riskScore: number;
  anomalyFactors: string[];
  explanationWeights: {
    [key: string]: number;
  };
  status: 'pending' | 'safe' | 'investigating' | 'flagged';
  userId: string;
}
```

## 🎯 Hackathon Edge Features

1. **Explainability Score** - Full transparency in AI decisions
2. **Behavioral Deviation Percentage** - Quantified anomaly detection
3. **Visual Contribution Factors** - Bar charts showing feature importance
4. **Investigation Case System** - Professional forensic workflow
5. **Audit Trail** - Immutable decision logging
6. **Multilingual Support** - Accessible to diverse teams

## 🔒 Security & Compliance

- Mock authentication system (ready for backend integration)
- Audit logging for all actions
- Immutable transaction records
- Role-based access control ready

## 🎨 UI/UX Highlights

- **Micro-interactions** - Smooth animations throughout
- **Gesture-based actions** - Swipe to mark safe/investigate
- **Animated charts** - Victory Native visualizations
- **Responsive design** - Works on all screen sizes
- **Accessibility** - High contrast, readable fonts

## 🚀 Future Enhancements

- Voice query system
- Network graph visualization
- Predictive risk alerts
- Real-time backend integration
- Advanced case management
- Export reports (PDF)
- Multi-user collaboration

## 📝 License

This project is created for hackathon purposes.

## 👥 Target Users

- Financial Auditors
- Compliance Teams
- Fraud Investigators
- Risk Analysts
- Forensic Accountants

---

**ForenXAI** - Not just an app, but a financial intelligence system.
