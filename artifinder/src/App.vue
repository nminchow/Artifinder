<template>
  <div id="app">
    <v-app id="inspire" dark>
      <v-toolbar app fixed clipped-left>
        <v-toolbar-title>Artifinder</v-toolbar-title>
      </v-toolbar>
      <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <Login/>
          <v-flex shrink>
            <div id="nav">
              <router-link to="/">Home</router-link> |
              <router-link to="/about">About</router-link>
            </div>
            <router-view/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    </v-app>
  </div>
</template>

<script>
import Login from './components/Login.vue';

export default {
  components: {
    Login,
  },
};
</script>
