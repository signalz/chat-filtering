import _ from 'lodash';

export const emptyCharacters = [' ', '\n', '\r', '\t'];

export const convertDataToObject = data => {
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

export const isContain = (text, obj) => {
  let objToTraverse = obj;
  for (let i = 0; i < text.length; i++) {
    for (let j = i; j < text.length;) {
      const char = text.charAt(j).toLowerCase();
      if (emptyCharacters.includes(char)) {
        ++j;
        continue;
      }
      if (objToTraverse[char]) {
        if (objToTraverse[char].isEnd) {
          return true;
        }
        objToTraverse = objToTraverse[char];
        ++j;
      } else {
        if (objToTraverse === obj) {
          ++j;
        } else {
          objToTraverse = obj;
          break;
        }
      }
    }
  }
  return false;
}
