const express = require("express");
const app = express();

require("dotenv").config();
require("express-async-errors");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authMiddleware = require("./middleware/authentication");

const authRoute = require("./routes/auth");
const jobsRoute = require("./routes/jobs");

app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("jobs api");
});
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/jobs", authMiddleware, jobsRoute);

// middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const connectDB = require("./db/connect");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Listening on port ${port}....`));
  } catch (error) {
    console.log(error);
  }
};

start();
