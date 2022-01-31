const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const { execSync } = require('child_process');

/**
 * @description 写入多个文件
 * @param {string} dir
 * @param {{[p:string]:string}} files
 * @param {{[p:string]:string}} preFiles
 */
async function writeFiles(dir, files, preFiles) {
  if (preFiles) {
    deleteFiles(dir, files, preFiles);
  }
  const streams = Object.keys(files).map(async (name) => {
    const filePath = path.resolve(dir, name);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, files[name]);
  });

  return Promise.all(streams);
}

function deleteFiles(dir, files, preFiles) {
  const filesToDelete = Object.keys(preFiles)
    .filter((filename) => !files[filename])
    .map((filename) => fs.unlink(path.resolve(dir, filename)));

  return Promise.all(filesToDelete);
}

function hasGit() {
  try {
    execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * @description 运行 command
 * @param {string} dir
 * @param {string} command
 * @param {string[]} args
 */
async function runCommand(dir, command, args) {
  return await execa(command, args, { cwd: dir });
}

module.exports = { hasGit, runCommand, writeFiles };
