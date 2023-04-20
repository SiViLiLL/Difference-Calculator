import _ from 'lodash';

const convertValToStr = (val) => {
  if (typeof val === 'string') {
    return `'${val}'`;
  }
  return _.isObject(val) ? '[complex value]' : val;
};

export default (diff) => {
  const iter = (propVal, propName, currAcc) => propVal
    .reduce((acc, item) => {
      const itemVal = convertValToStr(item.val);

      switch (item.status) {
        case 'added':
          return `${acc}Property '${propName + item.key}' was ${item.status} with value: ${itemVal}\n`;
        case 'removed':
          return `${acc}Property '${propName + item.key}' was ${item.status}\n`;
        case 'updated': {
          const itemOldVal = convertValToStr(item.oldVal);
          return `${acc}Property '${propName + item.key}' was ${item.status}. From ${itemOldVal} to ${itemVal}\n`;
        }
        case 'tree':
          return iter(item.children, `${propName + item.key}.`, acc);
        default:
          return acc;
      }
    }, currAcc);

  return iter(diff, '', '').trimEnd();
};
