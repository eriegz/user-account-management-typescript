const express = require("express");
const expressValidator = require("express-validator");
const jwt = require("jsonwebtoken");

const CONFIG = require("../config");
const logger = require("../util/logger");

const authService = require('../services/authService');
const authValidation = require("../validation/authValidators");

const router = express.Router();

// For some reason I could not get interfaces working when importing them from different files:
interface JwtToken {
  u: string,
}
interface ErrorResponse {
  error: string,
}

router.post("/auth/login", ...authValidation.login, (req, res) => {
  const validationErrors = expressValidator.validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).send({
      error: CONFIG.ERROR_MESSAGES.INVALID_FIELDS,
      errors: validationErrors.errors
    });
  }

  authService.authenticateUser(req.body.username, req.body.password).then((userJson) => {
    // Generate the user's authentication token.
    const payload: JwtToken = { u: userJson.username }; // keep the JWT payload as small as possible
    const token: string = jwt.sign(payload, CONFIG.JWT_SECRET, { expiresIn: `${CONFIG.JWT_LIFESPAN_DAYS} days` });
    const tokenLifespanMilliseconds: number = CONFIG.JWT_LIFESPAN_DAYS * 24 * 3600 * 1000;
    // Finally, return the token inside the "Set-Cookie" response header:
    res.cookie(CONFIG.JWT_TOKEN_NAME, token, { maxAge: tokenLifespanMilliseconds });
    res.send(userJson);
  }).catch(() => {
    const msg: string = CONFIG.ERROR_MESSAGES.INVALID_LOGIN;
    logger.error(msg);
    const errResp: ErrorResponse = { error: msg };
    res.status(401).send(errResp);
  });
});

module.exports = router;
