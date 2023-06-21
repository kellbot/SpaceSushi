/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp, watch } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import pinia from './store'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')

watch(
    pinia.state,
    (state) => {
      localStorage.setItem("app", JSON.stringify(state.app));
    },
    { deep: true }
    );

