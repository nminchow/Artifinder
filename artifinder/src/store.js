import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      name: null,
      userId: null,
      pendingLogin: false,
    },
  },
  mutations: {
    login(state, payload) {
      state.user.name = payload.name;
      state.user.userId = payload.userId;
      state.user.pendingLogin = false;
    },
    logout: state => state.user.name = null,
    togglePending: state => state.user.pendingLogin = true,
  },
  actions: {

  },
});
