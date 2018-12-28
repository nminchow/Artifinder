<template>
  <v-navigation-drawer
    fixed
    :value="this.$store.state.navDrawer"
    @input="setNav"
    app
  >
    <v-list>
      <v-list-tile @click="$router.push('tournamentBrowser')">
        <v-list-tile-action>
          <v-icon>format_list_bulleted</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Tournament Listings</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile @click="$router.push('prizedTournaments')">
        <v-list-tile-action>
          <v-icon>money</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Prized Tournaments</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
export default {
  props: ['drawer'],
  methods: {
    setNav(value) {
      this.$store.commit({
        type: 'setNav',
        navDrawer: value,
      });
    }
  }
}
</script>
