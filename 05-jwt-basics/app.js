const express = require("express");
const app = express();

require("dotenv").config();
require("express-async-errors");

const mainRoute = require("./routes/main");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
app.use(express.static("./public"));

app.use("/api/v1", mainRoute);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    app.listen(port, console.log(`Listening on port ${port}....`));
  } catch (error) {
    console.log(error);
  }
};

start();
