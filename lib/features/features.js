/* 
  功能模块
  const name = {
    name: 'name',
    value: 'value',
    short?: '',
    checked?: true,
    description: 'description',
    link: '',
  }
*/
const chalk = require('chalk');
const { prompt } = require('inquirer');
const { featuresEnum } = require('../constants');

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

module.exports = { featuresPrompt };
