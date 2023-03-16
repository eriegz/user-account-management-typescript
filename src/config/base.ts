// These are the config values that would NOT change per environment
module.exports = {
  VERSION: require('../../package.json').version,
  SSL_CERT_PATH: 'src/security/ssl/local/localhost-cert.crt',
  SSL_KEY_PATH: 'src/security/ssl/local/localhost-key.pem',
  ERROR_MESSAGES: {
    INVALID_FIELDS: 'One or more fields are invalid',
    INVALID_LOGIN: 'Invalid username or password',
    UNAUTHORIZED: 'Unauthorized',
    COULD_NOT_COMPLETE_OPERATION: 'Operation could not be completed',
    USERNAME_NOT_FOUND: 'Username not found',
    DUPLICATE_USERNAME: 'Username already exists',
    CACHE_READ_FAILED: 'Error reading from cache',
    CACHE_UPDATE_FAILED: 'Error updating cache',
  },
  BCRYPT_SALT_ROUNDS: 10,
  JWT_TOKEN_NAME: 'token',
  JWT_SECRET: '8>QrP3J8e{FU]6d(h(;R*d~F}BSn5XVj7yyE6C}9W/(<SrtVR#gzKF)5,(a~F[cy9HhUA]wMe&u4udLr>!47?m]?AJ)>',
};
