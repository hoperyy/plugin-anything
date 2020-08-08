/**
 * @param {Any} value
 * @returns {string}
 */
function toRawType(value): string {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

/**
 * @param {Any} value
 * @returns {Boolean}
 */
function isArray(value): boolean {
  return toRawType(value) === 'array';
}

/**
 * @param {Any} value
 * @returns {Boolean}
 */
function isString(value): boolean {
  return toRawType(value) === 'string';
}

/**
 * @param {Any} value
 * @returns {Boolean}
 */
function isFunction(value): boolean {
  return toRawType(value) === 'function';
}

/**
 * @param {Any} value
 * @returns {Boolean}
 */
function isObject(value): boolean {
  return value && typeof value === 'object';
}

/**
 * @param {Any} value
 * @returns {Boolean}
 */
function isPlainObject(value): boolean {
  return toRawType(value) === 'object';
}

/**
 * @description 串行执行
 * @param {Object} obj
 * @returns {Boolean}
 */
async function waterfallRun(obj: { [name: string]: Function }) {
  for (const name in obj) {
    const callback = obj[name];
    await callback();
  }
}

/**
 * @description 并行执行
 * @param {Object} obj
 * @returns {Boolean}
 */
async function parallelRun(obj: { [name: string]: Function }) {
  const promises = [];
  for (const name in obj) {
    // get callback
    const callback = obj[name];
    
    promises.push(new Promise(resolve => {
      resolve(callback());
    }))
  }

  await Promise.all(promises);
}

export {
  toRawType,
  isArray,
  isString,
  isFunction,
  isObject,
  isPlainObject,
  waterfallRun,
  parallelRun
}