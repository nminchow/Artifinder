<template>
  <div v-if="pendingLogin" class="about">
    <input :v-model="name">
    <button @click="login">login</button>
  </div>
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
