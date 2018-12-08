<template>
  <span>
    <v-btn class="white--text" icon :href="redditUrl" target="_blank">
      <font-awesome-icon :icon="['fab', 'reddit-alien']" size="2x" />
    </v-btn>
    <v-btn class="white--text" icon :href="twitterUrl" target="_blank">
      <font-awesome-icon :icon="['fab', 'twitter']" size="2x" />
    </v-btn>
    <v-btn
      v-if="!copyFinderTooltip"
      color="secondary"
      @click="copyFinderLink"
    >Artifinder Link</v-btn>
    <v-btn color="primary" v-if="copyFinderTooltip"> Copied to clipboard! </v-btn>
  </span>
</template>
<script>
import game from '../formatHelpers/game.js'
import copy from 'copy-to-clipboard';

const copyFinderLink = function copyFinderLink() {
  this.copyFinderTooltip = true;
  copy(window.location.toString());
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
  }
}
</script>

