const objToStr = (obj, isNested = false, indent = 4, externalInd = '', typeOfIndent = ' ') => {
  const isObj = (val) => Object.prototype.toString.call(val) === '[object Object]';
  const getTotalIndent = (currLevel) => externalInd + typeOfIndent.repeat(currLevel * indent);

  const iter = (currObj, currLevel) => Object.entries(currObj).reduce((acc, [prop, val]) => {
    if (isObj(val)) {
      return `${acc}\n${getTotalIndent(currLevel)}${prop}: {${iter(val, currLevel + 1)}\n${getTotalIndent(currLevel)}}`;
    }
    return `${acc}\n${getTotalIndent(currLevel)}${prop}: ${val}`;
  }, '');
  return `${isNested ? '' : externalInd}{${iter(obj, 1)}\n${externalInd}}`;
};

export default objToStr;
