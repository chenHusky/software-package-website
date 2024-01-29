import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from './routers';
import i18n from './i18n';
import '@/shared/allow_sensor/sensorsdata.min.js';
import '@/shared/allow_sensor/sensors.js';
import 'element-plus/theme-chalk/el-loading.css';
import '@/shared/styles/base.scss';
import '@/shared/styles/o-theme/index.scss';
import VueDOMPurifyHTML from 'vue-dompurify-html';

import App from './App.vue';
import OpenDesign from 'opendesign';

const app = createApp(App);

app.use(i18n);
app.use(createPinia());
app.use(OpenDesign);
app.use(router);
app.use(VueDOMPurifyHTML);

app.mount('#app');
