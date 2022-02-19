const chalk = require('chalk');
const path = require('path');
const { prompt } = require('inquirer');
const { featuresEnum } = require('../constants');
const { mergePackageJSON } = require('../utils');

const react = {
  name: 'React',
  value: featuresEnum.react,
  checked: true,
  description: 'A JavaScript library for building user interfaces',
  link: 'https://reactjs.org/',
};

const reactRouter = {
  name: 'React router',
  value: featuresEnum.reactRouter,
  short: 'Router',
  description: 'React Router is a lightweight, fully-featured routing library for the React JavaScript library',
  link: 'https://reactrouter.com/',
};

const linter = {
  name: 'Linter / Formatter',
  value: featuresEnum.linter,
  short: 'Linter',
  checked: true,
  description: 'Improve code quality with eslint and prettier',
  link: '',
};

/**
 * @returns {Promise<string[]>}
 */
async function featuresPrompt() {
  const { features = [] } = await prompt([
    {
      choices: [react, reactRouter, linter],
      name: 'features',
      type: 'checkbox',
      message: chalk.cyan('Check the features needed for your project:'),
      pageSize: 10,
    },
  ]);

  return features;
}

/**
 * @description 根据选择的features 加载模块
 * @param {string[]} features
 * @param {string} targetDir
 */
/**
 * Loads the specified features and returns a dictionary of the fields they define
 * @param {string[]} features - An array of strings that represent the features to load.
 * @param {string} targetDir - The directory where the feature modules are located.
 */
async function loadFeatures(features, targetDir) {
  let result = { pkg: {} };

  for (const feature of features) {
    const resolvePath = getResolvePath(feature, targetDir);
    if (resolvePath) {
      const { pkg, ...rest } = await require(resolvePath)();
      if (pkg) mergePackageJSON(result.pkg, pkg);
      if (rest) result = { ...result, ...rest };
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

module.exports = { featuresPrompt, loadFeatures };
