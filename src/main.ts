import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from './routers';
import i18n from './i18n';
import '@/shared/allow_sensor/sensorsdata.min.js';
import '@/shared/allow_sensor/sensors.js';
import 'element-plus/theme-chalk/el-loading.css';
import '@/shared/styles/base.scss';
import '@/shared/styles/o-theme/index.scss';

import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import Prism from 'prismjs';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';

import App from './App.vue';
import OpenDesign from 'opendesign';

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});

VMdPreview.use(githubTheme, {
  Prism,
});
VMdPreview.use(createEmojiPlugin());

const app = createApp(App);

app.use(i18n);
app.use(createPinia());
app.use(OpenDesign);
app.use(router);
app.use(VueMarkdownEditor);
app.use(VMdPreview);

app.mount('#app');
