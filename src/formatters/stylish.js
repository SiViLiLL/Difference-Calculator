import { isObj, sortWthoutMutation } from '../utilits.js';

const objToString = (obj, level, indent, typeOfIndent) => {
  const getTotalIndent = (currLevel) => typeOfIndent.repeat(currLevel * indent);

  const iter = (currObj, currLevel) => Object.entries(currObj).reduce((acc, [prop, val]) => {
    if (isObj(val)) {
      return `${acc}\n${getTotalIndent(currLevel)}${prop}: {${iter(val, currLevel + 1)}\n${getTotalIndent(currLevel)}}`;
    }
    return `${acc}\n${getTotalIndent(currLevel)}${prop}: ${val}`.trimEnd();
  }, '');
  return `{${iter(obj, level)}\n${getTotalIndent(level - 1)}}`;
};

export default (diff, indent = 4, typeOfIndent = ' ') => {
  const getTotalIndent = (level, offset) => typeOfIndent.repeat((indent * level) - offset);

  const iter = (node, level) => `{${sortWthoutMutation(node, (item1, item2) => (item1.key < item2.key))
    .reduce((acc, item) => {
      if (isObj(item.val)) {
        return `${acc}\n${getTotalIndent(level, 2)}${item.status === 'added' ? '+ ' : '- '}${item.key}: ${objToString(item.val, level + 1, indent, typeOfIndent)}`;
      }
      switch (item.status) {
        case 'tree':
          return `${acc}\n${getTotalIndent(level, 2)}  ${item.key}: ${iter(item.children, level + 1)}`;
        case 'not updated':
          return `${acc}\n${getTotalIndent(level, 2)}  ${item.key}: ${item.val}`.trimEnd();
        case 'removed':
          return `${acc}\n${getTotalIndent(level, 2)}- ${item.key}: ${item.val}`.trimEnd();
        case 'added':
          return `${acc}\n${getTotalIndent(level, 2)}+ ${item.key}: ${item.val}`.trimEnd();
        default:
          return `${acc}\n${getTotalIndent(level, 2)}- ${item.key}: ${isObj(item.oldVal) ? objToString(item.oldVal, level + 1, indent, typeOfIndent) : item.oldVal}`.trimEnd() + `\n${getTotalIndent(level, 2)}+ ${item.key}: ${item.val}`.trimEnd();
      }
    }, '')}\n${getTotalIndent(level, indent)}}`;

  return iter(diff, 1);
};
