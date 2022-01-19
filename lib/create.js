'use strict';
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { prompt } = require('inquirer');
const { LogInfos } = require('./logger');

const validateNpmPackageName = require('validate-npm-package-name');
const { clearConsole, dim, LogWarnings, LogErrors } = require('./logger');

/**
 * @description 创建pri 项目
 * @param {string} projectName
 * @param {{[p:string]:string}} options
 */
async function create(projectName, options) {
  const cwd = options.cwd || process.cwd(); // process.cwd(): 返回是当前执行node命令时候的文件夹地址
  const inCurrent = projectName === '.'; // 如果项目名称为 '.' 表示要在当前目录下直接创建项目
  const name = inCurrent ? path.relative('../', projectName) : projectName;
  const targetDir = path.resolve(cwd, projectName); // 获取创建项目的地址
  const result = validateNpmPackageName(name); // 检查项目名称是否符合npm 包的命名规范

  // 不符合npm 包的命名规范
  if (!result.validForNewPackages) {
    return handleInvalidName(result, name);
  }

  // 当要存在和要创建的项目相同的文件夹时
  if (fs.existsSync(targetDir)) {
    const isCreate = await createInExistTargetDir(targetDir, {
      ...options,
      inCurrent,
    });

    if (!isCreate) return;
  }

  console.log(`Creating project: ${name}`);
}

function handleInvalidName(result, name) {
  LogErrors([`Invalid project name ${name}`]);
  LogErrors(result.errors, dim.error);
  LogWarnings(result.warnings, dim.warn);
  process.exit(1);
}

/**
 * @description 处理文件夹存在的情况
 * @param {string} targetDir
 * @param {{[p:string]:string}} options
 * @returns {Promise<boolean>} 如果是false表示不在已存在的目录中创建项目
 */
async function createInExistTargetDir(targetDir, options) {
  const { force, inCurrent } = options;
  // 强制创建
  if (force) {
    await fs.remove(targetDir); //清除当前文件和文件夹
    return true;
  }

  // 不是强制创建
  // 在当前文件夹下创建
  clearConsole();
  if (inCurrent) {
    return createInCurrentDir();
  }

  // 不是在当前文件夹下创建
  return createInSubDir(targetDir);
}

/**
 * @returns {Promise<boolean>}
 */
async function createInCurrentDir() {
  const { ok } = await prompt([
    {
      name: 'ok',
      type: 'confirm',
      message: chalk.cyan('Create project in current directory？'),
    },
  ]);

  return ok;
}

const actionEnum = {
  Overwrite: 2,
  Merge: 1,
  Cancel: 0,
};

async function createInSubDir(targetDir) {
  const { action } = await prompt([
    {
      name: 'action',
      type: 'list',
      message: chalk.cyan(
        `Target directory ${targetDir} exists. Choose an action`
      ),
      choices: [
        { name: 'Overwrite', value: 2 },
        { name: 'Merge', value: 1 },
        { name: 'Cancel', value: 0 },
      ],
    },
  ]);

  if (!action || action === actionEnum.Cancel) return false;

  if (action === actionEnum.Overwrite) {
    LogInfos([`Removing ${targetDir}`]);
    await fs.remove(targetDir);
  }

  return true;
}

module.exports = {
  create,
};
