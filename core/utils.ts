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
 * @param {Any} value
 * @returns {Boolean}
 */
function isPromise(value): boolean {
    return toRawType(value) === 'promise';
}

export {
    toRawType,
    isArray,
    isString,
    isFunction,
    isObject,
    isPlainObject,
    isPromise,
}