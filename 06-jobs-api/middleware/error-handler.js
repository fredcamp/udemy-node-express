const { CustomErrorAPI } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  if (err instanceof CustomErrorAPI)
    return res.status(err.statusCode).json({ msg: err.message });

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
};

module.exports = errorHandlerMiddleware;
