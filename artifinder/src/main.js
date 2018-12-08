import Vue from 'vue';
import Vuetify from 'vuetify';
import { sync } from 'vuex-router-sync';
import VeeValidate from 'vee-validate';
import store from './store';
import router from './router';
import App from './App.vue';
import customValidators from './customValidators';
import '@fortawesome/fontawesome-free/css/all.css'; // Ensure you are using css-loader

import 'vuetify/dist/vuetify.min.css';

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
  iconfont: 'fa',
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
