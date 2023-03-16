const bcrypt = require('bcrypt');

const CONFIG = require('../config');

const dbService = require('../services/dbService');
const cacheService = require('../services/cacheService');

// For some reason I could not get interfaces working when importing them from different files:
interface User {
  username?: string;
  password?: string;
  error?: string;
  cached?: boolean;
}

module.exports = {
  getSanitizedUserObj(userObj: User): User {
    // Below: omit the password field when returning the user record back to the frontend:
    return {
      username: userObj.username,
    };
  },
  encryptPassword(plainTextPassword: string) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(CONFIG.BCRYPT_SALT_ROUNDS, function (err, salt) {
        bcrypt.hash(plainTextPassword, salt, function (err, hash) {
          resolve(hash);
        });
      });
    });
  },
  async createUser(reqBody: User): Promise<User> {
    const result = await dbService.insertUser({
      username: reqBody.username,
      password: await this.encryptPassword(reqBody.password),
    });
    return result;
  },
  async retrieveUser(username: string): Promise<User> {
    const cachedUser = await cacheService.getUser(username);
    if (cachedUser) {
      // This will result in a 304 response (i.e.: empty response body), so no need to return the
      // user object itself:
      return { cached: true };
    }

    const result = await dbService.getUser(username);
    cacheService.setUser(result);
    return this.getSanitizedUserObj(result);
  },
  async updateUser(username: string, reqBody: User): Promise<User> {
    if (reqBody.password) {
      reqBody.password = await this.encryptPassword(reqBody.password);
    }
    const result = await dbService.updateUser(username, reqBody);
    cacheService.setUser(result);
    return this.getSanitizedUserObj(result);
  },
  deleteUser(username: string) {
    cacheService.deleteUser(username);
    return dbService.deleteUser(username);
  },
}
