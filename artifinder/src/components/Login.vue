<template>
  <v-dialog max-width="290" :value="pendingLogin" @input="setPending">
     <v-card>
       <v-card-text>
         Other players will need your username to join or add you.
        </v-card-text>
       <v-form>
        <v-container>
          <v-layout row wrap>
            <v-text-field
              label="Steam ID"
              :v-model="name"
            ></v-text-field>
          </v-layout>
        </v-container>
      </v-form>
      <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="login"
          >
            Set
          </v-btn>
        </v-card-actions>
     </v-card>
  </v-dialog>
</template>

<script>
import firebase from '../firebase';

const login = function login() {
  firebase.instance.auth().signInAnonymously().then((response) => {
    this.$store.commit({
      type: 'login',
      name: this.name,
      userId: response.user.uid,
    });
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });
};

const setPending = function setPending(value) {
  this.$store.commit({
    type: 'setPending',
    pending: value == true,
  })
}

export default {
  data() {
    return {
      name: '',
    };
  },
  mounted() {
    const self = this;
    firebase.instance.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        const displayName = user.displayName;
        const email = user.email;
        const emailVerified = user.emailVerified;
        const photoURL = user.photoURL;
        const isAnonymous = user.isAnonymous;
        const uid = user.uid;
        const providerData = user.providerData;
        // ...
      } else {
        self.$store.commit('logout');
      }
    });
  },
  methods: {
    login,
    setPending,
  },
  computed: {
    loggedIn() {
      return this.$store.state.user.name != null;
    },
    pendingLogin() {
      return this.$store.state.user.pendingLogin;
    },
  },
};
</script>
