'use strict';
const fs = require('fs-extra');
const path = require('path');

const validateNpmPackageName = require('validate-npm-package-name');
const { clearConsole, dim, LogWarnings, LogErrors } = require('./logger');

/**
 * @description 创建pri 项目
 * @param {string} projectName
 * @param {{[p:string]:string}} options
 */
function create(projectName, options) {
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
    const isCreate = handleCreateInExistTargetDir(targetDir, {
      ...options,
      inCurrent,
    });

    if (!isCreate) return;
  }
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
 * @returns {boolean} 如果是false表示不在已存在的目录中创建项目
 */
async function handleCreateInExistTargetDir(targetDir, options) {
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
    return handleCreateInCurrent();
  }

  // 不是在当前文件夹下创建
}

function handleCreateInCurrent() {}

module.exports = {
  create,
};
