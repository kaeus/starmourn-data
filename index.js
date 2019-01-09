const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const atob = require('atob');
const moment = require('moment');

const admin = require('firebase-admin');

const FAIL_RESP = { success: false };
const SUCCESS_RESP = { success: true };

var serviceAccount = require('./starmourn-map-data-ddb16ef243c4.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

app.get('/getEntries', (req, res) => {
  if (req.query.collection == null) { res.json(FAIL_RESP); return; }

  db.collection(req.query.collection).get().then((snapshot) => {
    var items = [];
    if (!snapshot.empty) {
      snapshot.forEach(doc => {
        items.push(doc.data());
      });
    }
    res.json(items)
  });
});

function uploadJsonData(collection, data) {
  var ref = db.collection(collection).doc(data.key);
  ref.set(data);

  return true;
}

app.get('/uploadEntry', (req, res) => {
  if (req.query.collection == null) { res.json(FAIL_RESP); return; }
  if (req.query.payload == null) { res.json(FAIL_RESP); return; }

  var collection = req.query.collection
  var data = atob(req.query.payload);
  var jsonData = JSON.parse(data);

  if (jsonData.list) {
    jsonData.list.forEach(item => {
      var ref = db.collection(collection).doc(item.key);
      ref.set(item);
    });
  } else {
    var ref = db.collection(collection).doc(data.key);
    ref.set(data);
  }

  res.json(SUCCESS_RESP);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));