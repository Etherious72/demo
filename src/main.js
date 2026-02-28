import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
import './styles/global.css';

import App from './App.vue';
import routes from './router';

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

const app = createApp(App);
app.use(router);
app.use(TDesign);
app.mount('#app');

