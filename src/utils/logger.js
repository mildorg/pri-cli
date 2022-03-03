const chalk = require('chalk');
const readline = require('readline');

/**
 * @param {string[]|undefined} infos
 * @param {string} dim
 */
function logInfos(infos, dim) {
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
function logWarnings(warnings, dim) {
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
function logErrors(errors, dim) {
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
    logInfos([msg]);
  }
}

module.exports = {
  clearConsole,
  logInfos,
  logErrors,
  logWarnings,
};
