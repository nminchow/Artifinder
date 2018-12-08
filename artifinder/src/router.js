import Vue from 'vue';
import Router from 'vue-router';
import tournamentBrowser from './views/tournamentBrowser.vue';
import loading from './views/loading.vue';
import cookies from './views/cookies.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/loading',
      name: 'loading',
      component: loading,
    },
    {
      path: '/cookies!',
      name: 'cookies!',
      component: cookies,
    },
    {
      path: '/:id?',
      name: 'tournamentBrowser',
      component: tournamentBrowser,
    },
  ],
});
