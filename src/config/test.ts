module.exports = {
  HTTP_PORT: 3000,
  HTTPS_PORT: 3443,
  REDIS_HOST: 'localhost',
  REDIS_PORT: 6379,
  REDIS_KEY_EXPIRE_TIME_SECONDS: 1, // Very short time for automated testing purposes
  MONGODB_TEST_DB_CONN_STR: 'mongodb://localhost:27017/test',
  JWT_LIFESPAN_DAYS: 14,
};
