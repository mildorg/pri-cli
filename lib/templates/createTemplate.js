'use strict';
const { loadModules } = require('./loadModules');
const { getSortObject, writeFiles } = require('../utils');

/**
 * @description 创建模板
 * @param {string} targetDir
 * @param {{
    features:string[],
    files:{[p:string]:any},
    pkg:{[p:string]:any},
  }} options
 *
 */
async function createTemplate(targetDir, options) {
  const { features = [], files = {}, pkg = {} } = options;
  const initialPkg = { ...pkg };
  const initialFiles = { ...files };

  await resolveFiles();

  loadModules(features, targetDir).forEach(handleLoad);

  const sortPkg = getSortPkg(initialPkg);
  files['package.json'] = JSON.stringify(sortPkg, null, 2) + '\n';
  await writeFiles(targetDir, files, initialFiles);
}

function resolveFiles() {}

/**
 *
 * @param {(...args:any[]) => void} fn
 */
function handleLoad(fn) {
  const data = fn();
  console.log('handleLoad', data);
}

function getSortPkg(pkg) {
  const { dependencies, devDependencies, scripts } = pkg;
  const tmp = {
    ...pkg,
    dependencies: getSortObject(dependencies),
    devDependencies: getSortObject(devDependencies),
    scripts: getSortObject(scripts, ['serve', 'build', 'test', 'lint']),
  };

  return getSortObject(tmp, [
    'name',
    'version',
    'private',
    'scripts',
    'dependencies',
    'devDependencies',
    'babel',
    'eslintConfig',
    'prettier',
    'postcss',
    'browserslist',
    'jest',
  ]);
}

module.exports = { createTemplate };
