/* Handle package.json */
const deepMerge = require('deepmerge');
const semver = require('semver');
const { featuresEnum, configFileTypes } = require('../constants');
const { getSortObject, isFunction, isObject, isString, mergeArrayWithDedupe } = require('./base');

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
      // eslint-disable-next-line no-param-reassign
      delete pkg[key];
    }
  }

  for (let i = 0, len = features.length; i < len; i += 1) {
    const key = featuresEnum.configFiles[features[i]];
    if (isString(key)) move(key);
    if (isObject(key)) Object.values(key).forEach(move);
  }

  return result;
}

const getSortPkg = (pkg) => {
  const { dependencies, devDependencies, scripts } = pkg;
  const tmp = {
    ...pkg,
    dependencies: getSortObject(dependencies) || {},
    devDependencies: getSortObject(devDependencies) || {},
    scripts: getSortObject(scripts, ['serve', 'build', 'test', 'lint']) || {},
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
};

/**
 * @description 合并依赖
 * @param {*} params
 */
const mergeDeps = (target, source) => {
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
};

const getMergedValue = (target, source, key) => {
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
};

/**
 * Merge the fields of the source object into the target object
 * @param {{}} [pkg] - The package.json object to merge into.
 * @param {{}} fields - A function that returns an object with the fields to merge.
 */
function mergePackageJSON(pkg, fields) {
  const toMerge = isFunction(fields) ? fields() : fields;

  Object.entries(toMerge).forEach((entry) => {
    const [key, source] = entry;
    const target = pkg[key];
    const mergeValue = getMergedValue(target, source, key);
    if (mergeValue) {
      // eslint-disable-next-line no-param-reassign
      pkg[key] = mergeValue;
    }
  });
}

module.exports = {
  extractConfigFiles,
  getMergedValue,
  getSortPkg,
  mergeDeps,
  mergePackageJSON,
};
