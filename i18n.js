import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enUS from './src/locales/en-US/translation.json';
import esES from './src/locales/es-ES/translation.json';

const lang = navigator.language || navigator.userLanguage;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'en-US': {
        translation: enUS
      },
      'es-ES': {
        translation: esES
      }
    },
    lng: lang,
    fallbackLng: {
      en: ['en-US'],
      es: ['es-ES'],
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false,
    },
});

export default i18n;