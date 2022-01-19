const { create } = require('./create');
const logger = require('./logger');

module.exports = {
  ...logger,
  create,
};
