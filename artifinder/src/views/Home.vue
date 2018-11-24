<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App bleh"/> -->
    <br>
    <button @click="addItem">Add Item</button>
    <ul>
      <li v-for="game in games" :key="game.created.seconds + (game.created.nanoseconds/10000000)">
        {{ game.description }} - {{ game.created }}
      </li>
    </ul>

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
