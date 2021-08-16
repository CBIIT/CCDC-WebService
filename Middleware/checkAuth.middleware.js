const jwt = require("jsonwebtoken");
const config = require("../Config");

module.exports = function (req, res, next) {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(403).send("Access Denied.");

    const verified = jwt.verify(token, config.authSecret);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};