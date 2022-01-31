function linter() {
  const pkg = {
    scripts: {
      lint: '',
    },

    eslintConfig: getEslintConfig(),
    prettierConfig: getPrettierConfig(),

    devDependencies: {},
  };

  return pkg;
}

function getEslintConfig() {
  return {};
}

function getPrettierConfig() {
  return {};
}

module.exports = linter;
