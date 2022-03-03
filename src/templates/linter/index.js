const { featuresEnum } = require('../../constants');
const { hasReactFeature } = require('../../utils');

const { configFiles } = featuresEnum;

const getEslintConfig = ({ hasReact }) => {
  const { plugins, rules, settings } = hasReact
    ? {
        plugins: ['react', 'react-hooks'],
        rules: {
          'react/jsx-uses-react': 'off',
          'react/react-in-jsx-scope': 'off',
          'react-hooks/rules-of-hooks': 'error', // Check Hook's rules
          'react-hooks/exhaustive-deps': 'warn', // Check the dependencies of effect
        },
        settings: { react: { version: 'detect' } },
      }
    : {};

  const config = {
    root: true,
    env: {
      browser: true,
      es6: true,
      node: true,
    },
    extends: ['airbnb', 'prettier'],
    globals: {
      window: true,
      global: true,
      globalThis: true,
    },
    plugins,
    parser: '@babel/eslint-parser',
    parserOptions: {
      babelOptions: { presets: ['react-app'] },
      ecmaVersion: 2015,
      ecmaFeatures: { jsx: true },
      requireConfigFile: false,
    },
    rules: {
      'no-shadow': 'off',
      'no-console': 'warn',
      'no-debugger': 'warn',
      'import/prefer-default-export': 'off',
      ...rules,
    },
    settings,
  };

  return config;
};

const getEslintIgnoreConfig = () => ['node_modules', '/node_modules/**'].join('\n');

const getPrettierConfig = () => ({
  printWidth: 120,
  singleQuote: true,
  semi: true,
  tabWidth: 2,
});

/**
 *
 * @param {string[]} features
 * @returns
 */
const getPackageJson = (features) => {
  const hasReact = hasReactFeature(features);
  const lintScript = `eslint --ext .js${hasReact ? ',.jsx' : ''} --fix src`;
  const extraDependencies = hasReact
    ? { 'eslint-plugin-jsx-a11y': '^6.5.1', 'eslint-plugin-react-hooks': '^4.3.0', 'eslint-plugin-react': '^7.28.0' }
    : {};

  const pkg = {
    scripts: { lint: lintScript },

    [configFiles.linter.eslint]: getEslintConfig({ hasReact }),
    [configFiles.linter.eslintIgnore]: getEslintIgnoreConfig(),
    [configFiles.linter.prettier]: getPrettierConfig(),

    devDependencies: {
      ...extraDependencies,
      eslint: '^8.6.0',
      prettier: '^2.5.1',
      '@babel/eslint-parser': '^7.17.0',
      'eslint-config-airbnb': '^19.0.0',
      'eslint-config-prettier': '^8.3.0',
      'eslint-plugin-import': '^2.25.0',
    },
  };

  return pkg;
};

const invokeLinter = (options) => {
  const { features } = options;

  return { pkg: getPackageJson(features) };
};

module.exports = invokeLinter;
