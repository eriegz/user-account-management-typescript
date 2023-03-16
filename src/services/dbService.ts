const db = require('mongoose');

const CONFIG = require('../config');
const logger = require('../util/logger');

const UserModel = require('../models/UserModel');

db.connect(CONFIG.MONGODB_TEST_DB_CONN_STR)
  .then(() => { logger.info(`Connected to DBMS at ${CONFIG.MONGODB_TEST_DB_CONN_STR}`); })
  .catch((err) => logger.error(err));

module.exports = {
  insertUser(userObj) {
    return UserModel.create(userObj)
      .catch((err) => {
        logger.error(err);

        if (err.code === 11000) {
          throw new Error(CONFIG.ERROR_MESSAGES.DUPLICATE_USERNAME);
        }

        throw new Error(CONFIG.ERROR_MESSAGES.COULD_NOT_COMPLETE_OPERATION);
      });
  },
  getUser(username) {
    return UserModel.findOne({ username })
      .then((userObj) => {
        if (!userObj) {
          throw new Error(CONFIG.ERROR_MESSAGES.USERNAME_NOT_FOUND);
        }
        return userObj;
      });
  },
  updateUser(username, documentBody) {
    return UserModel.findOneAndUpdate({ username }, { ...documentBody }, { returnOriginal: false })
      .then((userObj) => {
        if (!userObj) {
          throw new Error(CONFIG.ERROR_MESSAGES.USERNAME_NOT_FOUND);
        }
        return userObj;
      });
  },
  deleteUser(username) {
    return UserModel.deleteOne({ username })
      .then((result) => {
        if (!result.deletedCount) {
          throw new Error(CONFIG.ERROR_MESSAGES.USERNAME_NOT_FOUND);
        }
        return;
      });
  },
};
