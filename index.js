const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const admin = require('firebase-admin');

var serviceAccount = require('starmourn-map-data-ddb16ef243c4.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/specials', (req, res) => {
  db.collection('room-notes')
    .get()
    .then((snapshot) => {
        res.json(snapshot);
    });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));