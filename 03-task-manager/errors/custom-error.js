class CustomErrorAPI extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const createCustomError = (message, statusCode) => {
  return new CustomErrorAPI(message, statusCode);
};

module.exports = { CustomErrorAPI, createCustomError };
