import {
  hasProp, isObj, sortWtMut, getUnKeys,
} from './utilits.js';

const getDiff = (obj1, obj2) => sortWtMut(getUnKeys(obj1, obj2), (key1, key2) => key1 < key2)
  .map((key) => {
    if (hasProp(obj1, key) && hasProp(obj2, key) && obj1[key] === obj2[key]) {
      return { key, status: 'not updated', val: obj1[key] };
    }
    if (hasProp(obj1, key) && hasProp(obj2, key) && isObj(obj1[key]) && isObj(obj2[key])) {
      return { key, status: 'tree', children: getDiff(obj1[key], obj2[key]) };
    }
    if (hasProp(obj1, key) && hasProp(obj2, key)) {
      return {
        key, status: 'updated', val: obj2[key], oldVal: obj1[key],
      };
    }
    return hasProp(obj1, key) ? { key, status: 'removed', val: obj1[key] }
      : { key, status: 'added', val: obj2[key] };
  });

export default getDiff;
