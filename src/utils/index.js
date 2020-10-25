const isEmptyObject = obj => Object.keys(obj).length === 0;
const isObject = obj =>
  obj && typeof obj === 'object' && Object.prototype.toString.call(obj) !== '[object Array]';
const isString = str => str && typeof str === 'string';
const isNumber = num => num && typeof num === 'number';
const isHasProp = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
const isBoolean = bool => typeof bool === 'boolean' && bool.constructor === Boolean;
const isFunction = func => typeof func !== 'undefined' && typeof func === 'function';
const isObjectKeyExist = (obj, key) => Object.keys(obj).indexOf(key) > -1;
const isObjectValExist = (obj, val) => Object.values(obj).indexOf(val) > -1;

export {
  isObject,
  isString,
  isNumber,
  isBoolean,
  isHasProp,
  isFunction,
  isEmptyObject,
  isObjectValExist,
  isObjectKeyExist,
};
