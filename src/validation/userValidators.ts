const { body } = require('express-validator');
const passwordValidator = require('password-validator');

const passwordCriteria = new passwordValidator();
passwordCriteria
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().symbols()
  .is().not().oneOf(['Password123!']);

// Below: because the chains below are mutable, we need a factory function to create a new instance
// of the base chain when we want to add functionality (e.g.: making a parameter optional).
const getPasswordValidation = () => (
  body('password')
    .exists({ checkNull: true })
    .withMessage('password field cannot be undefined or null')
    .isString()
    .withMessage('password field must be of type string')
    .isLength({ min: 8, max: 40 })
    .withMessage('password must be between 8 and 40 characters long (inclusive)')
    .custom(value => passwordCriteria.validate(value))
    .withMessage('password must contain an uppercase letter, a lowercase letter, a numeral, a special character (e.g.: !@#$%^&*()_+), and must not be easily guessable')
);

module.exports = {
  username: body('username')
    .exists({ checkNull: true })
    .withMessage('username field cannot be undefined or null')
    .isString()
    .withMessage('username field must be of type string')
    .isLength({ min: 3, max: 30 })
    .withMessage('username must be between 3 and 30 characters long (inclusive)')
    .isAlphanumeric()
    .withMessage('username must only contain alphanumeric characters (0–9, a–z)'),
  password: getPasswordValidation(),
  passwordOptional: getPasswordValidation().optional(),
}
