const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

var bodyParser = require('body-parser');

const atob = require('atob');
const moment = require('moment');
const Promise = require('promise');
var MongoClient = require('mongodb').MongoClient;

const FAIL_RESP = { success: false };
const SUCCESS_RESP = { success: true };


// Connection URL
const dbUrl = 'mongodb://{REDACTED}@ds253804.mlab.com:53804/heroku_8xc7nt9g';
const dbName= 'heroku_8xc7nt9g';

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

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

function overwriteJsonData(coll, data) {
  var client = new MongoClient(dbUrl);
  client.connect(err => {
    if (err) return err
    else {
      const db = client.db()
      const collection = db.collection(coll);
      console.log(`updating entry ${JSON.stringify(data)}`)
      collection.update({ _id: data._id }, data, { upsert: true, multi: false }, (res) => {
        return true;
      });
    }
  });
}

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

app.get('/map-data', (req, res) => {
  getIndexedEntries('map-data', mapData => {
    res.json(mapData)
  }, err => {
    res.json(FAIL_RESP)
  })
});

app.get('/map-aliases', (req, res) => {
  getIndexedEntries('map-data', mapData => {

  var aliases = {};

  for(var key in mapData) {
    var point = mapData[key];

    var celestials = ['stations', 'planets', 'suns'];

    for(var cIndex in celestials) {
      var celestial = celestials[cIndex];

      if (point[celestial]) {
        for(var i in point[celestial]) {
          var item = point[celestial][i];
          aliases[item.name] = point._id;
        }
      }
    }
  }

    res.json(aliases)
  }, err => {
    res.json(FAIL_RESP)
  })
});

app.post('/update-map', (req, res) => {
  console.log('uplodaing map-data', req.body._id);
  overwriteJsonData('map-data', req.body)

  res.json(SUCCESS_RESP);
})

app.get('/map', (req, res) => {
  res.render('map');
});

app.use(express.static('public'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
