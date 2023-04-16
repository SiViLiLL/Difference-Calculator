const isObj = (val) => Object.prototype.toString.call(val) === '[object Object]';

const hasProp = (o, prop) => Object.prototype.hasOwnProperty.call(o, prop);

const getUnKeys = (...listOfObj) => Object.keys(Array.from(listOfObj)
  .reduce((acc, item) => ({ ...acc, ...item }), {}));

// merge sort without any mutation :)
const sortWtMut = (arr, func) => {
  if (arr.length < 2) return arr;
  const mid = Math.floor((arr.length) / 2);

  const leftHalf = arr.slice(0, mid);
  const rightHalf = arr.slice(mid, arr.length);

  const mergeSort = (lHalf, rHalf) => {
    const iter = (l, r, result) => {
      if (l >= lHalf.length) {
        return [...result, ...rHalf.slice(r, rHalf.length)];
      }
      if (r >= rHalf.length) {
        return [...result, ...lHalf.slice(l, lHalf.length)];
      }
      if (func(lHalf[l], rHalf[r])) {
        const actualResult = [...result, lHalf[l]];
        return iter(l + 1, r, actualResult);
      }
      const actualResult = [...result, rHalf[r]];
      return iter(l, r + 1, actualResult);
    };

    return iter(0, 0, []);
  };

  return mergeSort(sortWtMut(leftHalf, func), sortWtMut(rightHalf, func));
};

const objToString = (obj, isNested = false, indent = 4, externalInd = '', typeOfIndent = ' ') => {
  const getTotalIndent = (currLevel) => externalInd + typeOfIndent.repeat(currLevel * indent);

  const iter = (currObj, currLevel) => Object.entries(currObj).reduce((acc, [prop, val]) => {
    if (isObj(val)) {
      return `${acc}\n${getTotalIndent(currLevel)}${prop}: {${iter(val, currLevel + 1)}\n${getTotalIndent(currLevel)}}`;
    }
    return `${acc}\n${getTotalIndent(currLevel)}${prop}: ${val}`;
  }, '');
  return `${isNested ? '' : externalInd}{${iter(obj, 1)}\n${externalInd}}`;
};

export {
  isObj, hasProp, sortWtMut, objToString, getUnKeys,
};
