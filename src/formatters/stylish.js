import _ from 'lodash';

const getStatusBage = (status) => {
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
  const getTotalIndent = (level, statusBage = '') => typeOfIndent.repeat((indent * level) - statusBage.length);

  const getItemStr = (totalIndent, statusBage, key, val) => {
    if (_.isPlainObject(val)) {
      const externalIndent = totalIndent + typeOfIndent.repeat(statusBage.length);
      const objVal = objToStr(val, true, indent, externalIndent);

      return `${totalIndent}${statusBage}${key}: ${objVal}`;
    }
    return `${totalIndent}${statusBage}${key}: ${val}`;
  };

  const iter = (node, level) => `{${node.reduce((acc, item) => {
    const [statusBage, oldStatusBage] = getStatusBage(item.status);
    const totalInd = getTotalIndent(level, statusBage);

    switch (item.status) {
      case 'tree':
        return `${acc}\n`
                + `${getItemStr(totalInd, statusBage, item.key, iter(item.children, level + 1))}`;
      case 'updated':
        return `${acc}\n`
                + `${getItemStr(totalInd, oldStatusBage, item.key, item.oldVal)}\n`
                + `${getItemStr(totalInd, statusBage, item.key, item.val)}`;
      default:
        return `${acc}\n`
                + `${getItemStr(totalInd, statusBage, item.key, item.val)}`;
    }
  }, '')}\n${getTotalIndent(level - 1)}}`;

  return iter(diff, 1);
};
