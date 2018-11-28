<template>
  <v-dialog max-width="290" :value="creatingGame" @input="setCreating">
     <v-card>
       <v-card-title primary-title>
        <div>
          <div class="headline">Create Tournament</div>
        </div>
      </v-card-title>
      <v-card-actions class="pa-3">
       <v-form>
        <v-container>
          <v-layout row wrap>
            <v-text-field
              label="Name"
              v-model="name"
              data-vv-name="name"
              v-validate="'required|min:5'"
              :error-messages="errors.collect('name')"
            ></v-text-field>
            <v-text-field
              label="Tournament Invite Link"
              v-model="link"
              data-vv-name="link"
              v-validate="'required|url'"
              :error-messages="errors.collect('link')"
            >
              <v-tooltip max-width="150" slot="append-outer" bottom>
                <v-icon slot="activator">help</v-icon>
                <span>To allow other players to join, create a tournament and use the "Create Open Invite"
                   option, then paste the link here.</span>
              </v-tooltip>
            </v-text-field>
            <v-select
              :items="types"
              label="Type"
              v-model="type"
            ></v-select>
            <v-select
              :items="sizes"
              label="Size"
              v-model="size"
            ></v-select>
          </v-layout>
        </v-container>
      </v-form>
      </v-card-actions>
      <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            @click="createGame"
            :disabled="creating"
          >
            Create
          </v-btn>
        </v-card-actions>
     </v-card>
  </v-dialog>
</template>

<script>
import firebase from '../firebase';
import gameHelper from '../databaseHelpers/games';

const setCreating = function setCreating(value) {
  this.$store.commit({
    type: 'setCreating',
    creatingGame: value == true,
  });
};


const createGame = function createGame() {
  this.$validator.validateAll().then((result) => {
    if (result) {
        this.creating = true;
        firebase.db.collection('games').add({
          description: this.name,
          playerLimit: this.size,
          currentPlayers: 0,
          created: firebase.instance.firestore.FieldValue.serverTimestamp(),
          owner: this.$store.state.user.userId,
          link: this.link,
          type: this.type,
        }).then(docRef => {
          gameHelper.addUserToGame(this.$store, docRef);
          this.$router.push({ path: `/${docRef.id}` })
        }).then(() => {
          this.setCreating(false);
          this.creating = false;
        })
        .catch(() => {
      });
    }
  });
};

export default {
  data() {
    return {
      name: '',
      link: '',
      sizes: [4, 8, 16, 32, 64],
      size: 4,
      types: ['draft', 'constructed'],
      type: 'draft',
      creating: false,
    };
  },
  methods: {
    setCreating,
    createGame,
  },
  computed: {
    creatingGame() {
      return this.$store.state.user.creatingGame;
    },
  },
};
</script>
