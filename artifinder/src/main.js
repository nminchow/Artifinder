import Vue from 'vue';
import Vuetify from 'vuetify';
import { sync } from 'vuex-router-sync';
import VeeValidate from 'vee-validate';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import store from './store';
import router from './router';
import App from './App.vue';
import customValidators from './customValidators';

import 'vuetify/dist/vuetify.min.css';

library.add(faDiscord, faGithub);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

customValidators(VeeValidate);

sync(store, router);

Vue.use(VeeValidate);
Vue.use(Vuetify, {
  theme: {
    primary: '#a59465',
    secondary: '#56077a',
    accent: '#3e918b',
    error: '#e57937',
    warning: '#ffeb3b',
    info: '#2196f3',
    success: '#a59465',
  },
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
