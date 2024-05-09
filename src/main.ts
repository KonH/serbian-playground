import { createApp } from 'vue';
import App from './App.vue';
import { BootstrapVue3 } from 'bootstrap-vue-3';
import localizationCsv from '!!raw-loader!./assets/localization.csv';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import { parseLocalizationCsv, setupI18n } from './logic/localizationUtils';

async function initializeApp() {
    const messages = await parseLocalizationCsv(localizationCsv);
    const i18n = setupI18n(messages);
    const app = createApp(App);
    app.use(BootstrapVue3);
    app.use(i18n);
    app.mount('#app');
}

initializeApp();
