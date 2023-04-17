import { isObj, objToString } from '../utilits.js';

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

export default (diff, indent = 4, typeOfIndent = ' ') => {
  const getTotalInd = (level, mark = '') => typeOfIndent.repeat((indent * level) - mark.length);

  const getItemStr = (totalInd, mark, key, val, typeOfInd = ' ') => {
    if (isObj(val)) {
      const correctedTotalInd = totalInd + typeOfInd.repeat(mark.length);
      const objVal = objToString(val, true, indent, correctedTotalInd);

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
