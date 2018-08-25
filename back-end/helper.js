import _ from 'lodash';

export const emptyCharacters = [' ', '\n', '\r', '\t'];

export const traverseObject = (originObj, obj, text) => {
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
