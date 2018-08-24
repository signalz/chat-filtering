import express from 'express';
import cors from 'cors';
import formidable from 'formidable';
import fs from 'fs';
import _ from 'lodash';
import bodyParser from 'body-parser';
// import MongoClient from 'mongodb';

const wordsObj = {};
const emptyCharacters = [' ', '\n', '\r', '\t'];

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

const test = {
  t: {
    h: {
      e: {
        f: {
          u: {
            c: {
              k: ''
            }
          }
        }
      }
    }
  }
}

const traverseObject = (obj, text) => {
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    if (emptyCharacters.includes(char)) {
        return traverseObject(obj, text.slice(i + 1));
    }

    if (obj[char] === '') {
      return true;
    }

    if (obj[char]) {
      return traverseObject(obj[char], text.slice(i + 1));
    }
  }
  return false;
}

// console.log(traverseObject(test, "sccasc        the fuc"));

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
        // ex: "this is a blacklist word" => { t:{ h: { i: {s ...}}}}
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
  res.json({ data: traverseObject(wordsObj, text) });
});

app.listen(5000, () => console.log('Example app listening on port 5000!'));
