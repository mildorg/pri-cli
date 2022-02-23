const { loadTemplates } = require('./features');
const { extractConfigFiles, getSortPkg, mergePackageJSON, writeFiles } = require('../utils');

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
