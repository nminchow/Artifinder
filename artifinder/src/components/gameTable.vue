<template>
  <v-list dense two-line>
  <span v-for="(game) in games" :key="game.created.toMillis()">
    <v-divider></v-divider>
    <v-list-tile
      ripple
      @click="preview(game.id)"
    >
      <v-list-tile-content>
        <v-list-tile-title>{{ game.description }}</v-list-tile-title>
        <v-list-tile-sub-title>
         {{ game.type }} - {{ timeAgo(game.created.toMillis()) }}
        </v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
      <v-list-tile-action-text> {{ game.currentPlayers }}/{{ game.playerLimit }} </v-list-tile-action-text>
      </v-list-tile-action>
    </v-list-tile>
  </span>
</v-list>
</template>
<script>
import timeago from 'epoch-timeago';

const preview = function preview(Id) {
  this.$router.push({ path: `/${Id}` })
  if(this.$vuetify.breakpoint.xs)
  {
    window.scrollTo(0, document.body.scrollHeight);
  }
};

const timeAgo = function timeAgo(milliseconds) {
  return timeago(milliseconds);
}

export default {
  props: ['games'],
  methods: {
    preview,
    timeAgo,
  }
}
</script>

