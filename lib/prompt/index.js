'use strict';

const chalk = require('chalk');
const { prompt } = require('inquirer');
const { features: choices } = require('./features');

/**
 * @returns {Promise<string[]>}
 */
async function featuresPrompt() {
  const { features = [] } = await prompt([
    {
      choices,
      name: 'features',
      type: 'checkbox',
      message: chalk.cyan('Check the features needed for your project:'),
      pageSize: 10,
    },
  ]);

  return features;
}

module.exports = { featuresPrompt };
