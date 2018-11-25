import firebase from '../firebase';

export default class games {
  static addUserToGame(store, docRef) {
    // add to member collection
    return docRef.collection('members').doc(store.state.user.userId).set({
      name: store.state.user.name,
    }).then(() => {
      // increment counter on new collection
      firebase.db.runTransaction(transaction => transaction.get(docRef).then((sfDoc) => {
        if (!sfDoc.exists) {
          return;
        }
        const players = sfDoc.data().currentPlayers + 1;
        transaction.update(docRef, { currentPlayers: players });
      })).catch((error) => {});
    })
      .then(() => {
        if (store.state.user.currentGame == null) return Promise.resolve();
        return this.removeFromGame(store.state.user.userId, store.state.user.currentGame);
      })
      .then(() => firebase.db.collection('userData').doc(store.state.user.userId).update({
        currentGame: docRef.id,
      }))
      .then(() => store.commit({
        type: 'setGame',
        currentGame: docRef.id,
      }))
      .then(() => store.commit({
        type: 'setPreview',
        currentGame: null,
      }))
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  }

  static removeFromGame(playerId, gameId) {
    const doc = firebase.db.collection('games').doc(gameId);
    return firebase.db.runTransaction(transaction => transaction.get(doc).then((sfDoc) => {
      if (!sfDoc.exists) {
        return;
      }
      const players = sfDoc.data().currentPlayers - 1;
      transaction.update(doc, { currentPlayers: players });
    })).catch((error) => {
      console.log('error decrementing')
    }).then(() => {
      return this.removeGameMember(playerId, gameId);
    });
  }

  static removeGameMember(playerId, gameId) {
    return firebase.db.collection('games')
      .doc(gameId)
      .collection('members').doc(playerId)
      .delete().catch((error) => {
        console.log('error removing')
    });
  }

  static removeUserGameRef(playerId) {
    return firebase.db.collection('userData').doc(playerId).update({
      currentGame: null,
    }).catch((error) => {
      console.log('error remoing ref')
    })
  }
}
