<template>
  <v-dialog max-width="290" :value="pendingLogin" @input="setPending">
     <v-card>
       <v-card-text>
         Please select a username. Your Steam ID is recomended so other users know who you are
         in-game.
        </v-card-text>
       <v-form>
        <v-container grid-list-md>
          <v-layout row wrap>
            <v-text-field
              label="Username / Steam ID"
              data-vv-name="name"
              v-validate="'required'"
              v-model="name"
              :error-messages="errors.collect('name')"
            ></v-text-field>
            <span class="caption text--secondary font-weight-light pt-3">
              By setting a username, you agree to our (minimal)
              <a target="_blank" href="/cookies!">cookie policy</a>.
            </span>
          </v-layout>
        </v-container>
      </v-form>
      <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="login"
            :disabled="loggingIn"
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
    if (!result) return;
    this.loggingIn = true;
    const user = firebase.instance.auth().currentUser;
    if (user) {
      firebase.db.collection('userData').doc(user.uid).set({
        name: this.name,
      }).then(() => {
        this.loggingIn = false;
        this.setPending(false);
      })
    }
    firebase.instance.auth().signInAnonymously().then(() => {
    }).catch((error) => {
      this.$store.commit('setError', error.message);
      this.setPending(false);
      this.loggingIn = false;
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
    pending: value === true,
  });
};

export default {
  data() {
    return {
      name: '',
      loggingIn: false,
      userListener: null,
    };
  },
  mounted() {
    const self = this;
    firebase.instance.auth().onAuthStateChanged((user) => {
      if (user) {
        self.createIfNeeded(user).then(() => {
          if (self.userListener != null) {
            self.userListener();
          }
          self.userListener = firebase.db.collection('userData').doc(user.uid).onSnapshot((document) => {
            const data = document.data();
            if (data) {
              self.$store.commit({
                type: 'login',
                name: data.name,
                currentGame: data.currentGame,
                userId: user.uid,
                anonymous: user.isAnonymous,
              });
            }
            if (self.$store.state.route.params.id || self.$store.state.route.path.endsWith('loading')) return;
            self.$router.push({ path: `/${data.currentGame || ''}` });
          });
          this.loggingIn = false;
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
