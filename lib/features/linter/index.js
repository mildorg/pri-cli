const { featuresEnum } = require('../../constants');

const { configFiles } = featuresEnum;

function invokeLinter() {
  const pkg = {
    scripts: {
      lint: '',
    },

    [configFiles.linter.eslint]: getEslintConfig(),
    [configFiles.linter.eslintIgnore]: getEslintIgnoreConfig(),
    [configFiles.linter.prettier]: getPrettierConfig(),

    devDependencies: {
      '@babel/eslint-parser': '^7.16.5',
      eslint: '^8.6.0',
      'eslint-config-prettier': '^8.3.0',
      prettier: '^2.5.1',
    },
  };

  return { pkg };
}

function getEslintConfig() {
  return {
    root: true,
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: ['eslint:recommended', 'prettier'],
    globals: {
      window: true,
      global: true,
      globalThis: true,
    },
    rules: {
      'no-shadow': 'off',
      'no-console': 'warn',
      'no-debugger': 'warn',
    },
    settings: {
      react: { version: 'latest' },
    },
  };
}

function getEslintIgnoreConfig() {
  return ['node_modules', '/node_modules/**'].join('\n');
}

function getPrettierConfig() {
  return {
    printWidth: 120,
    singleQuote: true,
    semi: true,
    tabWidth: 2,
  };
}

module.exports = invokeLinter;
