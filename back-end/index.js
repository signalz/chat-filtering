import express from 'express';
import cors from 'cors';
import formidable from 'formidable';
import fs from 'fs';
import _ from 'lodash';
import bodyParser from 'body-parser';
// import MongoClient from 'mongodb';

const wordsObj = {};

// var MongoClient = require('mongodb').MongoClient;
// const mongodbConnection = MongoClient.MongoClient;
// const url = 'mongodb://localhost:27017/';

// mongodbConnection.connect(url, (err, client) => {
//   if (err) throw err;
//   // console.log(db);
//   // console.log(db.namespaces.find( { name: 'test.testCollection' } ));
//   const db = client.db("mydb");
//   console.log(db.collection('hello'));
//   db.createCollection("words", (err, res) => {
//     if (err) throw err;
//     console.log("Collection created!");
//     client.close();
//   });
// });

const traverseObject = (obj, prop) => {

}

const app = express();
app.use(cors());
app.use(bodyParser());

app.get('/', (req, res) => {
  res.json({ data: 'Hello World!'});
});

app.post('/upload', (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req);
  form.on('file', (name, file) => {
    try {
      fs.readFile(file.path, 'utf8', (err, data) => {
        if (err) throw err;
        // data will contain the file contents
        // blacklist words
        const words = data.split('\r\n');
        // convert blacklist words to "set" of words
        words.forEach(word => {
          const singleWords = word.trim().split(' ');
          _.set(wordsObj, singleWords, '');
        });
        // extract each word and save to trie format
        // ex: "this is a blacklist word" => { this: { is: { a: ....}}}
        console.log(JSON.stringify(wordsObj));
        res.json({ data: 'saved file' });
      });
    } catch(e) {
      res.json({ data: 'error' });
    }
  });
});

app.post('/text',  (req, res) => {
  const text = req.body.data;
  const words = text.trim().split(' ');
  let result = false;
  words.forEach(word => {

  });
  res.json({ data: 'hitt' });
});

app.listen(5000, () => console.log('Example app listening on port 5000!'));
