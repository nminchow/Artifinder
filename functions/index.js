const functions = require('firebase-functions');
const admin = require('firebase-admin');
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
      <meta content='/artifinder.png' property='og:image'>
    </head>
    <body>
      <script>window.location="https://artifinder.com/?gameId=${gameId}";</script>
    </body>
  </html>`;
  res.status(200).send(result);
});
