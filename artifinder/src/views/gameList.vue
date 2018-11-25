<template>
  <div class="game-list">
    <v-container
      fluid
      grid-list-md
    >
      <v-layout row wrap>
        <v-flex xs12 sm6>
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
            <v-list dense two-line>
              <span v-for="(game, key) in games" :key="game.created.seconds + (game.created.nanoseconds/10000000)">
                <v-divider></v-divider>
                <v-list-tile
                  ripple
                  @click="preview(game.id)"
                >
                  <v-list-tile-content>
                    <v-list-tile-title>{{ game.description }}</v-list-tile-title>
                    <v-list-tile-sub-title>
                      {{ game.currentPlayers }}/{{ game.playerLimit }}
                      - {{ game.type }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </span>
            </v-list>
          </v-card>
        </v-flex>
        <v-flex xs12 sm6>
          <v-card>
            <game :gameId="previewGame || gameId"/>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import firebase from '../firebase';
import gameHelper from '../databaseHelpers/games';
import game from './game';
import createGame from '../components/createGame';


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

const preview = function preview(Id) {
  this.$store.commit({
    type: 'setPreview',
    previewGame: Id,
  });
  if(this.$vuetify.breakpoint.xs)
  {
    window.scrollTo(0, document.body.scrollHeight);
  }
};

const setListener = function setListener(newVal) {
  const self = this;
  if (this.gamesListener != null) this.gamesListener();
  let query = firebase.db.collection('games').orderBy('created', 'desc').limit(10);
  if (newVal != 'all') {
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
      games: [],
      db: null,
      gamesListener: null,
      filters: ['all', 'draft', 'constructed'],
      filter: 'all'
    };
  },
  components: {
    game,
    createGame,
  },
  methods: {
    addItem,
    preview,
    setListener,
  },
  watch: {
    filter(newVal, oldVal) {
      this.setListener(newVal);
    }
  },
  mounted() {
    this.setListener(this.filter);
  },
  computed: {
    loggedIn() {
      return this.$store.state.user.name != null;
    },
    gameId() {
      return this.$store.state.user.currentGame;
    },
    previewGame() {
      return this.$store.state.previewGame;
    },
  },
};
</script>
