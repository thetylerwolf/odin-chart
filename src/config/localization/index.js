import Vue from 'vue';
import VueI18n from 'vue-i18n';

import en from './en';
import es from './es';
import fr from './fr';

Vue.use(VueI18n);

const messages = {
  en,
  es,
  fr,
};

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});

export default i18n;
