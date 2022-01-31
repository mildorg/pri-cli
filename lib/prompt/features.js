/* 
  功能模块
  const name = {
    name: 'name',
    value: 'value',
    short?: '',
    checked?: true,
    description: 'description',
    link: '',
  }
*/

const { plugins } = require('../constants');

const react = {
  name: 'React',
  value: plugins.react,
  checked: true,
  description: 'A JavaScript library for building user interfaces',
  link: 'https://reactjs.org/',
};

const reactRouter = {
  name: 'React router',
  value: plugins.reactRouter,
  short: 'Router',
  description:
    'React Router is a lightweight, fully-featured routing library for the React JavaScript library',
  link: 'https://reactrouter.com/',
};

const linter = {
  name: 'Linter / Formatter',
  value: plugins.linter,
  short: 'Linter',
  checked: true,
  description: 'Improve code quality with eslint and prettier',
  link: '',
};

module.exports = { features: [react, reactRouter, linter] };
