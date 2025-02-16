'use strict';

var config = exports;
exports.constructor = function config() {};

var path = require('path');

var _ = require('lodash');

var packageJson = require(path.join(__dirname, '../package.json'));

/**
 * @const
 */
var DEFAULT_OPTS = {
  delimiter: '_',
};
var TYPE_ENUM = [
  'string',
  'number',
  'boolean'
];

/**
 * @member
 */
config._initialized = false;
config._opts = null;
config._configDelimiter = null;
config._camelDelimiter = null;

/**
 * Initializes the config object
 *
 * @public
 * @param {String} name The name that prefixes all config vars
 * @param {Object} opts Optional: override the default delimiters
 * @returns {Object} The config object
 */
config.initialize = function(name, opts) {
  if (config._initialized) {
    return;
  }

  opts = _.defaults(opts || {}, DEFAULT_OPTS);
  config._initialized = true;

  if (!_.isPlainObject(opts)) {
    throw new Error('opts must be an object');
  }

  if (!_.isString(name)) {
    throw new Error('name must be a string');
  }

  name = name.toUpperCase();
  config._configDelimiter = opts.delimiter + opts.delimiter;
  config._camelDelimiter = opts.delimiter;

  // Read package.json for version information
  config.poweredBy = [ packageJson.name, packageJson.version ].join('/');
  config.version = packageJson.version;

  _.each(process.env, function(value, key) {
    if (key.substr(0, name.length) !== name) {
      return;
    }

    var keyPath = key.split(config._configDelimiter);

    if (keyPath.length < 3) {
      return;
    }

    keyPath.shift(); // first index is the name, no longer needed
    var type = keyPath.pop().toLowerCase(); // last item is the type

    if (!_.contains(TYPE_ENUM, type)) {
      throw new Error(type + ' is not one of ' + TYPE_ENUM.toString());
    }

    var values = value.split(',');
    var convertedValue = [];

    values.forEach(function(value) {
      value = value.trim();
      convertedValue.push(config._convertType(value, type));
    });

    convertedValue = convertedValue.length === 1 ? convertedValue[0] :
      convertedValue;
    config.set(keyPath, convertedValue);
  });

  return config.get();
};

/**
 * Stores the value at keypath
 *
 * @public
 * @param {String, Array} keyPath the path to store the value at
 * @param {String, Boolean, Number, Array} value the value to store
 */
config.set = function(keyPath, value) {
  if (!_.isArray(keyPath) && !_.isString(keyPath)) {
    throw new Error('keyPath must be either a string or array');
  }

  if (!_.isArray(keyPath)) {
    keyPath = keyPath.split(config._configDelimiter);
  }

  var obj = config;

  keyPath.forEach(function(key, index) {
    key = config._toCamelCase(key);

    if (index >= keyPath.length - 1) {
      obj[key] = value;
      return false;
    }

    obj[key] = _.isPlainObject(obj[key]) ? obj[key] : {};
    obj = obj[key];
  });
};

/**
 * Returns the entire config object minus functions or the object at keyPath
 *
 * @public
 * @param {String} keypath optional: path of key to get
 * @returns {Object} the config object
 */
config.get = function(keyPath) {
  if (!keyPath) {
    var conf = _.cloneDeep(config);

    _.each(conf, function(value, key) {
      if (_.isFunction(value) || (_.isString(key) && key[0] === '_')) {
        delete conf[key];
      }
    });

    return conf;
  }

  keyPath = keyPath.split(config._configDelimiter);
  var obj = config;

  keyPath.forEach(function(key) {
    if (!_.isPlainObject(obj) || _.isUndefined(obj[key])) {
      obj = null;
      return false;
    }

    obj = obj[key];
  });

  return obj;
};

/** Converts an underscore delimited key to camel case
 *
 * @private
 * @param {String} key The key to convert
 * @return {String} The camel case key
 */
config._toCamelCase = function (key) {
  var camel = key.toLowerCase().split(config._camelDelimiter);

  var keyName = camel.shift(); // don't capitialize the first word
  camel.forEach(function(str) {
    keyName += str[0].toUpperCase() + str.substr(1);
  });

  return keyName;
};

/**
 * Converts a string from the env to the defined type
 *
 * @private
 * @param {String} value The env var to convert
 * @return {String, Number, Boolean} The converted var
 */
config._convertType = function (value, type) {
  if (!value) {
    return null;
  }

  switch (type) {
    case 'number':
      value = Number(value);
      break;
    case 'boolean':
      value = (value === 'true') ? true : false;
      break;
  }

  return value;
};
