import firebase from '../firebase';

/* eslint-disable no-console */
export default class games {
  static addUserToGame(store, docRef) {
    // add to member collection
    return docRef.collection('members').doc(store.state.user.userId).set({
      name: store.state.user.name,
    }).then(() => {
      if (store.state.user.currentGame == null) return Promise.resolve();
      return this.removeGameMember(store.state.user.userId, store.state.user.currentGame);
    })
      .then(() => firebase.db.collection('userData').doc(store.state.user.userId).update({
        currentGame: docRef.id,
      }))
      .then(() => store.commit({
        type: 'setGame',
        currentGame: docRef.id,
      }))
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  }

  static removeGameMember(playerId, gameId) {
    return firebase.db.collection('games')
      .doc(gameId)
      .collection('members').doc(playerId)
      .delete()
      .catch(() => {
        console.log('error removing');
      });
  }

  static removeUserGameRef(playerId) {
    return firebase.db.collection('userData').doc(playerId).update({
      currentGame: null,
    }).catch(() => {
      console.log('error remoing ref');
    });
  }
}
/* eslint-enable no-console */
