const { CustomErrorAPI } = require("../errors/custom-error");

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomErrorAPI)
    return res.status(err.statusCode).json({ msg: err.message });

  return res
    .status(500)
    .json({ msg: "Something went wrong. Please try again" });
};

module.exports = errorHandler;
