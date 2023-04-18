import _ from 'lodash';

const getDiff = (obj1, obj2) => _.sortBy(_.union(Object.keys(obj1), Object.keys(obj2)))
  .map((key) => {
    if (obj1[key] === obj2[key]) {
      return { key, status: 'not updated', val: obj1[key] };
    }
    if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
      return { key, status: 'tree', children: getDiff(obj1[key], obj2[key]) };
    }
    if (_.has(obj1, key) && _.has(obj2, key)) {
      return {
        key, status: 'updated', val: obj2[key], oldVal: obj1[key],
      };
    }
    return _.has(obj1, key) ? { key, status: 'removed', val: obj1[key] }
      : { key, status: 'added', val: obj2[key] };
  });

export default getDiff;
