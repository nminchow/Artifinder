<template>
  <v-container fluid fill-height>
    <v-layout
      justify-center
      align-center
    >
      <v-flex>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0">Cookies</h3>
          </v-card-title>
          <v-card-text>
            We use cookies to improve your browsing experience on Artifinder, primarily to keep track of your username and current game. By browsing Artifinder, you consent to our use of cookies.
          </v-card-text>
          <v-card-actions>
            <v-btn
              flat
              color="primary"
              @click="close"
              :disabled="loggingIn"
            >Got It!</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  methods: {
    close() {
      window.close();
    }
  }
}
</script>

