import _ from 'lodash';

const getStatusBage = (status) => {
  switch (status) {
    case 'added':
      return ['+ '];
    case 'removed':
      return ['- '];
    case 'updated':
      return ['+ ', '- '];
    case 'not updated':
    case 'tree':
      return ['  '];
    default:
      throw new Error('Oops, something went wrong )');
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

const getTotalIndent = (level, indent, typeOfIndent, statusBage = '') => typeOfIndent.repeat((indent * level) - statusBage.length);

const getItemStr = (totalIndent, indent, typeOfIndent, statusBage, key, val) => {
  if (_.isPlainObject(val)) {
    const externalIndent = totalIndent + typeOfIndent.repeat(statusBage.length);
    const objVal = objToStr(val, true, indent, externalIndent);

    return `${totalIndent}${statusBage}${key}: ${objVal}`;
  }
  return `${totalIndent}${statusBage}${key}: ${val}`;
};

export default (diff, indent = 4, typeOfIndent = ' ') => {
  const iter = (node, level) => `{${node.reduce((acc, item) => {
    const [statusBage, oldStatusBage] = getStatusBage(item.status);
    const totalIndent = getTotalIndent(level, indent, typeOfIndent, statusBage);

    switch (item.status) {
      case 'tree':
        return `${acc}\n`
                + `${getItemStr(totalIndent, indent, typeOfIndent, statusBage, item.key, iter(item.children, level + 1))}`;
      case 'updated':
        return `${acc}\n`
                + `${getItemStr(totalIndent, indent, typeOfIndent, oldStatusBage, item.key, item.oldVal)}\n`
                + `${getItemStr(totalIndent, indent, typeOfIndent, statusBage, item.key, item.val)}`;
      case 'added':
      case 'removed':
      case 'not updated':
        return `${acc}\n`
                + `${getItemStr(totalIndent, indent, typeOfIndent, statusBage, item.key, item.val)}`;
      default:
        throw new Error('Oops, something went wrong )');
    }
  }, '')}\n${getTotalIndent((level - 1), indent, typeOfIndent)}}`;

  return iter(diff, 1);
};
