import yaml from 'js-yaml';

export default (data, extName) => {
  switch (extName) {
    case '.json':
      return JSON.parse(data);
    case '.yml':
    case '.yaml':
      return yaml.load(data);
    default:
      throw new Error('This extension isn\'t supported');
  }
};
