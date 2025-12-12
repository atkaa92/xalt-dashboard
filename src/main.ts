import App from '@/App.vue';
import '@/assets/main.css';
import router from '@/router';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Initialize auth store to restore session
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
authStore.initialize();

app.mount('#app');
