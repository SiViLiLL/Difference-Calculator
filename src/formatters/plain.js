import { isObj } from '../utilits.js';

export default (diff) => {
  const converValToStr = (val) => (typeof val === 'string' ? `'${val}'` : val);

  const iter = (propVal, propName, currAcc) => propVal
    .reduce((acc, item) => {
      const itemVal = converValToStr(item.val);
      const itemOldVal = converValToStr(item.oldVal);

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
