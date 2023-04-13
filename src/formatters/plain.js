import { isObj, sortWthoutMutation } from '../utilits.js';

export default (diff) => {
  const iter = (propVal, propName, currAcc) => sortWthoutMutation(
    propVal,
    (item1, item2) => (item1.key < item2.key),
  )
    .reduce((acc, item) => {
      const itemVal = typeof item.val === 'string' ? `'${item.val}'` : item.val;
      const itemOldVal = typeof item.oldVal === 'string' ? `'${item.oldVal}'` : item.oldVal;
      switch (item.status) {
        case 'added':
          return `${acc}Property '${propName + item.key}' was ${item.status} with value: ${isObj(itemVal) ? '[complex value]' : itemVal}\n`;
        case 'removed':
          return `${acc}Property '${propName + item.key}' was ${item.status}\n`;
        case 'updated':
          return `${acc}Property '${propName + item.key}' was ${item.status}. From ${isObj(itemOldVal) ? '[complex value]' : itemOldVal} to ${isObj(itemVal) ? '[complex value]' : itemVal}\n`;
        case 'tree':
          return iter(item.children, `${propName + item.key}.`, acc);
        default:
          return acc;
      }
    }, currAcc);

  return iter(diff, '', '').trimEnd();
};
