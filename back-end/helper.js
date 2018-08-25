import _ from 'lodash';

export const emptyCharacters = [' ', '\n', '\r', '\t'];

export const buildPath = text => {
  let path = '';
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i).toLowerCase();
    if (emptyCharacters.includes(char)) {
      continue;
    } else {}
  }
}

export const checkText = (text, wordsObject) => {
  let isContains = false;
  const traverseObject = (originObj, obj, firstIndex, startIndex, text) => {
    let objToTraverse = obj;
    for (let i = startIndex; i < text.length; i++) {
      const char = text.charAt(i).toLowerCase();
      // console.log(char);
      if (emptyCharacters.includes(char)) {
        continue;
      }
      if (objToTraverse[char]) {
        if (objToTraverse[char].isEnd) {
          isContains = true;
          return;
        }
        objToTraverse = objToTraverse[char];
        // console.log('recursive');
        return traverseObject(originObj, objToTraverse, firstIndex, i + 1, text);
      } else {
        // console.log('next');
        return traverseObject(originObj, originObj, firstIndex + 1, firstIndex +1, text);
      }
    }
  }

  traverseObject(wordsObject, wordsObject, 0, 0, text);

  return isContains;
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
