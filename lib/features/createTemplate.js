'use strict';
const deepMerge = require('deepmerge');
const semver = require('semver');
const { loadModules } = require('./loadModules');
const { featuresEnum, configFileTypes } = require('../constants');
const { getSortObject, writeFiles, isString, isFunction, isObject, mergeArrayWithDedupe } = require('../utils');

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
  const { pkg, files } = handleLoadModules(targetDir, options);

  files['package.json'] = JSON.stringify(getSortPkg(pkg), null, 2) + '\n';
  await writeFiles(targetDir, files);
}

function handleLoadModules(targetDir, options) {
  const { features = [], files = {}, pkg = {} } = options;
  const newPkg = { ...pkg };

  loadModules(features, targetDir).forEach((loader) => {
    const fields = loader();
    fields && mergePackageJSON(newPkg, fields);
  });

  return {
    pkg: newPkg,
    files: { ...files, ...extractConfigFiles(newPkg, features) },
  };
}

/**
 * @description 合并各个template 中的package.json配置
 * @param {object} pkg
 * @param {object|() => object} fields
 */
function mergePackageJSON(pkg, fields) {
  const toMerge = isFunction(fields) ? fields() : fields;

  Object.entries(toMerge).forEach((entry) => {
    const [key, source] = entry;
    const target = pkg[key];
    pkg[key] = getMergedValue(target, source, key);
  });
}

function getMergedValue(target, source, key) {
  if (!source) return target;
  if (!target) return source;

  if (Array.isArray(source) && Array.isArray(target)) {
    return mergeArrayWithDedupe(target, source);
  }

  if (isObject(source) && (key === 'dependencies' || key === 'devDependencies')) {
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
 * For each feature, if the feature is a string, then check if the package has a property with that
 * name. If it does, then add it to the result. If it doesn't, then check if the feature is an object.
 * If it is, then check if the package has a property with the name of any of the values of the object.
 * If it does, then add it to the result
 * @param {object} pkg - The package.json file.
 * @param {string[]} features - an array of features to extract.
 * @returns A dictionary of configuration files.
 */
function extractConfigFiles(pkg, features) {
  const result = {};

  function move(key) {
    const data = pkg[key];
    if (data) {
      result[configFileTypes[key]] = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      delete pkg[key];
    }
  }

  for (const feature of features) {
    const key = featuresEnum.configFiles[feature];
    if (isString(key)) move(key);
    if (isObject(key)) Object.values(key).forEach(move);
  }

  return result;
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
