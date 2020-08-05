/**
 * @param {Any} value
 * @returns {string}
 */
function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

/**
 * @param {Any} value
 * @returns {Boolean}
 */
function isArray(value) {
  return getType(value) === 'array';
}

/**
 * @param {Any} value
 * @returns {Boolean}
 */
function isString(value) {
  return getType(value) === 'string';
}

/**
 * @param {Any} value
 * @returns {Boolean}
 */
function isFunction(value) {
  return getType(value) === 'function';
}

export {
  getType,
  isArray,
  isString,
  isFunction
}