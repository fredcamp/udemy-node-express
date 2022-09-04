const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = (req, res, next) => {
  const headAuth = req.headers.authorization;

  if (!headAuth || !headAuth.startsWith("Bearer "))
    throw new UnauthenticatedError("Authentication invalid");

  const token = headAuth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId, name: decoded.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Not authorized to access");
  }
};

module.exports = auth;
