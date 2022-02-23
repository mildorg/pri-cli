const { featuresEnum } = require('../../constants');

const { configFiles } = featuresEnum;

const getEslintConfig = () => ({
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['airbnb', 'prettier'],
  plugins: ['react', 'react-hooks'],
  globals: {
    window: true,
    global: true,
    globalThis: true,
  },
  parserOptions: {
    ecmaVersion: 2015,
    ecmaFeatures: { jsx: true },
    requireConfigFile: false,
  },
  rules: {
    'no-shadow': 'off',
    'no-console': 'warn',
    'no-debugger': 'warn',
    'import/prefer-default-export': 'off',
    'react-hooks/rules-of-hooks': 'error', // Check Hook's rules
    'react-hooks/exhaustive-deps': 'warn', // Check the dependencies of effect
  },
  settings: {
    react: { version: 'latest' },
  },
});

const getEslintIgnoreConfig = () => ['node_modules', '/node_modules/**'].join('\n');

const getPrettierConfig = () => ({
  printWidth: 120,
  singleQuote: true,
  semi: true,
  tabWidth: 2,
});

const invokeLinter = () => {
  const pkg = {
    scripts: {
      lint: 'eslint --ext .js,.jsx --fix src',
    },

    [configFiles.linter.eslint]: getEslintConfig(),
    [configFiles.linter.eslintIgnore]: getEslintIgnoreConfig(),
    [configFiles.linter.prettier]: getPrettierConfig(),

    devDependencies: {
      eslint: '^8.6.0',
      prettier: '^2.5.1',
      '@babel/eslint-parser': '^7.16.5',
      'eslint-config-airbnb': '^19.0.0',
      'eslint-config-prettier': '^8.3.0',
      'eslint-plugin-import': '^2.25.0',
      'eslint-plugin-jsx-a11y': '^6.5.1',
      'eslint-plugin-react-hooks': '^4.3.0',
      'eslint-plugin-react': '^7.28.0',
    },
  };

  return { pkg };
};

module.exports = invokeLinter;
