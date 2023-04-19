import yaml from 'js-yaml';

export default (data, extName) => {
  switch (extName) {
    case '.yml':
    case '.yaml':
      return yaml.load(data);
    default:
      return JSON.parse(data);
  }
};
