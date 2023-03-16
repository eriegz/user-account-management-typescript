const { body, header } = require("express-validator");

module.exports = {
  login: [
    body('username')
      .exists({ checkNull: true })
      .withMessage('username field cannot be undefined or null')
      .isString()
      .withMessage('username field must be of type string')
      .isLength({ min: 3, max: 30 })
      .withMessage('username must be between 3 and 30 characters long (inclusive)')
      .isAlphanumeric()
      .withMessage('username must only contain alphanumeric characters (0–9, a–z)'),
    body('password')
      .exists({ checkNull: true })
      .withMessage('password field cannot be undefined or null')
      .isString()
      .withMessage('password field must be of type string')
      .notEmpty()
      .withMessage('password field cannot be empty'),
  ],
}
