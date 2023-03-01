import { createI18n } from 'vue-i18n';

import common from './common';
import software from './software';
import sig from './sig';

const messages = {
  zh: {
    common: common.zh,
    software: software.zh,
    sig: sig.zh,
  },
  en: {
    common: common.en,
    software: software.en,
    sig: sig.en,
  },
};

const i18n = createI18n({
  globalInjection: true,
  locale: 'zh',
  legacy: false,
  messages,
});

export default i18n;
