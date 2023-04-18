import _ from 'lodash';

const getStatusMark = (status) => {
  switch (status) {
    case 'added':
      return ['+ '];
    case 'removed':
      return ['- '];
    case 'updated':
      return ['+ ', '- '];
    default:
      return ['  '];
  }
};

const objToStr = (obj, isNested = false, indent = 4, externalInd = '', typeOfIndent = ' ') => {
  const getTotalIndent = (currLevel) => externalInd + typeOfIndent.repeat(currLevel * indent);

  const iter = (currObj, currLevel) => Object.entries(currObj).reduce((acc, [prop, val]) => {
    if (_.isPlainObject(val)) {
      return `${acc}\n${getTotalIndent(currLevel)}${prop}: {${iter(val, currLevel + 1)}\n${getTotalIndent(currLevel)}}`;
    }
    return `${acc}\n${getTotalIndent(currLevel)}${prop}: ${val}`;
  }, '');

  return `${isNested ? '' : externalInd}{${iter(obj, 1)}\n${externalInd}}`;
};

export default (diff, indent = 4, typeOfIndent = ' ') => {
  const getTotalInd = (level, mark = '') => typeOfIndent.repeat((indent * level) - mark.length);

  const getItemStr = (totalInd, mark, key, val, typeOfInd = ' ') => {
    if (_.isPlainObject(val)) {
      const correctedTotalInd = totalInd + typeOfInd.repeat(mark.length);
      const objVal = objToStr(val, true, indent, correctedTotalInd);

      return `${totalInd}${mark}${key}: ${objVal}`;
    }
    return `${totalInd}${mark}${key}: ${val}`;
  };

  const iter = (node, level) => `{${node.reduce((acc, item) => {
    const [mark, oldMark] = getStatusMark(item.status);
    const totalInd = getTotalInd(level, mark);

    switch (item.status) {
      case 'tree':
        return `${acc}\n`
                + `${getItemStr(totalInd, mark, item.key, iter(item.children, level + 1))}`;
      case 'updated':
        return `${acc}\n`
                + `${getItemStr(totalInd, oldMark, item.key, item.oldVal)}\n`
                + `${getItemStr(totalInd, mark, item.key, item.val)}`;
      default:
        return `${acc}\n`
                + `${getItemStr(totalInd, mark, item.key, item.val)}`;
    }
  }, '')}\n${getTotalInd(level - 1)}}`;

  return iter(diff, 1);
};
