const execa = require('execa');
const { emojis } = require('./constants');
const { createTemplate, featuresPrompt } = require('./templates');
const { logInfos, writeFiles, hasGit, runCommand } = require('./utils');

const getPackageJson = (name) => ({
  name,
  version: '1.0.0',
  private: true,
  devDependencies: {},
});

const startLog = (name, targetDir) => {
  // clearConsole();
  logInfos([`Creating project: ${name} in ${targetDir}`], `\n${emojis.star}`);
};

/**
 * @description 写入package.json 文件
 * @param {{[p:string]:any}} pkg
 * @param {string} targetDir
 */
const writePackageJson = async (pkg, targetDir) => {
  await writeFiles(targetDir, { 'package.json': JSON.stringify(pkg, null, 2) });
};

/**
 * 初始化为git仓库
 * @param {string} targetDir
 */
const initGitRepository = async (targetDir) => {
  if (hasGit()) {
    logInfos(['Initializing the git repository...'], emojis.recycle);
    await runCommand(targetDir, 'git', ['init']);
  }
};

/**
 * It runs the `npm install` command in the target directory
 * @param {string} targetDir targetDir - The directory where the package.json file is located.
 * @returns {Promise<string>} A promise.
 */
const installDependencies = (targetDir) => {
  const command = 'npm';
  const args = ['install', '--loglevel', 'error'];

  return new Promise((resolve, reject) => {
    const child = execa(command, args, {
      cwd: targetDir,
      stdio: ['inherit', 'inherit', 'inherit'],
    });

    child.on('close', (code) => {
      const msg = `${command} ${args.join(' ')}`;
      if (code !== 0) reject(new Error(`Command failed: ${msg}`));
      resolve(`Command success: ${msg}`);
    });
  });
};

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
  await installDependencies(targetDir);
}

module.exports = {
  createProject,
};
