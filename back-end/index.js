import express from 'express';
import cors from 'cors';
import formidable from 'formidable';
import fs from 'fs';
import _ from 'lodash';
import bodyParser from 'body-parser';
// import MongoClient from 'mongodb';

import { traverseObject, convertDataToObject } from './helper';

let wordsObj = {};

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

const data = '1092\r\n2199\r\nzZZ\r\n10982\r\n1093 23';
console.log(JSON.stringify(convertDataToObject(data)));
const obj = convertDataToObject(data);
console.log(traverseObject(obj, obj, '13092  1980 1093 23'));

const app = express();
app.use(cors());
app.use(bodyParser());

app.get('/', (req, res) => {
  res.json({ data: 'Hello World!'});
});

app.post('/upload', (req, res) => {
  console.log('receive', new Date());
  const form = new formidable.IncomingForm();
  form.parse(req);
  form.on('file', (name, file) => {
    try {
      fs.readFile(file.path, 'utf8', (err, data) => {
        if (err) throw err;
        // data will contain the file contents
        // blacklist words
        // gen file with multi words
        // let newString = '';
        // const words = data.split('\r\n');
        // words.forEach(word => {
        //   newString = `${newString}${words[_.random(0, words.length - 1)]} ${words[_.random(0, words.length - 1)]} ${words[_.random(0, words.length - 1)]}\r\n`;
        // });
        // wordsObj = convertDataToObject(data);
        fs.writeFile('newWords.txt', newString, 'utf8', () => true);
        console.log('convert done', new Date());
        res.json({ data: 'saved file' });
      });
    } catch(e) {
      res.json({ data: 'error' });
    }
  });
});

app.post('/text',  (req, res) => {
  console.log('text receive', new Date());
  const text = req.body.data;
  console.log(text);
  const result = traverseObject(wordsObj, text);
  console.log('done process', new Date());
  res.json({ data: result });
});

app.listen(5000, () => console.log('Example app listening on port 5000!'));

// handle words like zzz, zzzt
