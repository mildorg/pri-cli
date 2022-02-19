'use strict';
const { loadFeatures } = require('./features');
const { extractConfigFiles, getSortPkg, mergePackageJSON, writeFiles } = require('../utils');

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
  const { pkg, files } = await getFilesAndPkg(targetDir, options);

  files['package.json'] = JSON.stringify(getSortPkg(pkg), null, 2) + '\n';
  await writeFiles(targetDir, files);
}

async function getFilesAndPkg(targetDir, options) {
  const { features = [], files = {}, pkg = {} } = options;
  const { pkg: featuresPkg, ...rest } = await loadFeatures(features, targetDir);

  const initPkg = { ...pkg };
  featuresPkg && mergePackageJSON(initPkg, featuresPkg);

  return {
    pkg: initPkg,
    files: { ...files, ...extractConfigFiles(initPkg, features), ...rest },
  };
}

module.exports = { createTemplate };
