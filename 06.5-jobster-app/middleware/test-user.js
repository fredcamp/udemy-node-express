const { BadRequestError } = require("../errors");

const testUser = (req, res, next) => {
  if (req.user.testUser)
    throw new BadRequestError("Invalid. Demo user not allowed.");
  next();
};

module.exports = testUser;
