'use strict';
const chalk = require('chalk');
const readline = require('readline');

const dim = {
  error: '❌',
  warn: '⚠️',
};

/**
 * @param {string[]|undefined} infos
 * @param {string} dim
 */
function LogInfos(infos, dim) {
  if (!infos) return;

  infos.forEach((msg) => {
    const str = dim ? chalk.cyan.dim(dim, msg) : chalk.cyan(msg);
    console.log(str);
  });
}

/**
 *  @param {string[]|undefined} warnings
 *  @param {string} dim
 */
function LogWarnings(warnings, dim) {
  if (!warnings) return;

  warnings.forEach((msg) => {
    const str = dim ? chalk.yellow.dim(dim, msg) : chalk.yellow(msg);
    console.warn(str);
  });
}

/**
 * @param {string[]|undefined} errors
 * @param {string} dim
 */
function LogErrors(errors, dim) {
  if (!errors) return;

  errors.forEach((msg) => {
    const str = dim ? chalk.red.dim(dim, msg) : chalk.red(msg);
    console.error(str);
  });
}

/**
 * @param {string|undefined} msg
 */
function clearConsole(msg) {
  const blank = '\n'.repeat(process.stdout.rows);
  console.log(blank);
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
  if (msg) {
    console.log(msg);
  }
}

module.exports = { clearConsole, dim, LogInfos, LogErrors, LogWarnings };
