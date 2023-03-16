const bcrypt = require('bcrypt');

const dbService = require('./dbService');
const userService = require('./userService');

module.exports = {
  authenticateUser(username, plainTextPassword) {
    return new Promise(async (resolve, reject) => {
      const userObj = await dbService.getUser(username);
      if (userObj.error) {
        return reject();
      }
      bcrypt.compare(plainTextPassword, userObj.password, function (err, result) {
        if (result === true) {
          resolve(userService.getSanitizedUserObj(userObj));
        } else {
          reject();
        }
      });
    });
  },
}
