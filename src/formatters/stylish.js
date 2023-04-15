import {
  isObj, hasProp, sortWthoutMutation, objToString,
} from '../utilits.js';

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
  const getTotalIndent = (level, offset) => typeOfIndent.repeat((indent * level) - offset);

  const getStr = (totalIndent, mark, key, val) => `${totalIndent}${mark}${key}: ${val}`;

  const iter = (node, level) => `{${sortWthoutMutation(node, (item1, item2) => (item1.key < item2.key))
    .reduce((acc, item) => {
      const totalInd = getTotalIndent(level, 2);
      const [mark, oldMark] = getStatusMark(item.status);
      const totalIndObjKeys = getTotalIndent(level, 0);

      if (isObj(item.val) && hasProp(item, 'oldVal')) {
        const oldValStr = getStr(totalInd, mark, item.key, item.oldVal);
        const objVal = objToString(item.val, true, indent, totalIndObjKeys);
        const valStr = getStr(totalInd, oldMark, item.key, objVal);

        return `${acc}\n${oldValStr}\n${valStr}`;
      }
      if (isObj(item.val)) {
        const objVal = objToString(item.val, true, indent, totalIndObjKeys);
        const valStr = getStr(totalInd, mark, item.key, objVal);
        return `${acc}\n${valStr}`;
      }

      if (item.status === 'tree') {
        const valStr = getStr(totalInd, mark, item.key, iter(item.children, level + 1));

        return `${acc}\n${valStr}`;
      }
      if (item.status === 'updated') {
        const valStr = getStr(totalInd, mark, item.key, item.val);

        if (isObj(item.oldVal)) {
          const oldValObj = objToString(item.oldVal, true, indent, totalIndObjKeys);
          const oldValStr = getStr(totalInd, oldMark, item.key, oldValObj);

          return `${acc}\n${oldValStr}\n${valStr}`;
        }
        const objValStr = getStr(totalInd, oldMark, item.key, item.oldVal);

        return `${acc}\n${objValStr}\n${valStr}`;
      }

      return `${acc}\n${getStr(totalInd, mark, item.key, item.val)}`;
    }, '')}\n${getTotalIndent(level, indent)}}`;

  return iter(diff, 1);
};
