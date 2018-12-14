import Vue from 'vue';
import Vuex from 'vuex';
import * as firebaseui from 'firebaseui'
import firebase from './firebase';


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

const startUi = function startUi(ui) {
  ui.start('#firebaseui-auth-container', {
    signInOptions: [
      // List of OAuth providers supported.
      firebase.instance.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    signInFlow: 'popup',
    autoUpgradeAnonymousUsers: true,
    callbacks: {
      signInSuccessWithAuthResult: function(authResult){},
      // signInFailure callback must be provided to handle merge conflicts which
      // occur when an existing credential is linked to an anonymous user.
      signInFailure: function(error) {
        // For merge conflicts, the error.code will be
        // 'firebaseui/anonymous-upgrade-merge-conflict'.
        if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
          return Promise.resolve();
        }
        // The credential the user tried to sign in with.
        var cred = error.credential;
        // Should we copy existing anon data, or just swap to attempted cred? lets opt for the latter for now.
        return firebase.instance.auth().signInAndRetrieveDataWithCredential(cred);
      }
    }
  });
}

/* eslint-disable no-param-reassign */
export default new Vuex.Store({
  state: {
    user: initialUserState,
    authui: new firebaseui.auth.AuthUI(firebase.instance.auth()),
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
      state.authui.reset();
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
      state.user.upgrading = true;
      startUi(state.authui);
     },
    setPending: (state, payload) => { state.user.pendingLogin = payload.pending; },
    setUpgrading: (state, payload) => {
      state.user.upgrading = payload.upgrading;
      if (payload.upgrading) {
        startUi(state.authui);
      } else {
        state.authui.reset();
      }
    },
    setCreating: (state, payload) => { state.user.creatingGame = payload.creatingGame; },
    setGame: (state, payload) => {
      state.user.currentGame = payload.currentGame;
    },
  },
});
/* eslint-enable no-param-reassign */
