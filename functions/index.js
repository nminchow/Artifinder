const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const defaultResponse = {
  "title": "Artifinder - Find and Host Artifact Tournaments",
  "thumbnail_url": "https://artifinder.com/favicon.ico",
  "author_name": "Artifinder",
  "author_url": "https://artifinder.com"
};

exports.oembed = functions.https.onRequest((req, res) => {
  const gameId = req.path.split('/')[1];
  if(!gameId) {
    res.status(200).send(defaultResponse);
    return;
  }

  admin.firestore().collection('/games').doc(gameId).get().then((doc) => {
    if(!doc.exists) {
      res.status(200).send(defaultResponse);
      return;
    } else {
      const data = doc.data();
      res.status(200).send({
        "version": "1.0",
        "author_name": data.description,
        "author_url": `https://artifinder.com/${doc.id}`,
        "provider_name": "Artifinder - Find and Host Artifact Tournaments",
        "provider_url": "https://artifinder.com",
      });
    }
    return;
  }).catch(() => {
    res.status(200).send(defaultResponse);
    return;
  });
});


// note that redirect is hardcoded to prod
exports.redirectAfterHeaders = functions.https.onRequest((req, res) => {
  const gameId = req.path.split('/')[1];
  const result = `<!DOCTYPE html>
    <head>
      <link id="oembed" type="application/json+oembed" href="https://${process.env.GCP_PROJECT}.firebaseapp.com/${gameId}/oembed.json">
      <meta name="theme-color" content="#56077a">
      <meta name="twitter:image" content="https://artifinder.com/artifinder.png" />
    </head>
    <body>
      <script>window.location="https://artifinder.com/?gameId=${gameId}";</script>
    </body>
  </html>`;
  res.status(200).send(result);
});

exports.createGame = functions.firestore
  .document('games/{gameId}')
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const game = snap.data();
    const payload = {
      "username": "Artifinder",
      "avatar_url": "https://artifinder.com/artifinder.png",
      "content": "New Tournament Posted on [Artifinder](https://artifinder.com)",
      "embeds": [
        {
          "thumbnail": {
            "url": "https://artifinder.com/artifinder.png"
          },
          "color": 5638010,
          "author": {
            "name": game.description,
            "url": `https://artifinder.com/${snap.id}`,
          },
          "fields": [
            {
              "name": game.type,
              "value": `${game.playerLimit} Player`
            },
          ],
          "footer": {
            "text": "Artifinder - Find and Host Artifact Tournaments"
          },
        }
      ],
    }
    admin.firestore().collection('/listeners').get().then((listeners) => {
      listeners.forEach((listener) => {
        const data = listener.data();
        console.log(`called listener: ${JSON.stringify(payload)}`);
        var options = {
          method: 'post',
          body: payload,
          json: true,
          url: data.url,
        }
        request(options, (err, res, body) => {
          if (err) {
            console.log(`error posting: ${err}`);
          }
        });
      })
      return;
    }).catch(() => {});
    return;
  });
