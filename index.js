const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const atob = require('atob');
const moment = require('moment');
const Promise = require('promise');
var MongoClient = require('mongodb').MongoClient;

const FAIL_RESP = { success: false };
const SUCCESS_RESP = { success: true };


// Connection URL
const dbUrl = 'mongodb://kaeus:hyuchi88@ds253804.mlab.com:53804/heroku_8xc7nt9g';
const dbName= 'heroku_8xc7nt9g';

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/getEntries', (req, res) => {
  if (req.query.collection == null) { res.json(FAIL_RESP); return; }

  console.log(`serving entries for ${req.query.collection} to ${req.ip}`)

  var client = new MongoClient(dbUrl);
  client.connect(err => {
    if (err) res.json(err)
    else {
      const db = client.db()
      const collection = db.collection(req.query.collection);
      collection.find({}).toArray((err, docs) => {
        if (err != null) res.json(err)
        else res.json(docs);
      })
    }
  });
});

function uploadJsonData(coll, data) {
  var client = new MongoClient(dbUrl);
  client.connect(err => {
    if (err) return err
    else {
      const db = client.db()
      const collection = db.collection(coll);
      console.log(`updating entry ${JSON.stringify(data)}`)
      collection.updateOne({ _id: data._id }, { $set: data }, { upsert:true }, (res) => {
        return true;
      });
    }
  });
}

app.get('/uploadEntry', (req, res) => {
  if (req.query.collection == null) { res.json(FAIL_RESP); return; }
  if (req.query.payload == null) { res.json(FAIL_RESP); return; }

  var collection = req.query.collection
  var data = atob(req.query.payload);

  //console.log(`uploadEntry: ${data}`);

  var jsonData = JSON.parse(data);

  if (jsonData.list != null) {
    console.log('list');
    jsonData.list.forEach(item => {
      uploadJsonData(collection, item);
    });
  } else {
    uploadJsonData(collection, jsonData);
  }

  res.json(SUCCESS_RESP);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));