const base = require('./base');
const errorCatch = require('./errorCatch');
const file = require('./file');
const logger = require('./logger');
const pkg = require('./pkg');

module.exports = {
  ...base,
  ...errorCatch,
  ...file,
  ...logger,
  ...pkg,
};
