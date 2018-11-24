import firebase from 'firebase';
import firestore from 'firebase/firestore';
import store from './store'



class FireBase {
  constructor(){
    firebase.initializeApp({
      apiKey: 'AIzaSyBEkwobHbPAQ2Yya6VNY1BNsLFg1wR0g_w',
      authDomain: 'artifinder-191f7.firebaseapp.com',
      projectId: 'artifinder-191f7'
    });
    this.db = firebase.firestore();
    this.db.settings({
      timestampsInSnapshots: true
    });
    this.instance = firebase;
  }
}

const firebaseInstance = new FireBase();
Object.freeze(firebaseInstance);

export default firebaseInstance;
