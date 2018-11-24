<template>
  <div class="home">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App bleh"/> -->
    <v-toolbar color="accent">
      <v-toolbar-title class="white--text">Games</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn @click="addItem">Create Game</v-btn>
    </v-toolbar>

      <v-list dense two-line>
        <template v-for="game in games">
        <v-list-tile
          :key="game.created.seconds + (game.created.nanoseconds/10000000)"
          avatar
          ripple
          @click="toggle(index)"
        >
          <v-list-tile-content>
            <v-list-tile-title>{{ game.description }}</v-list-tile-title>
            <v-list-tile-sub-title> {{ game.created }} </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </div>
</template>

<script>
// @ is an alias to /src
import firebase from '../firebase';

const addItem = function addItem() {
  if (!this.loggedIn) {
    this.$store.commit('togglePending');
    return;
  }
  firebase.db.collection('games').add({
    description: `Game ${this.games.length}`,
    playerLimit: 4,
    players: ['creator'],
    created: firebase.instance.firestore.FieldValue.serverTimestamp(),
  })
    .then((docRef) => {
      console.log('Document written with ID: ', docRef.id);
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
};

export default {
  name: 'home',
  data() {
    return {
      games: [],
      db: null,
    };
  },
  components: {
  },
  methods: {
    addItem,
  },
  mounted() {
    const self = this;
    firebase.db.collection('games').orderBy('created')
      .onSnapshot((querySnapshot) => {
        self.games = [];
        querySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites) return;
          self.games.push(doc.data());
        });
      });
  },
  computed: {
    loggedIn() {
      return this.$store.state.user.name != null;
    },
  },
};
</script>
