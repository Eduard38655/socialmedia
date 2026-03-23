 
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Importa tus JSON
 
import enTranslations from '../../Backend/src/Lenguages/en.json';
import esTranslations from '../../Backend/src/Lenguages/es.json';





import { setDayjsLocale } from '../src/utils/day.js';
i18n
  .use(LanguageDetector)      // Detecta idioma automáticamente
  .use(initReactI18next)      // Integración con React
  .init({
    resources: {
      es: { translation: esTranslations },
      en: { translation: enTranslations },
    },
    fallbackLng: 'es',        // Idioma por defecto
    interpolation: { escapeValue: false },
    detection: {
      // Configura el detector para usar localStorage
      order: ['localStorage', 'navigator'],  // Primero revisa localStorage, luego navegador
      caches: ['localStorage'],             // Guardar selección en localStorage
      lookupLocalStorage: 'i18nextLng',    // Clave donde se guarda
    },
  });
i18n.on('languageChanged', (lng) => {
  setDayjsLocale(lng);
});

export default i18n;