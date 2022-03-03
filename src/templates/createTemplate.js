const path = require('path');
const { extractConfigFiles, getSortPkg, mergePackageJSON, writeFiles } = require('../utils');

/**
 *
 * @param {string} feature
 * @param {string} context
 * @returns
 */
const getResolvePath = (feature, context) => {
  try {
    const template = path.resolve(__dirname, feature);
    return require.resolve(template, { paths: [context] });
  } catch (error) {
    return '';
  }
};

/**
 * Loads the specified features and returns a dictionary of the fields they define
 * @param {string[]} features - An array of strings that represent the features to load.
 * @param {string} targetDir - The directory where the feature modules are located.
 */
const loadTemplates = async (features, targetDir) => {
  const promises = [];
  let result = { pkg: {} };

  for (let i = 0, len = features.length; i < len; i += 1) {
    const resolvePath = getResolvePath(features[i], targetDir);
    if (resolvePath) {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      promises.push(require(resolvePath)({ features }));
    }
  }

  const templates = await Promise.all(promises);

  templates.forEach(({ pkg, ...rest }) => {
    if (pkg) mergePackageJSON(result.pkg, pkg);
    if (rest) result = { ...result, ...rest };
  });

  return result;
};

const getFilesAndPkg = async (targetDir, options) => {
  const { features = [], files = {}, pkg = {} } = options;
  const initPkg = { ...pkg };
  const { pkg: featuresPkg, ...rest } = await loadTemplates(features, targetDir);

  if (featuresPkg) {
    mergePackageJSON(initPkg, featuresPkg);
  }

  return {
    pkg: initPkg,
    files: { ...files, ...extractConfigFiles(initPkg, features), ...rest },
  };
};

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
const createTemplate = async (targetDir, options) => {
  const { pkg, files } = await getFilesAndPkg(targetDir, options);

  files['package.json'] = `${JSON.stringify(getSortPkg(pkg), null, 2)}\n`;
  await writeFiles(targetDir, files);
};

module.exports = { createTemplate };
