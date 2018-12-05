<template>
  <v-list-tile
    ripple
    @click="preview()"
  >
    <v-list-tile-content>
      <v-list-tile-title>{{ game.description }}</v-list-tile-title>
      <v-list-tile-sub-title>
        {{ game.type }}{{ formatAndSeries }}
      </v-list-tile-sub-title>
    </v-list-tile-content>
    <v-list-tile-action>
    <v-list-tile-action-text color="primary" class="text--secondary">
        {{ game.currentPlayers }}/{{ game.playerLimit }}
    </v-list-tile-action-text>
    <v-list-tile-action-text class="font-weight-medium">
        {{ timeAgo(game.created.toMillis()) }}
    </v-list-tile-action-text>
    </v-list-tile-action>
  </v-list-tile>
</template>
<script>
import timeago from 'epoch-timeago';

const preview = function preview() {
  this.$router.push({ path: `/${this.game.id}` });
  if (this.$vuetify.breakpoint.xs) {
    window.scrollTo(0, document.body.scrollHeight);
  }
};

const timeAgo = function timeAgo(milliseconds) {
  return timeago(milliseconds);
};

export default {
  props: ['game'],
  methods: {
    preview,
    timeAgo,
  },
  computed: {
    formatAndSeries() {
      if (this.game.format === 'advanced/other' || !this.game.format) {
        return '';
      }
      return ` | ${this.game.format} - ${this.shortFormSeries}`;
    },
    shortFormSeries() {
      if (!this.game.series) return '';
      return this.game.series.replace('best of one', 'Bo1')
        .replace('best of three', 'Bo3')
        .replace('best of five', 'Bo5')
        .replace('single match', 'single')
        .replace('two matches', 'double')
        .replace(' w/draw', '*');
    },
  },
};
</script>
