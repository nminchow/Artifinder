<template>
    <v-container
      fluid
      grid-list-md
    >
      <v-layout row wrap>
        <v-flex xs12>
          <v-card>
              <v-card-title>
                Prized Tournaments
                <v-btn v-if="editPermission" @click="creating = true" fab small color="success">
                  <v-fab-transition>
                    <v-icon>add</v-icon>
                  </v-fab-transition>
                </v-btn>
                <createPrizedTournament :display.sync="creating"/>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="headers"
                :items="tournaments"
                :search="search"
                :pagination.sync="pagination"
              >
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.name }}</td>
                  <td class="text-xs-right">{{ formatTime(props.item.startTime) }}</td>
                  <td class="text-xs-right">{{ props.item.prize }}</td>
                  <td class="text-xs-right">{{ props.item.description }}</td>
                  <td class="justify-end layout ma-0">
                    <v-btn
                      class="ml-0 mr-0"
                      flat icon
                      :href="props.item.link"
                      target="_blank"
                      color="accent"
                    >
                      <v-icon> open_in_new </v-icon>
                    </v-btn>
                    <v-btn
                      v-if="editPermission"
                      class="ml-0 mr-0"
                      flat
                      icon
                      @click="deleteItem(props.item)"
                      color="red"
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </td>
                </template>
                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                  Your search for "{{ search }}" found no results.
                </v-alert>
              </v-data-table>
            </v-card>
        </v-flex>
      </v-layout>
    </v-container>
</template>
<script>
import moment from 'moment';
import firebase from '../firebase';
import createPrizedTournament from '../components/createPrizedTournament.vue';

const formatTime = function formatTime(time) {
  return moment(time.toMillis()).format('llll');
};

const setListener = function setListener() {
  const self = this;
  if (this.tournamentsListener != null) this.tournamentsListener();
  const query = firebase.db.collection('prizedTournaments').orderBy('startTime', 'desc').limit(100);
  this.tournamentsListener = query.onSnapshot((querySnapshot) => {
    self.tournaments = [];
    querySnapshot.forEach((doc) => {
      if (doc.metadata.hasPendingWrites) return;
      self.tournaments.push({ ...doc.data(), id: doc.id });
    });
  });
};

const deleteItem = function deleteItem(item) {
  firebase.db.collection('prizedTournaments').doc(item.id).delete();
};

export default {
  data() {
    return {
      tournamentsListener: null,
      search: '',
      creating: false,
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name',
        },
        { text: 'Start Time', value: 'startTime' },
        { text: 'Prize', value: 'prize', sortable: false },
        { text: 'Description', value: 'description', sortable: false },
        { text: 'Join', sortable: false },
      ],
      tournaments: [],
      pagination: {},
    };
  },
  methods: {
    setListener,
    formatTime,
    deleteItem,
  },
  mounted() {
    this.setListener();
    this.pagination.rowsPerPage = 25;
  },
  computed: {
    editPermission() {
      const { permissions } = this.$store.state.user;
      return permissions && permissions.manageTournaments;
    },
  },
  components: {
    createPrizedTournament,
  },
};
</script>
