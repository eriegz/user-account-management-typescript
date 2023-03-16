// This simple endpoint provides some basic authorization based on the 'username' path parameter.
// Other endpoints could implement other versions of authorization, for example, only giving users
// access to data belonging to the username decoded from their JWT.
module.exports = (req, res, next) => {
  if (res.locals.username !== req.params.username) {
    return res.status(401).send();
  }
  next();
};
