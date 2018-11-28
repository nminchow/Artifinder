<template>
  <div id="app">
    <v-app id="inspire" dark>
      <v-toolbar app fixed clipped-left>
        <v-toolbar-title>Artifinder</v-toolbar-title>
        <v-spacer></v-spacer>
        <login/>
        <v-toolbar-items>
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
        <router-view/>
      </v-content>
      <v-footer dark height="auto" >
        <v-layout justify-center row wrap>
          <v-btn class="white--text" icon href="https://discord.gg/7arjbp4" target="_blank">
            <font-awesome-icon :icon="['fab', 'discord']" size="2x" />
          </v-btn>
          <v-btn class="white--text" icon href="https://github.com/nminchow/Artifinder" target="_blank">
            <font-awesome-icon :icon="['fab', 'github']" size="2x" />
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
