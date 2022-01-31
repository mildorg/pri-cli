'use strict';

const { featuresPrompt } = require('./prompt');
const { createTemplate } = require('./templates/createTemplate');
const {
  clearConsole,
  emojis,
  logInfos,
  writeFiles,
  hasGit,
  runCommand,
} = require('./utils');

/**
 * @description 创建项目
 * @param {string} name
 * @param {string} targetDir
 */
async function createProject(name, targetDir) {
  const pkg = getPackageJson(name);
  const features = await featuresPrompt();
  startLog(name, targetDir);

  await writePackageJson(pkg, targetDir);
  await initGitRepository(targetDir);
  await createTemplate(targetDir, { features, pkg });
}

function getPackageJson(name) {
  return {
    name,
    version: '1.0.0',
    private: true,
    devDependencies: {},
  };
}

function startLog(name, targetDir) {
  clearConsole();
  logInfos([`Creating project: ${name} in ${targetDir}`], emojis.star);
}

/**
 * @description 写入package.json 文件
 * @param {{[p:string]:any}} pkg
 * @param {string} targetDir
 */
async function writePackageJson(pkg, targetDir) {
  await writeFiles(targetDir, { 'package.json': JSON.stringify(pkg, null, 2) });
}

/**
 * 初始化为git仓库
 * @param {string} targetDir
 */
async function initGitRepository(targetDir) {
  if (hasGit()) {
    logInfos(['Initializing the git repository...'], emojis.recycle);
    await runCommand(targetDir, 'git', ['init']);
  }
}

module.exports = {
  createProject,
};
