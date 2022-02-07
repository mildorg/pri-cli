'use strict';
const deepMerge = require('deepmerge');
const semver = require('semver');
const { loadModules } = require('./loadModules');
const {
  getSortObject,
  writeFiles,
  isFunction,
  isObject,
  mergeArrayWithDedupe,
} = require('../utils');

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

  handleLoadModules(features, targetDir, initialPkg);

  console.log('initialPkg', initialPkg);

  const sortPkg = getSortPkg(initialPkg);
  files['package.json'] = JSON.stringify(sortPkg, null, 2) + '\n';
  await writeFiles(targetDir, files, initialFiles);
}

function resolveFiles() {}

function handleLoadModules(features, targetDir, initialPkg) {
  loadModules(features, targetDir).forEach((loader) => {
    const fields = loader();
    fields && mergePackageJSON(initialPkg, fields);
  });
}

/**
 * @description 合并各个template 中的package.json配置
 * @param {object} initialPkg
 * @param {object|() => object} fields
 */
function mergePackageJSON(initialPkg, fields) {
  const toMerge = isFunction(fields) ? fields() : fields;

  Object.entries(toMerge).forEach((entry) => {
    const [key, source] = entry;
    const target = initialPkg[key];
    initialPkg[key] = getMergedValue(target, source, key);
  });
}

function getMergedValue(target, source, key) {
  if (!source) return target;
  if (!target) return source;

  if (Array.isArray(source) && Array.isArray(target)) {
    return mergeArrayWithDedupe(target, source);
  }

  if (
    isObject(source) &&
    (key === 'dependencies' || key === 'devDependencies')
  ) {
    return mergeDeps(target, source);
  }

  if (isObject(source) && isObject(target)) {
    return deepMerge(target, source, {
      arrayMerge: mergeArrayWithDedupe,
    });
  }

  return source;
}

/**
 * @description 合并依赖
 * @param {*} params
 */
function mergeDeps(target, source) {
  const result = { ...target };

  Object.entries(source).forEach(([name, v2]) => {
    const v1 = target[name];
    if (!v1) {
      result[name] = v2;
    } else {
      result[name] = semver.gt(v1, v2) ? v1 : v2;
    }
  });

  return result;
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
