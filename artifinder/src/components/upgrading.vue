<template>
  <v-dialog :value="upgrading" @input="setUpgrading" max-width="290">
    <v-card>
      <v-card-text>
         Register to hang on to your account
        </v-card-text>
        <v-card-actions>
          <v-layout justify-center row wrap>
          <div id="firebaseui-auth-container"></div>
          </v-layout>
        </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui'

const setUpgrading = function setUpgrading(value) {
  this.$store.commit({
    type: 'setUpgrading',
    upgrading: value === true,
  });
};

export default {
  mounted() {
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', {
      signInOptions: [
        // List of OAuth providers supported.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
      signInFlow: 'popup',
      autoUpgradeAnonymousUsers: true,
      // Other config options...
    });
  },
  methods: {
    setUpgrading,
  },
  computed: {
    upgrading() {
      return this.$store.state.user.upgrading;
    },
  }
}
</script>

