import { createI18n } from 'vue-i18n';
import en from '@/locales/en.json';
import vi from '@/locales/vi.json';

const locale = import.meta.env.VITE_DEFAULT_LOCALE || 'vi';

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  messages: { en, vi },
});

export default i18n;
