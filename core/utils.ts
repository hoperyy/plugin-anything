/**
 * @param {Any} value
 * @returns {string}
 */
function getType(value): string {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

/**
 * @param {Any} value
 * @returns {Boolean}
 */
function isArray(value): boolean {
  return getType(value) === 'array';
}

/**
 * @param {Any} value
 * @returns {Boolean}
 */
function isString(value): boolean {
  return getType(value) === 'string';
}

/**
 * @param {Any} value
 * @returns {Boolean}
 */
function isFunction(value): boolean {
  return getType(value) === 'function';
}

export {
  getType,
  isArray,
  isString,
  isFunction
}