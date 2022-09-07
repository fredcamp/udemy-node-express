const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");
const User = require("../models/user");

const authMiddleware = (req, res, next) => {
  const authHead = req.headers.authorization;

  if (!authHead || !authHead.startsWith("Bearer "))
    throw new UnauthorizedError("Authentication Invalid");

  const token = authHead.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // const user = await User.findById(decoded.userId).select("-password");
    // req.user = user;
    req.user = { userId: decoded.userId, name: decoded.name };
    next();
  } catch (error) {
    throw new UnauthorizedError("Not authorized to access");
  }
};

module.exports = authMiddleware;
