<template>
  <v-dialog :value="upgrading" @input="setUpgrading" max-width="290">
    <v-card>
      <v-card-title primary-title>
        <div class="headline">
          Sign In
        </div>
        <div class="grey--text">
          Keep your tournaments synced between devices
        </div>
      </v-card-title>
      <v-card-actions>
        <v-layout justify-center row wrap>
        <div id="firebaseui-auth-container"></div>
        </v-layout>
      </v-card-actions>
      <v-container grid-list-md>
        <v-layout row wrap>
          <cookieText pre-text="Signing in isn't necessary to join or create games. By signing in"/>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import firebase from './../firebase';
import * as firebaseui from 'firebaseui'
import cookieText from './cookieText'

const setUpgrading = function setUpgrading(value) {
  this.$store.commit({
    type: 'setUpgrading',
    upgrading: value === true,
  });
};

const startUi = function startUi(ui) {
  ui.start('#firebaseui-auth-container', {
    signInOptions: [
      // List of OAuth providers supported.
      firebase.instance.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.instance.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.instance.auth.GithubAuthProvider.PROVIDER_ID
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

export default {
  data() {
    return {
      authui: new firebaseui.auth.AuthUI(firebase.instance.auth())
    };
  },
  methods: {
    setUpgrading,
  },
  computed: {
    upgrading() {
      return this.$store.state.user.upgrading;
    },
  },
  watch: {
    upgrading: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          startUi(this.authui);
        } else {
          this.authui.reset();
        }
      },
    },
  },
  components: {
    cookieText,
  },
}
</script>

