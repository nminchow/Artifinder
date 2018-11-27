<template>
  <v-container fluid fill-height>
    <v-layout
      justify-center
      align-center
    >
      <v-flex text-xs-center>
        <h1>Joining Game...</h1><br>
        <v-progress-circular
          :size="200"
          :width="17"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-flex>
    </v-layout>
  </v-container>
</template>
