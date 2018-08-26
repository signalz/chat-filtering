import express from 'express';
import cors from 'cors';
import formidable from 'formidable';
import fs from 'fs';
import _ from 'lodash';
import bodyParser from 'body-parser';
import MongoClient from 'mongodb';
import mysql from 'mysql';

import { convertDataToObject, checkText } from './helper';

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydb'
});
// const mysqlConnection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'mydb'
// });

// let wordsObj = {};
// let wordsString = [];

const mongodbConnection = MongoClient.MongoClient;
// const ObjectID = MongoClient.ObjectID;
const url = 'mongodb://localhost:27017/';

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
        const wordsObj = convertDataToObject(data);
        // connect to db
        mongodbConnection.connect(url, (err, client) => {
          if (err) throw err;
          const db = client.db('mydb');
          db.collection('words').findOne({}, (err, result) => {
            if (err) throw err;
            // update the list
            const updated = _.merge(result, wordsObj);
            db.collection('words').updateOne({ _id: result._id }, { $set: updated }, (err, response) => {
              if (err) throw err;
              client.close();
              console.log('convert done', new Date());
              res.json({ data: 'saved file' });
            });
          });
        });
        // fs.writeFile('json.json', JSON.stringify(wordsObj), 'utf8', () => true);
      });
    } catch(e) {
      res.json({ data: 'error' });
    }
  });
});

app.post('/text',  (req, res) => {
  console.log('text receive', new Date());
  const text = req.body.data;
  try {
    mongodbConnection.connect(url, (err, client) => {
      if (err) throw err;
      const db = client.db('mydb');
      db.collection('words').findOne({}, (err, wordsObj) => {
        if (err) throw err;
        // update the list
        const result = checkText(text, wordsObj);
        console.log('done process', new Date());
        client.close();
        res.json({ data: result });
      });
    });
  } catch(e) {
    res.json({ data: 'error' });
  }
});

app.post('/upload-split', (req, res) => {
  console.log('receive', new Date());
  const form = new formidable.IncomingForm();
  form.parse(req);
  form.on('file', (name, file) => {
    try {
      fs.readFile(file.path, 'utf8', (err, data) => {
        if (err) {
          throw err;
        };
        const wordsString = data.split('\r\n');
        // const insertArray = [];
        wordsString.forEach(word => insertArray.push([word]));
        pool.getConnection((err, connection) => {
          if (err) throw err;
          const sql = 'INSERT INTO words (word) VALUES ?';
          connection.query(sql, [insertArray], (err, result) => {
            connection.release();
            if (err) throw err;
            console.log('Number of records inserted: ' + result.affectedRows, new Date());
            res.json({ data: 'saved file' });
          });
        });
      });
    } catch(e) {
      console.log('error', new Date());
      res.json({ data: 'error' });
    }
  });
});

app.post('/text-split',  (req, res) => {
  console.log('text receive', new Date());
  const text = req.body.data;
  try {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query('SELECT * FROM words', (err, result, fields) => {
        connection.release();
        if (err) throw err;
        const check = text => {
          for (let i = 0; i < result.length; i++) {
            if (result[i].word && text.includes(result[i].word.trim())) {
              // console.log(`s${wordsString[i]}s`);
              return true
            }
          }
          return false;
        }
        const isContain = check(text);
        console.log('done process', new Date());
        res.json({ data: isContain });
      });
    });
  } catch(e) {
    console.log('error', new Date());
    res.json({ data: 'error' });
  }
});

app.listen(5000, () => console.log('Example app listening on port 5000!'));
