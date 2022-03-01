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
    primary: '#d7a556',
    secondary: '#a40e0e',
    accent: '#b5c3c9',
    error: '#cb7426',
    warning: '#85434c',
    info: '#2196f3',
    success: '#d7a556',
  },
  iconfont: 'fa',
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
