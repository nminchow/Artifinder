import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

const initialUserState = {
  name: null,
  userId: null,
  pendingLogin: false,
  upgrading: false,
  creatingGame: false,
  currentGame: null,
  anonymous: false,
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
      state.user.upgrading = false;
      state.user.anonymous = payload.anonymous;
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
    toggleUpgrading: (state) => {
      state.user.pendingLogin = false;
      state.user.upgrading = true;
     },
    setPending: (state, payload) => { state.user.pendingLogin = payload.pending; },
    setUpgrading: (state, payload) => {
      state.user.upgrading = payload.upgrading;
    },
    setCreating: (state, payload) => { state.user.creatingGame = payload.creatingGame; },
    setGame: (state, payload) => {
      state.user.currentGame = payload.currentGame;
    },
  },
});
/* eslint-enable no-param-reassign */
