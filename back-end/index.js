import express from 'express';
import cors from 'cors';
import formidable from 'formidable';
import fs from 'fs';
import _ from 'lodash';
import bodyParser from 'body-parser';
// import MongoClient from 'mongodb';

import { convertDataToObject, checkText } from './helper';

let wordsObj = {};
let wordsString = [];

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
        wordsObj = convertDataToObject(data);
        // fs.writeFile('json.json', JSON.stringify(wordsObj), 'utf8', () => true);
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
  const result = checkText(text, wordsObj);
  console.log('done process', new Date());
  res.json({ data: check(text) });
});

app.post('/upload-split', (req, res) => {
  console.log('receive', new Date());
  const form = new formidable.IncomingForm();
  form.parse(req);
  try {
    form.on('file', (name, file) => {
      console.log('hit>?');
      try {
        fs.readFile(file.path, 'utf8', (err, data) => {
          // console.log('read');
          if (err) {
            console.log('fs error');
            throw err;
          };
          wordsString = data.split('\r\n');
          // let newWords = '';
          // console.log('start');
          // wordsString.forEach((word) => {
          //   newWords = `${word} ${_.random(0, wordsString.length - 1)}\r\n`;
          //   newWords = `${word} ${_.random(0, wordsString.length - 1)}\r\n`;
          //   newWords = `${word} ${_.random(0, wordsString.length - 1)}\r\n`;
          //   newWords = `${word} ${_.random(0, wordsString.length - 1)}\r\n`;
          //   newWords = `${word} ${_.random(0, wordsString.length - 1)}\r\n`;
          // });
          // fs.writeFile('2m-words.txt', newWords, 'utf8', () => true);
          console.log(wordsString.length);
          console.log('convert done', new Date());
          res.json({ data: 'saved file' });
        });
      } catch(e) {
        console.log('error', new Date());
        res.json({ data: 'error' });
      }
    });
  } catch (e) {
    console.log(e);
  }
});

app.post('/text-split',  (req, res) => {
  console.log('text receive', new Date());
  const text = req.body.data;
  const check = text => {
    for (let i = 0; i < wordsObj.length; i++) {
      if (wordsString[i] && text.includes(wordsString[i])) {
        console.log(`s${wordsString[i]}s`);
        return true
      }
    }
    return false;
  }

  console.log('done process', new Date());
  res.json({ data: check(text) });
});

app.listen(5000, () => console.log('Example app listening on port 5000!'));

// handle words like zzz, zzzt
