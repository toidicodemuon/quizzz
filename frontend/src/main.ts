import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import { setupRouterGuard } from './router/guards';
import i18n from './plugins/i18n';
import './assets/tailwind.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
setupRouterGuard(router);
app.use(i18n);

app.mount('#app');

