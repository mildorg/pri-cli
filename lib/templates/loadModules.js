'use strict';
const path = require('path');

/**
 * @description 根据选择的features 加载模块
 * @param {string[]} features
 * @param {string} targetDir
 * @returns {(() => any)[]}
 */
function loadModules(features, targetDir) {
  const result = [];

  for (const feature of features) {
    const resolvePath = getResolvePath(feature, targetDir);
    if (resolvePath) {
      result.push(require(resolvePath));
    }
  }

  return result;
}

/**
 *
 * @param {string} feature
 * @param {string} context
 * @returns
 */
function getResolvePath(feature, context) {
  try {
    const template = path.resolve(__dirname, feature);
    return require.resolve(template, { paths: [context] });
  } catch (error) {
    return '';
  }
}

module.exports = { loadModules };
