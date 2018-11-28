<template>
  <div class="game-list">
    <v-toolbar color="secondary">
      <v-toolbar-title v-if="inGame" class="white--text">Current Tournament</v-toolbar-title>
      <v-toolbar-title v-else class="white--text">Tournament Preview</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="showBackLink" @click="backToCurrent">Back</v-btn>
    </v-toolbar>
    <div v-if="game != null">
      <v-card-title primary-title>
          <div>
            <div class="headline">{{ game.description }}</div>
            <div class="grey--text">
              {{ game.currentPlayers }}/{{ game.playerLimit }}
              - {{ game.type }}
            </div>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn v-if="joinable" :disabled="joiningGame" color="success" @click="join">Join</v-btn>
          <v-btn v-if="inGame && game.link != null && !copyTooltip" color="accent" @click="copyLink">Copy Game Link</v-btn>
          <v-btn color="primary" v-if="copyTooltip"> Copied to clipboard! </v-btn>
          <v-spacer></v-spacer>
          <v-btn fab small color="red" flat v-if="selfIsOwner" @click="deleteGame"><v-icon>delete_forever</v-icon></v-btn>
        </v-card-actions>
        <v-list dense>
          <v-subheader>
            Players
          </v-subheader>
          <v-divider></v-divider>
          <v-list-tile
              v-for="player in players"
              :key="player.id"
            >
            <v-list-tile-avatar>
              <v-icon v-if="userIsOwner(player)">star</v-icon>
              <v-icon v-else>person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title> {{ player.name }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action v-if="selfIsOwner || isSelf(player)">
              <v-btn icon ripple @click="removePlayer(player)">
                <v-icon color="grey lighten-1">cancel</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      <v-spacer></v-spacer>
    </div>
    <div v-else>
      <v-card-title>
        <div>
          <span class="grey--text">select or create a tournament</span>
        </div>
      </v-card-title>
    </div>
  </div>
</template>

<script>
import firebase from '../firebase';
import gameHelper from '../databaseHelpers/games';
import copy from 'copy-to-clipboard';

const join = function join() {
  var self = this;
  if (!this.loggedIn) {
    this.$store.commit('togglePending');
    return;
  }
  this.joiningGame = true;
  const openLink = this.selfIsOwner ? null : window.open('/#/loading', '_blank');
  return gameHelper.addUserToGame(this.$store, firebase.db.collection('games').doc(this.gameId))
    .then(() => {
    self.joiningGame = false;
    if (openLink == null) return;
    openLink.location = self.formattedLink
  });
};

const copyLink = function copyLink() {
  this.copyTooltip = true;
  copy(this.game.link);
  setTimeout(() => { this.copyTooltip = false; }, 2000);
}

const backToCurrent = function join() {
  this.$router.push({ path: `/${this.$store.state.user.currentGame}` })
};

const deleteGame = function deleteGame() {
  // stash this so we don't lose it
  const gameId = this.gameId;
  var self = this;
  let players = [];
  firebase.db.collection('games').doc(gameId)
        .collection('members').get().then((ref) => {
    ref.forEach((doc) => {
      players.push(gameHelper.removeUserGameRef(doc.id).then(() => {
        gameHelper.removeGameMember(doc.id, gameId);
      }));
    });
  }).then(() => {
    Promise.all(players).then(() => {
      firebase.db.collection('games').doc(gameId).delete().then(() => {
        self.game = null;
      });
    });
  });
}

const userIsOwner = function usersIsOwner(player) {
  return player.id == this.game.owner;
};

const isSelf = function isSelf(player) {
  return player.id == this.$store.state.user.userId;
}

const removePlayer = function removePlayer(player) {
  gameHelper.removeFromGame(player.id, this.game.id).then(() => {
    gameHelper.removeUserGameRef(player.id);
  })
}

export default {
  props: ['gameId'],
  data() {
    return {
      game: null,
      players: [],
      gameListener: null,
      playerListener: null,
      copyTooltip: false,
      joiningGame: false,
    };
  },
  methods: {
    join,
    backToCurrent,
    copyLink,
    deleteGame,
    userIsOwner,
    isSelf,
    removePlayer,
  },
  computed: {
    joinable() {
      if (this.game == null) return false;
      return this.$store.state.user.currentGame != this.gameId
      && this.game.currentPlayers < this.game.playerLimit;
    },
    showBackLink() {
      if (this.$store.state.user.currentGame == null) return false;
      return this.$store.state.user.currentGame != this.gameId;
    },
    inGame() {
      const self = this;
      if (this.game == null) return false;
      return !this.joinable && this.players.some(user => user.id == self.$store.state.user.userId);
    },
    loggedIn() {
      return this.$store.state.user.name != null;
    },
    selfIsOwner() {
      if (this.game == null) return false;
      return this.$store.state.user.userId == this.game.owner;
    },
    formattedLink() {
      if (this.game == null) return '';
      if (this.game.link.startsWith('http')) return this.game.link;
      return `https://${this.game.link}`
    }
  },
  watch: {
    gameId: {
      immediate: true,
      handler(newVal, oldVal) {
        const self = this;
        // unsubscribe from old
        if (oldVal != null) {
          this.gameListener();
          this.playerListener();
          self.players = [];
        }
        // escape if cleared
        if (newVal == null) {
          this.game = null;
          return;
        }
        // subscribe to new
        this.gameListener = firebase.db.collection('games').doc(newVal)
          .onSnapshot((document) => {
            if(!document.exists) return;
            this.game = { ...document.data(), id: document.id };
          });
        this.playerListener = firebase.db.collection('games').doc(newVal)
          .collection('members').onSnapshot((querySnapshot) => {
          self.players = [];
          querySnapshot.forEach((doc) => {
          // if (doc.metadata.hasPendingWrites) return;
            self.players.push({ ...doc.data(), id: doc.id });
          });
        });
      }
    },
  },
};
</script>
