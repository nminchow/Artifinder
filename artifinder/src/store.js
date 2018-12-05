import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const initialUserState = {
  name: null,
  userId: null,
  pendingLogin: false,
  creatingGame: false,
  currentGame: null,
};

/* eslint-disable no-param-reassign */
export default new Vuex.Store({
  state: {
    user: initialUserState,
    error: {
      show: false,
      message: null,
    },
  },
  mutations: {
    login(state, payload) {
      state.user.name = payload.name;
      state.user.userId = payload.userId;
      state.user.currentGame = payload.currentGame;
      state.user.pendingLogin = false;
    },
    logout: (state) => {
      state.user.name = null;
      state.user.userId = null;
      state.user.currentGame = null;
    },
    setError: (state, message) => {
      state.error.message = message;
      state.error.show = message !== null;
    },
    togglePending: (state) => { state.user.pendingLogin = true; },
    setPending: (state, payload) => { state.user.pendingLogin = payload.pending; },
    setCreating: (state, payload) => { state.user.creatingGame = payload.creatingGame; },
    setGame: (state, payload) => {
      state.user.currentGame = payload.currentGame;
    },
  },
});
/* eslint-enable no-param-reassign */
