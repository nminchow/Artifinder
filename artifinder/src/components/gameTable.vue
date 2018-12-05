<template>
  <v-list dense two-line>
  <span v-for="(game) in games" :key="game.created.toMillis()">
    <v-divider></v-divider>
    <gameRow :game="game" />
  </span>
</v-list>
</template>
<script>
import gameRow from './gameRow.vue';

export default {
  props: ['games'],
  components: {
    gameRow,
  },
};
</script>
