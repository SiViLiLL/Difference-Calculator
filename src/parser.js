import yaml from 'js-yaml';

export default (data, format) => {
  switch (format) {
    case '.yml':
    case '.yaml':
      return yaml.load(data);
    case '.json':
      return JSON.parse(data);
    default:
      throw new Error('Unknown data format!');
  }
};
