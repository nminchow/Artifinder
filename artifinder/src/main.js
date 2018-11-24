import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'


import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false;

// Helpers

Vue.use(Vuetify, {
  theme: {
    primary: "#424242",
    secondary: "#FFEA00",
    accent: "#9C27B0",
    error: "#f44336",
    warning: "#ffeb3b",
    info: "#2196f3",
    success: "#4caf50"
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
