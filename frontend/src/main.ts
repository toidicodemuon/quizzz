import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import { setupRouterGuard } from './router/guards';
import i18n from './plugins/i18n';
import './assets/tailwind.css';
import { useAuthStore } from '@/modules/auth/stores/auth';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
setupRouterGuard(router);
app.use(i18n);

// Hydrate auth from storage on app boot
const auth = useAuthStore();
auth.loadProfile();
// apply persisted language + theme
i18n.global.locale.value = auth.language;
const html = document.querySelector('html');
if (html) html.setAttribute('data-theme', auth.theme);

app.mount('#app');
