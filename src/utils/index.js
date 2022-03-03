const base = require('./base');
const errorCatch = require('./errorCatch');
const file = require('./file');
const logger = require('./logger');
const pkg = require('./pkg');
const templates = require('./templates');

module.exports = {
  ...base,
  ...errorCatch,
  ...file,
  ...logger,
  ...pkg,
  ...templates,
};
