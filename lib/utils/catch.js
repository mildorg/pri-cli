const { logErrors } = require('./logger');

function catchErrorHof(fn) {
  return (...args) => {
    try {
      return fn(...args);
    } catch (error) {
      logErrors([error.message]);
    }
  };
}

function asyncCatchErrorHof(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      logErrors([error.message]);
    }
  };
}

module.exports = { asyncCatchErrorHof, catchErrorHof };
