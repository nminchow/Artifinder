<template>
  <v-dialog max-width="290" persistent :value="display">
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
              v-validate="'required'"
              :error-messages="errors.collect('name')"
            ></v-text-field>
            <v-menu
              :close-on-content-click="false"
              v-model="dateMenu"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="date"
                label="Date"
                prepend-icon="event"
                data-vv-name="date"
                v-validate="'required'"
                :error-messages="errors.collect('date')"
                readonly
              ></v-text-field>
              <v-date-picker v-model="date" @input="dateMenu = false"></v-date-picker>
            </v-menu>
            <v-menu
              ref="menu"
              :close-on-content-click="false"
              v-model="timeMenu"
              :nudge-right="40"
              :return-value.sync="time"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="time"
                label="Start Time (UTC)"
                prepend-icon="access_time"
                data-vv-name="time"
                v-validate="'required'"
                :error-messages="errors.collect('time')"
                readonly
              ></v-text-field>
              <v-time-picker
                v-if="timeMenu"
                v-model="time"
                format="24hr"
                full-width
                @change="$refs.menu.save(time)"
              ></v-time-picker>
            </v-menu>
            <v-text-field
              label="Prize"
              v-model="prize"
              data-vv-name="prize"
              v-validate="'required'"
              :error-messages="errors.collect('prize')"
            ></v-text-field>
            <v-text-field
              label="Description"
              v-model="description"
              data-vv-name="description"
              :error-messages="errors.collect('description')"
            ></v-text-field>
            <v-text-field
              label="Join Link"
              v-model="link"
              data-vv-name="link"
              v-validate="'required|url'"
              :error-messages="errors.collect('link')"
            ></v-text-field>
          </v-layout>
        </v-container>
      </v-form>
      </v-card-actions>
      <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            @click="setCreating(false);"
            :disabled="creating"
          >
            Cancel
          </v-btn>
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
import moment from  'moment';

const createGame = function createGame() {
  this.$validator.validateAll().then((result) => {
    if (result) {
      this.creating = true;
      if(!this.link.startsWith('http')) {
        this.link = `https://${this.link}`;
      }
      firebase.db.collection('prizedTournaments').add({
        name: this.name,
        startTime: moment.utc(`${this.date}T${this.time}`).toDate(),
        prize: this.prize,
        description: this.description,
        link: this.link,
        created: firebase.instance.firestore.FieldValue.serverTimestamp(),
      }).then(() => {
        this.creating = false;
        this.setCreating(false);
      });
    }
  });
};

const setCreating = function setCreating(value) {
  this.$emit('update:display', value);
}

export default {
  props: ['display'],
  data() {
    return {
      name: '',
      date: null,
      time: null,
      prize: '',
      description: '',
      link: '',
      creating: false,
      timeMenu: false,
      dateMenu: false,
    };
  },
  methods: {
    createGame,
    setCreating,
  },
};
</script>
