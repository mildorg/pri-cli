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
  name: 'React Router',
  value: featuresEnum.reactRouter,
  short: 'Router',
  description: 'React Router is a lightweight, fully-featured routing library for the React JavaScript library',
  link: 'https://reactrouter.com/',
};

const linter = {
  name: 'Linter add Prettier',
  value: featuresEnum.linter,
  short: 'Linter, Prettier',
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

  return features.flat();
}

/**
 *
 * @param {string} feature
 * @param {string} context
 * @returns
 */
const getResolvePath = (feature, context) => {
  try {
    const template = path.resolve(__dirname, feature);
    return require.resolve(template, { paths: [context] });
  } catch (error) {
    return '';
  }
};

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
const loadTemplates = async (features, targetDir) => {
  const promises = [];
  let result = { pkg: {} };

  for (let i = 0, len = features.length; i < len; i += 1) {
    const resolvePath = getResolvePath(features[i], targetDir);
    if (resolvePath) {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      promises.push(require(resolvePath)());
    }
  }

  const templates = await Promise.all(promises);

  templates.forEach(({ pkg, ...rest }) => {
    if (pkg) mergePackageJSON(result.pkg, pkg);
    if (rest) result = { ...result, ...rest };
  });

  return result;
};

module.exports = { featuresPrompt, loadTemplates };
