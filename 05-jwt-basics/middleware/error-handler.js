const { StatusCodes } = require("http-status-codes");
const { CustomErrorAPI } = require("../errors");

const errorHandler = async (err, req, res, next) => {
  if (err instanceof CustomErrorAPI)
    return res.status(err.statusCode).json({ msg: err.message });

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send("Something went wrong, please try again");
};

module.exports = errorHandler;
