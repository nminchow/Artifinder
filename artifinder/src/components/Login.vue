<template>
  <div v-if="pendingLogin" class="about">
    <input :v-model="name">
    <button @click="login">login</button>
  </div>
</template>

<script>
import firebase from '../firebase';

const login = function login() {
  firebase.instance.auth().signInAnonymously().then( response => {
    this.$store.commit({
      type: 'login',
      name: this.name,
    })
  }).catch(error => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
}

export default {
  data: function() {
    return {
      name: '',
    }
  },
  mounted: function() {
    var self = this;
    firebase.instance.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
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
    loggedIn () {
      return this.$store.state.user.name != null;
    },
    pendingLogin () {
      return  this.$store.state.user.pendingLogin;
    }
  }
}
</script>

