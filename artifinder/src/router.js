import Vue from 'vue';
import Router from 'vue-router';
import tournamentBrowser from './views/tournamentBrowser.vue';
import loading from './views/loading.vue';
import cookies from './views/cookies.vue';
import prizedTournaments from './views/prizedTournaments.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  // note that new routes will need escaped in 'login.vue' to allow direct nav
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
      path: '/prizedTournaments',
      name: 'prizedTournaments',
      component: prizedTournaments,
    },
    {
      path: '/:id?',
      name: 'tournamentBrowser',
      component: tournamentBrowser,
    },
  ],
});
