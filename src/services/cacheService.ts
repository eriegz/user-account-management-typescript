const Redis = require('ioredis');

const CONFIG = require('../config');
const logger = require('../util/logger');

const redis = new Redis(CONFIG.REDIS_PORT, CONFIG.REDIS_HOST);
redis.on('connect', () => {
  logger.info(`Connected to redis instance at ${CONFIG.REDIS_HOST}:${CONFIG.REDIS_PORT}`);
});

// For some reason I could not get interfaces working when importing them from different files, so
// this interface is a duplicate of the one in "userService.ts" (i.e.: violates DRY). Will need to
// fix this in the future.
interface User {
  username?: string;
  password?: string;
  error?: string;
  cached?: boolean;
}

module.exports = {
  getUser(username: string): Promise<User> {
    return new Promise((resolve, reject) => {
      redis.get(username, (err, result) => {
        if (err) {
          logger.error(CONFIG.CACHE_READ_FAILED, err);
          // Failure to read from the cache should not fail the request, so just resolve the promise
          // for now, and then hopefully we would have monitoring set up to detect the above error
          // logs.
          resolve(null);
        } else {
          resolve(JSON.parse(result));
        }
      })
    });
  },
  async setUser(userObj: User): Promise<boolean> {
    const result = await redis.set(userObj.username, JSON.stringify(userObj));
    if (result !== 'OK') {
      logger.error(CONFIG.CACHE_UPDATE_FAILED, result);
      return false;
    }
    redis.expire(userObj.username, CONFIG.REDIS_KEY_EXPIRE_TIME_SECONDS);
    return true;
  },
  deleteUser(username: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      redis.del(username, (err, result) => {
        if (err) {
          logger.error(CONFIG.CACHE_READ_FAILED, err);
          reject(false);
        } else {
          resolve(true);
        }
      })
    });
  },
  redisConnection: redis,
};
