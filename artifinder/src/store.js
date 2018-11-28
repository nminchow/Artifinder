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

export default new Vuex.Store({
  state: {
    user: initialUserState,
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
    togglePending: state => state.user.pendingLogin = true,
    setPending: (state, payload) => state.user.pendingLogin = payload.pending,
    setCreating: (state, payload) => state.user.creatingGame = payload.creatingGame,
    setGame: (state, payload) => {
      state.user.currentGame = payload.currentGame;
    }
  },
  actions: {

  },
});
