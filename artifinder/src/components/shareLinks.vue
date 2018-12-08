<template>
  <span>
    <v-btn icon :href="redditUrl" target="_blank">
      <v-icon>fab fa-reddit-alien</v-icon>
    </v-btn>
    <v-btn icon :href="twitterUrl" target="_blank">
      <v-icon>fab fa-twitter</v-icon>
    </v-btn>
    <v-tooltip right>
      <v-btn slot="activator" icon @click="copyFinderLink">
        <v-icon>link</v-icon>
      </v-btn>
      <span> {{ copyText }}</span>
    </v-tooltip>
  </span>
</template>
<script>
import game from '../formatHelpers/game.js'
import copy from 'copy-to-clipboard';

const copyFinderLink = function copyFinderLink() {
  this.copyFinderTooltip = true;
  copy(this.url);
  setTimeout(() => { this.copyFinderTooltip = false; }, 2000);
};


export default {
  props: ['game'],
  data() {
    return {
      copyFinderTooltip: false,
    }
  },
  methods: {
    copyFinderLink,
  },
  computed: {
    redditUrl() {
      return `http://www.reddit.com/submit?url=${this.url}&title=${this.title}`
    },
    twitterUrl() {
      const hashtags = 'Artifact'
      return `https://twitter.com/intent/tweet?url=${this.url}&text=${this.title}&hashtags=${hashtags}`
    },
    title() {
      return `Join my Artifact tournament!  ${this.game.description} - ${this.game.type}${this.formatAndSeries}`
    },
    url() {
      return `https://artifinder.com/${this.game.id}`;
    },
    formatAndSeries() {
      return game.formatAndSeries(this.game).replace('|', '-');
    },
    copyText() {
      return this.copyFinderTooltip ? 'Copied!' : 'Copy Tournament Link';
    }
  }
}
</script>

