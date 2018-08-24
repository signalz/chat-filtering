import express from 'express';
import cors from 'cors';
import formidable from 'formidable';
import fs from 'fs';
import _ from 'lodash';
import bodyParser from 'body-parser';
// import MongoClient from 'mongodb';

let wordsObj = {};
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

const traverseObject = (obj, text) => {
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i).toLowerCase();
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

const convertDataToObject = data => {
  const obj = {};
  let path = '';
  for (let i = 0; i < data.length; i++) {
    const char = data.charAt(i).toLowerCase();
    if (char === '\r' || char === '\n') {
      if (path !== '') {
        path = path.slice(0, -1);
        _.set(obj, path, '');
        path = '';
      }
    } else {

      if (char === ' ') continue;

      path = `${path}${char}.`;

      if (i === data.length - 1) {
        if (path !== '') {
          path = path.slice(0, -1);
          _.set(obj, path, '');
          path = '';
        }
      }
    }
  }
  return obj;
}

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
        fs.writeFile('json.json', JSON.stringify(wordsObj), 'utf8', () => true);
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
