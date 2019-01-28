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

app.set('view engine', 'pug')

function getEntries(coll, success, fail) {
  var client = new MongoClient(dbUrl);
  client.connect(err => {
    if (err) fail(err)
    else {
      const db = client.db()
      const collection = db.collection(coll);
      collection.find({}).toArray((err, docs) => {
        if (err != null) fail(err)
        else success(docs);
      })
    }
  });
}

function getIndexedEntries(coll, success, fail) {
  var client = new MongoClient(dbUrl);
  client.connect(err => {
    if (err) fail(err)
    else {
      const db = client.db()
      const collection = db.collection(coll);
      collection.find({}).toArray((err, docs) => {
        if (err != null) fail(err)
        else {
          var indexedCollection = {};
          docs.forEach(item => {
            indexedCollection[item._id] = item;
          })
          success(indexedCollection);
        }
      })
    }
  });
}

app.get('/skills', (req, res) => {
  getEntries('skills', skills => {
    res.render('skills', {skillData: skills})
  }, err => {
    res.json(FAIL_RESP)
  })
});

app.get('/getEntries', (req, res) => {
  if (req.query.collection == null) { res.json(FAIL_RESP); return; }

  console.log(`serving entries for ${req.query.collection} to ${req.ip}`)

  getEntries(req.query.collection, docs => res.json(docs), err => res.json(err));
});

app.get('/getByKey', (req, res) => {
  if (req.query.collection == null) { res.json(FAIL_RESP); return; }

  console.log(`serving entries for ${req.query.collection} to ${req.ip}`)

  getIndexedEntries(req.query.collection, docs => res.json(docs), err => res.json(err));
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

function uploadJsonList(coll, data) {
  var client = new MongoClient(dbUrl);
  client.connect(err => {
    if (err) return err
    else {
      const db = client.db()
      const collection = db.collection(coll);
      console.log(`updating entry ${JSON.stringify(data)}`)
      collection.insertMany(data, (res) => {
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
    uploadJsonList(collection, jsonData.list);
    // console.log(jsonData.list);
    // jsonData.list.forEach(item => {
      // uploadJsonData(collection, item);
    // });
  } else {
    uploadJsonData(collection, jsonData);
  }

  res.json(SUCCESS_RESP);
});



app.get('/map', (req, res) => {
  getIndexedEntries('map-data', mapData => {
    res.render('map-data', { mapData: mapData })
  }, err => {
    res.json(FAIL_RESP)
  })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));