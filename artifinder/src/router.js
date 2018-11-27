import Vue from 'vue';
import Router from 'vue-router';
import gameList from './views/gameList.vue';
import loading from './views/loading.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'gameList',
      component: gameList,
    },
    {
      path: '/loading',
      name: 'loading',
      component: loading,
    },
  ],
});
