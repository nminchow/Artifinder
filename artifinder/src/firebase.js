import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

class FireBase {
  constructor() {
    firebase.initializeApp({
      apiKey: "AIzaSyB85GPMq_gH-1rsb1KOYsknzgiYETYRROU",
      authDomain: "artifinder-test.firebaseapp.com",
      databaseURL: "https://artifinder-test.firebaseio.com",
      projectId: "artifinder-test",
      storageBucket: "artifinder-test.appspot.com",
      messagingSenderId: "922494783036"
    });
    this.db = firebase.firestore();
    this.db.settings({
      timestampsInSnapshots: true,
    });
    this.instance = firebase;
  }
}

const firebaseInstance = new FireBase();
Object.freeze(firebaseInstance);

export default firebaseInstance;
