<template>
  <div class="game-list">
    <v-container
      fluid
      grid-list-md
    >
      <v-layout row wrap>
        <v-flex sm12 md6>
          <v-card>
            <v-toolbar color="secondary">
              <v-toolbar-title class="white--text">Tournaments</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="success" @click="addItem">Create</v-btn>
              <createGame></createGame>
            </v-toolbar>
            <v-card-actions class="pa-0">
              <v-form>
                <v-container class="pa-10 pb-0">
                  <v-layout row wrap>
                    <v-select
                      :items="filters"
                      label="Type"
                      v-model="filter"
                    ></v-select>
                  </v-layout>
                </v-container>
              </v-form>
            </v-card-actions>
            <v-progress-linear
              v-if="games == null"
              :indeterminate="true"
              height="9"
            ></v-progress-linear>
            <gameTable v-else :games="games" />
          </v-card>
        </v-flex>
        <v-flex sm12 md6>
          <v-card>
            <game :gameId="previewGame"/>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import firebase from '../firebase';
import game from './game.vue';
import createGame from '../components/createGame.vue';
import gameTable from '../components/gameTable.vue';

const addItem = function addItem() {
  if (!this.loggedIn) {
    this.$store.commit('togglePending');
    return;
  }
  this.$store.commit({
    type: 'setCreating',
    creatingGame: true,
  });
};

const setListener = function setListener(newVal) {
  const self = this;
  if (this.gamesListener != null) this.gamesListener();
  let query = firebase.db.collection('games').orderBy('created', 'desc').limit(10);
  if (newVal !== 'all') {
    query = query.where('type', '==', newVal);
  }
  this.gamesListener = query.onSnapshot((querySnapshot) => {
    self.games = [];
    querySnapshot.forEach((doc) => {
      if (doc.metadata.hasPendingWrites) return;
      self.games.push({ ...doc.data(), id: doc.id });
    });
  });
};

export default {
  name: 'home',
  data() {
    return {
      games: null,
      db: null,
      gamesListener: null,
      filters: ['all', 'draft', 'constructed'],
      filter: 'all',
    };
  },
  components: {
    game,
    createGame,
    gameTable,
  },
  methods: {
    addItem,
    setListener,
  },
  watch: {
    filter(newVal) {
      this.setListener(newVal);
    },
  },
  mounted() {
    this.setListener(this.filter);
  },
  computed: {
    loggedIn() {
      return this.$store.state.user.name != null;
    },
    previewGame() {
      return this.$store.state.route.params.id;
    },
  },
};
</script>
