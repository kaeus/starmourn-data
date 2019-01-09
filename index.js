const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const url = require('url');

const admin = require('firebase-admin');

var serviceAccount = require('./starmourn-map-data-ddb16ef243c4.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/special', (req, res) => {
  db.collection('specials').get().then((snapshot) => {
      var specials = []
      if (snapshot.empty) {
        res.json([]);
      } else {
        snapshot.forEach(doc => {
          specials.push(doc.data());
        });

        res.json(specials);
      }
  });
});

app.get('/uploadSpecial', (req, res) => {
  var data = atob(req.query.payload);
  var jsonData = JSON.parse(data);

  var ref = db.collection('specials').doc(jsonData.key);
  ref.set(jsonData);

  res.send(200);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));