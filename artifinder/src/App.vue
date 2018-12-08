<template>
  <div id="app">
    <v-app id="inspire" dark>
      <v-toolbar app fixed clipped-left>
        <v-toolbar-title>Artifinder</v-toolbar-title>
        <v-spacer></v-spacer>
        <login/>
        <v-toolbar-items v-if="$store.state.user.name != null">
          <v-menu offset-y>
            <v-btn slot="activator" flat>{{ name }}</v-btn>
            <v-list>
              <v-list-tile
                @click="logout"
              >
                <v-list-tile-title>logout</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar-items>
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
        </v-layout>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import login from './components/login.vue';
import firebase from './firebase';

export default {
  components: {
    login,
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
