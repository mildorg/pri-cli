'use strict';

/**
 * @description 排序对象
 * @param {{[p:string]:any}} obj
 * @param {string[]|undefined} orders
 */
function getSortObject(obj, orders) {
  if (!obj || typeof obj !== 'object') return;
  const keys = getSortKeys(Object.keys(obj), orders);
  const result = {};

  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
}

/**
 * @param {string[]} keys
 * @param {string[]|undefined} orders
 * @returns {string[]}
 */
function getSortKeys(keys, orders) {
  const result = [...keys];

  if (!orders) {
    result.sort();
  } else {
    result.sort((first, second) => {
      return getOrder(first, orders) - getOrder(second, orders);
    });
  }

  return result;
}

/**
 *
 * @param {string} key
 * @param {string[]} orders
 */
function getOrder(key, orders) {
  const i = orders.indexOf(key);
  return i === -1 ? Infinity : i;
}

const isString = (val) => typeof val === 'string';
const isFunction = (val) => typeof val === 'function';
const isObject = (val) => val && typeof val === 'function';

/**
 * @param {any[]} a
 * @param {any[]} b
 */
const mergeArrayWithDedupe = (a, b) => Array.from(new Set([...a, ...b]));

module.exports = {
  getSortObject,
  isString,
  isFunction,
  isObject,
  mergeArrayWithDedupe,
};
