/**
 *
 * @param {string} key
 * @param {string[]} orders
 */
const getOrder = (key, orders) => {
  const i = orders.indexOf(key);
  return i === -1 ? Infinity : i;
};

/**
 * Check if the value is a string.
 * @param val - The value to check.
 */
const isString = (val) => typeof val === 'string';

/**
 * Check if the value is a function.
 * @param val - The value to check.
 */
const isFunction = (val) => typeof val === 'function';

/**
 * Check if the value is an object and not null.
 * @param val - The value to check.
 */
const isObject = (val) => val && typeof val === 'object';

/**
 * Merge two arrays and remove duplicates
 * @param {any[]} a - The array that you want to merge with another array.
 * @param {any[]} b - The array to merge with a.
 */
const mergeArrayWithDedupe = (a, b) => Array.from(new Set([...a, ...b]));

/**
 * @param {string[]} keys
 * @param {string[]|undefined} orders
 * @returns {string[]}
 */
const getSortKeys = (keys, orders) => {
  const result = [...keys];

  if (!orders) {
    result.sort();
  } else {
    result.sort((first, second) => getOrder(first, orders) - getOrder(second, orders));
  }

  return result;
};

/**
 * @description 排序对象
 * @param {{[p:string]:any}} obj
 * @param {string[]|undefined} orders
 */
const getSortObject = (obj, orders) => {
  if (!obj || typeof obj !== 'object') return null;

  const result = {};

  getSortKeys(Object.keys(obj), orders).forEach((key) => {
    result[key] = obj[key];
  });

  return result;
};

module.exports = {
  getSortObject,
  isString,
  isFunction,
  isObject,
  mergeArrayWithDedupe,
};
