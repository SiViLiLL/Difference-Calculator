import _ from 'lodash';

export default (diff) => {
  const convertValToStr = (val) => {
    if (typeof val === 'string') {
      return `'${val}'`;
    }
    return _.isObject(val) ? '[complex value]' : val;
  };

  const iter = (propVal, propName, currAcc) => propVal
    .reduce((acc, item) => {
      const itemVal = convertValToStr(item.val);
      const itemOldVal = convertValToStr(item.oldVal);

      switch (item.status) {
        case 'added':
          return `${acc}Property '${propName + item.key}' was ${item.status} with value: ${itemVal}\n`;
        case 'removed':
          return `${acc}Property '${propName + item.key}' was ${item.status}\n`;
        case 'updated':
          return `${acc}Property '${propName + item.key}' was ${item.status}. From ${itemOldVal} to ${itemVal}\n`;
        case 'tree':
          return iter(item.children, `${propName + item.key}.`, acc);
        default:
          return acc;
      }
    }, currAcc);

  return iter(diff, '', '').trimEnd();
};
