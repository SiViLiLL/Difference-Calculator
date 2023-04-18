import yaml from 'js-yaml';

export default (extName) => {
  switch (extName) {
    case '.json':
      return JSON.parse;
    case '.yml':
    case '.yaml':
      return yaml.load;
    default:
      throw new Error('This extension isn\'t supported');
  }
};
