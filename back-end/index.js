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

const traverseObject = (originObj, obj, text) => {
  let objToTraverse = obj;
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i).toLowerCase();
    if (emptyCharacters.includes(char)) {
      continue;
    }

    if (objToTraverse[char]) {
      if (objToTraverse[char].isEnd) {
        return true;
      }
      objToTraverse = objToTraverse[char];
      return traverseObject(originObj, objToTraverse, text.slice(i + 1));
    } else {
      return traverseObject(originObj, originObj, text.slice(i + 1));
    }
  }
  return false;
}

const convertDataToObject = data => {
  let obj = {};
  let path = '';
  for (let i = 0; i <= data.length; i++) {
    const char = data.charAt(i).toLowerCase();
    if (char === '\r' || char === '\n' || !char ) {
      if (path !== '') {
        const newWord = _.setWith({}, path, { isEnd: true }, Object);
        obj = _.merge(obj, newWord);
        path = '';
      }
    } else {
      if (char === ' ') continue;

      path = `${path}[${char}]`;
    }
  }
  return obj;
}

const data = '1092\r\n2199\r\nzZZ\r\n10982\r\n1093 23';
console.log(JSON.stringify(convertDataToObject(data)));
const obj = convertDataToObject(data);
console.log(traverseObject(obj, obj, '13092  1980 1093 23'));

// const app = express();
// app.use(cors());
// app.use(bodyParser());

// app.get('/', (req, res) => {
//   res.json({ data: 'Hello World!'});
// });

// app.post('/upload', (req, res) => {
//   console.log('receive', new Date());
//   const form = new formidable.IncomingForm();
//   form.parse(req);
//   form.on('file', (name, file) => {
//     try {
//       fs.readFile(file.path, 'utf8', (err, data) => {
//         if (err) throw err;
//         // data will contain the file contents
//         // blacklist words
//         wordsObj = convertDataToObject(data);
//         fs.writeFile('json.json', JSON.stringify(wordsObj), 'utf8', () => true);
//         console.log('convert done', new Date());
//         res.json({ data: 'saved file' });
//       });
//     } catch(e) {
//       res.json({ data: 'error' });
//     }
//   });
// });

// app.post('/text',  (req, res) => {
//   console.log('text receive', new Date());
//   const text = req.body.data;
//   console.log(text);
//   const result = traverseObject(wordsObj, text);
//   console.log('done process', new Date());
//   res.json({ data: result });
// });

// app.listen(5000, () => console.log('Example app listening on port 5000!'));

// handle words like zzz, zzzt
