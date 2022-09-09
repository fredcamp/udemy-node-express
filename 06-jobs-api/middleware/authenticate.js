const { UnauthorizedError } = require("../errors");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHead = req.headers.authorization;

  if (!authHead || !authHead.startsWith("Bearer"))
    throw new UnauthorizedError("Please provide token");

  const token = authHead.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthorizedError("Unauthorized to access this route");
  }
};

module.exports = authMiddleware;
