import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

// Bootstrap 5 styles & JS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

// Global styles (optional)
import "./style.css";

createApp(App).use(createPinia()).use(router).mount("#app");
