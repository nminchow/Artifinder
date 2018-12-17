<template>
  <v-dialog max-width="290" :value="pendingLogin" @input="setPending">
     <v-card>
       <v-card-text>
         Please select a username. Your Steam ID is recomended so other users know who you are
         in-game.
        </v-card-text>
       <v-form>
        <v-container grid-list-md class="pb-0">
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                label="Username / Steam ID"
                data-vv-name="name"
                v-validate="'required'"
                v-model="name"
                :error-messages="errors.collect('name')"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
      <v-card-text class="pt-0">
        <p class="grey--text pa-0 ma-0">
          Already have an account? <a @click="$store.commit('toggleUpgrading')">Log in</a>
        </p>
      </v-card-text>
      <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <cookieText pre-text="By setting a username" />
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
import cookieText from './cookieText';

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
      return;
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
            if (document.exists){
              const data = document.data();
              self.$store.commit({
                type: 'login',
                name: data.name,
                currentGame: data.currentGame,
                userId: user.uid,
                anonymous: user.isAnonymous,
              });
              if (self.$store.state.route.params.id || self.$store.state.route.path.endsWith('loading')) return;
              self.$router.push({ path: `/${data.currentGame || ''}` });
            } else {
              self.$store.commit({
                type: 'login',
                userId: user.uid,
                anonymous: user.isAnonymous,
              });
            }
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
  components: {
    cookieText,
  },
};
</script>
