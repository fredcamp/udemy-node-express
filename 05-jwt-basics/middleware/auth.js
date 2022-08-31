const jwt = require("jsonwebtoken");
const { BadRequestError, UnauthorizedError } = require("../errors");

const authMiddleware = async (req, res, next) => {
  const headAuth = req.headers.authorization;

  if (!headAuth || !headAuth.startsWith("Bearer "))
    throw new BadRequestError("Token not provided");

  const token = headAuth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, username } = decoded;

    req.user = { id, username };
    next();
  } catch (error) {
    throw new UnauthorizedError("Not authorized to access this route");
  }
};

module.exports = authMiddleware;
