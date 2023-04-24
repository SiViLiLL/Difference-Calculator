import yaml from 'js-yaml';

export default (data, format) => {
  switch (format) {
    case '.yml':
    case '.yaml':
      return yaml.load(data);
    default:
      return JSON.parse(data);
  }
};
