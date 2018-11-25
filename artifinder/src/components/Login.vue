<template>
  <v-dialog max-width="290" :value="pendingLogin" @input="setPending">
     <v-card>
       <v-card-text>
         Please select a username. Your Steam ID is recomended so other users know who you are in-game.
        </v-card-text>
       <v-form>
        <v-container>
          <v-layout row wrap>
            <v-text-field
              label="Username / Steam ID"
              data-vv-name="name"
              v-validate="'required|min:5'"
              v-model="name"
              :error-messages="errors.collect('name')"
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
  this.$validator.validateAll().then((result) => {
    if(!result) return;
    firebase.instance.auth().signInAnonymously().catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });
  });
};

const createIfNeeded = function createIfNeeded(user) {
  const userDataRef = firebase.db.collection('userData');

  // create default state if new
  if (this.pendingLogin) {
    const defaultData = {
      name: this.name,
      currentGame: null,
    };
    return userDataRef.doc(user.uid).set(defaultData);
  }
  return Promise.resolve();
};

const setPending = function setPending(value) {
  this.$store.commit({
    type: 'setPending',
    pending: value == true,
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
        self.createIfNeeded(user).then(() => {
          firebase.db.collection('userData').doc(user.uid).onSnapshot((document) => {
            const data = document.data();
            self.$store.commit({
              type: 'login',
              name: data.name,
              currentGame: data.currentGame,
              userId: user.uid,
            });
          })

        });
      } else {
        self.$store.commit('logout');
      }
    });
  },
  methods: {
    login,
    setPending,
    createIfNeeded,
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
