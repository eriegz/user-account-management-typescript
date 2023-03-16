// This file matches the "NODE_ENV" environment variable to the correct config file
// (case-sensitive). See the README.md for instructions on how to pass this value on startup.

const logger = require('../util/logger');
const BASE_CONFIG = require('./base');

module.exports = (() => {
  if (process.env.NODE_ENV === undefined) {
    let errMsg = 'Missing \'NODE_ENV\' environment variable. Please see README.md file for how to run application.';
    logger.error(errMsg);
    throw new Error(errMsg);
  }

  const configFile = {
    ...BASE_CONFIG,
    ...require(`./${process.env.NODE_ENV}.js`),
  };
  return configFile;
})();
