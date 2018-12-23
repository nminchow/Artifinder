<template>
  <div id="app">
    <v-app id="inspire" dark>
      <v-toolbar app fixed clipped-left>
        <v-toolbar-title>Artifinder</v-toolbar-title>
        <v-spacer></v-spacer>
        <login/>
        <upgrading/>
        <v-toolbar-items v-if="$store.state.user.userId != null">
          <v-menu bottom left offset-y>
            <v-btn icon slot="activator" flat><v-icon>account_circle</v-icon></v-btn>
            <v-list subheader>
              <v-subheader v-if="name != null">{{name}}</v-subheader>
              <v-list-tile
                v-if="$store.state.user.anonymous"
                @click="$store.commit('toggleUpgrading');"
              >
                <v-list-tile-title>create account</v-list-tile-title>
              </v-list-tile>
              <v-list-tile
                @click="logout"
              >
                <v-list-tile-title>sign out</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar-items>
        <v-btn v-else color="secondary" @click="$store.commit('toggleUpgrading');">Sign in</v-btn>
      </v-toolbar>
      <v-content>
        <v-alert
        v-model="alert"
        dismissible
        type="error"
        >
          {{ $store.state.error.message }}
        </v-alert>
        <router-view/>
      </v-content>
      <v-footer dark height="auto" >
        <v-layout justify-center row wrap>
          <v-btn icon href="https://discord.gg/7arjbp4" target="_blank">
            <v-icon>fab fa-discord</v-icon>
          </v-btn>
          <v-btn icon href="https://github.com/nminchow/Artifinder" target="_blank">
            <v-icon>fab fa-github</v-icon>
          </v-btn>
          <v-btn icon href="https://www.patreon.com/leonrdo" target="_blank">
            <v-icon>fab fa-patreon</v-icon>
          </v-btn>
        </v-layout>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import login from './components/login.vue';
import upgrading from './components/upgrading.vue';
import firebase from './firebase';

export default {
  components: {
    login,
    upgrading,
  },
  computed: {
    alert: {
      get() {
        return this.$store.state.error.show;
      },
      set(newValue) {
        if (!newValue) {
          this.$store.commit('setError', null);
        }
      },
    },
    name() {
      return this.$store.state.user.name;
    },
  },
  methods: {
    logout() {
      firebase.instance.auth().signOut();
    },
  },
};
</script>
