import express from 'express';
import cors from 'cors';
import formidable from 'formidable';
import fs from 'fs';
import _ from 'lodash';
import bodyParser from 'body-parser';

import { convertDataToObject, checkText } from './helper';

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
        const addedWords = convertDataToObject(data);
        fs.readFile('words.json', 'utf8', (err, data) => {
          if (err) throw err;
          const updatedWords = _.merge(addedWords, JSON.parse(data));
          fs.writeFile('words.json', JSON.stringify(updatedWords), 'utf8', () => false);
          console.log('convert done', new Date());
          res.json({ data: 'saved file' });
        });
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
    fs.readFile('words.json', 'utf8', (err, data) => {
      if (err) throw err;
      const result = checkText(text, JSON.parse(data));
      console.log('process done', new Date());
      res.json({ data: result });
    });
  } catch(e) {
    res.json({ data: 'error' });
  }
});

app.post('/upload-split', (req, res) => {
  console.log('receive-split', new Date());
  const form = new formidable.IncomingForm();
  form.parse(req);
  form.on('file', (name, file) => {
    try {
      fs.readFile(file.path, 'utf8', (err, data) => {
        if (err) throw err;
        // data will contain the file contents
        // blacklist words
        const addedWords = data.split('\r\n');
        const addedWordsSet = new Set([...addedWords]);
        fs.readFile('split.txt', 'utf8', (err, data) => {
          if (err) throw err;
          const arrayData = data.split(',');
          const arraySet = new Set(arrayData);
          const updatedWordsSet = new Set([...arraySet, ...addedWordsSet])
          fs.writeFile('split.txt', Array.from(updatedWordsSet), 'utf8', () => false);
          console.log('convert done', new Date());
          res.json({ data: 'saved file' });
        });
      });
    } catch(e) {
      res.json({ data: 'error' });
    }
  });
});

app.post('/text-split',  (req, res) => {
  console.log('text receive', new Date());
  const text = req.body.data;
  try {
    fs.readFile('split.txt', 'utf8', (err, data) => {
      if (err) throw err;
      const arrayData = data.split(',');
      const check = text => {
        for (let i = 0; i < arrayData.length; i++) {
          if (arrayData[i] && text.includes(arrayData[i].trim())) {
            console.log(`=== ${arrayData[i]} ===`);
            return true
          }
        }
        return false;
      }
      const isContain = check(text);
      console.log('done process', new Date());
      res.json({ data: isContain });
    });
  } catch(e) {
    console.log('error', new Date());
    res.json({ data: 'error' });
  }
});

app.listen(5000, () => console.log('Example app listening on port 5000!'));
