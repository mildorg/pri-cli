const execa = require('execa');
const fs = require('fs-extra');
const globby = require('globby');
const Handlebars = require('handlebars');
const isBinaryPath = require('is-binary-path');
const path = require('path');
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

/**
 * Get all the files in a directory and render them to HTML
 * @param {string} dir - The directory to search for files.
 * @returns {Promise<{[p:string]:string}>} A dictionary of file names and their contents.
 */
async function getFilesFormDir(dir) {
  const result = {};
  const files = await globby(['**/*'], { cwd: dir });

  for (const file of files) {
    const targetPath = path.resolve(dir, file);
    result[file] = await renderFile(targetPath);
  }

  return result;
}

/**
 * Read the file at the specified path, compile it into a template, and return the rendered template
 * @param {string} filePath - The path to the file that you want to render.
 * @returns {Promise<string>} A string of HTML.
 */
async function renderFile(filePath) {
  if (isBinaryPath(filePath)) {
    return await fs.readFile(filePath);
  }

  const content = await fs.readFile(filePath, 'utf-8');
  return Handlebars.compile(content)();
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

module.exports = { getFilesFormDir, hasGit, runCommand, writeFiles };
