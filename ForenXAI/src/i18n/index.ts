import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';

const LANG_KEY = 'forenxai_lang';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

// Restore persisted language
AsyncStorage.getItem(LANG_KEY).then((lang) => {
  if (lang && ['en', 'hi', 'mr'].includes(lang)) {
    i18n.changeLanguage(lang);
  }
});

// Persist on change
i18n.on('languageChanged', (lng) => {
  AsyncStorage.setItem(LANG_KEY, lng);
});

export default i18n;
