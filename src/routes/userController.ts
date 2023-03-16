const express = require('express');
const expressValidator = require('express-validator');

const authentication = require('../middleware/authentication');
const authorization = require('../middleware/authorization');
const userValidation = require('../validation/userValidators');
const userService = require('../services/userService');

const CONFIG = require('../config');

const router = express.Router();

// User CRUD endpoints:

// "Create":
router.post(
  '/user/register',
  userValidation.username,
  userValidation.password,
  (req, res) => {
    const validationErrors = expressValidator.validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).send({
        error: CONFIG.ERROR_MESSAGES.INVALID_FIELDS,
        errors: validationErrors.errors
      });
    }

    userService.createUser(req.body).then((result) => {
      res.send(result);
    }).catch((error) => {
      res.status(400).send({ error: `${error}` });
    });
  },
);

// "Read":
router.get('/user/:username', authentication, authorization, (req, res) => {
  userService.retrieveUser(req.params.username).then((result) => {
    if (result.cached) {
      return res.status(304).send();
    }
    res.send(result);
  }).catch((error) => {
    res.status(404).send({ error: `${error}` });
  });
});

// "Update":
router.put(
  '/user/:username',
  authentication,
  authorization,
  userValidation.passwordOptional,
  (req, res) => {
    const validationErrors = expressValidator.validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).send({
        error: CONFIG.ERROR_MESSAGES.INVALID_FIELDS,
        errors: validationErrors.errors
      });
    }

    userService.updateUser(req.params.username, req.body).then((result) => {
      res.send(result);
    }).catch((error) => {
      res.status(404).send({ error: `${error}` });
    });
  },
);

// "Delete":
router.delete('/user/:username', authentication, authorization, (req, res) => {
  userService.deleteUser(req.params.username).then((result) => {
    res.status(204).send();
  }).catch((error) => {
    res.status(404).send({ error: `${error}` });
  });
});

module.exports = router;
