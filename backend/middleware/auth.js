
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send("No token");
  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = await User.findById(decoded.id);
    next();
  } catch {
    res.status(400).send("Invalid token");
  }
};
